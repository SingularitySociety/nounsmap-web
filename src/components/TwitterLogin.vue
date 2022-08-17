<template>
  <section v-if="user && user.userType == 'twitter.com'">
    <div
      class="max-w-xs max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl border-r border-b border-l border-gray-400 border-t bg-white rounded-b lg:rounded-r p-8 my-4 mx-4"
    >
      <img
        ref="imageRef"
        class="h-40 object-cover rounded-md"
        :src="(user?.user?.photoURL as string)"
        alt="twitter photo"
      />
      <div class="mb-8">
        <p class="text-gray-700 text-base">
          twitterName: {{ user?.user?.displayName }} <br />
        </p>
      </div>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        @click="signout"
        id="SignOutTwitter"
      >
        {{ $t("function.signout") }}
      </button>
    </div>
  </section>
  <section v-else>
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      @click="signin"
      id="SignInTwitter"
    >
      {{ $t("function.signinTwitter") }}
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
// import firebaseApp from '@/src/main.js'
import {
  getAuth,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";
import { UserData } from "@/components/NounsUser.vue";

export default defineComponent({
  props: {
    user: Object as PropType<UserData>,
  },
  setup() {
    const signin = () => {
      const provider = new TwitterAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then(() => {
          // The signed-in user info.
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "@@@" + errorMessage);
        });
    };
    const signout = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("logout correctly");
        })
        .catch(() => {
          alert("Logout fail");
        });
    };
    return {
      signin,
      signout,
    };
  },
});
</script>
