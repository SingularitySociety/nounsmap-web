<template>
  <div v-if="!hasMetaMask">{{ $t("message.youNeedMeta") }}</div>
  <div v-else class="ml-0">
    <div v-if="user?.userType == 'wallet' && account">
      <div
        class="max-w-xs max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl border-r border-b border-l border-gray-400 border-t bg-white rounded-b lg:rounded-r p-8 my-4 mx-4"
      >
        <div class="bg-white">
          <div class="">
            <div class="mb-8">
              <p class="text-gray-700 overflow-hidden text-base">
                {{ $t("message.youNeedNet", { networkName }) }}<br />
                Account: {{ account }} <br />
                Network: {{ nName }} chainID({{ nChainId }})
                <br />
              </p>
            </div>
            <div v-if="tokens && tokens.length > 0">
              {{ $t("message.selectToken") }}:
              <select v-model="ownedTokenId">
                <option
                  v-for="token in tokens"
                  :value="token.tokenID"
                  :key="token.hash"
                >
                  {{ token.tokenID }} : {{ token.tokenName }}
                </option>
              </select>
              <div v-if="nftstore" class="sm:flex">
                <div
                  class="h-auto w-32 flex-none rounded-t-none justify-center overflow-hidden"
                  title="token"
                >
                  <div class="relative w-full">
                    <a
                      :href="`${openseaUrl}/assets/${contractAddress}/${ownedTokenId}`"
                      target="_blank"
                    >
                      <img :src="nftstore.image" class="w-full" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="contractInfo">
                {{
                  $t("message.youDonthaveToken", {
                    tokenSymbol: contractInfo[0].tokenSymbol,
                    tokenName: contractInfo[0].tokenName,
                  })
                }}<br />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="inline-block bg-gray-200 hover:bg-white rounded-full text-sm font-semibold text-gray-700 px-3 py-1"
            @click="fetchNFT"
          >
            {{ $t("function.fetchNFT") }}
          </button>
        </div>
      </div>
    </div>
    <div class="ml-0">
      <span v-if="user && user.userType == 'wallet'">
        <button
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          @click="signOut"
        >
          {{ $t("function.signout") }}
        </button>
      </span>
      <span v-else-if="account">
        <button
          type="button"
          v-if="isBusy"
          class="inline-block px-6 py-2.5 text-gray-500 leading-tight rounded shadow-md"
          disabled
        >
          <img
            class="animate-spin h-3 w-8 absolute"
            src="@/assets/red160px.png"
          />
          <span class="ml-10">{{ $t("message.processing") }}</span>
        </button>
        <button
          v-else
          @click="signIn"
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          {{ $t("function.signinWallet") }}
        </button>
      </span>
      <span v-else>
        <button
          type="button"
          v-if="isBusy"
          class="inline-block px-6 py-2.5 text-gray-500 leading-tight rounded shadow-md"
          disabled
        >
          <img
            class="animate-spin h-3 w-8 absolute"
            src="@/assets/red160px.png"
          />
          <span class="ml-10">{{ $t("message.processing") }}</span>
        </button>
        <button
          v-else
          @click="connect"
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        >
          {{ $t("function.requestAccount") }}
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  computed,
  PropType,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import nounsTokenJson from "@/abi/NounsToken";
import { ethereumConfig } from "@/config/project";
import { auth } from "@/utils/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { generateNonce, verifyNonce, deleteNonce } from "../utils/functions";
import { UserData } from "@/components/NounsUser.vue";
import { requestAccount } from "@/utils/MetaMask";

interface Token {
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  hash: string;
}

export interface NFT {
  name: string;
  description: string;
  image: string;
  token: Token;
}

