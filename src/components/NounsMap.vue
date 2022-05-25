<template>
  <div class="p-6" align="center">
    <twitter-login :user="user.user" />
    <wallet :user="user.user" />
    <photo-select ref="photoRef" @selected="photoSelected" v-if="user.user" />
    <div align="center" v-if="photoLocal">
      <div>
        {{ $t("message.selectPhotoLocation") }}<br />
        <label>{{ $t("message.spotPrivacyLevel") }} : </label>
        <input
          type="range"
          v-model="pLevel"
          @input="locationUpdated"
          min="0"
          max="100"
        />
      </div>
      <button
        v-if="!processing"
        @click="uploadPhoto"
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      >
        {{ $t("message.uploadImage") }}
      </button>
      <button
        v-else
        type="button"
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        disabled
      >
        <i class="animate-spin material-icons text-lg text-op-teal mr-2"
          >schedule</i
        >
        {{ $t("message.processing") }}
      </button>
    </div>
    <div>
      <a :href="dataURL" v-if="dataURL"> {{ $t("message.shareTwitter") }} </a>
    </div>
  </div>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { Loader } from "@googlemaps/js-api-loader";

import heatmaps from "@/data/heatmapPoints";
import PhotoSelect from "@/components/PhotoSelect.vue";
import TwitterLogin from "./TwitterLogin.vue";
import Wallet from "./Wallet.vue";

import { uploadFile } from "@/utils/storage";
import { nounsMapConfig } from "../config/project";
import { photoPosted } from "@/utils/functions";
import { collection } from "firebase/firestore";

import { getNewPhotoData } from "@/models/photo";

interface UserData {
  user: User | null;
}

export default defineComponent({
  components: {
    PhotoSelect,
    TwitterLogin,
    Wallet,
  },
  setup() {
    const store = useStore();
    const mapRef = ref();
    const photoRef = ref();
    const pLevel = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const heatmapPoints = ref<
      { location: google.maps.LatLng; weight: number }[]
    >([]);
    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();

    const user = reactive<UserData>({ user: null });
    const processing = ref();

    let marker: google.maps.Marker;
    let locationCircle: google.maps.Circle | null;

    onMounted(async () => {
      auth.onAuthStateChanged((fbuser) => {
        if (fbuser) {
          console.log("authStateChanged:" + fbuser);
          user.user = fbuser;
          store.commit("setUser", fbuser);
        } else {
          console.log("authStateChanged:" + fbuser);
          store.commit("setUser", null);
          user.user = null;
        }
      });
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });
      const mapOptions = {
        center: { lat: 49, lng: 34.5 },
        zoom: 6,
      };
      mapInstance.value = await loader.load();
      mapObj.value = new mapInstance.value.maps.Map(mapRef.value, mapOptions);

      // TODO: get data from Firestore.
      heatmapPoints.value = heatmaps.map((point) => {
        return {
          location: new mapInstance.value.maps.LatLng(
            point.location.lat,
            point.location.lng
          ),
          weight: point.weight,
        };
      });

      const icon = {
        url: "/images/glasses/red320px.png",
        scaledSize: new mapInstance.value.maps.Size(80, 30),
      };
      marker = new mapInstance.value.maps.Marker({
        position: new mapInstance.value.maps.LatLng(47, 34.5),
        map: mapObj.value,
        icon,
      });
      pictureURL.value = require("@/assets/sample/pexels-11518762.jpg");

      const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '<img width="242" height="120"  src="' +
        pictureURL.value +
        '" />';
      "</div>" + "</div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infowindow.open({
        anchor: marker,
        map: mapObj.value,
        shouldFocus: false,
      });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: mapObj.value,
          shouldFocus: false,
        });
      });
      processing.value = false;
      pLevel.value = 50;
    });

    watch([heatmapPoints, mapObj], () => {
      if (heatmapPoints.value.length > 0 && mapInstance.value && mapObj.value) {
        const heatmap = new mapInstance.value.maps.visualization.HeatmapLayer({
          data: heatmapPoints.value,
          map: mapObj.value,
        });
        heatmap.setMap(mapObj.value);
      }
    });
    const photoSelected = async (files: File[]) => {
      console.log("photoSeleted" + files);
      photoLocal.value = files[0];
      marker.setMap(null);
      mapObj.value.addListener("center_changed", () => {
        locationUpdated();
      });
      locationUpdated();
    };
    const locationUpdated = () => {
      console.log(pLevel.value);
      const privacyLevel = pLevel.value * 1000;
      if (locationCircle) {
        locationCircle.setCenter(mapObj.value.getCenter());
        locationCircle.setRadius(privacyLevel);
        return;
      }
      locationCircle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: mapObj.value,
        center: mapObj.value.getCenter(),
        radius: privacyLevel,
      });
    };
    const privacyShift = (degree: number) => {
      //max 0.01+(random 0.01) degree shifted
      if (pLevel.value <= 1) {
        return degree;
      } else {
        return (
          degree + (pLevel.value / 10 + (Math.random() % pLevel.value)) * 0.001
        );
      }
    };
    const uploadPhoto = async () => {
      const latlng = mapObj.value.getCenter();
      console.log(latlng.lat(), latlng.lng());
      const { lat, lng, zoom } = {
        lat: privacyShift(latlng.lat()),
        lng: privacyShift(latlng.lng()),
        zoom: mapObj.value.getZoom(),
      };
      console.log(lat, lng);
      console.log(user.user ? user.user.uid : "user is empty");
      if (!photoLocal.value || !user.user) {
        console.log("empty photo or user");
        return;
      }
      processing.value = true;
      const _uid = user.user.uid;
      photoRef.value.fileInput.disabled = true;
      //const _pid = uuid(); a0X + 10 digits;
      const _pid = doc(collection(db, "hoge")).id;
      const storage_path = `images/users/${_uid}/public_photos/${_pid}/original.jpg`;
      const file: File = photoLocal.value;
      await uploadFile(file, storage_path);
      const pdata = getNewPhotoData(
        _pid,
        photoLocal.value.name,
        storage_path,
        lat,
        lng,
        zoom
      );
      console.log(pdata);
      await setDoc(doc(db, `users/${_uid}/public_photos/${_pid}`), pdata);
      // eslint-disable-next-line
      const { data }: any = await photoPosted({
        photoId: _pid,
        lat,
        lng,
        zoom,
      });
      console.log(data);
      if (data.success) {
        dataURL.value = `https://twitter.com/intent/tweet?url=https://${nounsMapConfig.hostName}/p/${_pid}`;
        console.log(dataURL.value);
      } else {
        console.error("failed");
      }
      photoRef.value.fileInput.value = null;
      photoRef.value.previewImage = null;
      photoRef.value.fileInput.disabled = false;
      processing.value = false;
      photoLocal.value = null;
      if (locationCircle) {
        locationCircle.setMap(null);
        locationCircle = null;
      }
    };

    return {
      user,
      mapRef,
      photoRef,
      pLevel,
      dataURL,
      pictureURL,
      photoLocal,
      processing,
      photoSelected,
      uploadPhoto,
      locationUpdated,
    };
  },
});
</script>
<style>
/* マップを画面幅に合わせる*/
.nouns-map {
  width: 100vw;
  height: 100vh;
}
</style>
