<template>
  <div class="flex flex-row items-center text-sm font-bold m-4">
    <span :class="formatClass"> {{ $t("label.event") }}: </span>
    <select
      v-model="selectedId"
      :id="testId"
      class="text-sm rounded-md py-1 font-semibold text-gray-800 border border-gray-800 text-center"
    >
      <option
        v-for="event in supportingEvents"
        :value="event.eventId"
        :key="event.eventId"
      >
        {{ eventName(event.eventId) }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { supportingEvents } from "@/config/project";
import { defineComponent, watch, ref, toRefs } from "vue";
import { eventName } from "@/utils/utils";

export default defineComponent({
  emits: {
    updated: null,
  },
  props: {
    eventId: {
      type: Number,
      default: 0,
    },
    testId: {
      type: String,
      default: "postEvent",
    },
    formatClass: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    const { eventId } = toRefs(props);
    watch(eventId, () => {
      selectedId.value = eventId.value;
    });
    const selectedId = ref<number>(props.eventId);
    watch(
      () => selectedId.value,
      () => {
        context.emit("updated", selectedId.value);
      }
    );
    const getEventId = () => {
      return selectedId.value;
    };
    return {
      selectedId,
      supportingEvents,
      getEventId,
      eventName,
    };
  },
});
</script>
