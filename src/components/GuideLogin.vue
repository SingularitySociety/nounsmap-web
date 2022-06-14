<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-40 justify-items-center bg-black bg-opacity-50"
    v-if="isShow"
  >
    <div
      class="col-start-4 row-span-1 col-span-1 flex justify-center items-center"
      @click="isShow=false"
    >
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div
      class="row-start-2 col-start-2 col-span-3 row-span-3 col-end-5 justify-center items-center font-mono"
    >
    初めての人はログインしてね。ここを押してね。
    </div>
    <div
      class="row-start-5 col-start-2 col-span-2 row-span-1 shrink-0 py-2 flex justify-center items-center"
    >
      <div class="flex flex-column items-center">

      
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { nounsMapConfig } from "@/config/project";
import router from "@/router";

export default defineComponent({
  emits: {},
  setup() {
    const store = useStore();
    const isShow = ref();
    const clickedPhoto = computed({
      get: () => store.state.clickedPhoto,
      set: (val) => store.commit("setClickedPhoto", val),
    });
    const open = () => {
      isShow.value = true;
    };
    return {
      nounsMapConfig,
      clickedPhoto,
      isShow,
      open,
    };
  },
});
</script>
