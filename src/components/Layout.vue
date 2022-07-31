<template>
  <div class="layout">
    <NounsUser />
    <PhotoView />
    <PhotoNFTRequest />
    <GuideLogin ref="guideLogin" />
    <GuidePhoto ref="guidePhoto" :photoSelect="photoSelect" />
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
      <li class="mr-3" v-if="featureConfig.enableNFTReq">
        <router-link :to="localizedUrl('/nft')">
          <div
            class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
          >
            {{ $t("menu.nft") }}
          </div>
        </router-link>
      </li>
      <li class="mr-3">
        <a
          class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
          @click="showUpload"
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
    <photo-select ref="photoSelect" />
    <router-view />
    <Languages class="mt-4" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import { useStore } from "vuex";
import { getLocalePath, useI18nParam } from "@/i18n/utils";
import { auth } from "@/utils/firebase";
import { featureConfig } from "@/config/project";

import Languages from "@/components/Languages.vue";
import NounsUser from "@/components/NounsUser.vue";
import PhotoView from "@/components/PhotoView.vue";
import GuideLogin from "@/components/GuideLogin.vue";
import GuidePhoto from "@/components/GuidePhoto.vue";
import PhotoSelect from "@/components/PhotoSelect.vue";
import PhotoNFTRequest from "@/components/PhotoNFTRequest.vue";
import { getLocaleName } from "@/i18n/utils";

export default defineComponent({
  name: "AppLayout",
  components: {
    Languages,
    NounsUser,
    PhotoView,
    PhotoSelect,
    PhotoNFTRequest,
    GuideLogin,
    GuidePhoto,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    store.commit("load");
    const user = computed(() => store.state.user);
    const userPhotoState = computed(() => store.state.userPhotoState);
    const guideLogin = ref();
    let isShownGuideLogin = false;
    const guidePhoto = ref();
    let isShownGuidePhoto = false;
    const photoSelect = ref();
    onMounted(() => {
      auth.onAuthStateChanged(() => {
        console.log("authStateChanged", store.state.account);
        routeCheck();
      });
    });
    watch(
      () => route.path,
      () => {
        routeCheck();
      }
    );
    watch(userPhotoState, () => {
      console.log("userPhoto:", userPhotoState.value);
      routeCheck();
    });
    const routeCheck = () => {
      if (
        route.path == getLocalePath(router, "/map") ||
        route.path == getLocalePath(router, "/nft") ||
        route.path == getLocalePath(router, "/nft_req")
      ) {
        photoSelect.value?.hide();
        //for not sign in user (isShown stored to memory, so if reloaded show again.)
        if (!user.value && !isShownGuideLogin) {
          guideLogin.value.open();
          isShownGuideLogin = true;
        }
        if (user.value) {
          guideLogin.value.close();
        }
        if (
          user.value &&
          userPhotoState.value == "empty" &&
          !isShownGuidePhoto
        ) {
          //for not photo uploaded (isShown stored to memory, so if reloaded show again.)
          guidePhoto.value.open();
          isShownGuidePhoto = true;
        }
      }
    };
    const showUpload = () => {
      if (photoSelect.value.isShow) {
        console.log("hide");
        photoSelect.value.hide();
      } else {
        router.push({
          name: getLocaleName(router, "map"),
        });
        console.log("show");
        photoSelect.value.show();
      }
    };
    useI18nParam();
    return {
      featureConfig,
      guideLogin,
      guidePhoto,
      photoSelect,
      showUpload,
    };
  },
});
</script>
