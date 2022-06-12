<template>
  <div
    class="fixed grid h-screen w-screen z-40 place-content-center m-0 p-0 bg-black bg-opacity-50"
    v-if="selectedPhoto"
  >
    <div class="content-end" @click="close">
      <i class="material-icons mr-2">cancel</i>
    </div>
    <div class="shrink-0 py-2">
      <img
        ref="imageRef"
        class="h-80 object-cover rounded-md"
        :src="selectedPhoto.photoURL"
        alt="selected photo"
      />
    </div>
    <div class="shrink-0 py-2">
      <img
        ref="imageRef"
        class="h-10 rounded-lg object-cover p-2"
        :src="selectedPhoto.iconURL"
        alt="selected photo"
      />
    </div>
    <div class="flex">
      <i class="material-icons mr-2">share</i>
      <a
        :href="
          'https://twitter.com/intent/tweet?url=https://' +
          nounsMapConfig.hostName +
          '/p/' +
          selectedPhoto.photoId
        "
      >
        <div
          class="col-span-1 text-gray-700 px-4 py-2 text-sm hover:animate-pulse"
        >
          <img class="h-8 text-center" src="@/assets/icon/Twitter.svg" />
        </div>
      </a>
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
