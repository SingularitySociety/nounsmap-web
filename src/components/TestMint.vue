<template>
  <div class="max-w-xl mx-auto text-left p-2">
    <div class="mt-4 mb-8">
      <p class="mb-4">This Page is for testing use only.</p>
      <p class="mb-4">
        This work was inspired by
        <a href="https://opensea.io/collection/nouns" class="underline"
          >Nouns</a
        >
      </p>
      >
    </div>
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
      <div><b>Token Limit Count:</b> {{ $n(limit) }}</div>
      <div v-if="currentToken < limit">
        <b>Current Token count:</b> {{ currentToken }}
      </div>
      <div v-else>Sold Out!</div>
      <div v-if="tokenBalance == 0" class="mt-4">
        <div v-if="justMinted">
          <p>Thank you for minting. Please wait a little bit...</p>
        </div>
        <div v-else>
          <div v-if="currentToken < limit">
            Please select your Birth day, and create your special happy token!
            <input
              type="date"
              ref="birthDateRef"
              value="1990-01-1"
              min="1970-01-01"
              max="2022-12-31"
            />
            <p>
              <button
                @click="mint"
                class="inline-block px-6 py-2.5 bg-green-600 text-white leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                MINT
              </button>
              (free, but you need to pay a gas fee).
            </p>
          </div>
          <div v-else>
            Thank you for the interest, but it is sold out unfortunately.
          </div>
        </div>
      </div>
      <div v-else class="mt-4">
        <div>
          <p>Thank you for being a member of Happy Token community.</p>
          <a
            :href="
              'https://opensea.io/assets/ethereum/0x433697232e3b55ec39050cb7a5678a3b1347eec4/' +
              tokenId
            "
          >
            <img :src="imageURL" class="mt-4 w-48 rounded-xl" />
          </a>
        </div>
      </div>
      <div class="mt-4">
        <img
          v-for="image in images"
          :src="image"
          class="w-24 inline-block mr-1 mt-1 rounded"
          v-bind:key="image"
        />
      </div>
    </div>
  </div>
  <div v-if="nftRequestPhoto">
    Request from Ryuji(0x3e3....fa) photoID:0xFdfsadfasdf
    Do you want to support mint it?
    Gas estimation (XXXXX)
    <img :src="nftRequestPhoto.photoURL" class="mt-4 w-48 rounded-xl" />
    <p>
      <button
        @click="mint"
        class="inline-block px-6 py-2.5 bg-green-600 text-white leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
      >
        MINT
      </button>
      (free, but you need to pay a gas fee).
    </p>   
  </div>
  <div v-if="nftPhotos" class="mt-4">
    NFT photos!

    <div v-for="(nphoto,key) in nftPhotos" :key="key" >
      <p>.</p>
      <a
        :href="
          'https://opensea.io/assets/ethereum/0xd4Ea3587D9eA7a24BE1cE222E7E917e589AB8984/' +
          nphoto.tokenId
        "
      >
        <img :src="nphoto.photoURL" class="mt-4 w-48 rounded-xl" />
        {{nphoto.tokenURI.name}}: <BR/>
        {{nphoto.tokenURI.description}}
      </a>
    </div>
  </div>    
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { ChainIds, switchNetwork } from "../utils/MetaMask";
import { NftPhoto } from "@/models/photo";
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
import { NFT } from "@/models/SmartContract";

const HappyToken = {
  wabi: require("@/abi/HappyToken.json"), // wrapped abi
  address: "0x4F700D279b7046BE3B31DcFD9D94166bF4E6FBb1",
};

const ContentsToken = {
  wabi: require("@/abi/ContentsToken.json"), // wrapped abi
  address: "0xd4Ea3587D9eA7a24BE1cE222E7E917e589AB8984",
};

