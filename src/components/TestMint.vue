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
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useStore } from "vuex";
import { ethers } from "ethers";
import { ChainIds, switchNetwork } from "../utils/MetaMask";

const HappyToken = {
  wabi: require("@/abi/HappyToken.json"), // wrapped abi
  address: "0x4F700D279b7046BE3B31DcFD9D94166bF4E6FBb1",
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
      HappyToken.address,
      HappyToken.wabi.abi,
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
          HappyToken.address,
          HappyToken.wabi.abi,
          signer
        );
        const mintFilter = contract.filters.NounBought();
        provider.on(mintFilter, (log, event) => {
          console.log("**** got mint event", log, event);
          justMinted.value = false;
          fetchBalance();
        });
        prevProvider = provider;
        if (window.location.href == "http://localhost:8080/") {
          fetchImages(contract);
        }

        return { provider, signer, contract };
      }
      return null;
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
    // eslint-disable-next-line
    const fetchLimit = async (contract: any) => {
      let result = await contract.functions.limit();
      limit.value = result[0].toNumber();
      result = await contract.functions.getCurrentToken();
      currentToken.value = result[0].toNumber();
      console.log("**fetchLimit", limit.value, currentToken.value);
    };
    fetchLimit(contractViewOnly);

    const fetchBalance = async () => {
      if (!networkContext.value) return;
      let contract = networkContext.value.contract;
      let result = await contract.functions.balanceOf(store.state.account);
      //console.log("**** count", count[0].toNumber());
      tokenBalance.value = result[0].toNumber();

      if (tokenBalance.value > 0) {
        result = await contract.functions.tokenOfOwnerByIndex(account.value, 0);
        tokenId.value = result[0].toNumber();
        result = await contract.functions.generateSVG(tokenId.value);
        imageURL.value =
          "data:image/svg+xml;base64," +
          Buffer.from(result[0]).toString("base64");
      }

      await fetchLimit(contract);
    };

    const mint = async () => {
      if (!networkContext.value) return;
      if (!birthDateRef.value.value) {
        console.error("invalid birthDate");
        return;
      }
      const birth = birthDateRef.value.valueAsDate;
      console.log(birth.getFullYear(), birth.getMonth() + 1, birth.getDate());
      const id =
        ((birth.getFullYear() / 100) << (8 * 3)) +
        (birth.getFullYear() % 100 << (8 * 2)) +
        ((birth.getMonth() + 1) << (8 * 1)) +
        birth.getDate();
      console.log(id, id.toString(16));
      await networkContext.value.contract.functions.customMint(id);
      justMinted.value = true;
    };
    const tokenGate = computed(() => {
      if (!store.state.account) {
        return "noAccount";
      }
      if (parseInt(store.state.chainId) != parseInt(expectedNetwork)) {
        return "invalidNetwork";
      }
      fetchBalance();
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
    return {
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
