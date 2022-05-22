<template>
  <div class="p-6" align="center">
    <twitter-login :user="user.user" />
    <photo-select @selected="photoSelected" v-if="user.user" />
    <div align="center" v-if="photoLocal">
      <button  @click="uploadPhoto" class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
        upload
      </button>
    </div>
    <div>
      <a :href="dataURL" v-if="dataURL"> share(Twitter)!! </a>
    </div>
  </div>
  <div id="captureRef">
    <div ref="mapRef" class="nouns-map" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { db } from "@/lib/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";

import { Loader } from "@googlemaps/js-api-loader";

import heatmaps from "@/data/heatmapPoints";
import PhotoSelect from "@/components/PhotoSelect.vue";
import TwitterLogin from "./TwitterLogin.vue";

import { uploadFile } from "@/lib/firebase/storage";
import { nounsMapConfig } from "../config/project";
import { photoPosted } from "@/lib/firebase/functions";

interface UserData {
  user: User | null;
}

export default defineComponent({
  components: {
    PhotoSelect,
    TwitterLogin,
  },
  setup() {
    const store = useStore();
    const mapRef = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const heatmapPoints = ref<
      { location: google.maps.LatLng; weight: number }[]
    >([]);
    const captureRef = ref();
    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();

    const user = reactive<UserData>({ user: null });

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
      const marker = new mapInstance.value.maps.Marker({
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
    const getNewPhotoData = (
      pid: string,
      org: string,
      path: string,
      lat: number,
      lng: number,
      zoom: number
    ) => {
      const photoData = {
        id: pid,
        description: "",
        original_name: org,
        images: {
          original: path,
        },
        lat: lat,
        lng: lng,
        zoom: zoom,
        plevel: 0,
        deletedFlag: false,
        publicFlag: true,
      };
      return photoData;
    };
    const photoSelected = async (files: File[]) => {
      photoLocal.value = files[0];
    };
    const uploadPhoto = async () => {
      const latlng = mapObj.value.getCenter();
      console.log(latlng.lat(), latlng.lng());
      const { lat, lng, zoom } = {
        lat: latlng.lat(),
        lng: latlng.lng(),
        zoom: mapObj.value.getZoom(),
      };
      console.log(user.user ? user.user.uid : "user is empty");
      if (!photoLocal.value || !user.user) {
        console.log("empty photo or user");
        return;
      }
      //const _pid = uuid(); a0X + 10 digits;
      const _pid =
        "a02" +
        ("0000000000" + Math.floor(Math.random() * 10000000000)).slice(-10);
      const storage_path = `images/photos/${_pid}/original.jpg`;
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
      photoLocal.value = "";
      await setDoc(doc(db, `photos/${_pid}`), pdata);
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
    };

    return {
      user,
      mapRef,
      dataURL,
      pictureURL,
      captureRef,
      photoLocal,
      photoSelected,
      uploadPhoto,
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
