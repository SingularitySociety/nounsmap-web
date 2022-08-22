<template>
  <div class="flex flex-row justify-center items-center m-4">
    <span class="block text-white text-sm font-bold m-2">
      {{ $t(label) }}:
    </span>
    <input
      type="text"
      :id="testId"
      ref="textRef"
      maxlength="128"
      minlength="1"
      class="text-sm rounded-md py-1 font-semibold text-gray-800 border border-gray-800 text-center"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  emits: {},
  props: {
    initText: {
      type: String,
      default: "",
    },
    testId: String,
    label: String,
  },
  setup(props) {
    const textRef = ref();
    const getText = () => {
      return textRef.value.value;
    };
    onMounted(() => {
      textRef.value.value = props.initText;
    });
    return {
      textRef,
      getText,
    };
  },
});
</script>
