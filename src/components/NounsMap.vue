<template>
  <twitter-login/>
  <div>
    <div @click="capture">
      ここを押したら
    </div>
    <div>
      ここ↓に出す
      <img :src="dataURL"/>
    </div>
  </div>  
  <div id='captureRef'>
    <div ref="mapRef" class="nouns-map" />
    <div id="content"><img width="242" height="120"  :src="pictureURL" /></div>  
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from "vue";
import { Loader } from "@googlemaps/js-api-loader";
import TwitterLogin from "@/components/TwitterLogin.vue";
import html2canvas from "html2canvas";

import heatmaps from "@/data/heatmapPoints";

export default defineComponent({
  components: {
    TwitterLogin,
  },
  setup() {
    const mapRef = ref();

    const mapInstance = ref();
    const mapObj = ref();

    const heatmapPoints = ref<{location: google.maps.LatLng, weight: number}[]>([]);
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
          location: new mapInstance.value.maps.LatLng(point.location.lat, point.location.lng),
          weight: point.weight,
        };
      });

      pictureURL.value = "/images/sample/FSQp5oGXIAA3qD6.jpeg";
      class Popup extends google.maps.OverlayView {
        position: google.maps.LatLng;
        containerDiv: HTMLDivElement;

        constructor(position: google.maps.LatLng, content: HTMLElement) {
          super();
          this.position = position;

          content.classList.add("popup-bubble");

          // This zero-height div is positioned at the bottom of the bubble.
          const bubbleAnchor = document.createElement("div");

          bubbleAnchor.classList.add("popup-bubble-anchor");
          bubbleAnchor.appendChild(content);

          // This zero-height div is positioned at the bottom of the tip.
          this.containerDiv = document.createElement("div");
          this.containerDiv.classList.add("popup-container");
          this.containerDiv.appendChild(bubbleAnchor);

          // Optionally stop clicks, etc., from bubbling up to the map.
          Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
        }

        /** Called when the popup is added to the map. */
        onAdd() {
          this.getPanes()!.floatPane.appendChild(this.containerDiv);
        }

        /** Called when the popup is removed from the map. */
        onRemove() {
          if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
          }
        }

        /** Called each frame when the popup needs to draw itself. */
        draw() {
          const divPosition = this.getProjection().fromLatLngToDivPixel(
            this.position
          )!;

          // Hide the popup when it is far out of view.
          const display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
              ? "block"
              : "none";

          if (display === "block") {
            this.containerDiv.style.left = divPosition.x + "px";
            this.containerDiv.style.top = divPosition.y + "px";
          }

          if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
          }
        }
      }

      const popup = new Popup(
        new mapInstance.value.maps.LatLng( 49.9, 34.5 ),
        document.getElementById("content") as HTMLElement
      );
      popup.setMap(mapObj.value);

      const icon = {
        url: "/images/4-glasses/glasses-square-honey.png",
        scaledSize: new mapInstance.value.maps.Size(72, 80),
      };
      const marker = new mapInstance.value.maps.Marker({
        position: new mapInstance.value.maps.LatLng(47, 34.5),
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

    const capture = async () => {
      const el = document.querySelector("#captureRef") as HTMLElement;
      const params: Parameters<typeof html2canvas> = [
        el,
        {
          x:240,
          y:240,
          width:480,
          height:480,
          useCORS: true,       
        }
      ]
      const canvasElement = await html2canvas(...params).catch(e => {
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
/* The popup bubble styling. */
.popup-bubble {
  /* Position the bubble centred-above its parent. */
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  /* Style the bubble. */
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  font-family: sans-serif;
  overflow-y: auto;
  max-height: 360px;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.5);
}

/* The parent of the bubble. A zero-height div at the top of the tip. */
.popup-bubble-anchor {
  /* Position the div a fixed distance above the tip. */
  position: absolute;
  width: 100%;
  bottom: 8px;
  left: 0;
}

/* This element draws the tip. */
.popup-bubble-anchor::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  /* Center the tip horizontally. */
  transform: translate(-50%, 0);
  /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
  width: 0;
  height: 0;
  /* The tip is 8px high, and 12px wide. */
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid white;
}

/* JavaScript will position this div at the bottom of the popup tip. */
.popup-container {
  cursor: auto;
  height: 100px;
  position: absolute;
  /* The max width of the info window. */
  width: 200px;
}
</style>
