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
        <InputText
          label="label.name"
          testId="PhotoTitleEdit"
          v-model:text="photoTitle"
        />
        <EventSelector v-model:eventId="photoEventId" />
      </div>
      <div v-else>
        <LabelText
          testId="PhotoTitleView"
          label="label.name"
          :text="clickedPhoto.title"
        />
        <LabelText
          testId="PhotoEventView"
          label="label.event"
          :text="eventName(photoEventId)"
        />
      </div>
    </div>
    <div
      class="col-start-5 row-span-1 col-span-1 flex justify-center items-center"
    >
      <IconButton
        testId="ClosePhotoView"
        icon="scancel"
        @clicked="close"
        label=""
      />
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
      class="row-start-5 col-start-2 col-span-2 row-span-1 shrink-0 py-2 flex justify-center items-center text-white"
    >
      <div class="flex flex-column items-center">
        <img
          ref="imageRef"
          class="h-32 lg:h-32 rounded-full p-2"
          :src="clickedPhoto.iconURL"
          alt="nft icon"
        />
      </div>
      <div class="flex flex-column items-center">
        <IconButton
          icon="share"
          @clicked="openTweetPopup(clickedPhoto.photoId)"
          label="function.sharePhoto"
        />
      </div>
    </div>
    <div
      class="row-start-4 col-start-5 col-span-1 row-span-2 shrink-0 py-2 flex flex-col justify-center items-center text-white"
      v-if="isOwner"
    >
      <div class="flex flex-row items-center" v-if="isEditInfo">
        <IconButton
          testId="PhotoInfoSaving"
          icon="sync"
          animate="animate-spin"
          label="function.save"
          v-if="processing == 'saving'"
        />
        <IconButton
          testId="PhotoInfoSaveComplete"
          icon="save"
          label="function.saveComplete"
          v-else-if="processing == 'saveComplete'"
        />
        <IconButton
          @clicked="savePhotoInfo"
          testId="PhotoInfoSave"
          icon="save"
          label="function.save"
          v-else
        />
      </div>
      <div class="flex flex-row items-center" v-else>
        <IconButton
          testId="EditInfo"
          icon="edit"
          label="function.editPhotoInfo"
          @clicked="isEditInfo = true"
        />
      </div>
      <div class="flex flex-row items-center">
        <IconButton
          testId="DelPhoto"
          icon="delete"
          label="function.deletePhoto"
          @clicked="isDelete = true"
        />
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
import EventSelector from "./EventSelector.vue";
import InputText from "./InputText.vue";
import IconButton from "./IconButton.vue";
import LabelText from "./LabelText.vue";

export default defineComponent({
  components: {
    EventSelector,
    InputText,
    IconButton,
    LabelText,
  },
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
    const photoTitle = ref<string>("");
    watch(photoTitle, () => {
      //console.log(photoTitle.value);
      processing.value = "";
    });
    const photoEventId = ref<number>(0);
    watch(photoEventId, () => {
      //console.log(photoEventId.value);
      processing.value = "";
    });
    const clickedPhoto: WritableComputedRef<PhotoPubData | undefined> =
      computed({
        get: () => store.state.clickedPhoto as PhotoPubData,
        set: (val) => store.commit("setClickedPhoto", val),
      });
    watch(clickedPhoto, () => {
      checkUser();
      if (clickedPhoto.value) {
        photoTitle.value = clickedPhoto.value.title
          ? clickedPhoto.value.title
          : "";
        photoEventId.value = clickedPhoto.value.eventId
          ? clickedPhoto.value.eventId
          : 0;
        console.log(photoTitle.value, photoEventId.value);
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
      const title = photoTitle.value;
      const eventId = photoEventId.value;
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
      photoTitle,
      photoEventId,
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
