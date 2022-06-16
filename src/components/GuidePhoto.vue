<template>
  <div
    class="fixed grid grid-rows-5 grid-cols-5 grid-flow-col items-stretch h-screen w-screen z-40 justify-items-center bg-black bg-opacity-50"
    v-if="isShow"
  >
    <div
      class="col-start-4 row-span-1 col-span-1 flex justify-center items-center"
      @click="isShow = false"
    >
      <i class="text-6xl material-icons text-white mr-2">cancel</i>
    </div>
    <div
      class="row-start-2 col-start-2 col-span-3 row-span-3 col-end-5 justify-center items-center font-mono text-2xl text-white"
    >
      <div class="flex flex-col items-stretch md:items-center">
        {{ $t("message.guidephoto") }}

        <br /><br />
        <button
          @click="gotoPhotoSelect"
          class="bg-green-800 hover:bg-green-100 text-white md:w-2/3 justify-center font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          {{ $t("function.tryphoto") }}
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import PhotoSelect from "@/components/PhotoSelect.vue";

export default defineComponent({
  props: {
    photoSelect: PhotoSelect,
  },
  setup(props) {
    const isShow = ref();
    const open = () => {
      isShow.value = true;
    };
    const gotoPhotoSelect = () => {
      isShow.value = false;
      props.photoSelect?.show();
    };
    return {
      isShow,
      open,
      gotoPhotoSelect,
    };
  },
});
</script>
