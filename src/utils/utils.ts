import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { supportingEvents } from "@/config/project";

export const useUser = () => {
  const store = useStore();
  const user = computed(() => store.state.user);
  return user;
};
export const useIsSignedIn = () => {
  const store = useStore();
  const isSignedIn = computed(() => store.getters.isSignedIn);
  return isSignedIn;
};
export const shortID = (_id: string) => {
  if (_id.length <= 6) {
    return _id;
  } else if (_id.startsWith("0x")) {
    return _id.slice(2, 6) + ".." + _id.slice(-3);
  } else {
    return _id.slice(0, 4) + ".." + _id.slice(-3);
  }
};

export const eventName = (eventId: number) => {
  const event = supportingEvents.find((v) => v.eventId == eventId);
  if (!event) return "";
  const i18n = useI18n();
  const locl: keyof typeof event.name = i18n.locale
    .value as keyof typeof event.name;
  return event?.name[locl] ? event.name[locl] : "";
};
