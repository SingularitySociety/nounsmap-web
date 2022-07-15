<template>
  <ul class="flex border-b" v-if="isRequestView">
    <li class="-mb-px mr-1">
      <a
        class="bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold"
        href="#"
        >{{ $t("menu.nftRequest") }}</a
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

  <div v-if="nftRequestPhotos" class="flex flex-col items-center m-4">
    <span class="my-4 text-2xl text-current">
      {{ $t("message.nftRequestTitle") }}
    </span>
    <span class="my-4 text-xl text-current">
      {{ $t("message.nftRequestDesc") }}
    </span>

    <div class="max-w-xl mx-auto text-left p-2">
      <div v-if="tokenGate == 'noAccount'">
        <p>there are no Account</p>
      </div>
      <div v-else-if="tokenGate == 'invalidNetwork'">
        <p>invalid network: we neeed to connect {{ networkName }}</p>
        <button @click="switchToValidNetwork" class="underline">
          Switch Network
        </button>
      </div>
      <div v-else>
        <b>Current Token count:</b> {{ currentToken }}
        <div v-if="justMinted">
          <p>Thank you for minting. Please wait a little bit...</p>
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
              v-if="photo?.status == 'init'"
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
              <i class="animate-spin material-icons text-lg text-op-teal mr-2"
                >schedule</i
              >
              {{ $t("label.minting") }}
            </button>
            {{ $t("message.mintCaution") }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="nftPhotos" class="flex flex-col items-center m-4">
    <span class="my-4 text-2xl text-current">
      {{ $t("message.nftMintedTitle") }}
    </span>
    <span class="my-4 text-xl text-current">
      {{ $t("message.nftMintedDesc") }}
    </span>
    <div class="max-w-xl mx-auto text-left p-2">
      <div v-if="tokenGate == 'noAccount'">
        <p>there are no Account</p>
      </div>
      <div v-else-if="tokenGate == 'invalidNetwork'">
        <p>invalid network: we neeed to connect {{ networkName }}</p>
        <button @click="switchToValidNetwork" class="underline">
          Switch Network
        </button>
      </div>
      <div v-else>
        <b>Current Token count:</b> {{ currentToken }}
        <div v-if="justMinted">
          <p>Thank you for minting. Please wait a little bit...</p>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div v-for="(nphoto, key) in nftPhotos" :key="key">
        <a
          :href="
            'https://opensea.io/assets/ethereum/0xd4Ea3587D9eA7a24BE1cE222E7E917e589AB8984/' +
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { ChainIds, switchNetwork } from "../utils/MetaMask";
import { NftPhoto, NftRequestPhoto } from "@/models/photo";
import { db } from "@/utils/firebase";
import {
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { photoNFTSync } from "@/utils/functions";
import { shortID } from "@/utils/utils";
import { ContentsContract } from "@/config/project";
import { ContentsAttribute } from "@/models/SmartContract";

export default defineComponent({
  components: {},
  setup() {
    const isRequestView = ref(false);

    // Following three lines must be changed for other networks
    const expectedNetwork = ChainIds.RinkebyTestNet;
    const networkName = "Rinkeby Testnet";
    const birthDateRef = ref();
    const store = useStore();
    const tokenBalance = ref(0);
    const justMinted = ref(false);
    const limit = ref(0);
    const currentToken = ref(0);
    const imageURL = ref("");
    const tokenId = ref(0);
    const images = ref([] as Array<string>);

    const nftRequestPhotos = ref([] as Array<NftRequestPhoto>);
    const nftPhotos = ref([] as Array<NftPhoto>);

    let prevProvider: ethers.providers.Web3Provider | null = null;
    const networkContext = computed(() => {
      if (prevProvider) {
        console.log("Calling removeAllListners()");
        prevProvider.removeAllListeners();
        prevProvider = null;
      }

      if (
        store.state.account &&
        parseInt(store.state.chainId) == parseInt(expectedNetwork)
      ) {
        const provider = new ethers.providers.Web3Provider(
          store.state.ethereum
        );
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
      const photos = await getDocs(collection(db, `nft_request_photos/`));
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const nreqphoto: NftRequestPhoto = doc.data();
        nftRequestPhotos.value.push(nreqphoto);
      });
    });

    const fetchContentsTokens = async () => {
      if (!networkContext.value) return;
      const providerViewOnly = new ethers.providers.AlchemyProvider(
        ContentsContract.network
      );
      const contractViewOnly = new ethers.Contract(
        ContentsContract.address,
        ContentsContract.wabi.abi,
        providerViewOnly
      );

      let result = await contractViewOnly.functions.totalSupply();
      limit.value = result[0].toNumber();
      console.log("limit is ",limit.value);
      const log = await photoNFTSync();
      console.log(log);

      const photos = await getDocs(collection(db, `nft_photos/`));
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const nphoto: NftPhoto = doc.data();
        if (!nphoto.nounsmapCreated) {
          console.log("not nounsmap created", doc.id);
          return;
        }
        nftPhotos.value.push(nphoto);
      });
    };
    const mint = async (_from: string, _photoId: string) => {
      if (!networkContext.value) return;
      console.log(_from, _photoId);
      const photo = await getDoc(doc(db, `nft_request_photos/${_photoId}`));
      if (!photo.exists) {
        console.error("invalid photoId", _photoId);
        return;
      }
      const pdata: NftRequestPhoto = photo.data() as NftRequestPhoto;
      console.log(pdata);
      const asset: ContentsAttribute = {
        group: "photo",
        category: "news",
        tag: "",
        width: 512,
        height: 512,
        minter: "",
        metadata: new Uint8Array(),
        name: pdata.title,
        description: pdata.description,
        soulbound: account.value,
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
    const tokenGate = computed(() => {
      if (!store.state.account) {
        return "noAccount";
      }
      if (parseInt(store.state.chainId) != parseInt(expectedNetwork)) {
        return "invalidNetwork";
      }
      fetchContentsTokens();
      return "valid";
    });
    const switchToValidNetwork = async () => {
      console.log(expectedNetwork);
      await switchNetwork(expectedNetwork);
    };
    const account = computed(() => {
      if (store.state.account) {
        return store.state.account.toLowerCase();
      }
      return null;
    });
    const nftRequestPhoto = computed({
      get: () => store.state.nftRequestPhoto,
      set: (val) => store.commit("setClickedPhoto", val),
    });

    return {
      isRequestView,
      nftRequestPhoto,
      nftRequestPhotos,
      nftPhotos,
      birthDateRef,
      account,
      networkName,
      mint,
      justMinted,
      limit,
      currentToken,
      tokenGate,
      tokenBalance,
      imageURL,
      images,
      tokenId,
      switchToValidNetwork,
      shortID,
    };
  },
});
</script>
