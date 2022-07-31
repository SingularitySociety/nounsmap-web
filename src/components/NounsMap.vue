<template>
  <div class="flex flex-col p-6" align="center" v-if="photoLocal">
    <div>
      <div class="flex flex-row justify-center items-center m-4">
        <span class="block text-gray-700 text-sm font-bold m-2">
          {{ $t("label.name") }}:
        </span>
        <input
          type="text"
          ref="nameRef"
          maxlength="128"
          minlength="1"
          class="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div class="flex flex-row justify-center items-center m-4">
        <span class="block text-gray-700 text-sm font-bold m-2">
          {{ $t("label.event") }}:
        </span>
        <select v-model="eventId">
          <option
            v-for="event in supportingEvents"
            :value="event.eventId"
            :key="event.eventId"
          >
            {{ eventName(event.eventId) }}
          </option>
        </select>
      </div>
    </div>
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
  <div class="fixed z-20 right-0">
    <div class="flex flex-row justify-center items-center mr-20">
      <span class="block text-gray-700 text-sm font-bold m-2">
        {{ $t("label.viewEvent") }}:
      </span>
      <select v-model="viewEventId">
        <option
          v-for="event in supportingEvents"
          :value="event.eventId"
          :key="event.eventId"
        >
          {{ eventName(event.eventId) }}
        </option>
      </select>
    </div>
    <div>
      <label class="m-2">{{ $t("label.showPhoto") }}:</label>
      <input type="checkbox" id="showPicture" v-model="isShowPicture" />
    </div>
  </div>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, Ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  DocumentData,
  collection,
} from "firebase/firestore";
import { User } from "firebase/auth";
import { Loader } from "@googlemaps/js-api-loader";
import {
  defaultMapConfig,
  privacyCircleConfig,
  supportingEvents,
} from "@/config/project";
import { NFT } from "@/models/SmartContract";
import { useI18n } from "vue-i18n";
import { uploadFile, uploadSVG, getFileDownloadURL } from "@/utils/storage";
import { photoPosted } from "@/utils/functions";
import { generateNewPhotoData, PhotoInfo } from "@/models/photo";
import router from "@/router";
import { getLocalePath, getLocaleName } from "@/i18n/utils";
import { shortID } from "@/utils/utils";
interface PinData {
  pid: string | null;
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
      '<div  id="siteNotice">' +
      '<img  class="w-32" src="' +
      photoURL +
      '" />' +
      "</div>" +
      "</div>"
    );
  }

  constructor(
    mapInstance: Ref<typeof google>,
    mapObj: Ref<google.maps.Map>,
    data: PinData,
    eventId: number
  ) {
    this._mapInstance = mapInstance;
    this._mapObj = mapObj;
    this._marker = new mapInstance.value.maps.Marker({
      icon: data.icon,
      position: new mapInstance.value.maps.LatLng(data.lat, data.lng),
      map: mapObj.value,
      visible: data.visibility,
    });
    this._infoWindow = new mapInstance.value.maps.InfoWindow({
      content: this.contentString(data.photoURL),
    });
    this._infoWindow.setContent(this.contentString(data.photoURL));
    this.showPhoto();
    this._marker.addListener("click", () => {
      this._infoWindow.open({
        anchor: this._marker,
        map: mapObj.value,
        shouldFocus: false,
      });
      if (data.pid) {
        if(eventId > 0) {
          router.push({
            name: getLocaleName(router, "eventphoto"),
            params: { eventId, photoId: data.pid },
          });
        } else {
          router.push({
            name: getLocaleName(router, "photo"),
            params: { photoId: data.pid },
          });
        }
      }
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
      if (!data.visibility) {
        this.hidePhoto();
      }
    }
  }
  delete() {
    this.hidePhoto();
    this._marker.setMap(null);
  }
}

