<template>
  <div class="flex flex-row justify-center items-center m-4">
    <span class="block text-white text-sm font-bold m-2">
      {{ $t("label.event") }}:
    </span>
    <select
      v-model="eventIdRef"
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
import { defineComponent, ref } from "vue";
import { eventName } from "@/utils/utils";

export default defineComponent({
  emits: {},
  props: {
    eventId: {
      type: Number,
      default: 0,
    },
    testId: {
      type: String,
      default: "postEvent",
    },
  },
  setup(props) {
    const eventIdRef = ref<number>(props.eventId);
    const getEventId = () => {
      return eventIdRef.value;
    };
    return {
      eventIdRef,
      supportingEvents,
      getEventId,
      eventName,
    };
  },
});
</script>
