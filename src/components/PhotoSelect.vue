<template>
  <div class="container mx-auto px-2 py-4">
    <span class="sr-only">Upload Image:</span>
    <input type="file" ref="fileInput" @input="pickFile"
      class="text-sm text-slate-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-full file:border-1
      file:text-sm file:font-semibold
      file:bg-white file:text-gray-800
      hover:file:bg-gray-100
    "/>
    <div class="shrink-0 py-2"  @click="selectImage" v-if="previewImage">
      <img class="h-40 object-cover rounded-md" :src="previewImage" alt="selected photo" />
    </div>    
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(_, context) {
    const fileInput = ref();
    const previewImage = ref();
    const selectImage = () => {
      fileInput.value.click();
    };
    const pickFile = () => {
      const input = fileInput.value;
      const file = input.files;
      if (file && file[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.value = e?.target?.result;
        };
        reader.readAsDataURL(file[0]);
        context.emit("input", file[0]);
        context.emit("selected", file);
      }
    };
    return {
      fileInput,
      previewImage,
      selectImage,
      pickFile,
    };
  },
});
</script>

