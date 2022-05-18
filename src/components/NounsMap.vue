<template>
  <div>
    <div>
      <img :src="dataURL" />
    </div>
  </div>
  <div id="captureRef">
    <div ref="mapRef" class="nouns-map" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import html2canvas from "html2canvas";

import heatmaps from "@/data/heatmapPoints";

export default defineComponent({
  setup() {
    const mapRef = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const heatmapPoints = ref<
      { location: google.maps.LatLng; weight: number }[]
    >([]);
    const captureRef = ref();
    const dataURL = ref<string>();
    const pictureURL = ref<string>();

    onMounted(async () => {
      const loader = new Loader({
        apiKey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
        libraries: ["places", "visualization"],
      });

      const mapOptions = {
        center: { lat: 49, lng: 34.5 },
        zoom: 6,
      };
      mapInstance.value = await loader.load();
      mapObj.value = new mapInstance.value.maps.Map(mapRef.value, mapOptions);

      // TODO: get data from Firestore.
      heatmapPoints.value = heatmaps.map((point) => {
        return {
          location: new mapInstance.value.maps.LatLng(
            point.location.lat,
            point.location.lng
          ),
          weight: point.weight,
        };
      });

      const icon = {
        url: "/images/glasses/red320px.png",
        scaledSize: new mapInstance.value.maps.Size(80, 30),
      };
      const marker = new mapInstance.value.maps.Marker({
        position: new mapInstance.value.maps.LatLng(47, 34.5),
        map: mapObj.value,
        icon,
      });
      pictureURL.value = require("@/assets/sample/pexels-11518762.jpg");

      const contentString =
        '<div id="content">' +
        '<div id="siteNotice">' +
        '<img width="242" height="120"  src="' +
        pictureURL.value +
        '" />';
      "</div>" + "</div>";

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infowindow.open({
        anchor: marker,
        map: mapObj.value,
        shouldFocus: false,
      });

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map: mapObj.value,
          shouldFocus: false,
        });
      });
    });

    watch([heatmapPoints, mapObj], () => {
      if (heatmapPoints.value.length > 0 && mapInstance.value && mapObj.value) {
        const heatmap = new mapInstance.value.maps.visualization.HeatmapLayer({
          data: heatmapPoints.value,
          map: mapObj.value,
        });
        heatmap.setMap(mapObj.value);
      }
    });

    const capture = async () => {
      const el = captureRef.value as HTMLElement;
      const params: Parameters<typeof html2canvas> = [
        el,
        {
          x: 40,
          y: 40,
          width: 480,
          height: 480,
          useCORS: true,
        },
      ];
      const canvasElement = await html2canvas(...params).catch((e) => {
        console.error(e);
        return;
      });
      if (!canvasElement) {
        return;
      }
      dataURL.value = canvasElement.toDataURL();
    };

    return {
      mapRef,
      dataURL,
      pictureURL,
      captureRef,
      capture,
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
