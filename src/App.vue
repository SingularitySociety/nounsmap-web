<template>
  <nouns-map />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NounsMap from "./components/NounsMap.vue";

export default defineComponent({
  name: "App",
  components: {
    NounsMap,
  },
});
</script>
