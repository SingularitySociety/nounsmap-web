<template>
    <section class="card" v-if="user">
        <button
            @click="tweet"
            block
            class="text-transform py-4 my-2"
            color="primary"            
            >
            test Tweet
        </button>
          {{ info }}
          {{ user }}
    </section>
    <section class="card" v-else>
        <button
            @click="signin"
            block
            class="text-transform py-4 my-2"
            color="primary"            
            >
            Twitterでログイン
        </button>
        <button
            block
            text
            class="text-transform py-4 my-2"
            color="primary"
            >
            新規登録はこちら
        </button>
    </section>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from "vue";
// import firebaseApp from '@/src/main.js'
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import axios, { AxiosInstance } from "axios";

export default defineComponent({
  setup() {
    const user = ref();
    const token = ref();
    const secret = ref();
    const info = ref();

    const signin = () => {
      const provider = new TwitterAuthProvider();
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
        // The signed-in user info.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        token.value = credential.accessToken;
        secret.value = credential.secret;        
        user.value = result.user;
        if (user.value) {
          console.log(user.value,token.value,secret.value);
        } else {
          alert('有効なアカウントではありません')
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + "@@@" + errorMessage);
      });
    };
    const tweet = () => {
    const apiClientbak = axios.create({
        // APIのURI
        baseURL: "https://api.coindesk.com/",
        // リクエストヘッダ
        headers: {
            "Content-type": "application/json",
        },
    });        
    //apiClientbak.get('v1/bpi/currentprice.json').then(response => (info.value = response))        
    const apiClient = axios.create({
        // APIのURI
        baseURL: "https://api.twitter.com/2/",
        // リクエストヘッダ
        headers: {
            "Content-type": "application/json",
            "Authorization" : "Bearer" + token.value
        },
    });        
    apiClient.get('users/me')
        .then(response => (info.value = response))        
    };
    return {
      user,
      info,
      signin,
      tweet,
    };
  },
});
</script>