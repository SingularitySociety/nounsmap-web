import { createStore } from "vuex";
import { User } from "firebase/auth";
import { NFT } from "@/components/Wallet.vue";

interface State {
  user: User | null | undefined;
  userType: string | undefined;
  networkName: string | null;
  chainId: string | null;
  account: undefined | null | string;
  nft: NFT | null;
}

export default createStore<State>({
  state: {
    user: undefined,
    userType: undefined,
    networkName: null,
    chainId: null,
    account: undefined,
    nft: null,
  },
  mutations: {
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
    isSignedIn: (state: State) => {
      return state.user !== null && state.user !== undefined;
    },
    NFT: (state) => {
      return state.nft;
    },
  },
  actions: {},
  modules: {},
});
