import store from "../store";

export const requestAccount = async () => {
  const ethereum = store.state.ethereum;
  if (!ethereum) {
    return null;
  }
  console.log(ethereum.request);
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  return accounts.length > 0 ? accounts[0] : null;
};

export const getAccount = async (): Promise<string | null> => {
  const ethereum = store.state.ethereum;
  if (!ethereum) {
    return null;
  }
  const accounts = await ethereum.request({ method: "eth_accounts" });
  return accounts.length > 0 ? accounts[0] : null;
};

// https://github.com/NoahZinsmeister/web3-react/blob/main/packages/types/src/index.ts
// per EIP-1193
export interface ProviderConnectInfo {
  readonly chainId: string;
}

export interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

export const ChainIds = {
  Mainnet: "0x1",
  RinkebyTestNet: "0x04",
  Polygon: "0x89",
};

const ChainConfigs = {
  Mainnet: {
    chainId: ChainIds.Mainnet,
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      decimals: 18,
      name: "ETH",
      symbol: "ETH",
    },
  },
  Polygon: {
    chainId: ChainIds.Polygon,
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://polygon-rpc.com/"],
    nativeCurrency: {
      decimals: 18,
      name: "Polygon",
      symbol: "MATIC",
    },
  },
  Rinkeby: {
    chainId: ChainIds.RinkebyTestNet,
    chainName: "Rinkeby",
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    nativeCurrency: {
      decimals: 18,
      name: "RIN",
      symbol: "ETH",
    },
  },
};

export const initializeEthereum = () => {
  const setEthereum = () => {
    const ethereum = (window as any).ethereum;
    if (store.state.ethereum != ethereum) {
      store.commit("setEthereum", ethereum);
    }
  };
  const ethereum = (window as any).ethereum;
  if (ethereum) {
    setEthereum();
  } else {
    window.addEventListener(
      "ethereum#initialized",
      () => {
        setEthereum();
      },
      { once: true }
    );
    setTimeout(setEthereum, 30000); // 30 seconds in which nothing happens on android
  }
};

export const startMonitoringMetamask = () => {
  getAccount().then((value) => {
    store.commit("setAccount", value);
    console.log("Eth gotAccount", store.getters.displayAccount);
  });
  if (store.getters.hasMetaMask) {
    const ethereum = store.state.ethereum;
    ethereum.on("accountsChanged", (accounts: string[]) => {
      console.log("accountsChanged", accounts.length);
      if (accounts.length == 0) {
        store.commit("setAccount", null);
      } else {
        store.commit("setAccount", accounts[0]);
        console.log("Eth acountsChanged", store.getters.displayAccount);
      }
    });
    ethereum.on("connect", (info: ProviderConnectInfo): void => {
      console.log("Eth connect", info, store.getters.displayAccount);
      store.commit("setChainId", info.chainId);
    });
    ethereum.on("disconnect", (info: ProviderRpcError): void => {
      console.log("Eth disconnect", info);
    });
    ethereum.on("chainChanged", (chainId: string) => {
      store.commit("setChainId", chainId);
    });
  }
};

export const switchNetwork = async (chainId: string) => {
  const ethereum = store.state.ethereum;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId }],
    });
  } catch (e: any) {
    console.log(e);
    // This error code indicates that the chain has not been added to MetaMask.
    if (e.code === 4902) {
      const config =
        chainId == ChainIds.Mainnet
          ? ChainConfigs.Mainnet
          : chainId == ChainIds.Polygon
          ? ChainConfigs.Polygon
          : chainId == ChainIds.RinkebyTestNet
          ? ChainConfigs.Rinkeby
          : console.error("not suppported chain:", chainId);
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [config],
        });
      } catch (addError) {
        console.error("cannot add", config);
        // handle "add" error
      }
    }
  }
};
