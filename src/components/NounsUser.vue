<template>
  <transition>
    <modal
      class="fixed container grid h-full w-full z-30 place-content-center bg-black bg-opacity-50"
      v-if="isContentShown"
      @close="isContentShown = false"
    >
      <div
        class="bg-white flex-col mx-auto w-80 h-auto shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="grid-cols-1" v-if="!user?.user && selectView">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2"
              for="username"
            >
              Plsease SignIn by
            </label>
          </div>
          <div class="table">
            <div class="table-row">
              <div class="table-cell text-gray-700 px-4 py-2 text-sm">
                twicon
              </div>
              <div class="table-cell text-gray-700 px-4 py-2 text-sm">
                <TwitterLogin :user="user" />
              </div>
            </div>
            <div class="table-row">
              <div class="table-cell text-gray-700 px-4 py-2 text-sm">
                MMicon
              </div>
              <div class="table-cell text-gray-700 px-4 py-2 text-sm">
                <Wallet :user="user"/>
              </div>
            </div>
          </div>
        </div>
        <div v-if="user.userType == 'twitter.com'">
          <TwitterLogin :user="user" />
        </div>
        <div v-if="metaMaskView">
          <Wallet />
          <Connect />
        </div>
        <div class="flex justify-end pt-4">
          <button
            @click="isContentShown = false"
            class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </modal>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  useTransitionState,
} from "vue";
import { useStore } from "vuex";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import Connect from "@/components/Connect.vue";
import TwitterLogin from "./TwitterLogin.vue";
import Wallet from "./Wallet.vue";
export interface UserData {
  user: User | null;
  userType: string | undefined;
}
export default defineComponent({
  components: {
    Connect,
    TwitterLogin,
    Wallet,
  },
  emits: {
    updated: (param: any) => {
      if (param.image && param.token) {
        return true;
      } else {
        return false;
      }
    },
  },
  setup(_, context) {
    const store = useStore();
    const user = reactive<UserData>({ user: null, userType: undefined });
    const isContentShown = ref(false);
    const open = () => (isContentShown.value = true);
    const selectView = ref(true);
    const twitterView = ref(false);
    const metaMaskView = ref(false);

    onMounted(async () => {
      auth.onAuthStateChanged((fbuser) => {
        console.log({ fbuser });
        if (fbuser) {
          user.user = fbuser;
          user.userType = fbuser.providerData?.[0].providerId;
          store.commit("setUser", user.user);
          store.commit("setUserType", user.userType);
        } else {
          store.commit("setUserType", undefined);
          store.commit("setUser", null);
          user.userType = undefined;
          user.user = null;
        }
      });
    });
    return {
      isContentShown,
      selectView,
      twitterView,
      metaMaskView,
      user,
      open,
    };
  },
});
</script>
