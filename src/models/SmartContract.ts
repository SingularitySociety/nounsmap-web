export interface Token {
  tokenID: string;
  dispalyID: string;
  tokenName: string;
  image: string;
  imageType: string;
  buff: ArrayBuffer | undefined;
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
  media: [
    {
      format: string;
      gateway: string;
      raw: string;
      thumbnail: string;
    }
  ];
  metadata: {
    external_link: string;
    image: string;
  };
}

export interface ContentsAttribute {
  group: string;
  category: string;
  tag: string;
  width: number;
  height: number;
  minter: string;
  name: string;
  description: string;
  metadata: Uint8Array;
  soulbound: string;
  creator: string;
}
