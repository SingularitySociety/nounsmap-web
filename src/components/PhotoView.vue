<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-40 justify-items-center bg-black bg-opacity-50"
    v-if="clickedPhoto"
  >
    <div
      class="col-start-4 row-span-1 col-span-1 flex justify-center items-center"
      @click="close"
    >
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div
      class="row-start-2 col-start-2 col-span-3 row-span-3 col-end-5 justify-center items-center"
    >
      <img
        ref="imageRef"
        class="rounded-md"
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
        <a
          :href="
            'https://twitter.com/intent/tweet?url=https://' +
            nounsMapConfig.hostName +
            '/p/' +
            clickedPhoto.photoId
          "
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="text-5xl material-icons text-white hover:animate-pulse mr-2"
            >share</i
          >
        </a>
      </div>
    </div>
    <div
      v-if="isWalletUser"
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
import { User } from "firebase/auth";
import { nounsMapConfig } from "@/config/project";
import {
  defineComponent,
  ref,
  watch,
  computed,
  WritableComputedRef,
} from "vue";
import router from "@/router";
import { PhotoPubData } from "@/models/photo";

export default defineComponent({
  emits: {},
  setup() {
    const store = useStore();
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
      router.push("../map");
    };
    const nftRequest = () => {
      store.commit("setNftRequestPhoto", clickedPhoto.value);
    };
    return {
      nounsMapConfig,
      clickedPhoto,
      isWalletUser,
      close,
      nftRequest,
    };
  },
});
</script>
