<template>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

export default defineComponent({
  setup() {
    const mapRef = ref();

    const google = ref();
    const mapObj = ref();

    const heatmapPoints = ref<{location: any, weight: number}[]>([]);
    
    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });

      const mapOptions = {
        // lat: latitude, lng: longititude
        center: { lat: 49, lng: 34.5 },
        zoom: 5.5,
      };
      google.value = await loader.load();
      mapObj.value = new google.value.maps.Map(mapRef.value, mapOptions);

      // TODO: get data from Firestore.
      heatmapPoints.value = [
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
    });

    watch([heatmapPoints, mapObj], () => {
      if (heatmapPoints.value.length > 0 && google.value && mapObj.value) {
        const heatmap = new google.value.maps.visualization.HeatmapLayer({
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
