<template>
    <div ref="map" class="nouns-map"></div>
</template>

<script>
export default {
  data(){
    return {
      map:'',
    }
  },
  mounted(){
    let timer = setInterval(() => {
      if(window.google){
        clearInterval(timer);
        this.map = new window.google.maps.Map(this.$refs.map, {
          // lat 緯度 lng 経度
          center: {lat: 49, lng: 34.5},
          zoom: 5.5
        });       
      }
    },500)
  }
}

</script>
<style>

/* マップを画面幅に合わせる*/
.nouns-map {
    width: 100vw;
    height: 100vh;
}

</style>