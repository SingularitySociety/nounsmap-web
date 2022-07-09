export interface Token {
  tokenID: string;
  dispalyID: string;
  tokenName: string;
  image: string;
}

export interface TokenMeta {
  description: string;
  external_url: string;
  image: string;
  name: string;
}

export interface NFT {
  name: string;
  description: string;
  contractAddress: string;
  token: Token;
}

export interface TokenContract {
  name: string;
  chainId: string;
  contractAddress: string;
  openseaUrl: string;
  filter: string | null;
  idmask: number;
}

export interface AlchemyOwnedTokens {
  title: string;
  id: {
    tokenId: string;
  };
  contract: {
    address: string;
  };
  metadata: {
    external_link: string;
    image: string;
  };
}
