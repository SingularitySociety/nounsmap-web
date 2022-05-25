<template>
  <div v-if="!hasMetaMask">
    Please install MetaMask.
  </div>
  <div v-else class="ml-0">  
  <button
    class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
    @click="requestAccount"
  >
    {{ $t("message.requestAccount") }}
  </button>
  </div>
       <div v-if="nfts[ownedTokenId]" class="sm:flex">
          
          <div class="relative sm:w-1/2 w-full" :class="bgColor">
            <a :href="`https://testnets.opensea.io/assets/${contractAddress}/${ownedTokenId}`" target="_blank">
              <img :src="nfts[ownedTokenId].data?.image" class="w-full" />
            </a>
          </div>
        </div>

</template>

<script lang="ts">
import { defineComponent,ref } from "vue";
import { ethers } from "ethers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nounsTokenJson = require("./NounsToken9331f10808.json");
// import firebaseApp from '@/src/main.js'
import {
  getAuth,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
} from "firebase/auth";

export default defineComponent({
  props: {
    user: Object,
  },
  setup() {
    //const contractAddress = "0x1c9fD50dF7a4f066884b58A05D91e4b55005876A"; // desc for actual nouns for local
    //const contractAddress = "0xbe41F43c0d2cCbfce561429F18d3473DFa17eBAd"; // desc for actual nouns // for rinkeby
    const contractAddress = "0xA409B4d308D6234b1E47b63ae1AEbE4fb5030D2a"; //  for rinkeby 0524 version
    
    
    const nfts = ref<{[key: string]: any}>({});
    const accounts = ref<string[]>([]);    
    const ownedTokenId = ref();

    const hasMetaMask = !!((window as any).ethereum);
    if (!hasMetaMask) {
      return { hasMetaMask: false, fireOn: false};
    }
    const ethereum = (window as any).ethereum;
    ethereum.on('accountsChanged', (accounts: any) => {
      console.log("AA");
    });
    ethereum.on('chainChanged', (chainId: string) => {
      console.log(chainId);
    });


    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    const contract = new ethers.Contract(contractAddress, nounsTokenJson.abi, provider);
    const ethScan = new ethers.providers.EtherscanProvider("rinkeby");

    const requestAccount = async () => {
      await provider.send("eth_requestAccounts", []);
      accounts.value = await provider.listAccounts();
      console.log(accounts.value)
      const signer = provider.getSigner()      
      console.log(signer);
      const network = await provider.getNetwork();
      console.log(network);
      const tokens = await ethScan.fetch("account",{action:"tokennfttx", contractaddress : contractAddress, address: accounts.value[0]});
      console.log(tokens);
    };
    const selectToken = async (tokenId: string) => {
      ownedTokenId.value = "23";
      await updateNftData(ownedTokenId.value);
      const history = await ethScan.getHistory(accounts.value[0]);
      console.log(history);

    };

    const updateNftData = async (tokenId: string) => {
      try {
        const dataURI = await contract.functions.dataURI(tokenId);
        const data = JSON.parse(
          Buffer.from(dataURI[0].substring(29), 'base64').toString('ascii'),
        );
        updateNFT(String(tokenId), "data", data);
      } catch(e) {
        updateNFT(String(tokenId), "data", {name: "broken"});
      }
    };
    const updateNFT = (index: string, key: string, nft: any) => {
      const newNfts = {...nfts.value}
      const newData = {...nfts.value[index]} || {};
      newData[key] = nft;
      newNfts[index] = newData;
      nfts.value = newNfts;
      console.log(nfts.value);
      
    };    


    const signout = () => {
      const auth = getAuth();
      signOut(auth)
        .then(() => {
          console.log("logout correctly");
        })
        .catch(() => {
          alert("Logout fail");
        });
    };
    return {
      hasMetaMask,
      contractAddress,      
      accounts,   
      nfts,   
      provider,
      ownedTokenId,
      requestAccount,
      signout,
    };
  },
});
</script>
