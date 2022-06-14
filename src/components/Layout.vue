<template>
  <div class="layout">
    <PhotoView />
    <NounsUser />
    <GuideLogin ref="guideLogin" />
    <!-- Saved for future changes. Currently causes error. -->
    <!-- <template v-if="user.user"> {{ user.user.displayName }}!! </template> -->
    <ul class="grid grid-cols-3 gap-0 justify-items-stretch">
      <li class="mr-3">
        <router-link :to="localizedUrl('/map')">
          <div
            class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
          >
            {{ $t("menu.map") }}
          </div>
        </router-link>
      </li>
      <li class="mr-3">
        <a
          class="cursor-not-allowed flex justify-center items-center border border-white rounded hover:border-gray-200 text-gray-500 hover:bg-gray-200 py-2 px-4"
          href="#"
        >
          {{ $t("menu.upload") }}</a
        >
      </li>
      <li class="mr-3">
        <router-link :to="localizedUrl(`/user`)">
          <div
            class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
          >
            <i class="material-icons mr-2">person</i>
            {{ $t("menu.user") }}
          </div>
        </router-link>
      </li>
    </ul>
    <router-view />
    <Languages class="mt-4" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useStore } from "vuex";
import {getLocalePath, useI18nParam } from "@/i18n/utils";
import { auth } from "@/utils/firebase";

import Languages from "@/components/Languages.vue";
import NounsUser from "@/components/NounsUser.vue";
import PhotoView from "@/components/PhotoView.vue";
import GuideLogin from "@/components/GuideLogin.vue";

export default defineComponent({
  name: "AppLayout",
  components: {
    Languages,
    NounsUser,
    PhotoView,
    GuideLogin,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    store.commit("load");
    const user = computed(() => store.state.user);
    const guideLogin = ref();
    let isShownGuideLogin = false;
    onMounted(() =>{
      auth.onAuthStateChanged((fbuser) => {
        routeCheck();
      });
    });
    watch(
      () => route.path,
      () => {
        routeCheck();
      }
    );
    const routeCheck = ()=>{
      if (route.path == getLocalePath(router, "/map")) {
        //for not sign in user (isShown stored to memory, so if reloaded show again.)
        if(!user.value && !isShownGuideLogin){
          console.log("guideOpen");
          guideLogin.value.open();
          isShownGuideLogin=true;
        }
      }

    }

    useI18nParam();
    return {
      guideLogin
    };
  },
});
</script>
