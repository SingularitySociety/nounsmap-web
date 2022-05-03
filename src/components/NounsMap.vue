<template>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
  setup() {
    const mapRef = ref();
    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places"],
      });

      const mapOptions = {
        // lat 緯度 lng 経度
        center: { lat: 49, lng: 34.5 },
        zoom: 5.5,
      };
      const google = await loader.load();
      new google.maps.Map(mapRef.value, mapOptions);
    });
    return {
      mapRef,
    };
  },
});
</script>
<style>
/* マップを画面幅に合わせる*/
.nouns-map {
  width: 100vw;
  height: 100vh;
}
</style>
