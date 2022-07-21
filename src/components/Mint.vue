<template>
  <ul class="flex border-b" v-if="isRequestView">
    <li class="-mb-px mr-1 cursor-pointer">
      <span
        class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
        href="#"
        >{{ $t("menu.nftRequest") }}</span
      >
    </li>
    <li class="mr-1" @click="isRequestView = false">
      <a
        class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
        href="#"
        >{{ $t("menu.nftMinted") }}</a
      >
    </li>
  </ul>
  <ul class="flex border-b" v-else>
    <li class="-mb-px mr-1" @click="isRequestView = true">
      <a
        class="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold"
        href="#"
        >{{ $t("menu.nftRequest") }}</a
      >
    </li>
    <li class="mr-1">
      <a
        class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
        href="#"
        >{{ $t("menu.nftMinted") }}</a
      >
    </li>
  </ul>
  <div v-if="nftSyncing" class="text-right">
    <i class="animate-spin material-icons text-lg text-op-teal mr-2"
      >schedule</i
    >
    {{ $t("label.syncing") }}
  </div>

  <div v-if="isRequestView">
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
      {{ nftRequestPhotos.filter((v) => v.status == "init").length }}

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
  <div v-else>
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
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import axios from "axios";

import { nounsMapConfig, ContentsContract } from "@/config/project";
import { NftPhoto, NftRequestPhoto } from "@/models/photo";
import { photoNFTSync, photoNFTDownload } from "@/utils/functions";
import { switchNetwork } from "@/utils/MetaMask";
import { shortID, InitBool, InitBoolType } from "@/utils/utils";
import { ContentsAttribute, AlchemyOwnedTokens } from "@/models/SmartContract";

export default defineComponent({
  components: {},
  setup() {
    const isRequestView = ref(false);
    const hasAuthorityToken = ref<InitBoolType>(InitBool.init);
    const store = useStore();
    const user = computed<User>(() => store.state.user);
    const errorAccount = ref(false);
    const justMinted = ref(false);
    const nftSyncing = ref(false);

    const nftRequestPhotos = ref<NftRequestPhoto[]>([]);
    const nftPhotos = ref<NftPhoto[]>([]);
    const nftOwnPhotos = ref<NftPhoto[]>([]);

    const downloadLink = ref<string>();

    let prevProvider: ethers.providers.Web3Provider | null = null;
    const tokenGate = computed(() => {
      if (!store.state.account) {
        return "noAccount";
      }
      if (parseInt(store.state.chainId) != parseInt(ContentsContract.chainId)) {
        return "invalidNetwork";
      }
      fetchContentsTokens();
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
          fetchContentsTokens();
        });
        prevProvider = provider;
        return { provider, signer, contract };
      }
      return null;
    });

    onMounted(async () => {
      updateNftRequestPhotos();
      updateNftPhotos();
    });

    const updateNftRequestPhotos = async () => {
      const lastUpdate = nftRequestPhotos.value
        .map((v) => v.updatedAt as Timestamp)
        .reduce((p, c) => Math.max(p, c.toMillis()), 0);
      const lastTime = Timestamp.fromMillis(lastUpdate);
      console.log({ lastUpdate }, { lastTime });
      const q = query(
        collection(db, `nft_request_photos`),
        where("updatedAt", ">", lastTime)
      );
      const photos = await getDocs(q);
      photos.forEach((doc: DocumentData) => {
        const nreqphoto: NftRequestPhoto = doc.data();
        console.log("new request found", nreqphoto);
        nftRequestPhotos.value.push(nreqphoto);
      });
    };
    const updateNftPhotos = async () => {
      const lastOwnUpdate = nftOwnPhotos.value
        .map((v) => v.updatedAt as Timestamp)
        .reduce((p, c) => Math.max(p, c.toMillis()), 0);
      const lastUpdate = nftPhotos.value
        .map((v) => v.updatedAt as Timestamp)
        .reduce((p, c) => Math.max(p, c.toMillis()), 0);
      const lastTime = Timestamp.fromMillis(
        Math.max(lastOwnUpdate, lastUpdate)
      );
      const q = query(
        collection(db, `nft_photos`),
        where("updatedAt", ">", lastTime),
        where("nounsmapCreated", "==", true)
      );
      const photos = await getDocs(q);
      photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        const nphoto: NftPhoto = doc.data();
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
      });
    };

    const fetchContentsTokens = async () => {
      if (networkContext.value) {
        checkAuthorityToken();
      }
      if (hasAuthorityToken.value != InitBool.true) {
        return;
      }
      nftSyncing.value = true;
      const log = await photoNFTSync();
      console.log(log);
      updateNftPhotos();
      updateNftRequestPhotos();
      nftSyncing.value = false;
    };
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
    const checkAuthorityToken = async () => {
      if (hasAuthorityToken.value != InitBool.init) {
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
    return {
      isRequestView,
      hasAuthorityToken,
      nftRequestPhotos,
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
      mint,
      switchToValidNetwork,
      shortID,
      downloadOriginal,
    };
  },
});
</script>
