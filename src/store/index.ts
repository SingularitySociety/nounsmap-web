import { createStore } from "vuex";
import { User } from "firebase/auth";
import { startMonitoringMetamask } from "@/utils/MetaMask";
import { NFT, TokenContract } from "@/models/SmartContract";
import { PhotoPubData } from "@/models/photo";

export type UserPhotoState = "checking" | "empty" | "exist";

interface State {
  //eslint-disable-next-line  @typescript-eslint/no-explicit-any
  ethereum: any | null;
  user: User | null | undefined;
  userType: string | undefined;
  userPhotoState: UserPhotoState;
  networkName: string | null;
  chainId: string | null;
  tokenContract: TokenContract | null;
  account: undefined | null | string;
  nft: NFT | null;
  clickedPhoto: PhotoPubData | null;
}

export default createStore<State>({
  state: {
    ethereum: null,
    user: undefined,
    userType: undefined,
    userPhotoState: "checking",
    networkName: null,
    chainId: null,
    tokenContract: null,
    account: undefined,
    nft: null,
    clickedPhoto: null,
  },
  mutations: {
    load(state: State) {
      const contract = localStorage.getItem("tokenContract");
      if (contract) {
        state.tokenContract = JSON.parse(contract);
      }
      const nft = localStorage.getItem("nft");
      if (nft) {
        state.nft = JSON.parse(nft);
      }
    },
    //eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
    setUserPhotoState(state: State, userPhotoState: UserPhotoState) {
      state.userPhotoState = userPhotoState;
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
    setTokenContract(state: State, tokenContract) {
      state.tokenContract = tokenContract;
      localStorage.setItem("tokenContract", JSON.stringify(tokenContract));
    },
    setNft(state: State, nft: NFT | null) {
      state.nft = nft;
      localStorage.setItem("nft", JSON.stringify(nft));
    },
    setClickedPhoto(state: State, photo: PhotoPubData | null) {
      state.clickedPhoto = photo;
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
