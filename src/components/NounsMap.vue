<template>
  <div class="p-6" align="center">
    <photo-select ref="photoRef" @selected="photoSelected" />
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
import { defineComponent, ref, onMounted, computed, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import { doc, setDoc, getDoc, getDocs, DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";
import { Loader } from "@googlemaps/js-api-loader";

import PhotoSelect, { PhotoInfo } from "@/components/PhotoSelect.vue";
import Wallet, { NFT } from "./Wallet.vue";

import { uploadFile, uploadSVG, getFileDownloadURL } from "@/utils/storage";
import { nounsMapConfig } from "../config/project";
import { photoPosted } from "@/utils/functions";
import { collection } from "firebase/firestore";

import { generateNewPhotoData } from "@/models/photo";

interface PinData {
  icon?: google.maps.Icon;
  photoURL: string;
  lat: number;
  lng: number;
  visibility: boolean;
}

class Pin {
  protected _mapInstance: Ref<typeof google>;
  protected _mapObj: Ref<google.maps.Map>;
  protected _marker: google.maps.Marker;
  protected _infoWindow: google.maps.InfoWindow;
  protected _data: PinData;

  protected contentString(photoURL: string) {
    return (
      '<div id="content">' +
      '<div id="siteNotice">' +
      '<img width="128"  src="' +
      photoURL +
      '" />' +
      "</div>" +
      "</div>"
    );
  }

  constructor(
    mapInstance: Ref<typeof google>,
    mapObj: Ref<google.maps.Map>,
    data: PinData
  ) {
    this._mapInstance = mapInstance;
    this._mapObj = mapObj;
    this._marker = new mapInstance.value.maps.Marker({
      icon: data.icon,
      animation: google.maps.Animation.BOUNCE,
      position: new mapInstance.value.maps.LatLng(data.lat, data.lng),
      map: mapObj.value,
      visible: data.visibility,
    });
    this._infoWindow = new mapInstance.value.maps.InfoWindow({
      content: this.contentString(data.photoURL),
    });
    this.showPhoto();
    this._marker.addListener("click", () => {
      this._infoWindow.open({
        anchor: this._marker,
        map: mapObj.value,
        shouldFocus: false,
      });
    });
    this._data = data;
  }
  showPhoto() {
    this._infoWindow.open({
      anchor: this._marker,
      map: this._mapObj.value,
      shouldFocus: false,
    });
  }
  hidePhoto() {
    this._infoWindow.close();
  }

  update(data: Partial<PinData>) {
    this._data = { ...this._data, ...data };

    if (data.icon != null) {
      this._marker.setIcon(data.icon);
    }

    if (data.photoURL != null) {
      this._infoWindow.setContent(this.contentString(data.photoURL));
    }
    if (data.lat != null || data.lng != null) {
      const latlng = new this._mapInstance.value.maps.LatLng(
        data.lat ?? this._data.lat,
        data.lng ?? this._data.lng
      );
      this._marker.setPosition(latlng);
    }

    if (data.visibility != null) {
      this._marker.setVisible(data.visibility);
    }
  }
}

export default defineComponent({
  components: {
    PhotoSelect,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const mapRef = ref();
    const photoRef = ref();
    const walletRef = ref<InstanceType<typeof Wallet>>();
    const pLevel = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();

    const processing = ref();

    let locationCircle: google.maps.Circle | null;

    const user = computed<User>(() => store.state.user);
    const nft = computed<NFT>(() => store.state.nft);
    watch(nft, (cur, prev) => {
      console.log({ cur }, { prev });
      nftUpdate();
    });
    watch(
      () => route.path,
      (cur) => {
        console.log(cur);
        if (route.path == "/user/photos") {
          loadUserPhotos();
        }
      }
    );

    const pins: { [id: string]: Pin } = {};

    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });
      const mapOptions = {
        zoom: 6,
      };
      mapInstance.value = await loader.load();
      mapObj.value = new mapInstance.value.maps.Map(mapRef.value, mapOptions);
      if (route.params.photoId == null) {
        mapObj.value.setCenter(new mapInstance.value.maps.LatLng(49, 34.5));
        showDemoIcons();
      }
      processing.value = false;
      pLevel.value = 5;
      console.log(route.path);
      if (route.params.photoId != null) {
        const photoDoc = getDoc(doc(db, `photos/${route.params.photoId}`));
        photoDoc
          .then((doc) => {
            if (doc.exists()) {
              const { iconURL, photoURL, lat, lng, zoom } = doc.data();

              pins[doc.id] = new Pin(mapInstance, mapObj, {
                icon: {
                  url: iconURL,
                  scaledSize: new mapInstance.value.maps.Size(80, 80),
                },
                photoURL,
                lat,
                lng,
                visibility: true,
              });
              if (lat != null && lng != null) {
                mapObj.value.setCenter(
                  new mapInstance.value.maps.LatLng(lat, lng)
                );
              }
              if (zoom != null) {
                mapObj.value.setZoom(zoom);
              }
            }
          })
          .catch((reason) => {
            console.error(reason);
          });
      }
    });

    const photoSelected = async (info: PhotoInfo) => {
      photoLocal.value = info;
      Object.values(pins).forEach((site) => site.update({ visibility: false }));
      mapObj.value.addListener("center_changed", () => {
        locationUpdated();
      });
      const location = info.location ? info.location : mapObj.value.getCenter();
      mapObj.value.setCenter(location);
      mapObj.value.setZoom(12);
      pins["upload"] = new Pin(mapInstance, mapObj, {
        icon: defaultIcon(),
        photoURL: "",
        lat: location.lat,
        lng: location.lng,
        visibility: true,
      });
    };
    const locationUpdated = () => {
      const center = mapObj.value.getCenter();
      console.debug(pLevel.value);
      const privacyLevel = pLevel.value * 1000;
      pins["upload"]?.update({ lat: center.lat(), lng: center.lng() });
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
      if (nft.value) {
        const _id =
          nft.value.token.tokenID +
          nft.value.token.tokenSymbol +
          nft.value.token.contractAddress;
        const storage_path = `images/users/${_uid}/public_icons/${_id}/icon.svg`;
        const downloadURL = await getFileDownloadURL(storage_path);
        if (downloadURL) {
          //already icon exists
          console.log("exist", { downloadURL });
          return [_id, downloadURL];
        } else {
          //new icon
          const newURL = await uploadSVG(nft.value.image, storage_path);
          console.log("new icon", { newURL });
          return [_id, newURL];
        }
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
      if (!photoLocal.value || !user.value) {
        console.error("empty photo or user");
        return;
      }
      processing.value = true;
      const _uid = user.value.uid;
      photoRef.value.fileInput.disabled = true;
      const [iconId, iconURL] = await uploadIcon(_uid);

      //generate random id  "hoge" is not created actually
      const _pid = doc(collection(db, "hoge")).id;
      const storage_path = `images/users/${_uid}/public_photos/${_pid}/original.jpg`;
      const photoURL = (await uploadFile(
        photoLocal.value.resizedBlob,
        storage_path
      )) as string;
      const pdata = generateNewPhotoData(
        _pid,
        photoURL,
        photoLocal.value.file.name,
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
    const nftUpdate = async () => {
      pins["demo"]?.update({ icon: defaultIcon() });
      pins["upload"]?.update({ icon: defaultIcon() });
    };

    const defaultIcon = () => {
      if (nft.value && nft.value.image) {
        return {
          url: nft.value.image,
          scaledSize: new mapInstance.value.maps.Size(80, 80),
        };
      } else {
        //Nouns Default red grass
        return {
          url: "/images/glasses/red320px.png",
          scaledSize: new mapInstance.value.maps.Size(80, 30),
        };
      }
    };
    const showDemoIcons = () => {
      //update for demofor Demo

      pins["demo"] = new Pin(mapInstance, mapObj, {
        icon: defaultIcon(),
        photoURL: require("@/assets/sample/pexels-11518762.jpg"),
        lat: 47,
        lng: 34.5,
        visibility: true,
      });
    };
    const loadUserPhotos = async () => {
      if (!user.value) {
        console.error("no user info");
        return;
      }
      const photos = await getDocs(
        collection(db, `users/${user.value.uid}/public_photos/`)
      );
      let maxLat = -90;
      let maxLng = -180;
      let minLat = 90;
      let minLng = 180;
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const { iconURL, images, lat, lng } = doc.data();
        const imageUrl = images?.resizedImages?.["600"]?.url;
        if (!imageUrl) {
          console.log("photoid skipped", doc.id);
          return;
        }
        pins[doc.id] = new Pin(mapInstance, mapObj, {
          icon: {
            url: iconURL,
            scaledSize: new mapInstance.value.maps.Size(80, 80),
          },
          photoURL: imageUrl,
          lat,
          lng,
          visibility: true,
        });
        if (lat != null && lng != null) {
          maxLat = Math.max(lat, maxLat);
          maxLng = Math.max(lng, maxLng);
          minLat = Math.min(lat, minLat);
          minLng = Math.min(lng, minLng);
        }
      });
      console.log(minLat, maxLat, minLng, maxLng);
      if (minLat < maxLat && minLng < maxLng) {
        const min = new google.maps.LatLng(minLat - 1, minLng - 1);
        const max = new google.maps.LatLng(maxLat + 1, maxLng + 1);
        const latLngBounds = new google.maps.LatLngBounds(min, max);
        mapObj.value.fitBounds(latLngBounds);
      }
    };

    return {
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
      loadUserPhotos,
      nftUpdate,
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
