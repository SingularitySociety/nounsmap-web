<template>
  <div class="flex-row justify-center m-4">
    <div :class="formatClass">
      <span class="text-sm font-bold m-2"> {{ $t(label) }}:</span>
      <span :id="testId">{{ text }} </span>
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
    label: {
      type: String,
      default: "",
    },
    testId: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    formatClass: {
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
