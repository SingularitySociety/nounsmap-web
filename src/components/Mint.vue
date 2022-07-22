<template>
  <ul class="flex border-b">
    <li class="-mb-px mr-1 cursor-pointer">
      <span
        class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
        >{{ $t("menu.nftRequest") }}</span
      >
    </li>
    <li class="mr-1">
      <router-link :to="localizedUrl('/nft')">
        <span
          class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
          >{{ $t("menu.nftMinted") }}</span
        >
      </router-link>
    </li>
  </ul>
  <div v-if="nftSyncing" class="text-right">
    <i class="animate-spin material-icons text-lg text-op-teal mr-2"
      >schedule</i
    >
    {{ $t("label.syncing") }}
  </div>

  <div>
    <div v-if="nftRequestPhotos" class="flex flex-col items-center m-4">
      <span class="my-4 text-2xl text-current">
        {{ $t("message.nftRequestTitle") }}
      </span>
      <span class="my-4 text-xl text-current">
        {{
          $t("message.nftRequestDesc", {
            tokenName: ContentsContract.authorityTokenName,
          })
        }}
      </span>
      <b>{{ $t("label.requestCount") }} :</b>
      {{ nftRequestPhotos.length }}

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
        <div v-else>
          <div v-if="justMinted">
            <p>{{ $t("message.justMint") }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div v-for="(photo, key) in nftRequestPhotos" :key="key">
          <div
            class="flex flex-col"
            v-if="photo.status == 'init' || photo.status == 'mint'"
          >
            <img :src="photo.photoURL" class="mt-4 w-48 rounded-xl" />
            <span>{{ $t("label.creator") }}:{{ shortID(photo.creator) }}</span>
            <span>{{ $t("label.name") }}:{{ photo.title }}</span>
            <span>{{ $t("label.description") }}:{{ photo.description }}</span>
            <p>
              <button
                v-if="
                  photo?.status == 'init' && hasAuthorityToken == InitBool.true
                "
                @click="mint(photo.creator, photo.photoId)"
                class="inline-block px-6 py-2.5 bg-green-600 text-white leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {{ $t("label.mint") }}
              </button>
              <button
                v-else
                type="button"
                class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                disabled
              >
                <span v-if="photo?.status == 'init'">
                  {{ $t("label.mintNotHasAuthority") }}
                </span>
                <span v-else>
                  <i
                    class="animate-spin material-icons text-lg text-op-teal mr-2"
                    >schedule</i
                  >
                  {{ $t("label.minting") }} </span
                >>
              </button>
              {{ $t("message.mintCaution") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { db } from "@/utils/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import axios from "axios";

import { nounsMapConfig, ContentsContract } from "@/config/project";
import { NftRequestPhoto } from "@/models/photo";
import { photoNFTSync } from "@/utils/functions";
import { switchNetwork } from "@/utils/MetaMask";
import { shortID, InitBool, InitBoolType } from "@/utils/utils";
import { ContentsAttribute, AlchemyOwnedTokens } from "@/models/SmartContract";

export default defineComponent({
  components: {},
  setup() {
    const hasAuthorityToken = ref<InitBoolType>(InitBool.init);
    const store = useStore();
    const errorAccount = ref(false);
    const justMinted = ref(false);
    const nftSyncing = ref(false);

    const nftRequestPhotos = ref<NftRequestPhoto[]>([]);

    let prevProvider: ethers.providers.Web3Provider | null = null;
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
    const networkContext = computed(() => {
      if (prevProvider) {
        console.log("Calling removeAllListners()");
        prevProvider.removeAllListeners();
        prevProvider = null;
      }

      if (
        store.state.account &&
        parseInt(store.state.chainId) == parseInt(ContentsContract.chainId)
      ) {
        const provider = new ethers.providers.Web3Provider(
          store.state.ethereum
        );
        console.log("update ContentsContract");
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          ContentsContract.address,
          ContentsContract.wabi.abi,
          signer
        );
        const mintFilter = contract.filters.ContentsCreated();
        provider.on(mintFilter, (log, event) => {
          console.log("**** got mint event", log, event);
          justMinted.value = false;
          nftSync();
        });
        prevProvider = provider;
        return { provider, signer, contract };
      }
      return null;
    });

    onMounted(async () => {
      updateNftRequestPhotos();
      checkAuthorityToken();
    });

    const updateNftRequestPhotos = async () => {
      const lastTime = Timestamp.fromMillis(
        nftRequestPhotos.value.reduce(
          (p, c) => Math.max(p, (c.updatedAt as Timestamp).toMillis()),
          0
        )
      );
      console.log({ lastTime });
      const q = query(
        collection(db, `nft_request_photos`),
        where("status", "==", "init"),
        where("updatedAt", ">", lastTime)
      );
      const photos = await getDocs(q);
      for (const doc of photos.docs) {
        const nreqphoto: NftRequestPhoto = doc.data() as NftRequestPhoto;
        console.log("new request found", nreqphoto);
        nftRequestPhotos.value.push(nreqphoto);
      }
    };

    const nftSync = async () => {
      if (hasAuthorityToken.value != InitBool.true) {
        return;
      }
      nftSyncing.value = true;
      const log = await photoNFTSync();
      console.log(log);
      updateNftRequestPhotos();
      nftSyncing.value = false;
    };
    watch(
      () => hasAuthorityToken.value,
      () => {
        nftSync();
      }
    );

    const mint = async (_from: string, _photoId: string) => {
      if (!networkContext.value || !account.value) return;
      console.log(_from, _photoId);
      const photo = await getDoc(doc(db, `nft_request_photos/${_photoId}`));
      if (!photo.exists()) {
        console.error("invalid photoId", _photoId);
        return;
      }
      const pdata: NftRequestPhoto = photo.data() as NftRequestPhoto;
      console.log(pdata);
      const { group, category, width, height } = ContentsContract;
      const asset: ContentsAttribute = {
        group,
        category,
        tag: "", //TBD
        width,
        height,
        minter: "", //TBD
        metadata: new Uint8Array(), //TBD
        name: pdata.title,
        description: pdata.description,
        soulbound: account.value,
        creator: _from,
      };
      await networkContext.value.contract.functions.mint(
        _from,
        ContentsContract.authorityToken,
        _photoId,
        asset
      );
      const target = nftRequestPhotos.value.findIndex(
        (v) => v.photoId == _photoId
      );
      console.log(target, nftRequestPhotos.value[target]);
      nftRequestPhotos.value[target].status = "mint";

      justMinted.value = true;
    };

    const checkAuthorityToken = async () => {
      if (!account.value || hasAuthorityToken.value != InitBool.init) {
        //already checked once.
        return;
      }
      try {
        const provider = new ethers.providers.Web3Provider(
          store.state.ethereum
        );
        const { name, chainId } = await provider.getNetwork();
        console.info({ name }, { chainId });
        const base = ContentsContract.alchemyUrl;
        const request = {
          method: "get",
          url: `${base}${nounsMapConfig.alchemy}/getNFTs/?owner=${account.value}`,
        };
        const response = await axios(request);
        console.log(response);
        const target = response.data.ownedNfts.filter(
          (nft: AlchemyOwnedTokens) => {
            if (
              Number(nft.contract.address) ==
              Number(ContentsContract.authorityToken)
            ) {
              if (ContentsContract.authorityTokenFilter) {
                const base = ethers.BigNumber.from(
                  ContentsContract.authorityTokenFilter
                );
                const targetId = ethers.BigNumber.from(nft.id.tokenId);
                //opensea polygon ERC1155 uses 12 byte mask
                const shift = ContentsContract.authorityTokenIdmask * 8; //8bit
                return base.shr(shift).eq(targetId.shr(shift));
              } else {
                return true;
              }
            }
            return false;
          }
        );
        if (target.length > 0) {
          console.log(target);
          hasAuthorityToken.value = InitBool.true;
        } else {
          hasAuthorityToken.value = InitBool.false;
        }
      } catch (error) {
        console.log(error);
      }
    };
    watch(
      () => account.value,
      () => {
        checkAuthorityToken();
      }
    );
    return {
      hasAuthorityToken,
      nftRequestPhotos,
      account,
      errorAccount,
      justMinted,
      tokenGate,
      ContentsContract,
      nftSyncing,
      InitBool,
      mint,
      switchToValidNetwork,
      shortID,
    };
  },
});
</script>
