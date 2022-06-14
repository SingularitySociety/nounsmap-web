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
    const clickedPhoto = computed({
      get: () => store.state.clickedPhoto,
      set: (val) => store.commit("setClickedPhoto", val),
    });
    const close = () => {
      router.push("../map");
    };
    return {
      nounsMapConfig,
      clickedPhoto,
      close,
    };
  },
});
</script>
