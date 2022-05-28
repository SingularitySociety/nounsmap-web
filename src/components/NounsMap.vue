<template>
  <div class="p-6" align="center">
    <twitter-login :user="user.user" />
    <wallet ref="walletRef" @updated="iconUpdate" :user="user.user" />
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
import { defineComponent, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { Loader } from "@googlemaps/js-api-loader";

import PhotoSelect from "@/components/PhotoSelect.vue";
import TwitterLogin from "./TwitterLogin.vue";
import Wallet from "./Wallet.vue";

import { uploadFile, uploadSVG } from "@/utils/storage";
import { nounsMapConfig } from "../config/project";
import { photoPosted } from "@/utils/functions";
import { collection } from "firebase/firestore";

import { generateNewPhotoData } from "@/models/photo";

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
    const walletRef = ref();
    const pLevel = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();

    const user = reactive<UserData>({ user: null });
    const processing = ref();

    let marker: google.maps.Marker;
    let locationCircle: google.maps.Circle | null;

    onMounted(async () => {
      auth.onAuthStateChanged((fbuser) => {
        console.log({ fbuser });
        if (fbuser) {
          user.user = fbuser;
          store.commit("setUser", fbuser);
        } else {
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
      marker = new mapInstance.value.maps.Marker({
        position: new mapInstance.value.maps.LatLng(47, 34.5),
        map: mapObj.value,
      });
      showDemoIcons();
      processing.value = false;
      pLevel.value = 5;
    });

    const photoSelected = async (file: File) => {
      photoLocal.value = file;
      marker.setMap(null);
      mapObj.value.addListener("center_changed", () => {
        locationUpdated();
      });
      const location = photoRef.value.getLocation()
        ? photoRef.value.getLocation()
        : mapObj.value.getCenter();
      mapObj.value.setCenter(location);
      mapObj.value.setZoom(12);
      marker = new mapInstance.value.maps.Marker({
        position: location,
        map: mapObj.value,
      });
      iconUpdate();
    };
    const locationUpdated = () => {
      console.debug(pLevel.value);
      const privacyLevel = pLevel.value * 1000;
      marker.setPosition(mapObj.value.getCenter());
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
    const uploadIcon = async (_uid: string): Promise<[string, string]> => {
      const nft = walletRef.value.getNftData();
      if (nft) {
        const _id =
          nft.token.tokenID + nft.token.tokenSymbol + nft.token.contractAddress;
        const storage_path = `images/users/${_uid}/public_icons/${_id}/icon.svg`;
        const downloadURL = await uploadSVG(nft.image, storage_path);
        return [_id, downloadURL];
      }
      return ["default", ""];
    };
    const uploadPhoto = async () => {
      const latlng = mapObj.value.getCenter();
      console.debug(latlng.lat(), latlng.lng());
      const { lat, lng, zoom } = {
        lat: privacyShift(latlng.lat()),
        lng: privacyShift(latlng.lng()),
        zoom: mapObj.value.getZoom(),
      };
      console.debug(lat, lng);
      if (!photoLocal.value || !user.user) {
        console.error("empty photo or user");
        return;
      }
      processing.value = true;
      const _uid = user.user.uid;
      photoRef.value.fileInput.disabled = true;
      const [iconId, iconURL] = await uploadIcon(_uid);

      //generate random id  "hoge" is not created actually
      const _pid = doc(collection(db, "hoge")).id;
      const storage_path = `images/users/${_uid}/public_photos/${_pid}/original.jpg`;
      const photoURL = (await uploadFile(
        photoRef.value.getResizedBlob(),
        storage_path
      )) as string;
      const pdata = generateNewPhotoData(
        _pid,
        photoURL,
        photoLocal.value.name,
        storage_path,
        lat,
        lng,
        zoom,
        iconId,
        iconURL
      );
      await setDoc(doc(db, `users/${_uid}/public_photos/${_pid}`), pdata);
      // eslint-disable-next-line
      const { data }: any = await photoPosted({
        photoId: _pid,
        lat,
        lng,
        zoom,
      });
      console.log({ _pid }, { data });
      if (data.success) {
        dataURL.value = `https://twitter.com/intent/tweet?url=https://${nounsMapConfig.hostName}/p/${_pid}`;
        console.debug(dataURL.value);
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
    const iconUpdate = async () => {
      if (walletRef.value && walletRef.value.getNftData()) {
        const icon = {
          url: walletRef.value.getNftData().image,
          scaledSize: new mapInstance.value.maps.Size(80, 80),
        };
        marker.setIcon(icon);
        marker.setAnimation(google.maps.Animation.BOUNCE);
      } else {
        //Nouns Default red grass
        const icon = {
          url: "/images/glasses/red320px.png",
          scaledSize: new mapInstance.value.maps.Size(80, 30),
        };
        marker.setIcon(icon);
      }
    };
    const showDemoIcons = () => {
      //update for demofor Demo
      const icon = {
        url: "/images/glasses/red320px.png",
        scaledSize: new mapInstance.value.maps.Size(80, 30),
      };
      pictureURL.value = require("@/assets/sample/pexels-11518762.jpg");
      marker.setIcon(icon);
      marker.setAnimation(google.maps.Animation.BOUNCE);
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
    };

    return {
      user,
      mapRef,
      photoRef,
      walletRef,
      pLevel,
      dataURL,
      pictureURL,
      photoLocal,
      processing,
      photoSelected,
      uploadPhoto,
      locationUpdated,
      iconUpdate,
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