export default defineComponent({
  setup() {
    const route = useRoute();
    const store = useStore();
    const mapRef = ref();
    const pLevel = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const pins: { [id: string]: Pin } = {};
    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();
    const processing = ref();
    const nameRef = ref();
    const descRef = ref();
    const i18n = useI18n();
    const eventId = ref<number>(0);
    const viewEventId = ref<number>(0);
    watch(viewEventId, () => {
      router.push({
        name: getLocaleName(router, "eventmap"),
        params: { eventId: viewEventId.value },
      });
    });
    const eventName = (eventId: number) => {
      const event = supportingEvents.filter((v) => v.eventId == eventId)[0];
      const locl: keyof typeof event.name = i18n.locale
        .value as keyof typeof event.name;
      return event?.name[locl] ? event.name[locl] : "";
    };
    const isShowPicture = ref(true);
    watch(isShowPicture, (cur) => {
      console.log(cur);
      for (const pin of Object.values(pins)) {
        if (cur) {
          pin.showPhoto();
        } else {
          pin.hidePhoto();
        }
      }
    });

    let locationCircle: google.maps.Circle | null;

    const user = computed<User>(() => store.state.user);
    const nft = computed<NFT>(() => store.state.nft);
    watch(nft, (cur, prev) => {
      console.log({ cur }, { prev });
      nftUpdate();
    });
    const localPhoto = computed<PhotoInfo>(() => store.state.uploadPhoto);
    watch(localPhoto, (cur, prev) => {
      console.log({ cur }, { prev });
      photoSelected(localPhoto.value);
    });

    watch(
      () => route.path,
      () => {
        routeCheck();
      }
    );
    watch(user, (cur) => {
      console.log(cur);
      routeCheck();
    });
    const routeCheck = () => {
      console.log(route.path, route.params, pins);
      if (route.params.photoId != null) {
        loadPhoto(route.params.photoId as string);
      } else if (route.params.eventId != null) {
        store.commit("setCanGoBack", true);
        loadEventPhotos(parseInt(route.params.eventId as string));
      } else if (route.path == getLocalePath(router, "/map")) {
        store.commit("setCanGoBack", true);
        store.commit("setClickedPhoto", null);
        viewEventId.value = supportingEvents[0].eventId;
        loadUserPhotos();
      }
    };

    onMounted(async () => {
      const loader = new Loader({
        apiKey: defaultMapConfig.mapkey,
        libraries: ["places", "visualization"],
      });
      const mapOptions = {
        zoom: defaultMapConfig.zoom,
      };
      mapInstance.value = await loader.load();
      mapObj.value = new mapInstance.value.maps.Map(mapRef.value, mapOptions);
      processing.value = false;
      pLevel.value = privacyCircleConfig.pLevel;
      mapObj.value.setCenter(
        new mapInstance.value.maps.LatLng(
          defaultMapConfig.lan,
          defaultMapConfig.lng
        )
      );
      routeCheck();
    });

    const photoSelected = async (info: PhotoInfo) => {
      if (!info) {
        photoLocal.value = null;
        return;
      }
      photoLocal.value = info;
      Object.values(pins).forEach((pin) => pin.update({ visibility: false }));
      mapObj.value.addListener("center_changed", () => {
        locationUpdated();
      });
      const location = info.location ? info.location : mapObj.value.getCenter();
      mapObj.value.setCenter(location);
      mapObj.value.setZoom(12);
      pins["upload"] = new Pin(mapInstance, mapObj, {
        pid: null,
        icon: defaultIcon(),
        photoURL: "",
        lat: location.lat,
        lng: location.lng,
        visibility: true,
      }, 0);
      pins["upload"].hidePhoto();
    };
    const locationUpdated = () => {
      if (!photoLocal.value) {
        //not photo selected yet
        return;
      }
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
        strokeColor: privacyCircleConfig.color,
        strokeOpacity: privacyCircleConfig.strokeOpacity,
        strokeWeight: privacyCircleConfig.strokeWeight,
        fillColor: privacyCircleConfig.color,
        fillOpacity: privacyCircleConfig.fillOpacity,
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
          degree +
          (pLevel.value * privacyCircleConfig.baseShiftRate +
            (Math.random() % pLevel.value)) *
            privacyCircleConfig.kmToDeg
        );
      }
    };

    const uploadIcon = async (_uid: string): Promise<[string, string]> => {
      if (nft.value) {
        const _id =
          shortID(nft.value.token.tokenID) +
          nft.value.name.trim() +
          shortID(nft.value.contractAddress);
        const post = nft.value.token.imageType
          ? nft.value.token.imageType.slice(0, 3)
          : "";
        const storage_path = `images/users/${_uid}/public_icons/${_id}/icon.${post}`;
        const downloadURL = await getFileDownloadURL(storage_path);
        if (downloadURL) {
          //already icon exists
          console.log("exist", { downloadURL });
          return [_id, downloadURL];
        } else {
          //new icon
          const newURL = nft.value.token.buff
            ? ((await uploadFile(
                nft.value.token.buff,
                storage_path,
                nft.value.token.imageType
              )) as string)
            : ((await uploadSVG(
                nft.value.token.image,
                storage_path
              )) as string);
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
      const [iconId, iconURL] = await uploadIcon(_uid);

      //generate random id  "hoge" is not created actually
      const _pid = doc(collection(db, "hoge")).id;
      const storage_path = `images/users/${_uid}/public_photos/${_pid}/original.jpg`;
      const photoURL = (await uploadFile(
        photoLocal.value.resizedBlob,
        storage_path,
        "jpeg"
      )) as string;
      pins["upload"]?.update({ photoURL });
      pins["upload"]?.showPhoto();
      const _title = nameRef.value?.value ? nameRef.value.value : "";
      const _desc = descRef.value?.value ? descRef.value.value : "";
      const _eventid = eventId.value ? eventId.value : 0;
      const pdata = generateNewPhotoData(
        _pid,
        _title,
        _desc,
        _eventid,
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
        pins["upload"]?.delete();
        delete pins["upload"];
        Object.values(pins).forEach((pin) => pin.update({ visibility: true }));
        router.push({
          name: getLocaleName(router, "photo"),
          params: { photoId: _pid },
        });
      } else {
        console.error("failed");
      }
      processing.value = false;
      photoLocal.value = null;
      if (locationCircle) {
        locationCircle.setMap(null);
        locationCircle = null;
      }
    };
    const nftUpdate = () => {
      pins["demo"]?.update({ icon: defaultIcon() });
      pins["upload"]?.update({ icon: defaultIcon() });
    };

    const defaultIcon = () => {
      if (nft.value && nft.value.token.image) {
        return {
          url: nft.value.token.image,
          scaledSize: new mapInstance.value.maps.Size(80, 80),
        };
      } else {
        //Nouns Default red grass
        return {
          url: require("@/assets/red160px.png"),
          scaledSize: new mapInstance.value.maps.Size(80, 30),
        };
      }
    };
    const loadUserPhotos = async () => {
      if (!user.value) {
        console.info("no user info");
        return;
      }
      const photos = await getDocs(
        collection(db, `users/${user.value.uid}/public_photos/`)
      );
      if (photos.size && photos.size == Object.keys(pins).length) {
        console.log("already loaded so skipped,,", photos.size);
        //Object.keys(pins).forEach((key: string) => pins[key].showPhoto());
        return;
      }
      //delete current pins
      for (const [key, pin] of Object.entries(pins)) {
        pin.delete();
        delete pins[key];
      }

      if (photos.size) {
        store.commit("setUserPhotoState", "exist");
      } else {
        store.commit("setUserPhotoState", "empty");
        return;
      }
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const { iconURL, images, lat, lng } = doc.data();
        const imageUrl = images?.resizedImages?.["600"]?.url;
        if (!imageUrl) {
          console.log("photoid skipped", doc.id);
          return;
        }
        //for default icon care
        const _iconurl = iconURL ? iconURL : require("@/assets/red160px.png");
        const _hsize = iconURL ? 80 : 30;
        pins[doc.id] = new Pin(mapInstance, mapObj, {
          pid: doc.id,
          icon: {
            url: _iconurl,
            scaledSize: new mapInstance.value.maps.Size(80, _hsize),
          },
          photoURL: imageUrl,
          lat,
          lng,
          visibility: true,
        },0);
      });
      const latarray = photos.docs.map((doc) => {
        return doc.data().lat;
      });
      const maxLat = Math.max.apply(null, latarray);
      const minLat = Math.min.apply(null, latarray);
      const lngarray = photos.docs.map((doc) => {
        return doc.data().lng;
      });
      const maxLng = Math.max.apply(null, lngarray);
      const minLng = Math.min.apply(null, lngarray);
      console.log(minLat, maxLat, minLng, maxLng);
      if (photos.size == 1) {
        mapObj.value.setCenter(
          new mapInstance.value.maps.LatLng(minLat, minLng)
        );
        const zoom = photos.docs[0].data().zoom;
        if (zoom) {
          mapObj.value.setZoom(zoom);
        }
      } else if (minLat < maxLat && minLng < maxLng) {
        const min = new google.maps.LatLng(minLat - 0.1, minLng - 0.1);
        const max = new google.maps.LatLng(maxLat + 0.1, maxLng + 0.1);
        const latLngBounds = new google.maps.LatLngBounds(min, max);
        mapObj.value.fitBounds(latLngBounds);
      }
    };
    const loadPhoto = (photoId: string) => {
      console.log(photoId);
      if (pins[photoId]) {
        pins[photoId].delete();
        delete pins[photoId];
      }
      Object.values(pins).forEach((pin) => pin.hidePhoto());
      const photoDoc = getDoc(doc(db, `photos/${photoId}`));
      photoDoc
        .then((doc) => {
          if (doc.exists()) {
            store.commit("setClickedPhoto", doc.data());
            const { iconURL, photoURL, lat, lng, zoom } = doc.data();
            //default icon size is 80, 30
            const size = iconURL.match(/red160px/)
              ? new mapInstance.value.maps.Size(80, 30)
              : new mapInstance.value.maps.Size(80, 80);
            pins[doc.id] = new Pin(mapInstance, mapObj, {
              pid: doc.id,
              icon: {
                url: iconURL,
                scaledSize: size,
              },
              photoURL,
              lat,
              lng,
              visibility: true,
            },0);
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
    };
    let lockedLoadEventPhotos = false;
    const loadEventPhotos = async (_id: number) => {
      if (_id == supportingEvents[0].eventId) {
        router.push({
          name: getLocaleName(router, "map"),
        });
        return;
      }
      if (lockedLoadEventPhotos) {
        console.log("already loading so skipped", _id);
        return;
      }
      console.log("loading photos for event:", _id);
      lockedLoadEventPhotos = true;
      try {
        //delete current pins
        for (const [key, pin] of Object.entries(pins)) {
          pin.delete();
          delete pins[key];
        }
        const q = query(collection(db, `photos`), where("eventId", "==", _id));
        const photos = await getDocs(q);
        for (const doc of photos.docs) {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          const { iconURL, photoURL, lat, lng } = doc.data();
          //default icon size is 80, 30
          const size = iconURL.match(/red160px/)
            ? new mapInstance.value.maps.Size(80, 30)
            : new mapInstance.value.maps.Size(80, 80);
          const _iconurl = iconURL ? iconURL : require("@/assets/red160px.png");
          if (pins[doc.id]) {
            pins[doc.id].delete();
            delete pins[doc.id];
          }
          pins[doc.id] = new Pin(mapInstance, mapObj, {
            pid: doc.id,
            icon: {
              url: _iconurl,
              scaledSize: size,
            },
            photoURL,
            lat,
            lng,
            visibility: true,
          },_id);
        }
        const latarray = photos.docs.map((doc) => {
          return doc.data().lat;
        });
        const maxLat = Math.max.apply(null, latarray);
        const minLat = Math.min.apply(null, latarray);
        const lngarray = photos.docs.map((doc) => {
          return doc.data().lng;
        });
        const maxLng = Math.max.apply(null, lngarray);
        const minLng = Math.min.apply(null, lngarray);
        console.log(minLat, maxLat, minLng, maxLng);
        if (photos.size == 1) {
          mapObj.value.setCenter(
            new mapInstance.value.maps.LatLng(minLat, minLng)
          );
          const zoom = photos.docs[0].data().zoom;
          if (zoom) {
            mapObj.value.setZoom(zoom);
          }
        } else if (minLat < maxLat && minLng < maxLng) {
          const min = new google.maps.LatLng(minLat - 3, minLng - 3);
          const max = new google.maps.LatLng(maxLat + 1, maxLng + 1);
          const latLngBounds = new google.maps.LatLngBounds(min, max);
          mapObj.value.fitBounds(latLngBounds);
        }
      } catch (e) {
        console.error(e);
        lockedLoadEventPhotos = false;
      }
      lockedLoadEventPhotos = false;
    };
    return {
      mapRef,
      user,
      pLevel,
      dataURL,
      pictureURL,
      photoLocal,
      processing,
      nameRef,
      descRef,
      eventId,
      viewEventId,
      supportingEvents,
      isShowPicture,
      eventName,
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
  height: 90vh;
}
</style>
