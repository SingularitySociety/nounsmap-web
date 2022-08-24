<template>
  <div class="flex flex-row justify-center items-center m-4">
    <div :class="textColor">
      <span class="text-sm font-bold m-2"> {{ $t(label) }}: </span>
      <span :id="testId">
        {{ text }}
      </span>
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
    label: String,
    testId: String,
    text: String,
    textColor: {
      type: String,
      default: "text-white",
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
