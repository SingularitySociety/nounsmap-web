<template>
  <transition>
    <div
      class="fixed container grid h-full w-full z-30 place-content-center bg-black bg-opacity-50"
      v-if="visibility"
      @close="close"
    >
      <div
        class="bg-white flex-col mx-auto w-auto h-auto shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
          <div class="grid grid-cols-4">
            <div class="col-span-1 text-gray-700 px-4 py-2 text-sm">
              <img class="h-8 text-center" src="@/assets/icon/Twitter.svg" />
            </div>
            <div class="col-span-3 text-gray-700 px-4 py-2 text-sm">
              <TwitterLogin :user="user" />
            </div>
            <div class="col-span-1 text-gray-700 px-4 py-2 text-sm">
              <img
                class="h-8 text-center"
                src="@/assets/icon/metamask-fox.svg"
              />
            </div>
            <div class="col-span-3 text-gray-700 px-4 py-2 text-sm">
              <Wallet :user="user" />
            </div>
          </div>
        </div>
        <div v-if="user.userType == 'twitter.com'">
          <TwitterLogin :user="user" />
        </div>
        <div v-if="user.userType == 'wallet'">
          <Wallet :user="user" />
        </div>
        <div class="flex justify-end pt-4">
          <button
            @click="close()"
            class="inline-block bg-gray-200 hover:bg-white rounded-full text-sm font-semibold text-gray-700 px-3 py-1"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import TwitterLogin from "./TwitterLogin.vue";
import Wallet from "./Wallet.vue";
export interface UserData {
  user: User | null;
  userType: string | undefined;
}
export default defineComponent({
  components: {
    TwitterLogin,
    Wallet,
  },
  setup() {
    const store = useStore();
    const user = reactive<UserData>({ user: null, userType: undefined });
    const isContentShown = ref(false);
    const open = () => store.commit('setUserModalVisibility', true);
    const close = () => store.commit('setUserModalVisibility', false);
    const selectView = ref(true);
    const twitterView = ref(false);
    const metaMaskView = ref(false);
    const visibility = computed<boolean>(() => store.state.userModalVisibility);

    onMounted(async () => {
      auth.onAuthStateChanged((fbuser) => {
        console.log({ fbuser });
        if (fbuser) {
          user.user = fbuser;
          if (fbuser.providerData?.[0]?.providerId) {
            user.userType = fbuser.providerData?.[0].providerId;
          } else if (!fbuser.displayName) {
            user.userType = "wallet";
          } else {
            user.userType = undefined;
          }
          store.commit("setUser", user.user);
          store.commit("setUserType", user.userType);
          isContentShown.value = false;
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
      close,
      visibility,
      store
    };
  },
});
</script>
