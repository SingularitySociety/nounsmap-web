<template>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
  setup() {
    const mapRef = ref();

    const google = ref();
    const mapObj = ref();
    
    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });

      const mapOptions = {
        // lat 緯度 lng 経度
        center: { lat: 49, lng: 34.5 },
        zoom: 5.5,
      };
      google.value = await loader.load();
      mapObj.value = new google.value.maps.Map(mapRef.value, mapOptions);

      const heatmapPoints = [
        {
          location: new google.value.maps.LatLng(49, 34.5),
          weight: 1,
        },
        {
          location: new google.value.maps.LatLng(49.3, 34.3),
          weight: 1,
        },
        {
          location: new google.value.maps.LatLng(49.5, 34.4),
          weight: 2,
        },
      ]
      
      const heatmap = new google.value.maps.visualization.HeatmapLayer({
        data: heatmapPoints,
        map: mapObj.value
      });
      heatmap.setMap(mapObj.value);
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
