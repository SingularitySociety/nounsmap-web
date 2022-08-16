<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-40 justify-items-center bg-black bg-opacity-50"
    id="photoView"
    v-if="clickedPhoto"
  >
    <div
      class="col-start-2 row-span-1 col-span-3 flex justify-center items-center mt-16 text-white"
    >
      <span class="block text-white text-sm font-bold m-2">
        {{ $t("label.name") }}:
      </span>
      {{ clickedPhoto.title }}
    </div>
    <div
      class="col-start-5 row-span-1 col-span-1 flex justify-center items-center"
      @click="close"
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
        <i
          class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          @click="openTweetPopup(clickedPhoto.photoId)"
          >share</i
        >
        <!-- </a> -->
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
</template>
<script lang="ts">
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { User } from "firebase/auth";
import { nounsMapConfig, featureConfig } from "@/config/project";
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
      if (
        store.state.userType == "wallet" &&
        clickedPhoto.value?.uid == user.value?.uid
      ) {
        isWalletUser.value = true;
      } else {
        isWalletUser.value = false;
      }
    };
    const isWalletUser = ref(false);
    const clickedPhoto: WritableComputedRef<PhotoPubData> = computed({
      get: () => store.state.clickedPhoto as PhotoPubData,
      set: (val) => store.commit("setClickedPhoto", val),
    });
    watch(clickedPhoto, () => {
      checkUser();
    });
    const close = () => {
      console.log(router);
      store.commit("setClickedPhoto", undefined);
      if (route.params.eventId) {
        router.push({
          name: getLocaleName(router, "eventmap"),
          params: { eventId: route.params.eventId },
        });
      } else {
        router.push("../map");
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
      isWalletUser,
      close,
      nftRequest,
      openTweetPopup,
    };
  },
});
</script>
