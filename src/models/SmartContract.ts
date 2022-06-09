export interface Token {
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  image: string;
  hash: string;
}

export interface NFT {
  name: string;
  description: string;
  image: string;
  token: Token;
}

export interface tokenConfig{
  name: string;
  chainId: string;
  contractAddress: string;
  openseaUrl: string;
  filter: string | null;
}
