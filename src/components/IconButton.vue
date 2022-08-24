<template>
  <div class="text-large" @click="clicked" :id="testId">
    <span :class="textColor">
      <div :class="animate">
        <i
          class="text-5xl material-icons text-white hover:animate-pulse mr-2"
          >{{ icon }}</i
        >
      </div>
      {{ $t(label) }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: {
    clicked: null,
  },
  props: {
    icon: String,
    testId: String,
    label: String,
    textColor: {
      type: String,
      default: "text-white",
    },
    animate: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const clicked = () => {
      context.emit("clicked");
    };
    return {
      clicked,
    };
  },
});
</script>
