<template>
  <transition>
    <div
      class="fixed grid items-stretch h-screen w-screen z-30 place-content-center bg-black bg-opacity-50"
      v-if="isContentShown"
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
              {{ $t("message.pleasesignin") }}
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
            @click="close"
            id="Close"
            class="inline-block bg-gray-200 hover:bg-white rounded-full text-sm font-semibold text-gray-700 px-3 py-1"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
  <div v-if="false">
    {{ debugmessage }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useStore } from "vuex";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { initializeEthereum } from "@/utils/MetaMask";
import { getLocalePath, getLocaleName } from "@/i18n/utils";

import TwitterLogin from "./TwitterLogin.vue";
import Wallet from "./Wallet.vue";
import { ethers } from "ethers";
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
    const route = useRoute();
    const store = useStore();
    const user = reactive<UserData>({ user: null, userType: undefined });
    const isContentShown = ref(false);
    const selectView = ref(true);
    const twitterView = ref(false);
    const metaMaskView = ref(false);
    const debugmessage = ref<string>();
    initializeEthereum();
    onMounted(async () => {
      if (route.path == getLocalePath(router, "/user")) {
        console.log(route.path);
        isContentShown.value = true;
      }
      auth.onAuthStateChanged((fbuser) => {
        console.log({ fbuser });
        if (fbuser) {
          user.user = fbuser;
          if (fbuser.providerData?.[0]?.providerId) {
            user.userType = fbuser.providerData?.[0].providerId;
          } else if (!fbuser.displayName) {
            user.userType = "wallet";
            if (
              ethers.utils.getAddress(user.user.uid) !==
              ethers.utils.getAddress(store.state.account)
            ) {
              console.log("auto signout");
              auth.signOut();
              store.commit("setNft", null);
            }
          } else {
            user.userType = undefined;
          }
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
    watch(
      () => route.path,
      () => {
        if (route.path == getLocalePath(router, "/user")) {
          console.log(route.path);
          isContentShown.value = true;
        } else {
          isContentShown.value = false;
        }
      }
    );
    watch(
      () => store.state.account,
      (cur) => {
        console.log("watched cur:", cur);
        if (store.getters.hasMetaMask) {
          if (user?.userType == "wallet" && user.user?.uid) {
            if (
              ethers.utils.getAddress(user.user.uid) !==
              ethers.utils.getAddress(store.state.account)
            ) {
              console.log("signout");
              auth.signOut();
              store.commit("setNft", null);
            }
          }
        }
      }
    );

    const close = () => {
      router.push({
        name: getLocaleName(router, "map"),
      });
    };

    return {
      isContentShown,
      selectView,
      twitterView,
      metaMaskView,
      user,
      debugmessage,
      close,
    };
  },
});
</script>
