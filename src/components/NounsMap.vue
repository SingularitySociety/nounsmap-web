<template>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";


export default defineComponent({
  setup() {
    const mapRef = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const heatmapPoints = ref<{location: google.maps.LatLng, weight: number}[]>([]);
    
    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });

      const mapOptions = {
        center: { lat: 49, lng: 34.5 },
        zoom: 5.5,
      };
      mapInstance.value = await loader.load();
      mapObj.value = new mapInstance.value.maps.Map(mapRef.value, mapOptions);

      // TODO: get data from Firestore.
      heatmapPoints.value = [
        {
          location: new mapInstance.value.maps.LatLng(49, 34.5),
          weight: 1,
        },
        {
          location: new mapInstance.value.maps.LatLng(49.3, 34.3),
          weight: 1,
        },
        {
          location: new mapInstance.value.maps.LatLng(49.5, 34.4),
          weight: 2,
        },
      ]
    });

    watch([heatmapPoints, mapObj], () => {
      if (heatmapPoints.value.length > 0 && mapInstance.value && mapObj.value) {
        const heatmap = new mapInstance.value.maps.visualization.HeatmapLayer({
          data: heatmapPoints.value,
          map: mapObj.value
        });
        heatmap.setMap(mapObj.value);
      }
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
