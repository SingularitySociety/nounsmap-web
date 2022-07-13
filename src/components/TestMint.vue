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
  <div class="flex flex-col items-center mx-auto px-2 py-4">
    NFT Request test
    <canvas ref="resized" width="600" height="600" v-if="false" />
    <span class="sr-only">{{ $t("message.selectImage") }}</span>
    <button
      ref="imageRef"
      class="h-40 object-cover hover:bg-gray-100 font-semibold py-2 px-4 border border-gray-400  rounded-md"
      @click="testNftPost"
      alt="selected photo"
    >
    testNft
    </button>
  </div>

  <div v-if="nftRequestPhotos" class="mt-4">
    NFT Request photos!

    <div v-for="(photo,key) in nftRequestPhotos" :key="key" >
      <p>.</p>
        <img :src="photo.photoURL" class="mt-4 w-48 rounded-xl" />
        request from {{photo.owner}}: <BR/>
        Do you want to support mint it?
            <p>
            <button
              @click="mint(photo.owner,photo.photoId)"
              class="inline-block px-6 py-2.5 bg-green-600 text-white leading-tight rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-800 active:shadow-lg transition duration-150 ease-in-out"
            >
              MINT
            </button>
            (free, but you need to pay a gas fee).
          </p>   

    </div>
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
import { NftPhoto, PhotoPubData } from "@/models/photo";
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
import {photoNFTPosted} from "@/utils/functions"

const ContentsToken = {
  wabi: require("@/abi/ContentsToken.json"), // wrapped abi
  address: "0xFd0A8de60f4Fbe523c0B748BE1E59aD69946A481",
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

    const nftRequestPhotos = ref([] as Array<PhotoPubData>)
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

      const photos = await getDocs(
        collection(db, `nft_request_photos/`)
      );
      await photos.forEach((doc: DocumentData) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        const nreqphoto : PhotoPubData = doc.data();
        nftRequestPhotos.value.push(nreqphoto);
      });      

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
        const photoId = await contractViewOnly.functions.getContents(i);
        console.log(photoId);
        const attribute = await contractViewOnly.functions.getAttributes(i);
        console.log(attribute)
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
    const mint = async (_from:string, _photoId:string) => {
      if (!networkContext.value) return;

      const assetBase:any = {
        group: "photo",
        category: "news",
        tag: "",
        width: 512, height: 512,
        minter: ""
      };
      const asset = Object.assign({}, assetBase);
      asset.name = "testContents";
      asset.metadata = new Uint8Array();
      asset.description = "this is test contents";
      asset.soulbound = account.value;
      const authorityToken = "0x1602155eB091F863e7e776a83e1c330c828ede19"; //nouns love
      await networkContext.value.contract.functions.mint(_from,authorityToken,_photoId,asset);
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
    const testNftPost = async () => {
      const ret = await photoNFTPosted({photoId:"YQqU9TERDEOpuvcWd37P"});
      console.log(ret);
    }

    return {
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
      testNftPost,
    };
  },
});
</script>
