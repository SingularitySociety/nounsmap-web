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
                {{ $t("message.selectContract") }}:
                <select v-model="ownedContract">
                  <option
                    v-for="contract in validTokenContracts"
                    :value="contract.name"
                    :key="contract.name"
                  >
                    {{ contract.name }} : {{ contract.chainId }}
                  </option>
                </select>
                <br />
                Account: {{ account }} <br />
                chainID({{ nChainId }})
                <br />
              </p>
            </div>
            <div v-if="isDebugTest">
              <div class="flex flex-row justify-center items-center m-4">
                <input
                  type="text"
                  ref="debugRef"
                  maxlength="128"
                  minlength="1"
                  class="shadow appearance-none border rounded w-auto py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
            <div v-if="tokens && tokens.length > 0">
              {{ $t("message.selectToken") }}:
              <select v-model="ownedTokenId">
                <option
                  v-for="token in tokens"
                  :value="token.tokenID"
                  :key="token.tokenID"
                >
                  {{ token.displayID }} : {{ token.tokenName }}
                </option>
              </select>
              <div v-if="nftstore" class="sm:flex">
                <div
                  class="h-auto w-32 flex-none rounded-t-none justify-center overflow-hidden"
                  title="token"
                >
                  <div class="relative w-full">
                    <a
                      :href="`${contract.openseaUrl}/${contract.contractAddress}/${ownedTokenId}`"
                      target="_blank"
                    >
                      <img :src="nftstore.token.image" class="w-full" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div v-if="contract">
                {{
                  $t("message.youDonthaveToken", {
                    tokenName: contract.name,
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
//import nounsTokenJson from "@/abi/NounsToken";
import { nounsMapConfig, ethereumConfig } from "@/config/project";
import { auth } from "@/utils/firebase";
import { signInWithCustomToken } from "firebase/auth";
import { generateNonce, verifyNonce, deleteNonce } from "../utils/functions";
import { shortID } from "@/utils/utils";
import { UserData } from "@/components/NounsUser.vue";
import { requestAccount, switchNetwork, ChainIds } from "@/utils/MetaMask";
import { Token, NFT, AlchemyOwnedTokens } from "@/models/SmartContract";
import axios, { AxiosRequestConfig } from "axios";

export default defineComponent({
  components: {},
  props: {
    user: Object as PropType<UserData>,
  },
  emits: {
    updated: (param: NFT) => {
      if (
        param.name &&
        param.contractAddress &&
        param.token &&
        param.token.image
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  setup(props, context) {
    const store = useStore();
    const account = computed(() => store.state.account);
    const contract = computed(() => store.state.tokenContract);
    const nChainId = computed(() => store.state.chainId);
    const isSignedIn = computed(() => store.getters.isSignedIn);
    const hasMetaMask = computed(() => store.getters.hasMetaMask);
    const nft = ref<NFT>();
    const nftstore = computed(() => store.state.nft);
    const validTokenContracts = ethereumConfig.validTokenContracts;
    const ownedContract = ref();
    const ownedTokenId = ref();
    const tokens = ref<Array<Token>>([]);
    const isBusy = ref("");
    const isContentShown = ref(false);
    const debugRef = ref();
    const isDebugTest = ref(true);
    const open = () => (isContentShown.value = true);
    onMounted(async () => {
      if (store.getters.hasMetaMask) {
        //for already connected user , re-conect,
        console.log(props);
        if (props.user?.userType == "wallet") {
          if (account.value) {
            if (contract.value) {
              ownedContract.value = contract.value.name;
            } else {
              store.commit(
                "setTokenContract",
                ethereumConfig.validTokenContracts[0]
              );
            }
            await fetchNFT();
          } else {
            await connect();
          }
        }
      }
    });
    const fetchNFT = async () => {
      const provider = new ethers.providers.Web3Provider(store.state.ethereum);
      const { name, chainId } = await provider.getNetwork();
      console.info({ name }, { chainId });
      store.commit("setChainId", chainId);
      console.log(contract.value, ChainIds);
      const base = ((chainId) => {
        switch (parseInt(chainId)) {
          case parseInt(ChainIds.Mainnet):
            return "https://eth-mainnet.alchemyapi.io/v2/";
          case parseInt(ChainIds.RinkebyTestNet):
            return "https://eth-rinkeby.alchemyapi.io/v2/";
          case parseInt(ChainIds.Polygon):
            return "https://polygon-mainnet.g.alchemy.com/v2/";
          default:
            return "invalid";
        }
      })(contract.value.chainId);
      const _account = isDebugTest.value ? debugRef.value.value : account.value;
      const request = {
        method: "get",
        url: `${base}${nounsMapConfig.alchemy}/getNFTs/?owner=${_account}`,
      };
      try {
        const response = await axios(request);
        console.log(response);
        const target = response.data.ownedNfts.filter(
          (nft: AlchemyOwnedTokens) => {
            console.log(nft.metadata.external_link);
            if (
              Number(nft.contract.address) ==
              Number(contract.value.contractAddress)
            ) {
              if (contract.value.filter) {
                const base = ethers.BigNumber.from(contract.value.filter);
                const target = ethers.BigNumber.from(nft.id.tokenId);
                //opensea polygon ERC1155 uses 12 byte mask
                const shift = contract.value.idmask * 8; //8bit
                console.log(
                  base,
                  target,
                  base.shr(shift),
                  target.shr(shift),
                  shift
                );
                return base.shr(shift).eq(target.shr(shift));
              } else {
                return true;
              }
            }
            return false;
          }
        );
        tokens.value = target.map((nft: AlchemyOwnedTokens) => {
          const _image = nft.metadata.image.startsWith("ipfs")
            ? nft.media[0].gateway
            : nft.metadata.image;
          const _type = nft.media[0].format
            ? nft.media[0].format
            : nft.metadata.image.endsWith("svg") ||
              nft.metadata.image.startsWith("data:image/svg")
            ? "svg+xml"
            : undefined;
          return {
            tokenID: nft.id.tokenId,
            displayID: shortID(nft.id.tokenId),
            tokenName: nft.title,
            image: _image,
            imageType: _type,
          };
        });
      } catch (error) {
        console.log(error);
      }
      console.log(tokens.value);
      if (nftstore?.value?.token?.tokenID) {
        const selected = tokens.value.filter(
          (token) => token.tokenID == nftstore?.value?.token?.tokenID
        );
        ownedTokenId.value = selected[0]
          ? parseInt(selected[0].tokenID)
          : tokens.value[0]
          ? parseInt(tokens.value[0].tokenID)
          : undefined;
      } else if (tokens.value[0]) {
        ownedTokenId.value = parseInt(tokens.value[0].tokenID);
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
        const token = tokens.value.filter(
          (x: Token) => x.tokenID == tokenId
        )[0];
        if (token) {
          if (token.image.indexOf("http") == 0) {
            const config = { responseType: "arraybuffer" };
            const ret = await axios.get(
              token.image,
              config as AxiosRequestConfig
            );
            console.log(token.imageType);
            //const data = Buffer.from(ret.data , "base64").toString("ascii");
            const data = Buffer.from(ret.data).toString("base64");
            token.image = `data:image/${token.imageType};base64,` + data;
            token.buff = Buffer.from(ret.data);
          }
          nft.value = {
            name: contract.value.name,
            description: "",
            contractAddress: contract.value.contractAddress,
            token: token,
          };
        } else {
          nft.value = undefined;
        }
      } catch (e) {
        //nft.value = "broken";
        console.error(e);
      }
    };
    watch(ownedTokenId, async () => {
      console.log("ownedTokenId:", ownedTokenId.value);
      await updateNftData(ownedTokenId.value);
      if (nft.value && nft.value.token.image) {
        context.emit("updated", nft.value as NFT);
        store.commit("setNft", nft.value);
      }
    });
    watch(ownedContract, () => {
      const contract = validTokenContracts.filter(
        (a) => a.name == ownedContract.value
      );
      console.log(contract[0]);
      store.commit("setTokenContract", contract[0]);
      switchNetwork(contract[0].chainId);
    });
    watch(nChainId, () => {
      console.log(nChainId);
      fetchNFT();
    });

    return {
      hasMetaMask,
      validTokenContracts,
      contract,
      ownedContract,
      account,
      nftstore,
      nChainId,
      tokens,
      ownedTokenId,
      isContentShown,
      isBusy,
      isSignedIn,
      debugRef,
      isDebugTest,
      open,
      connect,
      signIn,
      signOut,
      fetchNFT,
    };
  },
});
</script>
