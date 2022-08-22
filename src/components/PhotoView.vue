<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-40 justify-items-center bg-black bg-opacity-50"
    id="photoView"
    v-if="clickedPhoto"
  >
    <div
      class="col-start-2 row-span-1 col-span-3 flex justify-center items-center mt-16 text-white"
    >
      <div v-if="isEditInfo">
        <div class="flex flex-row justify-center items-center m-4">
          <span class="block text-white text-sm font-bold m-2">
            {{ $t("label.name") }}:
          </span>
          <input
            type="text"
            id="PhotoTitleEdit"
            ref="titleRef"
            maxlength="128"
            minlength="1"
            class="text-sm rounded-md py-1 font-semibold text-gray-800 border border-gray-800 text-center"
          />
        </div>
        <div class="flex flex-row justify-center items-center m-4">
          <span class="block text-white text-sm font-bold m-2">
            {{ $t("label.event") }}:
          </span>
          <select
            v-model="eventIdRef"
            id="postEvent"
            class="text-sm rounded-md py-1 font-semibold text-gray-800 border border-gray-800 text-center"
          >
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
      <div v-else>
        <div class="flex flex-row justify-center items-center m-4">
          <span class="block text-white text-sm font-bold m-2">
            {{ $t("label.name") }}:
          </span>
          <span id="PhotoTitleView">
            {{ clickedPhoto.title }}
          </span>
        </div>
        <div class="flex flex-row justify-center items-center m-4">
          <span class="block text-white text-sm font-bold m-2">
            {{ $t("label.event") }}:
          </span>
          {{ eventName(clickedPhoto.eventId) }}
        </div>
      </div>
    </div>
    <div
      class="col-start-5 row-span-1 col-span-1 flex justify-center items-center"
      @click="close"
      id="ClosePhotoView"
    >
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div
      class="row-start-2 col-start-2 col-span-3 row-span-3 justify-center items-center"
    >
      <img
        ref="imageRef"
        class="max-h-full rounded-md"
        :src="clickedPhoto.photoURL"
        alt="selected photo"
      />
    </div>
    <div
      class="row-start-5 col-start-2 col-span-2 row-span-1 shrink-0 py-2 flex justify-center items-center"
    >
      <div class="flex flex-column items-center">
        <img
          ref="imageRef"
          class="h-32 lg:h-32 rounded-full p-2"
          :src="clickedPhoto.iconURL"
          alt="nft icon"
        />
      </div>
      <div
        class="flex flex-column items-center"
        @click="openTweetPopup(clickedPhoto.photoId)"
      >
        <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          >share</i
        >
        <span class="text-white text-large">{{
          $t("function.sharePhoto")
        }}</span>
      </div>
    </div>
    <div
      class="row-start-4 col-start-5 col-span-1 row-span-2 shrink-0 py-2 flex flex-col justify-center items-center"
      v-if="isOwner"
    >
      <div class="flex flex-row items-center" v-if="isEditInfo">
        <span
          class="text-white text-large"
          id="PhotoInfoSaving"
          v-if="processing == 'saving'"
        >
          <i
            class="animate-spin text-5xl material-icons text-white hover:animate-pulse mr-2"
            >sync</i
          >
          {{ $t("function.save") }}</span
        >
        <span
          class="text-white text-large"
          id="PhotoInfoSaveComplete"
          v-else-if="processing == 'saveComplete'"
        >
          <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
            >save</i
          >
          {{ $t("function.saveComplete") }}</span
        >
        <span
          class="text-white text-large"
          @click="savePhotoInfo()"
          id="PhotoInfoSave"
          v-else
        >
          <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
            >save</i
          >
          {{ $t("function.save") }}</span
        >
      </div>
      <div
        class="flex flex-row items-center"
        @click="isEditInfo = true"
        id="EditInfo"
        v-else
      >
        <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          >edit</i
        >
        <span class="text-white text-large">{{
          $t("function.editPhotoInfo")
        }}</span>
      </div>
      <div
        class="flex flex-row items-center"
        @click="isDelete = true"
        id="DelPhoto"
      >
        <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          >delete</i
        >
        <span class="text-white text-large">{{
          $t("function.deletePhoto")
        }}</span>
      </div>
    </div>

    <div
      v-if="isWalletUser && featureConfig.enableNFTReq"
      class="row-start-5 col-start-4 col-span-1 row-span-1 shrink-0 py-2 flex justify-center items-center"
    >
      <div class="flex flex-column items-center" @click="nftRequest">
        <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          >generating_tokens</i
        >
        <span class="text-white text-large">{{
          $t("message.nftRequestButton")
        }}</span>
      </div>
    </div>
  </div>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-50 justify-items-center bg-black bg-opacity-50"
    id="delPhotoConfirm"
    v-if="isDelete"
  >
    <div
      class="bg-white row-start-3 col-start-2 col-span-3 row-span-1 mx-auto w-auto h-auto shadow-md rounded px-8 pt-8 pb-4 mb-2"
    >
      <div class="grid-cols-1">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            <span id="DelPhotoComplete" v-if="processing == 'deleteComplete'">
              {{ $t("message.deletePhotoComplete") }}
            </span>
            <span v-else>
              {{ $t("message.deletePhotoConfirm") }}
            </span>
          </label>
        </div>
        <div
          class="flex justify-between mt-8"
          v-if="processing == 'deleteComplete'"
        >
          <button
            @click="close()"
            id="DelPhotoClose"
            class="inline-block bg-gray-200 hover:bg-gray-400 rounded-full text-sm font-semibold text-gray-700 mx-4 p-3 py-1"
            type="button"
          >
            {{ $t("function.close") }}
          </button>
        </div>
        <div class="flex justify-between mt-8" v-else>
          <button
            @click="deletePhoto()"
            id="DelPhotoDo"
            class="inline-block bg-gray-200 hover:bg-gray-400 rounded-full text-sm font-semibold text-gray-700 mx-4 p-3 py-1"
            type="button"
          >
            {{ $t("function.delete") }}
          </button>
          <button
            @click="isDelete = false"
            id="DelPhotoCancel"
            class="inline-block bg-gray-200 hover:bg-gray-400 rounded-full text-sm font-semibold text-gray-700 mx-4 px-3 py-1"
            type="button"
          >
            {{ $t("function.cancel") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { User } from "firebase/auth";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  nounsMapConfig,
  featureConfig,
  supportingEvents,
} from "@/config/project";
import {
  defineComponent,
  ref,
  watch,
  computed,
  WritableComputedRef,
} from "vue";
import router from "@/router";
import { PhotoPubData } from "@/models/photo";
import { getLocaleName } from "@/i18n/utils";
import { eventName } from "@/utils/utils";
import { photoInfoUpdated, photoDeleted } from "@/utils/functions";

export default defineComponent({
  emits: {},
  setup() {
    const store = useStore();
    const route = useRoute();
    const user = computed<User>(() => store.state.user);
    watch(user, () => {
      checkUser();
    });
    const checkUser = () => {
      isWalletUser.value =
        store.state.userType == "wallet" &&
        clickedPhoto.value?.uid == user.value?.uid;
      isOwner.value = clickedPhoto.value?.uid == user.value?.uid;
    };
    const isOwner = ref(false);
    const isWalletUser = ref(false);
    const isEditInfo = ref(false);
    const isDelete = ref(false);
    const processing = ref("");
    const titleRef = ref();
    const eventIdRef = ref<number>(0);
    const clickedPhoto: WritableComputedRef<PhotoPubData | undefined> =
      computed({
        get: () => store.state.clickedPhoto as PhotoPubData,
        set: (val) => store.commit("setClickedPhoto", val),
      });
    watch(clickedPhoto, () => {
      checkUser();
      if (clickedPhoto.value) {
        eventIdRef.value = clickedPhoto.value.eventId;
      }
    });
    const close = () => {
      console.log(router);
      isEditInfo.value = false;
      isDelete.value = false;
      clickedPhoto.value = undefined;
      if (route.params.eventId) {
        router.push({
          name: getLocaleName(router, "eventmap"),
          params: { eventId: route.params.eventId },
        });
      } else {
        router.push("../map");
      }
    };
    const savePhotoInfo = async () => {
      if (!clickedPhoto.value) {
        console.error("wrong sequence");
        return;
      }
      processing.value = "saving";
      const photoId = clickedPhoto.value.photoId;
      const title = titleRef.value?.value ? titleRef.value.value : "";
      const eventId = eventIdRef.value;
      console.log({ title, eventId });

      try {
        //user data master  photo meta data 更新
        await updateDoc(
          doc(db, `users/${user.value.uid}/public_photos/${photoId}`),
          {
            title,
            eventId,
            updatedAt: serverTimestamp(),
          }
        );
        // backend へ 全体共有情報更新依頼
        const ret = await photoInfoUpdated({ photoId, title, eventId });
        console.log(ret);
        processing.value = "saveComplete";
        //close();
      } catch (e: unknown) {
        console.error(e);
      }
    };
    const deletePhoto = async () => {
      if (!clickedPhoto.value) {
        console.error("wrong sequence");
        return;
      }
      processing.value = "deleting";
      const photoId = clickedPhoto.value.photoId;
      console.log({ photoId }, "delete");

      try {
        //user data master photo meta data 更新
        await updateDoc(
          doc(db, `users/${user.value.uid}/public_photos/${photoId}`),
          {
            deletedFlag: true,
            updatedAt: serverTimestamp(),
          }
        );
        // backend へ 全体共有情削除依頼
        const ret = await photoDeleted({ photoId });
        console.log(ret);
        processing.value = "deleteComplete";
      } catch (e: unknown) {
        console.error(e);
      }
    };
    const nftRequest = () => {
      store.commit("setNftRequestPhoto", clickedPhoto.value);
    };
    const openTweetPopup = (photoId: string) => {
      const url =
        "https://twitter.com/intent/tweet?url=https://" +
        nounsMapConfig.hostName +
        "/p/" +
        photoId;
      const width = 400,
        height = 300;
      const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                      width=${width},height=${height},left=${
        (window.screen.width - width) / 2
      },top=${(window.screen.height - height) / 2}`;

      window.open(url, url, params);
    };
    return {
      nounsMapConfig,
      featureConfig,
      clickedPhoto,
      isOwner,
      isWalletUser,
      isEditInfo,
      isDelete,
      titleRef,
      eventIdRef,
      supportingEvents,
      processing,
      close,
      savePhotoInfo,
      deletePhoto,
      nftRequest,
      openTweetPopup,
      eventName,
    };
  },
});
</script>
