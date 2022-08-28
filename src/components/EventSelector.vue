<template>
  <div class="flex flex-row items-center text-sm font-bold m-4">
    <span :class="formatClass"> {{ $t("label.event") }}: </span>
    <select
      v-model="myEventId"
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
  emits: ['update:eventId'],
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
    //this watch needed for the case direct link to event page (event ID updated has delay)
    watch(eventId, () => {
        console.log("prop update",eventId.value);
        myEventId.value = eventId.value;
    });
    const myEventId = ref<number>(props.eventId);
    watch(myEventId, () => {
        console.log("selected",myEventId.value);
        context.emit("update:eventId", myEventId.value);
      }
    );
    const getEventId = () => {
      return myEventId.value;
    };
    return {
      myEventId,
      supportingEvents,
      getEventId,
      eventName,
    };
  },
});
</script>