export default defineComponent({
  components: {},
  props: {
    user: Object as PropType<UserData>,
  },
  emits: {
    updated: (param: NFT) => {
      if (param.image && param.token) {
        return true;
      } else {
        return false;
      }
    },
  },
  setup(props, context) {
    const { contractAddress, openseaUrl, networkName } = ethereumConfig;
    const store = useStore();
    const account = computed(() => store.state.account);
    const nName = computed(() => store.state.networkName);
    const nChainId = computed(() => store.state.chainId);
    const isSignedIn = computed(() => store.getters.isSignedIn);
    const hasMetaMask = computed(() => store.getters.hasMetaMask);
    const nft = ref<NFT>();
    const nftstore = computed(() => store.state.nft);
    const ownedTokenId = ref();
    const contractInfo = ref();
    const tokens = ref<Array<Token>>([]);
    const isBusy = ref("");
    const isContentShown = ref(false);
    const open = () => (isContentShown.value = true);
    onMounted(async () => {
      if (store.getters.hasMetaMask) {
        //for already connected user , re-conect,
        if (props.user?.userType == "wallet" && !account.value) {
          await connect();
        }
        await fetchNFT();
      }
    });
    const fetchNFT = async () => {
      const provider = new ethers.providers.Web3Provider(store.state.ethereum);
      const ethScan = new ethers.providers.EtherscanProvider("rinkeby");
      const tmpKey = "WPHTZ9QQ5WXJRNCWNXC2B3AMPD6AWCWTXB";

      const { name, chainId } = await provider.getNetwork();
      console.debug({ name }, { chainId });
      store.commit("setNetworkName", name);
      store.commit("setChainId", chainId);
      contractInfo.value = await ethScan.fetch("account", {
        action: "tokennfttx",
        contractaddress: contractAddress,
        address: contractAddress,
        apikey: tmpKey,
      });
      console.log(contractInfo.value);
      if (account.value) {
        tokens.value = await ethScan.fetch("account", {
          action: "tokennfttx",
          contractaddress: contractAddress,
          address: account.value,
          apikey: tmpKey,
        });
        console.log(tokens.value);
        if (nftstore?.value?.token?.tokenID) {
          ownedTokenId.value = nftstore?.value?.token?.tokenID;
        } else if (tokens.value[0]) {
          ownedTokenId.value = tokens.value[0].tokenID;
        }
      }
    };
    const connect = async () => {
      isBusy.value = "Connecting Metamask...";
      try {
        await requestAccount(); // ethereum.on('accountsChanged') in App.vue will handle the result
      } catch (e) {
        console.log(e);
      }
      isBusy.value = "";
      console.log("*****", store.state.account);
      // signIn();
    };
    const signIn = async () => {
      // Step 1: We get a nonce from the server
      isBusy.value = "Fetching a verification message from server...";
      const account = store.state.account;
      const result = (await generateNonce({ account })) as {
        data: { nonce: string; uuid: string };
      };
      const nonce = result.data.nonce;
      const uuid = result.data.uuid;

      console.log("signIn: uuid/nonce", uuid, nonce);

      try {
        // Step 2: We ask the user to sign this nonce
        isBusy.value = "Waiting for you to sign a message...";
        const signature = await store.state.ethereum.request({
          method: "personal_sign",
          params: [nonce, account],
        });

        // Step 3: We ask the server to verify the signature and get custom token
        const result2 = (await verifyNonce({ signature, uuid })) as {
          data: { account: string; token: string };
        };
        console.log(result2.data);
        const token = result2.data.token;
        console.log("signIn: token", token);
        if (token) {
          await signInWithCustomToken(auth, token);
          await fetchNFT();
        } else {
          alert("Failed to verifyIdenty");
        }
      } catch (e) {
        console.error(e);
        isBusy.value = "Canceling the verification...";
        try {
          await deleteNonce({ account, uuid });
        } catch (e) {
          console.error(e);
        }
      }
      isBusy.value = "";
    };
    const signOut = async () => {
      await auth.signOut();
      store.commit("setNft", null);
    };
    const updateNftData = async (tokenId: string) => {
      try {
        const provider = new ethers.providers.Web3Provider(
          store.state.ethereum
        );
        const contract = new ethers.Contract(
          contractAddress,
          nounsTokenJson.abi,
          provider
        );
        const dataURI = await contract.functions.dataURI(tokenId);
        const data = JSON.parse(
          Buffer.from(dataURI[0].substring(29), "base64").toString("ascii")
        );
        nft.value = data;
        if (nft.value) {
          nft.value.token = tokens.value.filter(
            (x: Token) => x.tokenID == tokenId
          )[0];
        }
      } catch (e) {
        //nft.value = "broken";
        console.error(e);
      }
    };
    watch(ownedTokenId, async () => {
      console.log("ownedTokenId:", ownedTokenId.value);
      await updateNftData(ownedTokenId.value);
      if (nft.value && nft.value.image) {
        context.emit("updated", nft.value as NFT);
        store.commit("setNft", nft.value);
      }
    });
    return {
      hasMetaMask,
      contractAddress,
      contractInfo,
      openseaUrl,
      networkName,
      account,
      nftstore,
      nName,
      nChainId,
      tokens,
      ownedTokenId,
      isContentShown,
      isBusy,
      isSignedIn,
      open,
      connect,
      signIn,
      signOut,
      fetchNFT,
    };
  },
});
</script>
