import { computed } from "vue";
import { useStore } from "vuex";

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

// Add init status to bool
export const InitBool = {
  init: 'init',
  true: 'true',
  false: 'false',
} as const;

export type InitBoolType = typeof InitBool[keyof typeof InitBool];
export const AllInitBool = Object.values(InitBool);