export default defineComponent({
  components: {},
  setup() {
    // Following three lines must be changed for other networks
    const expectedNetwork = ChainIds.RinkebyTestNet;
    const networkName = "Rinkeby Testnet";
    const providerViewOnly = new ethers.providers.AlchemyProvider("rinkeby");
    const birthDateRef = ref();

    const contractViewOnly = new ethers.Contract(
      ContentsToken.address,
      ContentsToken.wabi.abi,
      providerViewOnly
    );
    const store = useStore();
    const tokenBalance = ref(0);
    const justMinted = ref(false);
    const limit = ref(0);
    const currentToken = ref(0);
    const imageURL = ref("");
    const tokenId = ref(0);
    const images = ref([] as Array<string>);

    const nftPhotos = ref([] as Array<NftPhoto>)

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
          ContentsToken.address,
          ContentsToken.wabi.abi,
          signer
        );
        const mintFilter = contract.filters.ContentsBought();
        provider.on(mintFilter, (log, event) => {
          console.log("**** got mint event", log, event);
          justMinted.value = false;
          fetchContentsTokens();
        });
        prevProvider = provider;
        if (window.location.href == "http://localhost:8080/") {
          fetchImages(contract);
        }

        return { provider, signer, contract };
      }
      return null;
    });

    const photoId = "PV0Bpa7Neyc2exi4tSAr";
    onMounted(async () => {

      const photoDoc = getDoc(doc(db, `photos/${photoId}`));
      photoDoc
        .then((doc) => {
          if (doc.exists()) {
            store.commit("setNftRequestPhoto", doc.data());
          }
        })
        .catch((reason) => {
          console.error(reason);
        });
    });
    // eslint-disable-next-line
    const fetchImages = async (contract: any) => {
      // debug only
      let i = 0;
      for (i = 0; i < 100; i++) {
        const result = await contract.functions.generateSVG(i);
        images.value[i] =
          "data:image/svg+xml;base64," +
          Buffer.from(result[0]).toString("base64");
      }
    };

    const fetchContentsTokens = async () => {
      if (!networkContext.value) return;
      let result = await contractViewOnly.functions.totalSupply();
      limit.value = result[0].toNumber();
      for(let i =0; i<limit.value; i++){
        const uri = (await contractViewOnly.functions.tokenURI(i))[0];
        const tokenURI = JSON.parse(Buffer.from(uri.substr('data:application/json;base64,'.length) , "base64").toString());
        //const photoId = await contractViewOnly.functions.contentsName(i);
        const owner = (await contractViewOnly.functions.ownerOf(i))[0];
        const photoDoc = await getDoc(doc(db, `photos/${photoId}`));
        if (photoDoc.exists()) {
          const { iconURL, photoURL, lat, lng, zoom } = photoDoc.data();
          setDoc(doc(db, `nft_photos/${photoId}`),{
              nounsmapCreated: true,
              photoId,
              tokenURI,
              tokenId:i,
              iconURL,
              photoURL,
              lat,
              lng,
              zoom,
              owner,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),              
          });
        } else {
          updateDoc(doc(db, `nft_photos/${photoId}`),{
              nounsmapCreated: false,
              photoId,
              tokenURI,
              tokenId:i,
              photoURL:tokenURI.image,
              owner,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),              
          });

        }
      }

      const photos = await getDocs(
        collection(db, `nft_photos/`)
      );
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const nphoto : NftPhoto = doc.data();
        if (!nphoto.nounsmapCreated) {
          console.log("not nounsmap created", doc.id);
          return;
        }
        nftPhotos.value.push(nphoto);
      });
    };
    const mint = async () => {
      if (!networkContext.value) return;
      const nounslove = "0x1602155eB091F863e7e776a83e1c330c828ede19";
      const test2 = "0xdFc6c245881eC5463A3C0c99221F324A8339d70d";
      const photoId = "6oHFJbRhdqBpCseSVNOk";
      await networkContext.value.contract.functions.mint(test2,nounslove,photoId,);
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
      nftRequestPhoto,
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
    };
  },
});
</script>
