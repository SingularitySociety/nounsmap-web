<template>
  <div class="flex flex-col text-gray-700 p-6" align="center" v-if="photoLocal">
    <InputText
      label="label.name"
      testId="photo_title"
      v-model:text="photoTitle"
    />
    <EventSelector v-model:eventId="eventId" />
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
      id="UploadImage"
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
  <div v-else>
    <div class="fixed z-20 inset-x-0 .text-justify">
      <div class="flex flex-col justify-start text-gray-700 font-bold">
        <EventSelector testId="viewEventSelect" v-model:eventId="viewEventId" />
        <div class="flex flex-row">
          <label class="text-sm m-2">{{ $t("label.showPhoto") }}:</label>
          <input type="checkbox" id="showPicture" v-model="isShowPicture" />
        </div>
      </div>
      <div class="fixed z-20 inset-x-0 bottom-0 p-8">
        <PhotoPlayback
          :total="pinsCount"
          :wait="playbackConfig.wait"
          :title="playingTitle"
          @updated="playbackUpdate"
          @stopped="playbackStop"
          ref="playbackRef"
        />
      </div>
    </div>
  </div>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  watch,
  reactive,
} from "vue";
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
  playbackConfig,
} from "@/config/project";
import { NFT } from "@/models/SmartContract";
import { uploadFile, getFileDownloadURL } from "@/utils/storage";
import { photoPosted } from "@/utils/functions";
import { generateNewPhotoData, PhotoInfo } from "@/models/photo";
import router from "@/router";
import { getLocalePath, getLocaleName } from "@/i18n/utils";
import { shortID, eventName, pause } from "@/utils/utils";
import { Pin, PinsType } from "@/utils/mapPin";
import EventSelector from "./EventSelector.vue";
import InputText from "./InputText.vue";
import PhotoPlayback from "./PhotoPlayback.vue";

