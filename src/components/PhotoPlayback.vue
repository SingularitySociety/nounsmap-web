<template>
  <div class="text-center justify-center">
    <div v-if="playbackState == 'playing'">
      <LabelText testId="photoPlayTitle" label="label.name" :text="title" />
      <span id="photoPlayIndex"> {{ playbackIndex }} </span>/<span
        id="photoCount"
      >
        {{ total }}
      </span>
      <div class="flex flex-row justify-center">
        <IconButton testId="playbackPrevious" icon="skip_previous" />
        <IconButton testId="playbackPause" icon="pause" @clicked="pause()" />
        <IconButton testId="playbackNext" icon="skip_next" />
      </div>
    </div>
    <div v-else-if="playbackState == 'paused'">
      <LabelText testId="photoPlayTitle" label="label.name" :text="title" />
      <span id="photoPlayIndex"> {{ playbackIndex }} </span>/<span
        id="photoCount"
      >
        {{ total }}
      </span>
      <div class="flex flex-row justify-center">
        <IconButton
          testId="playbackPrevious"
          icon="skip_previous"
          @clicked="previous()"
        />
        <IconButton testId="playbackStop" icon="stop" @clicked="stop()" />
        <IconButton testId="playback" icon="play_arrow" @clicked="playback()" />
        <IconButton testId="playbackNext" icon="skip_next" @clicked="next()" />
      </div>
    </div>
    <div v-else>
      <LabelText
        testId="photoCount"
        text-color="justify-center"
        label="label.totalCount"
        :text="String(total)"
      />
      <div class="flex flex-row justify-center">
        <IconButton testId="playback" icon="play_arrow" @clicked="playback()" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from "vue";
import IconButton from "./IconButton.vue";
import LabelText from "./LabelText.vue";

export default defineComponent({
  components: {
    IconButton,
    LabelText,
  },
  emits: {
    started: Number,
    updated: Number,
    stopped: null,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    total: {
      type: Number,
      default: 1,
    },
    start: {
      type: Number,
      deafult: 1,
    },
    repeat: {
      type: Boolean,
      default: true,
    },
    wait: {
      type: Number,
      default: 2,
    },
  },

  setup(props, context) {
    const { total } = toRefs(props);
    const playbackState = ref("stopped");
    const playbackIndex = ref(1);
    let timerObj: ReturnType<typeof setTimeout>;
    const playback = () => {
      timerObj = setInterval(() => {
        count();
      }, props.wait * 1000);
      console.log("started", { timerObj });
      playbackState.value = "playing";
      context.emit("started", playbackIndex.value);
      update();
    };
    const count = () => {
      playbackIndex.value++;
      if (total.value < playbackIndex.value) {
        complete();
      } else {
        update();
      }
    };
    const uncount = () => {
      playbackIndex.value--;
      if (playbackIndex.value < 1) {
        playbackIndex.value = total.value;
      } else {
        update();
      }
    };
    const pause = () => {
      console.log("paused", { timerObj });
      clearInterval(timerObj);
      playbackState.value = "paused";
    };
    const stop = () => {
      console.log("stopped", { timerObj });
      clearInterval(timerObj);
      playbackState.value = "stopped";
      context.emit("stopped");
    };

    const complete = () => {
      playbackIndex.value = 1;
      update();
    };
    const update = () => {
      console.log(playbackIndex.value);
      context.emit("updated", playbackIndex.value);
    };
    const next = () => {
      count();
    };
    const previous = () => {
      uncount();
    };

    return {
      playbackState,
      playbackIndex,
      playback,
      stop,
      pause,
      next,
      previous,
    };
  },
});
</script>
