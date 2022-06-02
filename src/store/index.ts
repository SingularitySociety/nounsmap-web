import { createStore } from "vuex";
import { User } from "firebase/auth";

interface State {
  user: User | null | undefined;
  userType: string | undefined;
  chainId: string | null;
  account: undefined | null | string;
}

export default createStore<State>({
  state: {
    user: undefined,
    userType: undefined,
    chainId: null,
    account: undefined,
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
    setAccount(state: State, account) {
      state.account = account;
    },
  },
  getters: {
    isSignedIn: (state: State) => {
      return state.user !== null && state.user !== undefined;
    },
  },
  actions: {},
  modules: {},
});
