import { createStore } from "vuex";
import { User } from "firebase/auth";
import { startMonitoringMetamask } from "@/utils/MetaMask";
import { NFT } from "@/components/Wallet.vue";

interface State {
  ethereum: any | null;
  user: User | null | undefined;
  userType: string | undefined;
  networkName: string | null;
  chainId: string | null;
  account: undefined | null | string;
  nft: NFT | null;
}

export default createStore<State>({
  state: {
    ethereum: null,
    user: undefined,
    userType: undefined,
    networkName: null,
    chainId: null,
    account: undefined,
    nft: null,
  },
  mutations: {
    setEthereum(state: State, ethereum: any | null) {
      state.ethereum = ethereum;
      if (state.ethereum) {
        startMonitoringMetamask();
      }
    },
    setUser(state: State, user: User | null) {
      state.user = user;
    },
    setUserType(state: State, userType: string | undefined) {
      state.userType = userType;
    },
    setChainId(state: State, chainId: string | null) {
      state.chainId = chainId;
    },
    setNetworkName(state: State, networkName: string | null) {
      state.networkName = networkName;
    },
    setAccount(state: State, account) {
      state.account = account;
    },
    setNft(state: State, nft: NFT | null) {
      state.nft = nft;
    },
  },
  getters: {
    hasMetaMask: (state: State) => {
      return state.ethereum && state.ethereum.isMetaMask;
    },
    isSignedIn: (state: State) => {
      return state.user !== null && state.user !== undefined;
    },
    NFT: (state) => {
      return state.nft;
    },
    displayAccount: (state: State) => {
      const account = state.account;
      if (!account) {
        return "";
      }
      return account.substring(0, 6) + "..." + account.substring(38);
    },
  },
  actions: {},
  modules: {},
});
