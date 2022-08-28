<template>
  <div class="text-large" @click="clicked" :id="testId">
    <div :class="formatClass">
      <div :class="animate">
        <i class="text-5xl material-icons hover:animate-pulse mr-2">{{
          icon
        }}</i>
      </div>
      <span v-if="label">{{ $t(label) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  emits: {
    clicked: null,
  },
  props: {
    icon: {
      type: String,
      default: "",
    },
    testId: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    formatClass: {
      type: String,
      default: "",
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
