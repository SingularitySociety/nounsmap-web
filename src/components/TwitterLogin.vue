<template>
  <section class="card" v-if="user">
    <button class="btn btn-primary" @click="signout">Logout</button>
  </section>
  <section class="card" v-else>
    <button class="btn btn-primary" @click="signin">Login(Twitter)</button>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import firebaseApp from '@/src/main.js'
import {
  getAuth,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";

export default defineComponent({
  props: {
    user: Object,
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
