import store from "../store";
import { ethers } from "ethers";

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
  RinkebyTestNet: "0x4",
  Polygon: "0x89",
};

interface ChainConfig {
  chainId: string;
  chainName: string;
  rpcUrls: [string];
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
}
const ChainConfigs: { [key: string]: ChainConfig } = {
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
  RinkebyTestNet: {
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
    const ethereum = window.ethereum;
    if (store.state.ethereum != ethereum) {
      store.commit("setEthereum", ethereum);
      if (ethereum) {
        startMonitoringMetamask();
      }
    }
  };
  const ethereum = window.ethereum;
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
  getAccount().then(async (value) => {
    store.commit("setAccount", value);
    console.log("Eth gotAccount", store.getters.displayAccount);
    const provider = new ethers.providers.Web3Provider(store.state.ethereum);
    const { name, chainId } = await provider.getNetwork();
    console.info({ name }, { chainId });
    store.commit("setChainId", chainId);
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
  } catch (e: unknown) {
    console.log(e);
    const code = (e as { code: number }).code;
    // This error code indicates that the chain has not been added to MetaMask.
    if (code === 4902) {
      const configs = Object.values(ChainConfigs).filter(
        (item) => parseInt(item.chainId) == parseInt(chainId)
      );
      console.log(configs);
      try {
        if (configs[0]) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [configs[0]],
          });
        }
      } catch (addError) {
        console.error("cannot add", configs[0]);
        // handle "add" error
      }
    }
  }
};
