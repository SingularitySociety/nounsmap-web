<template>
 
 <div class="App container mt-5">
     
    <div class="mb-3">
      <label for="formFile" class="form-label">Upload Image:</label>
      
      <input class="form-control" ref="fileInput" type="file" @input="pickFile">
      </div>
       <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
    </div>
    
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import "bootstrap/dist/css/bootstrap.min.css";

export default defineComponent({
  setup(_, context) {
    const fileInput = ref();
    const previewImage = ref();
    const selectImage = () => {
      fileInput.value.click()
    };
    const pickFile = () => {
      const input = fileInput.value
      const file = input.files
      if (file && file[0]) {
        const reader = new FileReader
        reader.onload = e => {
          previewImage.value = e?.target?.result
        }
        reader.readAsDataURL(file[0])
        context.emit('input', file[0])
        context.emit('selected', file)
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
<style scoped>
.imagePreviewWrapper {
  background-repeat: no-repeat;
    width: 250px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: contain;
    background-position: center center;
}
</style>