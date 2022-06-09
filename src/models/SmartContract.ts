export interface Token {
  tokenID: string;
  tokenName: string;
  image: string;
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
}
