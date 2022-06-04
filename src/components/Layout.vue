<template>
  <div class="layout">
    <!-- Saved for future changes. Currently causes error. -->
    <!-- <template v-if="user.user"> {{ user.user.displayName }}!! </template> -->
    <ul class="grid grid-cols-3 gap-4 justify-items-stretch">
      <li class="mr-3">
        <div
          class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
        >
          <router-link to="/user/photos">{{ $t("menu.map") }}</router-link>
        </div>
      </li>
      <li class="mr-3">
        <a
          class="cursor-not-allowed flex justify-center items-center border border-white rounded hover:border-gray-200 text-gray-500 hover:bg-gray-200 py-2 px-4"
          href="#"
        >
          {{ $t("menu.upload") }}</a
        >
      </li>
      <li class="mr-3" @click="nounsUserRef?.open()">
        <div
          class="flex justify-center items-center border border-white rounded hover:border-gray-200 text-blue-500 hover:bg-gray-200 py-2 px-4"
        >
          <router-link to="/user">
            <i class="material-icons mr-2">person</i>
            {{ $t("menu.user") }}
          </router-link>
        </div>
      </li>
    </ul>
    <NounsUser ref="nounsUserRef" />

    <router-view />
    <Languages class="mt-4" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
//import { useStore } from "vuex";

//import { auth } from "@/utils/firebase";
//import { User } from "firebase/auth";

import { useI18nParam } from "@/i18n/utils";

import Languages from "@/components/Languages.vue";
import NounsUser from "@/components/NounsUser.vue";

//interface UserData {
//  user: User | null;
//}

export default defineComponent({
  name: "AppLayout",
  components: {
    Languages,
    NounsUser,
  },
  setup() {
    // Saved for future changes. Currently causes error.
    // const store = useStore();
    // const user = reactive<UserData>({ user: null });
    const nounsUserRef = ref<InstanceType<typeof NounsUser>>();

    useI18nParam();

    // Saved for future changes. Currently causes error.
    // onMounted(() => {
    //   auth.onAuthStateChanged((fbuser) => {
    //     if (fbuser) {
    //       console.log("authStateChanged:");
    //       user.user = fbuser;
    //       store.commit("setUser", fbuser);
    //     } else {
    //       store.commit("setUser", null);
    //     }
    //   });
    // });

    return {
      nounsUserRef,
    };
    //   user,
    // };
  },
});
</script>
