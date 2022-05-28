<template>
  <div v-if="!hasMetaMask">Please install MetaMask.</div>
  <div v-else class="ml-0">
    <div v-if="accounts[0] && network">
      <div class="max-w-sm w-full lg:max-w-full lg:flex">
        <div
          class="border-r border-b border-l border-gray-400 border-t bg-white rounded-b lg:rounded-r p-8 my-4 mx-4 justify-between leading-normal"
        >
          <div class="mb-8">
            <p class="text-gray-700 text-base">
              {{ $t("message.youNeedNet", { networkName }) }}<br />
              Account: {{ accounts[0] }} <br />
              Network: {{ network.name }} chainID({{ network.chainId }}) <br />
            </p>
          </div>
          <div v-if="tokens">
            Please select your Token:
            <select v-model="ownedTokenId">
              <option
                v-for="token in tokens"
                :value="token.tokenID"
                :key="token.hash"
              >
                {{ token.tokenID }} : {{ token.tokenName }}
              </option>
            </select>
            <div v-if="nft" class="sm:flex">
              <div
                class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
                style="background-image: {{nft.image}}"
                title="token"
              >
                <div class="relative sm:w-1/2 w-full">
                  <a
                    :href="`${openseaUrl}/assets/${contractAddress}/${ownedTokenId}`"
                    target="_blank"
                  >
                    <img :src="nft.image" class="w-full" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="ml-0">
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        @click="requestAccount"
      >
        {{ $t("message.requestAccount") }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { ethers } from "ethers";
import nounsTokenJson from "@/abi/NounsToken";
import { ethereumConfig } from "@/config/project";

interface NFT {
  name: string;
  description: string;
  image: string;
}
interface NFTData {
  data: NFT;
  price: number;
  owner: string;
  bgColor: string;
  token?: object;
}
export default defineComponent({
  props: {
    user: Object,
  },
  setup(_, context) {
    const { contractAddress, openseaUrl, networkName } = ethereumConfig;
    const nft = ref<NFTData>();
    const accounts = ref<string[]>([]);
    const ownedTokenId = ref();
    const network = ref();
    const tokens = ref();

    const hasMetaMask = !!(window as Window).ethereum;
    if (!hasMetaMask) {
      return { hasMetaMask: false, fireOn: false };
    }

    const ethereum = (window as Window).ethereum;
    ethereum.on("accountsChanged", (accounts: Array<string>) => {
      console.log(accounts);
    });
    ethereum.on("chainChanged", (chainId: string) => {
      console.log(chainId);
    });

    const provider = new ethers.providers.Web3Provider(
      (window as Window).ethereum
    );
    const contract = new ethers.Contract(
      contractAddress,
      nounsTokenJson.abi,
      provider
    );
    const ethScan = new ethers.providers.EtherscanProvider("rinkeby");
    const tmpKey = "WPHTZ9QQ5WXJRNCWNXC2B3AMPD6AWCWTXB";

    const requestAccount = async () => {
      await provider.send("eth_requestAccounts", []);
      accounts.value = await provider.listAccounts();
      console.debug(accounts.value);
      const signer = provider.getSigner();
      console.debug(signer);
      network.value = await provider.getNetwork();
      console.debug(network.value);
      tokens.value = await ethScan.fetch("account", {
        action: "tokennfttx",
        contractaddress: contractAddress,
        address: accounts.value[0],
        apikey: tmpKey,
      });
      console.log(tokens.value);
    };
    const updateNftData = async (tokenId: string) => {
      try {
        const dataURI = await contract.functions.dataURI(tokenId);
        const data = JSON.parse(
          Buffer.from(dataURI[0].substring(29), "base64").toString("ascii")
        );
        nft.value = data;
        if (nft.value) {
          nft.value.token = tokens.value.filter(
            // eslint-disable-next-line
            (x: any) => x.tokenID == tokenId
          )[0];
        }
      } catch (e) {
        //nft.value = "broken";
        console.error(e);
      }
    };
    const getNftData = () => {
      return nft.value;
    };

    watch(ownedTokenId, async () => {
      await updateNftData(ownedTokenId.value);
      context.emit("updated", ownedTokenId.value);
    });
    return {
      hasMetaMask,
      contractAddress,
      openseaUrl,
      networkName,
      accounts,
      nft,
      provider,
      network,
      tokens,
      ownedTokenId,
      requestAccount,
      getNftData,
    };
  },
});
</script>
