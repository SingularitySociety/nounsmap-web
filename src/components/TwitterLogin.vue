<template>
  <section v-if="user && user.userType == 'twitter.com'">
    <div class="max-w-sm bg-white rounded overflow-hidden shadow-lg">
      <img
        ref="imageRef"
        class="h-40 object-cover rounded-md"
        src="user.user.providerData?[0].photoURL"
        alt="twitter photo"
      />
      <div class="mb-8">
        <p class="text-gray-700 text-base">
          twitterName: {{ user?.user?.displayName }} <br />
          email: {{ user?.user?.email }}
        </p>
      </div>
      <button
        class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
        @click="signout"
      >
        {{ $t("message.logout") }}
      </button>
    </div>
  </section>
  <section v-else>
    <button
      class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
      @click="signin"
    >
      {{ $t("message.loginTwitter") }}
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
