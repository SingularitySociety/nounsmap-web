<template>
  <div
    class="fixed grid grid-rows-10 grid-cols-10 grid-flow-col items-stretch h-screen w-screen z-40 place-content-center bg-black bg-opacity-50"
    v-if="selectedPhoto"
  >
    <div class="row-start-1 row-span-1 col-start-9 col-span-2" @click="close">
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div class="row-start-2 row-span-6 col-start-2 col-span-8">
      <img
        ref="imageRef"
        class="rounded-md"
        :src="selectedPhoto.photoURL"
        alt="selected photo"
      />
    </div>
    <div class="row-start-8 row-span-2 col-start-2 col-span-3 shrink-0 py-2">
      <img
        ref="imageRef"
        class="object-contain lg:h-32 rounded-full p-2"
        :src="selectedPhoto.iconURL"
        alt="nft icon"
      />
    </div>
    <div class="row-start-9 row-span-1 col-start-8 col-end-10">
      <div class="flex place-items-center">
        <i class="text-5xl material-icons text-white mr-2">share</i>
        <a
          :href="
            'https://twitter.com/intent/tweet?url=https://' +
            nounsMapConfig.hostName +
            '/p/' +
            selectedPhoto.photoId
          "
          target="_blank"
          rel="noopener noreferrer"
        >
          <div
            class="col-span-1 text-gray-700 px-4 py-2 text-sm hover:animate-pulse"
          >
            <img class="h-16 text-center" src="@/assets/icon/Twitter.svg" />
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { useStore } from "vuex";
import { nounsMapConfig } from "@/config/project";
import { defineComponent, computed } from "vue";
import router from "@/router";

export default defineComponent({
  emits: {},
  setup() {
    const store = useStore();
    const selectedPhoto = computed({
      get: () => store.state.selectedPhoto,
      set: (val) => store.commit("setSelectedPhoto", val),
    });
    const close = () => {
      router.push("../map");
    };
    return {
      nounsMapConfig,
      selectedPhoto,
      close,
    };
  },
});
</script>
