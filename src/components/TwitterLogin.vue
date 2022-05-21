<template>
  <section class="card" v-if="user">
    <button class="btn btn-primary"  @click="signout" >
    Logout
    </button>
  </section>
  <section class="card" v-else>
    <button class="btn btn-primary"  @click="signin" >
      Login(Twitter)
    </button>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
// import firebaseApp from '@/src/main.js'
import { getAuth, signInWithPopup, signOut, TwitterAuthProvider } from "firebase/auth";
import { useStore } from "vuex";
import { db } from "@/lib/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";


export default defineComponent({
  props: {
    user: User
  },
  setup() {
    const user = ref();
    const token = ref();
    const secret = ref();
    const signin = () => {
      const provider = new TwitterAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // The signed-in user info.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          token.value = credential.accessToken;
          secret.value = credential.secret;
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + "@@@" + errorMessage);
        });
    };
    const signout = ()=>{
      const auth = getAuth();
      signOut(auth)
      .then(() => {
        console.log("logout correctly");
      })
      .catch(() => {
        alert('Logout fail')
      })
    };
    return {
      signin,
      signout,
    };
  },
});
</script>
