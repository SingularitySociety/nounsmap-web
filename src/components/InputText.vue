<template>
  <div class="flex flex-row justify-center items-center text-sm font-bold m-4">
    <span :class="formatClass"> {{ $t(label) }}: </span>
    <input
      type="text"
      :id="testId"
      ref="textRef"
      maxlength="128"
      minlength="1"
      class="text-sm rounded-md py-1 font-semibold text-gray-800 border border-gray-800 text-center"
      @change="changed"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  emits: ['update:text'],
  props: {
    text: {
      type: String,
      default: "",
    },
    formatClass: {
      type: String,
      default: "text-white",
    },
    testId: String,
    label: String,
  },
  setup(props, context) {
    const textRef = ref();
    const getText = () => {
      return textRef.value.value;
    };
    const changed = () => {
      context.emit("update:text", textRef.value.value);
    };
    onMounted(() => {
      textRef.value.value = props.text;
    });
    return {
      textRef,
      changed,
      getText,
    };
  },
});
</script>
