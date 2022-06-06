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
    <div class="shrink-0 py-2" v-if="previewImage">
      <img
        ref="imageRef"
        class="h-40 object-cover rounded-md"
        :src="previewImage"
        @load="onImageLoad"
        alt="selected photo"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { resizeImage } from "@/utils/image";
import exifr from "exifr";
import heic2any from "heic2any";

export interface PhotoInfo {
  file: File | null;
  size: { w: number; h: number } | null;
  resizedBlob: Blob | null;
  location: { lat: number; lng: number } | null;
}

export default defineComponent({
  emits: {
    selected: (param: PhotoInfo | null) => {
      if (param === null) {
        return true;
      }
      if (param.file && param.size && param.resizedBlob) {
        //payload.location is optional
        if (!param.location || (param.location.lat && param.location.lng)) {
          return true;
        }
      }
      return false;
    },
  },
  setup(_, context) {
    const fileInput = ref();
    const previewImage = ref();
    const imageRef = ref();
    const resized = ref();
    let photoInfo = {} as PhotoInfo;

    const selectImage = () => {
      fileInput.value.click();
    };
    const pickFile = async () => {
      const files = fileInput.value.files;

      if (files && files[0]) {
        if (/\.(jpe?g|png|gif)$/i.test(files[0].name)) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            previewImage.value = e?.target?.result;
          };
          reader.readAsDataURL(files[0]);
        } else if (/\.(heic)$/i.test(files[0].name)) {
          const blob = await heic2any({
            blob: files[0],
            toType: "image/jpeg",
            quality: 0.94,
          });
          previewImage.value = URL.createObjectURL(blob as Blob);
        } else {
          fileInput.value.value = "";
          previewImage.value = "";
          context.emit("selected", null);
        }
      }
    };
    const onImageLoad = async () => {
      if (!imageRef.value || !fileInput.value || !fileInput.value.files[0]) {
        console.error(imageRef.value, fileInput.value);
        return false;
      }
      photoInfo.size = {
        w: imageRef.value.naturalWidth,
        h: imageRef.value.naturalHeight,
      };
      const toWidth = 600;
      const toSize = {
        width: toWidth,
        height: (toWidth * photoInfo.size.h) / photoInfo.size.w,
      };
      console.debug(photoInfo.size, toSize);
      const results = await Promise.all([
        resizeImage(imageRef.value, toSize),
        exifr.gps(fileInput.value.files[0]),
      ]);

      if (!results[0]) {
        console.error("resizeImage failed", toSize);
        return false;
      }
      const [resizedCanvas, blob] = results[0];
      photoInfo.resizedBlob = blob as Blob;
      if (resized.value && resizedCanvas) {
        resized.value.getContext("2d").clearRect(0, 0, 1000, 1000);
        resized.value.getContext("2d").drawImage(resizedCanvas, 0, 0);
      }

      if (!results[1]) {
        console.info("exifr.gps no gps info", fileInput.value.files[0]);
        photoInfo.location = null;
      } else {
        const output = results[1];
        console.log({ output });
        photoInfo.location = { lat: output.latitude, lng: output.longitude };
      }
      const files = fileInput.value.files;
      if (!files || !files[0]) {
        console.error("fileInput error", files);
        return false;
      }
      photoInfo.file = files[0];
      context.emit("selected", photoInfo);
    };
    return {
      fileInput,
      imageRef,
      previewImage,
      resized,
      selectImage,
      pickFile,
      onImageLoad,
    };
  },
});
</script>
