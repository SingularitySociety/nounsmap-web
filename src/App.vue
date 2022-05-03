<template>
  <nouns-map />
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useUser, useIsSignedIn } from "@/utils/utils";
import NounsMap from "./components/NounsMap.vue";

export default defineComponent({
  name: "App",
  components: {
    NounsMap,
  },
});
</script>
