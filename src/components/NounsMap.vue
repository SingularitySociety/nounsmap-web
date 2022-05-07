<template>
  <div ref="mapRef" class="nouns-map" />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";

import heatmaps from "@/data/heatmapPoints";

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
      heatmapPoints.value = heatmaps.map((point) => {
        return {
          location: new mapInstance.value.maps.LatLng(point.location.lat, point.location.lng),
          weight: point.weight,
        };
      });


      const icon = {
        url: "/images/4-glasses/glasses-square-honey.png",
        scaledSize: new mapInstance.value.maps.Size(72, 80),
      };
      const marker = new mapInstance.value.maps.Marker({
        position: new mapInstance.value.maps.LatLng(49, 34.5),
        map: mapObj.value,
        icon,
      });
      
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