export default defineComponent({
  components: {
    EventSelector,
    InputText,
    PhotoPlayback,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const mapRef = ref();
    const pLevel = ref();
    const mapInstance = ref();
    const mapObj = ref();
    const pins = reactive<PinsType>({});
    const pinsCount = computed(() => Object.keys(pins).length);
    const photoLocal = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();
    const processing = ref();
    const photoTitle = ref<string>("title");
    const descRef = ref();
    const eventId = ref<number>(0);
    const viewEventId = ref<number>(0);
    watch(viewEventId, () => {
      console.log("event:", viewEventId.value);
      router.push({
        name: getLocaleName(router, "eventmap"),
        params: { eventId: String(viewEventId.value) },
      });
    });
    const isShowPicture = ref(true);
    watch(isShowPicture, (cur) => {
      //console.log(cur);
      for (const pin of Object.values(pins)) {
        if (cur) {
          pin.showPhoto();
        } else {
          pin.hidePhoto();
        }
      }
    });
    const playbackRef = ref();

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
        playbackRef.value?.stop();
        loadPhoto(route.params.photoId as string);
      } else if (route.params.eventId != null) {
        const _event = parseInt(route.params.eventId as string);
        viewEventId.value = _event;
        isShowPicture.value = true;
        loadEventPhotos(_event);
      } else if (route.path == getLocalePath(router, "/map")) {
        store.commit("setClickedPhoto", null);
        viewEventId.value = supportingEvents[0].eventId;
        isShowPicture.value = true;
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
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
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
      pins["upload"] = new Pin(
        mapInstance,
        mapObj,
        {
          pid: null,
          title: null,
          icon: defaultIcon(),
          photoURL: "",
          lat: location.lat,
          lng: location.lng,
          zoom: mapObj.value.getZoom(),
          visibility: true,
        },
        0
      );
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
          const binary = Buffer.from(
            nft.value.token.image.split(",")[1],
            "base64"
          );
          const newURL = await uploadFile(
            binary.buffer,
            storage_path,
            nft.value.token.imageType
          );
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
      const _title = photoTitle.value;
      const _desc = descRef.value?.value ? descRef.value.value : "";
      const _eventid = eventId.value;
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
      const _size = defaultMapConfig.icon_size;
      const _nouns_h = defaultMapConfig.nouns_icon_h;
      if (nft.value && nft.value.token.image) {
        return {
          url: nft.value.token.image,
          scaledSize: new mapInstance.value.maps.Size(_size, _size),
        };
      } else {
        //Nouns Default red grass
        return {
          url: require("@/assets/red160px.png"),
          scaledSize: new mapInstance.value.maps.Size(_size, _nouns_h),
        };
      }
    };
    const loadUserPhotos = async () => {
      if (!user.value) {
        console.info("no user info");
        return;
      }
      const q = query(
        collection(db, `users/${user.value.uid}/public_photos`),
        where("deletedFlag", "==", false)
      );
      const photos = await getDocs(q);
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
        const { title, iconURL, images, lat, lng, zoom } = doc.data();
        const imageUrl = images?.resizedImages?.["600"]?.url;
        if (!imageUrl) {
          console.log("photoid skipped", doc.id);
          return;
        }
        //for default icon care
        const _size = defaultMapConfig.icon_size;
        const _nouns_h = defaultMapConfig.nouns_icon_h;
        const _iconurl = iconURL ? iconURL : require("@/assets/red160px.png");
        const _hsize = iconURL ? _size : _nouns_h;
        pins[doc.id] = new Pin(
          mapInstance,
          mapObj,
          {
            pid: doc.id,
            title,
            icon: {
              url: _iconurl,
              scaledSize: new mapInstance.value.maps.Size(_size, _hsize),
            },
            photoURL: imageUrl,
            lat,
            lng,
            zoom,
            visibility: true,
          },
          0
        );
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
            const { title, iconURL, photoURL, lat, lng, zoom } = doc.data();
            const _size = defaultMapConfig.icon_size;
            const _nouns_h = defaultMapConfig.nouns_icon_h;
            const size = iconURL.match(/red160px/)
              ? new mapInstance.value.maps.Size(_size, _nouns_h)
              : new mapInstance.value.maps.Size(_size, _size);
            pins[doc.id] = new Pin(
              mapInstance,
              mapObj,
              {
                pid: doc.id,
                title,
                icon: {
                  url: iconURL,
                  scaledSize: size,
                },
                photoURL,
                lat,
                lng,
                zoom,
                visibility: true,
              },
              0
            );
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
          const { title, iconURL, photoURL, lat, lng, zoom } = doc.data();
          if (!iconURL || !photoURL) {
            continue;
          }
          const _size = defaultMapConfig.icon_size;
          const _nouns_h = defaultMapConfig.nouns_icon_h;
          const size = iconURL.match(/red160px/)
            ? new mapInstance.value.maps.Size(_size, _nouns_h)
            : new mapInstance.value.maps.Size(_size, _size);
          const _iconurl = iconURL ? iconURL : require("@/assets/red160px.png");
          if (pins[doc.id]) {
            pins[doc.id].delete();
            delete pins[doc.id];
          }
          pins[doc.id] = new Pin(
            mapInstance,
            mapObj,
            {
              pid: doc.id,
              title,
              icon: {
                url: _iconurl,
                scaledSize: size,
              },
              photoURL,
              lat,
              lng,
              zoom,
              visibility: true,
            },
            _id
          );
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
    const playingTitle = ref("");
    const playbackUpdate = async (index: number) => {
      // latitude descending
      const latpins = Object.values(pins).sort(
        (p1, p2) => p2.data().lat - p1.data().lat
      );
      if (index < 1 || latpins.length < index) {
        console.error(`wrong index:${index} lenghth:${latpins.length}`);
        return;
      }
      if (index == 1) {
        for (const pin of Object.values(pins)) {
          pin.hidePhoto();
        }
      }
      //playback animation
      //1.  panaout => 2. move to next photo location => 3. zoom in
      //1. pan aout
      await changeZoomAnimation(
        mapObj.value.getZoom(),
        playbackConfig.defaultZoom
      );

      //2. move next photo location
      const pin = latpins[index - 1];
      pin.setContentLarge();
      pin.showPhoto();
      playingTitle.value = pin.data().title ? (pin.data().title as string) : "";
      const center = mapObj.value.getCenter();
      await changeLocationAnimation(
        center.lat(),
        center.lng(),
        pin.data().lat,
        pin.data().lng
      );

      //3. zoom in
      const zoom = pin.data().zoom;
      if (zoom) {
        await changeZoomAnimation(mapObj.value.getZoom(), zoom);
      }
    };
    const changeZoomAnimation = async (from: number, to: number) => {
      //console.log(from, to);
      //steps to takes 1sec to change
      const delta = (to - from) / playbackConfig.animateStep;
      const pauseSec = playbackConfig.animateSec / playbackConfig.animateStep;
      for (let i = 1; i <= playbackConfig.animateStep; i++) {
        mapObj.value.setZoom(from + Math.trunc(delta * i));
        await pause(pauseSec);
      }
    };
    const changeLocationAnimation = async (
      fromLat: number,
      fromLng: number,
      toLat: number,
      toLng: number
    ) => {
      const deltaLat = (toLat - fromLat) / playbackConfig.animateStep;
      const deltaLng = (toLng - fromLng) / playbackConfig.animateStep;
      const pauseSec = playbackConfig.animateSec / playbackConfig.animateStep;
      for (let i = 1; i <= playbackConfig.animateStep; i++) {
        mapObj.value.setCenter(
          new google.maps.LatLng(fromLat + deltaLat * i, fromLng + deltaLng * i)
        );
        await pause(pauseSec);
      }
    };
    const playbackStop = async () => {
      for (const pin of Object.values(pins)) {
        pin.setContent();
      }
    };
    return {
      mapRef,
      user,
      pLevel,
      dataURL,
      pictureURL,
      photoLocal,
      processing,
      photoTitle,
      descRef,
      eventId,
      viewEventId,
      supportingEvents,
      isShowPicture,
      pins,
      pinsCount,
      playbackRef,
      playbackConfig,
      playingTitle,
      eventName,
      photoSelected,
      uploadPhoto,
      locationUpdated,
      loadUserPhotos,
      nftUpdate,
      playbackUpdate,
      playbackStop,
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
