<template>
 
 <div class="App container mt-5">
     
    <div class="mb-3">
      <label for="formFile" class="form-label">Upload Image:</label>
      
      <input class="form-control" ref="fileInput" type="file" @input="pickFile">
      </div>
       <div class="imagePreviewWrapper" :style="{ 'background-image': `url(${previewImage})` }" @click="selectImage"></div>
    </div>
    
</template>
<script>
//importing bootstrap 5 and pdf maker Modules
import "bootstrap/dist/css/bootstrap.min.css";
export default {
  methods: {
      //image upload and preview methods
        selectImage () {
          this.$refs.fileInput.click()
      },
      pickFile () {
        let input = this.$refs.fileInput
        let file = input.files
        if (file && file[0]) {
          let reader = new FileReader
          reader.onload = e => {
            this.previewImage = e.target.result
          }
          reader.readAsDataURL(file[0])
          this.$emit('input', file[0])
        }
      }
  },
  data: function() {
    return {
      previewImage: null
    }  
  }
}
</script>
<style >
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