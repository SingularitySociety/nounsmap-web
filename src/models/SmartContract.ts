export interface Token {
  tokenID: string;
  tokenName: string;
  tokenSymbol: string;
  contractAddress: string;
  hash: string;
}

export interface NFT {
  name: string;
  description: string;
  image: string;
  token: Token;
}

export interface ContractConfig {
  name: string;
  chainId: string;
  networkNamee: string;
  contractAddress: string;
  openseaUrl: string;
}
