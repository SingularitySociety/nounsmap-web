<template>
  <div class="container mx-auto px-2 py-4">
    <canvas ref="resized" v-if="false" />
    <span class="sr-only">{{ $t("message.selectImage") }}</span>
    <input
      type="file"
      ref="fileInput"
      @input="pickFile"
      class="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-1 file:text-sm file:font-semibold file:bg-white file:text-gray-800 hover:file:bg-gray-100"
    />
    <div class="shrink-0 py-2" @click="selectImage" v-if="previewImage">
      <img
        ref="imageRef"
        class="h-40 object-cover rounded-md"
        :src="previewImage"
        alt="selected photo"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { resizeImage } from "@/utils/image";

export default defineComponent({
  setup(_, context) {
    const fileInput = ref();
    const previewImage = ref();
    const imageRef = ref();
    const resized = ref();
    let resizedBlob: Blob;
    let imageSize: { w: number; h: number };

    const selectImage = () => {
      fileInput.value.click();
    };
    const pickFile = () => {
      const file = fileInput.value.files;
      if (file && file[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.value = e?.target?.result;
        };
        reader.readAsDataURL(file[0]);
      }
    };
    const getResizedBlob = () => {
      return resizedBlob;
    };
    const getImageSize = () => {
      return imageSize;
    };
    watch(imageRef, () => {
      if (!imageRef.value) {
        return;
      }
      imageRef.value.onload = async function () {
        imageSize = {
          w: imageRef.value.naturalWidth,
          h: imageRef.value.naturalHeight,
        };
        const toWidth = 600;
        const toSize = {
          width: toWidth,
          height: (toWidth * imageSize.h) / imageSize.w,
        };
        console.debug(imageSize, toSize);
        //TBD : can not resized correctly
        const [resizedCanvas, blob] = await resizeImage(imageRef.value, toSize);
        resizedBlob = blob;
        if (resized.value) {
          resized.value.getContext("2d").clearRect(0, 0, 1000, 1000);
          resized.value.getContext("2d").drawImage(resizedCanvas, 0, 0);
        }
        context.emit("selected", fileInput.value.files[0]);
      };
    });
    return {
      fileInput,
      imageRef,
      previewImage,
      resized,
      selectImage,
      pickFile,
      getResizedBlob,
      getImageSize,
    };
  },
});
</script>
