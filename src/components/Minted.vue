<template>
  <ul class="flex border-b">
    <li class="mr-1">
      <router-link :to="localizedUrl('/nft_req')">
        <span
          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
          >{{ $t("menu.nftRequest") }}</span
        >
      </router-link>
    </li>
    <li class="-mb-px mr-1 cursor-pointer">
      <span
        class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
        >{{ $t("menu.nftMinted") }}</span
      >
    </li>
  </ul>
  <div v-if="nftSyncing" class="text-right">
    <i class="animate-spin material-icons text-lg text-op-teal mr-2"
      >schedule</i
    >
    {{ $t("label.syncing") }}
  </div>

  <div>
    <div class="flex flex-col items-center m-4">
      <span class="my-4 text-2xl text-current">
        {{ $t("message.nftMintedTitle") }}
      </span>
      <span class="my-4 text-xl text-current">
        {{ $t("message.nftMintedDesc") }}
      </span>
      <b>{{ $t("label.nftOwnCount") }} :</b> {{ nftOwnPhotos.length }}

      <div class="max-w-xl mx-auto text-left p-2">
        <div v-if="tokenGate == 'noAccount'">
          <p>{{ $t("message.errorAccount") }}</p>
        </div>
        <div v-else-if="tokenGate == 'invalidNetwork'">
          <p>
            {{ $t("message.invalidNetwork") }} {{ ContentsContract.network }}
          </p>
          <button @click="switchToValidNetwork" class="underline">
            {{ $t("message.switchNetwork") }}
          </button>
        </div>
      </div>
      <div v-if="errorAccount" class="text-red-600">
        {{ $t("message.errorAccount") }}
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="(nphoto, key) in nftOwnPhotos" :key="key">
          <a
            :href="
              ContentsContract.openseaUrl +
              ContentsContract.address +
              '/' +
              nphoto.tokenId
            "
          >
            <div class="flex flex-col">
              <img :src="nphoto.photoURL" class="mt-4 w-48 rounded-xl" />
              <span>{{ $t("label.name") }}:{{ nphoto.tokenURI.name }}</span>
              <span
                >{{ $t("label.description") }}:{{
                  nphoto.tokenURI.description
                }}</span
              >
            </div>
          </a>
          <button
            @click="downloadOriginal(nphoto.photoId)"
            class="inline-block px-6 py-2.5 bg-green-600 text-white leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
          >
            {{ $t("label.downloadOriginal") }}
          </button>
        </div>
      </div>
      <a v-if="downloadLink" :href="downloadLink" class="underline">
        {{ $t("label.downloadLink") }}
      </a>

      <b class="mt-8">{{ $t("label.nftCount") }} :</b> {{ nftPhotos.length }}

      <div class="grid grid-cols-2 gap-4">
        <div v-for="(nphoto, key) in nftPhotos" :key="key">
          <a
            :href="
              ContentsContract.openseaUrl +
              ContentsContract.address +
              '/' +
              nphoto.tokenId
            "
          >
            <div class="flex flex-col">
              <img :src="nphoto.photoURL" class="mt-4 w-48 rounded-xl" />
              <span>{{ $t("label.name") }}:{{ nphoto.tokenURI.name }}</span>
              <span
                >{{ $t("label.description") }}:{{
                  nphoto.tokenURI.description
                }}</span
              >
              <span>{{ $t("label.owner") }}:{{ shortID(nphoto.owner) }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { User } from "firebase/auth";
import { db } from "@/utils/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

import { ContentsContract } from "@/config/project";
import { NftPhoto } from "@/models/photo";
import { photoNFTDownload } from "@/utils/functions";
import { switchNetwork } from "@/utils/MetaMask";
import { shortID, InitBool, InitBoolType } from "@/utils/utils";

export default defineComponent({
  components: {},
  setup() {
    const hasAuthorityToken = ref<InitBoolType>(InitBool.init);
    const store = useStore();
    const user = computed<User>(() => store.state.user);
    const errorAccount = ref(false);
    const justMinted = ref(false);
    const nftSyncing = ref(false);

    const nftPhotos = ref<NftPhoto[]>([]);
    const nftOwnPhotos = ref<NftPhoto[]>([]);
    const downloadLink = ref<string>();

    const tokenGate = computed(() => {
      if (!store.state.account) {
        return "noAccount";
      }
      if (parseInt(store.state.chainId) != parseInt(ContentsContract.chainId)) {
        return "invalidNetwork";
      }
      return "valid";
    });
    const switchToValidNetwork = async () => {
      console.log(ContentsContract.chainId);
      await switchNetwork(ContentsContract.chainId);
    };
    const account = computed(() => {
      if (store.state.account) {
        return ethers.utils.getAddress(store.state.account);
      }
      return null;
    });

    onMounted(async () => {
      updateNftPhotos();
    });

    const updateNftPhotos = async () => {
      const lastOwnUpdate = nftOwnPhotos.value.reduce(
        (p, c) => Math.max(p, (c.updatedAt as Timestamp).toMillis()),
        0
      );
      const lastUpdate = nftPhotos.value.reduce(
        (p, c) => Math.max(p, (c.updatedAt as Timestamp).toMillis()),
        0
      );
      const lastTime = Timestamp.fromMillis(
        Math.max(lastOwnUpdate, lastUpdate)
      );
      const q = query(
        collection(db, `nft_photos`),
        where("updatedAt", ">", lastTime),
        where("nounsmapCreated", "==", true)
      );
      const photos = await getDocs(q);
      for (const doc of photos.docs) {
        const nphoto: NftPhoto = doc.data() as NftPhoto;
        if (!nphoto.photoId) {
          console.log("not nounsmap created", doc.id);
          return;
        }
        if (
          account.value &&
          ethers.utils.getAddress(nphoto.owner) === account.value
        ) {
          console.log("new nft own found", nphoto);
          nftOwnPhotos.value.push(nphoto);
        } else {
          console.log("new nft found", nphoto);
          nftPhotos.value.push(nphoto);
        }
      }
    };

    const downloadOriginal = async (_photoId: string) => {
      console.log(user.value);
      if (
        !account.value ||
        account.value !== ethers.utils.getAddress(user.value.uid)
      ) {
        console.log("wrong user", account.value, user.value);
        errorAccount.value = true;
        return;
      }
      const ret: { data: { success: boolean; url: string } } =
        (await photoNFTDownload({ photoId: _photoId })) as {
          data: { success: boolean; url: string };
        };
      downloadLink.value = ret.data.url;
    };

    return {
      hasAuthorityToken,
      nftPhotos,
      nftOwnPhotos,
      downloadLink,
      account,
      errorAccount,
      justMinted,
      tokenGate,
      ContentsContract,
      nftSyncing,
      InitBool,
      switchToValidNetwork,
      shortID,
      downloadOriginal,
    };
  },
});
</script>
