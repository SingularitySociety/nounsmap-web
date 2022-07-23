const abi = {
  _format: "hh-sol-artifact-1",
  contractName: "NounsToken",
  sourceName: "contracts/NounsToken.sol",
  abi: [
    {
      inputs: [
        {
          internalType: "contract INounsDescriptor",
          name: "_descriptor",
          type: "address",
        },
        {
          internalType: "contract INounsSeeder",
          name: "_seeder",
          type: "address",
        },
        {
          internalType: "address",
          name: "_developer",
          type: "address",
        },
        {
          internalType: "address",
          name: "_committee",
          type: "address",
        },
        {
          components: [
            {
              internalType: "uint256",
              name: "maxPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "priceDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timeDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expirationTime",
              type: "uint256",
            },
          ],
          internalType: "struct NounsToken.PriceSeed",
          name: "_priceSeed",
          type: "tuple",
        },
        {
          internalType: "contract IProxyRegistry",
          name: "_proxyRegistry",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "approved",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "delegator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "fromDelegate",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "toDelegate",
          type: "address",
        },
      ],
      name: "DelegateChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "delegate",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "previousBalance",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "newBalance",
          type: "uint256",
        },
      ],
      name: "DelegateVotesChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "mintTime",
          type: "uint256",
        },
      ],
      name: "MintTimeUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "NounBought",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "NounBurned",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "uint48",
              name: "background",
              type: "uint48",
            },
            {
              internalType: "uint48",
              name: "body",
              type: "uint48",
            },
            {
              internalType: "uint48",
              name: "accessory",
              type: "uint48",
            },
            {
              internalType: "uint48",
              name: "head",
              type: "uint48",
            },
            {
              internalType: "uint48",
              name: "glasses",
              type: "uint48",
            },
          ],
          indexed: false,
          internalType: "struct INounsSeeder.Seed",
          name: "seed",
          type: "tuple",
        },
      ],
      name: "NounCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "noundersDAO",
          type: "address",
        },
      ],
      name: "NoundersDAOUpdated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "Transfer",
      type: "event",
    },
    {
      inputs: [],
      name: "DELEGATION_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "DOMAIN_TYPEHASH",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "approve",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "nounId",
          type: "uint256",
        },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "burnExpiredToken",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "buy",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      name: "checkpoints",
      outputs: [
        {
          internalType: "uint32",
          name: "fromBlock",
          type: "uint32",
        },
        {
          internalType: "uint96",
          name: "votes",
          type: "uint96",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "committee",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "dataURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "decimals",
      outputs: [
        {
          internalType: "uint8",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "delegatee",
          type: "address",
        },
      ],
      name: "delegate",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "delegatee",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "nonce",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "expiry",
          type: "uint256",
        },
        {
          internalType: "uint8",
          name: "v",
          type: "uint8",
        },
        {
          internalType: "bytes32",
          name: "r",
          type: "bytes32",
        },
        {
          internalType: "bytes32",
          name: "s",
          type: "bytes32",
        },
      ],
      name: "delegateBySig",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "delegator",
          type: "address",
        },
      ],
      name: "delegates",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "descriptor",
      outputs: [
        {
          internalType: "contract INounsDescriptor",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "developer",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "getApproved",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getCurrentToken",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "getCurrentVotes",
      outputs: [
        {
          internalType: "uint96",
          name: "",
          type: "uint96",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getMintTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getPriceData",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "maxPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "priceDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timeDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expirationTime",
              type: "uint256",
            },
          ],
          internalType: "struct NounsToken.PriceSeed",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "blockNumber",
          type: "uint256",
        },
      ],
      name: "getPriorVotes",
      outputs: [
        {
          internalType: "uint96",
          name: "",
          type: "uint96",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
      ],
      name: "isApprovedForAll",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "mint",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "mintTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "nonces",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "numCheckpoints",
      outputs: [
        {
          internalType: "uint32",
          name: "",
          type: "uint32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "ownerOf",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "priceSeed",
      outputs: [
        {
          internalType: "uint256",
          name: "maxPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "minPrice",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "priceDelta",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "timeDelta",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "expirationTime",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "proxyRegistry",
      outputs: [
        {
          internalType: "contract IProxyRegistry",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "seeder",
      outputs: [
        {
          internalType: "contract INounsSeeder",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "seeds",
      outputs: [
        {
          internalType: "uint48",
          name: "background",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "body",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "accessory",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "head",
          type: "uint48",
        },
        {
          internalType: "uint48",
          name: "glasses",
          type: "uint48",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_committee",
          type: "address",
        },
      ],
      name: "setCommittee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_developer",
          type: "address",
        },
      ],
      name: "setDeveloper",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "maxPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "minPrice",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "priceDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "timeDelta",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "expirationTime",
              type: "uint256",
            },
          ],
          internalType: "struct NounsToken.PriceSeed",
          name: "_priceSeed",
          type: "tuple",
        },
      ],
      name: "setPriceData",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      name: "supportsInterface",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "testTime",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
      ],
      name: "tokenOfOwnerByIndex",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenPrice",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "tokenURI",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "transfer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
      ],
      name: "transferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "delegator",
          type: "address",
        },
      ],
      name: "votesToDelegate",
      outputs: [
        {
          internalType: "uint96",
          name: "",
          type: "uint96",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
  bytecode:
    "0x60a06040523480156200001157600080fd5b50604051620058fa380380620058fa833981016040819052620000349162000f70565b6040518060400160405280600a8152602001694e6f756e73206c6f766560b01b815250604051806040016040528060048152602001632727aaa760e11b8152506200008e620000886200015360201b60201c565b62000157565b8151620000a390600190602085019062000ea1565b508051620000b990600290602084019062000ea1565b5050601080546001600160a01b03199081166001600160a01b038a811691909117909255601180548216898416179055601b80548216888416179055600f805490911691861691909117905550606081811b6001600160601b031916608090815283516016556020840151601755604084015160185590830151601955820151601a5562000146620001a7565b50505050505050620012fb565b3390565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600080546001600160a01b03163314620002085760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b601354156200024c5760405162461bcd60e51b815260206004820152600f60248201526e4669727374206d696e74206f6e6c7960881b6044820152606401620001ff565b6200027f620002636000546001600160a01b031690565b60138054906000620002758362001282565b909155506200029e565b506013805462000299913091906000620002758362001282565b905090565b60115460105460405163422e2e9960e01b8152600481018490526001600160a01b0391821660248201526000928392169063422e2e999060440160a06040518083038186803b158015620002f157600080fd5b505afa15801562000306573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906200032c91906200103f565b6000848152601260209081526040918290208351815485840151868601516060808901516080998a015165ffffffffffff9687166001600160601b0319909616959095176601000000000000948716850217600160601b600160c01b0319166c01000000000000000000000000938716840265ffffffffffff60901b191617600160901b91871682021765ffffffffffff60c01b198116600160c01b9688168702908117988990558a5160a081018c5291881690881617815293870486169784019790975290850484169682019690965293830482169484019490945292900490911691810191909152905062000422620004c3565b62000441620004396000546001600160a01b031690565b8585620004fe565b827f1106ee9d020bfbb5ee34cf5535a5fbf024a011bd130078088cbf124ab309247882604051620004b39190815165ffffffffffff9081168252602080840151821690830152604080840151821690830152606080840151821690830152608092830151169181019190915260a00190565b60405180910390a2509092915050565b4260148190556040519081527f821964bd9a1d2293691ad21ae7e91848254493a40c1c13fc88e032e6a14a94c99060200160405180910390a1565b6001600160a01b038216620005565760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401620001ff565b6000818152600360205260409020546001600160a01b031615620005bd5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401620001ff565b620005cb600083836200067a565b6001600160a01b0382166000908152600460205260408120805460019290620005f690849062001175565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b0386811691909117909155905183929186169190600080516020620058a3833981519152908290a480826001600160a01b0316846001600160a01b0316600080516020620058a383398151915260405160405180910390a4505050565b62000692838383620006b960201b6200256c1760201c565b620006b4620006a18462000795565b620006ac8462000795565b6001620007c9565b505050565b620006d1838383620006b460201b62000e2a1760201c565b6001600160a01b0383166200072f576200072981600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b62000755565b816001600160a01b0316836001600160a01b031614620007555762000755838262000995565b6001600160a01b0382166200076f57620006b48162000a42565b826001600160a01b0316826001600160a01b031614620006b457620006b4828262000afc565b6001600160a01b038082166000908152600b60205260408120549091168015620007c05780620007c2565b825b9392505050565b816001600160a01b0316836001600160a01b031614158015620007f557506000816001600160601b0316115b15620006b4576001600160a01b03831615620008c6576001600160a01b0383166000908152600d602052604081205463ffffffff1690816200083957600062000888565b6001600160a01b0385166000908152600c60205260408120906200085f600185620011fa565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b90506000620008b28285604051806060016040528060378152602001620058c36037913962000b4d565b9050620008c28684848462000b9c565b5050505b6001600160a01b03821615620006b4576001600160a01b0382166000908152600d602052604081205463ffffffff1690816200090457600062000953565b6001600160a01b0384166000908152600c60205260408120906200092a600185620011fa565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b905060006200097d8285604051806060016040528060368152602001620058296036913962000d93565b90506200098d8584848462000b9c565b505050505050565b60006001620009af8462000de560201b6200144c1760201c565b620009bb9190620011e0565b60008381526008602052604090205490915080821462000a0f576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b60095460009062000a5690600190620011e0565b6000838152600a60205260408120546009805493945090928490811062000a815762000a81620012cc565b90600052602060002001549050806009838154811062000aa55762000aa5620012cc565b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548062000ae05762000ae0620012b6565b6001900381819060005260206000200160009055905550505050565b600062000b148362000de560201b6200144c1760201c565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b6000836001600160601b0316836001600160601b03161115829062000b875760405162461bcd60e51b8152600401620001ff9190620010e6565b5062000b94838562001222565b949350505050565b600062000bc3436040518060800160405280604481526020016200585f6044913962000e6e565b905060008463ffffffff1611801562000c2057506001600160a01b0385166000908152600c6020526040812063ffffffff83169162000c04600188620011fa565b63ffffffff908116825260208201929092526040016000205416145b1562000c93576001600160a01b0385166000908152600c60205260408120839162000c4d600188620011fa565b63ffffffff168152602081019190915260400160002080546001600160601b039290921664010000000002600160201b600160801b031990921691909117905562000d3e565b60408051808201825263ffffffff80841682526001600160601b0380861660208085019182526001600160a01b038b166000908152600c82528681208b8616825290915294909420925183549451909116640100000000026001600160801b031990941691161791909117905562000d0d84600162001190565b6001600160a01b0386166000908152600d60205260409020805463ffffffff191663ffffffff929092169190911790555b604080516001600160601b038086168252841660208201526001600160a01b038716917fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724910160405180910390a25050505050565b60008062000da28486620011bb565b9050846001600160601b0316816001600160601b03161015839062000ddc5760405162461bcd60e51b8152600401620001ff9190620010e6565b50949350505050565b60006001600160a01b03821662000e525760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401620001ff565b506001600160a01b031660009081526004602052604090205490565b600081640100000000841062000e995760405162461bcd60e51b8152600401620001ff9190620010e6565b509192915050565b82805462000eaf9062001245565b90600052602060002090601f01602090048101928262000ed3576000855562000f1e565b82601f1062000eee57805160ff191683800117855562000f1e565b8280016001018555821562000f1e579182015b8281111562000f1e57825182559160200191906001019062000f01565b5062000f2c92915062000f30565b5090565b5b8082111562000f2c576000815560010162000f31565b805162000f5481620012e2565b919050565b805165ffffffffffff8116811462000f5457600080fd5b60008060008060008086880361014081121562000f8c57600080fd5b875162000f9981620012e2565b602089015190975062000fac81620012e2565b604089015190965062000fbf81620012e2565b606089015190955062000fd281620012e2565b935060a0607f198201121562000fe757600080fd5b5062000ff26200113e565b608088810151825260a0890151602083015260c0890151604083015260e0890151606083015261010089015190820152915062001033610120880162000f47565b90509295509295509295565b600060a082840312156200105257600080fd5b60405160a081016001600160401b03811182821017156200108357634e487b7160e01b600052604160045260246000fd5b604052620010918362000f59565b8152620010a16020840162000f59565b6020820152620010b46040840162000f59565b6040820152620010c76060840162000f59565b6060820152620010da6080840162000f59565b60808201529392505050565b600060208083528351808285015260005b818110156200111557858101830151858201604001528201620010f7565b8181111562001128576000604083870101525b50601f01601f1916929092016040019392505050565b60405160a081016001600160401b03811182821017156200116f57634e487b7160e01b600052604160045260246000fd5b60405290565b600082198211156200118b576200118b620012a0565b500190565b600063ffffffff808316818516808303821115620011b257620011b2620012a0565b01949350505050565b60006001600160601b03828116848216808303821115620011b257620011b2620012a0565b600082821015620011f557620011f5620012a0565b500390565b600063ffffffff838116908316818110156200121a576200121a620012a0565b039392505050565b60006001600160601b03838116908316818110156200121a576200121a620012a0565b600181811c908216806200125a57607f821691505b602082108114156200127c57634e487b7160e01b600052602260045260246000fd5b50919050565b6000600019821415620012995762001299620012a0565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b6001600160a01b0381168114620012f857600080fd5b50565b60805160601c6145086200132160003960008181610887015261235201526145086000f3fe60806040526004361061034a5760003560e01c8063782d6fe1116101bb578063c3cda520116100f7578063e9580e9111610095578063f0503e801161006f578063f0503e8014610a25578063f1127ed814610ad8578063f2fde38b14610b4d578063ff70fa4914610b6d57600080fd5b8063e9580e91146109d0578063e985e9c5146109f0578063ef2d174614610a1057600080fd5b8063d4ddce8a116100d1578063d4ddce8a14610949578063d864e74014610969578063d96a094a14610989578063e7a324dc1461099c57600080fd5b8063c3cda520146108e9578063c87b56dd14610909578063ca4b208b1461092957600080fd5b806395d89b4111610164578063b4b5ea571161013e578063b4b5ea5714610855578063b50cbd9f14610875578063b88d4fde146108a9578063bddae40e146108c957600080fd5b806395d89b41146107c9578063a22cb465146107de578063a4a28168146107fe57600080fd5b8063864a28ec11610195578063864a28ec146107765780638a4068dd146107965780638da5cb5b146107ab57600080fd5b8063782d6fe1146106fb5780637ecebe0014610733578063864781221461076057600080fd5b8063313ce5671161028a5780635ac1e3bb11610233578063684931ed1161020d578063684931ed1461065e5780636fcfff451461067e57806370a08231146106c6578063715018a6146106e657600080fd5b80635ac1e3bb146105fe5780635c19a95c1461061e5780636352211e1461063e57600080fd5b806342966c681161026457806342966c681461059e5780634f6ccce7146105be578063587cde1e146105de57600080fd5b8063313ce567146105415780633c35a0c11461056857806342842e0e1461057e57600080fd5b80631249c58b116102f757806323b872dd116102d157806323b872dd146104cc5780632f745c59146104ec578063303e74df1461050c5780633053ea2b1461052c57600080fd5b80631249c58b1461046e57806318160ddd1461048357806320606b701461049857600080fd5b806306fdde031161032857806306fdde03146103f2578063081812fc14610414578063095ea7b31461044c57600080fd5b806301ffc9a71461034f578063026833c71461038457806303e65c96146103d3575b600080fd5b34801561035b57600080fd5b5061036f61036a366004613db7565b610b8d565b60405190151581526020015b60405180910390f35b34801561039057600080fd5b50601654601754601854601954601a546103ab949392919085565b604080519586526020860194909452928401919091526060830152608082015260a00161037b565b3480156103df57600080fd5b506014545b60405190815260200161037b565b3480156103fe57600080fd5b50610407610bd1565b60405161037b9190614053565b34801561042057600080fd5b5061043461042f366004613f1f565b610c63565b6040516001600160a01b03909116815260200161037b565b34801561045857600080fd5b5061046c610467366004613cf2565b610cfd565b005b34801561047a57600080fd5b506103e4610e2f565b34801561048f57600080fd5b506009546103e4565b3480156104a457600080fd5b506103e47f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b3480156104d857600080fd5b5061046c6104e7366004613bcf565b610f24565b3480156104f857600080fd5b506103e4610507366004613cf2565b610fab565b34801561051857600080fd5b50601054610434906001600160a01b031681565b34801561053857600080fd5b5061046c611053565b34801561054d57600080fd5b50610556600081565b60405160ff909116815260200161037b565b34801561057457600080fd5b506103e460155481565b34801561058a57600080fd5b5061046c610599366004613bcf565b61109c565b3480156105aa57600080fd5b5061046c6105b9366004613f1f565b6110b7565b3480156105ca57600080fd5b506103e46105d9366004613f1f565b611148565b3480156105ea57600080fd5b506104346105f9366004613b5c565b6111ec565b34801561060a57600080fd5b50610407610619366004613f1f565b61121e565b34801561062a57600080fd5b5061046c610639366004613b5c565b6113a3565b34801561064a57600080fd5b50610434610659366004613f1f565b6113c1565b34801561066a57600080fd5b50601154610434906001600160a01b031681565b34801561068a57600080fd5b506106b1610699366004613b5c565b600d6020526000908152604090205463ffffffff1681565b60405163ffffffff909116815260200161037b565b3480156106d257600080fd5b506103e46106e1366004613b5c565b61144c565b3480156106f257600080fd5b5061046c6114e6565b34801561070757600080fd5b5061071b610716366004613cf2565b61154c565b6040516001600160601b03909116815260200161037b565b34801561073f57600080fd5b506103e461074e366004613b5c565b600e6020526000908152604090205481565b34801561076c57600080fd5b506103e460145481565b34801561078257600080fd5b5061046c610791366004613e5f565b6117ec565b3480156107a257600080fd5b5061046c6118e6565b3480156107b757600080fd5b506000546001600160a01b0316610434565b3480156107d557600080fd5b5061040761197b565b3480156107ea57600080fd5b5061046c6107f9366004613cbf565b61198a565b34801561080a57600080fd5b50610813611a4f565b60405161037b9190600060a082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015292915050565b34801561086157600080fd5b5061071b610870366004613b5c565b611ab6565b34801561088157600080fd5b506104347f000000000000000000000000000000000000000000000000000000000000000081565b3480156108b557600080fd5b5061046c6108c4366004613c10565b611b34565b3480156108d557600080fd5b5061046c6108e4366004613b5c565b611bc2565b3480156108f557600080fd5b5061046c610904366004613d1e565b611c3e565b34801561091557600080fd5b50610407610924366004613f1f565b611f70565b34801561093557600080fd5b50601b54610434906001600160a01b031681565b34801561095557600080fd5b506103e4610964366004613f1f565b612098565b34801561097557600080fd5b50600f54610434906001600160a01b031681565b6103e4610997366004613f1f565b612123565b3480156109a857600080fd5b506103e47fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf81565b3480156109dc57600080fd5b5061071b6109eb366004613b5c565b6122e7565b3480156109fc57600080fd5b5061036f610a0b366004613b96565b612313565b348015610a1c57600080fd5b506013546103e4565b348015610a3157600080fd5b50610a9f610a40366004613f1f565b60126020526000908152604090205465ffffffffffff80821691660100000000000081048216916c01000000000000000000000000820481169172010000000000000000000000000000000000008104821691600160c01b9091041685565b6040805165ffffffffffff968716815294861660208601529285169284019290925283166060830152909116608082015260a00161037b565b348015610ae457600080fd5b50610b29610af3366004613d80565b600c60209081526000928352604080842090915290825290205463ffffffff81169064010000000090046001600160601b031682565b6040805163ffffffff90931683526001600160601b0390911660208301520161037b565b348015610b5957600080fd5b5061046c610b68366004613b5c565b612411565b348015610b7957600080fd5b5061046c610b88366004613b5c565b6124f0565b60006001600160e01b031982167f780e9d63000000000000000000000000000000000000000000000000000000001480610bcb5750610bcb82612624565b92915050565b606060018054610be0906142e1565b80601f0160208091040260200160405190810160405280929190818152602001828054610c0c906142e1565b8015610c595780601f10610c2e57610100808354040283529160200191610c59565b820191906000526020600020905b815481529060010190602001808311610c3c57829003601f168201915b5050505050905090565b6000818152600360205260408120546001600160a01b0316610ce15760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600560205260409020546001600160a01b031690565b6000610d08826113c1565b9050806001600160a01b0316836001600160a01b03161415610d925760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f72000000000000000000000000000000000000000000000000000000000000006064820152608401610cd8565b336001600160a01b0382161480610dae5750610dae8133612313565b610e205760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610cd8565b610e2a83836126bf565b505050565b600080546001600160a01b03163314610e8a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b60135415610eda5760405162461bcd60e51b815260206004820152600f60248201527f4669727374206d696e74206f6e6c7900000000000000000000000000000000006044820152606401610cd8565b610f08610eef6000546001600160a01b031690565b60138054906000610eff8361431c565b9190505561272d565b5060138054610f1f913091906000610eff8361431c565b905090565b610f2e33826129b6565b610fa05760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f7665640000000000000000000000000000006064820152608401610cd8565b610e2a838383612a8d565b6000610fb68361144c565b821061102a5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201527f74206f6620626f756e64730000000000000000000000000000000000000000006064820152608401610cd8565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b6000601454426110639190614259565b601a549091508111156110825761108260016013546105b99190614259565b60138054611098913091906000610eff8361431c565b5050565b610e2a83838360405180602001604052806000815250611b34565b6000546001600160a01b031633146111115760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b61111a81612c4c565b60405181907f806be94a2ac8b92d74e99aa8add5a8e54528a01ec914a9e00d201a6480ed986390600090a250565b600061115360095490565b82106111c75760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201527f7574206f6620626f756e647300000000000000000000000000000000000000006064820152608401610cd8565b600982815481106111da576111da61438d565b90600052602060002001549050919050565b6001600160a01b038082166000908152600b602052604081205490911680156112155780611217565b825b9392505050565b6000818152600360205260409020546060906001600160a01b03166112995760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b60006112a483612cf3565b90506000816040516020016112b99190613f64565b60405160208183030381529060405290506000826040516020016112dd9190613f97565b60408051601f1981840301815282825260105460008981526012602052929092207f87db11bd0000000000000000000000000000000000000000000000000000000084529093506001600160a01b03909116916387db11bd916113469186918691600401614066565b60006040518083038186803b15801561135e57600080fd5b505afa158015611372573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261139a9190810190613df1565b95945050505050565b6001600160a01b0381166113b45750335b6113be3382612e25565b50565b6000818152600360205260408120546001600160a01b031680610bcb5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201527f656e7420746f6b656e00000000000000000000000000000000000000000000006064820152608401610cd8565b60006001600160a01b0382166114ca5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a6560448201527f726f2061646472657373000000000000000000000000000000000000000000006064820152608401610cd8565b506001600160a01b031660009081526004602052604090205490565b6000546001600160a01b031633146115405760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b61154a6000612ea5565b565b60004382106115c35760405162461bcd60e51b815260206004820152603760248201527f455243373231436865636b706f696e7461626c653a3a6765745072696f72566f60448201527f7465733a206e6f74207965742064657465726d696e65640000000000000000006064820152608401610cd8565b6001600160a01b0383166000908152600d602052604090205463ffffffff16806115f1576000915050610bcb565b6001600160a01b0384166000908152600c602052604081208491611616600185614270565b63ffffffff9081168252602082019290925260400160002054161161168a576001600160a01b0384166000908152600c6020526040812090611659600184614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03169150610bcb9050565b6001600160a01b0384166000908152600c6020908152604080832083805290915290205463ffffffff168310156116c5576000915050610bcb565b6000806116d3600184614270565b90505b8163ffffffff168163ffffffff1611156117a657600060026116f88484614270565b6117029190614217565b61170c9083614270565b6001600160a01b0388166000908152600c6020908152604080832063ffffffff8581168552908352928190208151808301909252549283168082526401000000009093046001600160601b03169181019190915291925087141561177a57602001519450610bcb9350505050565b805163ffffffff168711156117915781935061179f565b61179c600183614270565b92505b50506116d6565b506001600160a01b0385166000908152600c6020908152604080832063ffffffff909416835292905220546001600160601b036401000000009091041691505092915050565b6000546001600160a01b031633146118465760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b60208101518151116118c05760405162461bcd60e51b815260206004820152602760248201527f4d6178207072696365206d757374206265206c6172676572207468616e204d6960448201527f6e205072696365000000000000000000000000000000000000000000000000006064820152608401610cd8565b805160165560208101516017556040810151601855606081015160195560800151601a55565b6000546001600160a01b031633146119405760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b600f546040516001600160a01b039091169081904780156108fc02916000818181858888f19350505050158015611098573d6000803e3d6000fd5b606060028054610be0906142e1565b6001600160a01b0382163314156119e35760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610cd8565b3360008181526006602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611a816040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b506040805160a08101825260165481526017546020820152601854918101919091526019546060820152601a54608082015290565b6001600160a01b0381166000908152600d602052604081205463ffffffff1680611ae1576000611217565b6001600160a01b0383166000908152600c6020526040812090611b05600184614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03169392505050565b611b3e33836129b6565b611bb05760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f7665640000000000000000000000000000006064820152608401610cd8565b611bbc84848484612ef5565b50505050565b6000546001600160a01b03163314611c1c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b600f80546001600160a01b0319166001600160a01b0392909216919091179055565b60007f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866611c69610bd1565b80519060200120611c774690565b60408051602080820195909552808201939093526060830191909152306080808401919091528151808403909101815260a0830182528051908401207fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60c08401526001600160a01b038b1660e084015261010083018a90526101208084018a9052825180850390910181526101408401909252815191909301207f1901000000000000000000000000000000000000000000000000000000000000610160830152610162820183905261018282018190529192506000906101a20160408051601f198184030181528282528051602091820120600080855291840180845281905260ff8a169284019290925260608301889052608083018790529092509060019060a0016020604051602081039080840390855afa158015611dbe573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611e475760405162461bcd60e51b815260206004820152603660248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a20696e76616c6964207369676e6174757265000000000000000000006064820152608401610cd8565b6001600160a01b0381166000908152600e60205260408120805491611e6b8361431c565b919050558914611ee35760405162461bcd60e51b815260206004820152603260248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a20696e76616c6964206e6f6e636500000000000000000000000000006064820152608401610cd8565b87421115611f595760405162461bcd60e51b815260206004820152603660248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a207369676e61747572652065787069726564000000000000000000006064820152608401610cd8565b611f63818b612e25565b505050505b505050505050565b6000818152600360205260409020546060906001600160a01b0316611feb5760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b6010546000838152601260205260409081902090517f3cfdafd30000000000000000000000000000000000000000000000000000000081526001600160a01b0390921691633cfdafd391612044918691906004016140d6565b60006040518083038186803b15801561205c57600080fd5b505afa158015612070573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bcb9190810190613df1565b6000818152600360205260408120546001600160a01b03166121105760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b506000908152601c602052604090205490565b60008061212f836113c1565b905033600061213c612f7e565b90506001600160a01b03831630146121965760405162461bcd60e51b815260206004820152601960248201527f4f776e6572206973206e6f742074686520636f6e7472616374000000000000006044820152606401610cd8565b60016013546121a59190614259565b85146121f35760405162461bcd60e51b815260206004820152600f60248201527f4e6f74206c6174657374204e6f756e00000000000000000000000000000000006044820152606401610cd8565b803410156122435760405162461bcd60e51b815260206004820152601f60248201527f4d7573742073656e64206174206c656173742063757272656e745072696365006044820152606401610cd8565b6000858152601c6020526040902034905561225e8286612ff9565b600a60135461226d9190614337565b61229357601b5460138054612291926001600160a01b0316916000610eff8361431c565b505b6040516001600160a01b038316815285907ff3919fe9a709ec82fb9fd1c54a2af7cf717bfe52a6c9b1f1ed8ea42d52ba392f9060200160405180910390a26013805461139a913091906000610eff8361431c565b6000610bcb6122f58361144c565b6040518060600160405280603d815260200161445f603d91396131a5565b6040517fc45527910000000000000000000000000000000000000000000000000000000081526001600160a01b038381166004830152600091818416917f0000000000000000000000000000000000000000000000000000000000000000169063c45527919060240160206040518083038186803b15801561239457600080fd5b505afa1580156123a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123cc9190613b79565b6001600160a01b031614156123e357506001610bcb565b6001600160a01b0380841660009081526006602090815260408083209386168352929052205460ff16611217565b6000546001600160a01b0316331461246b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b6001600160a01b0381166124e75760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610cd8565b6113be81612ea5565b6000546001600160a01b0316331461254a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b601b80546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0383166125c7576125c281600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6125ea565b816001600160a01b0316836001600160a01b0316146125ea576125ea83826131dd565b6001600160a01b03821661260157610e2a8161327a565b826001600160a01b0316826001600160a01b031614610e2a57610e2a8282613329565b60006001600160e01b031982167f80ac58cd00000000000000000000000000000000000000000000000000000000148061268757506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b80610bcb57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b0319831614610bcb565b600081815260056020526040902080546001600160a01b0319166001600160a01b03841690811790915581906126f4826113c1565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6011546010546040517f422e2e99000000000000000000000000000000000000000000000000000000008152600481018490526001600160a01b0391821660248201526000928392169063422e2e999060440160a06040518083038186803b15801561279857600080fd5b505afa1580156127ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127d09190613eaf565b6000848152601260209081526040918290208351815485840151868601516060808901516080998a015165ffffffffffff9687166bffffffffffffffffffffffff199096169590951766010000000000009487168502177fffffffffffffffff000000000000000000000000ffffffffffffffffffffffff166c0100000000000000000000000093871684027fffffffffffffffff000000000000ffffffffffffffffffffffffffffffffffff161772010000000000000000000000000000000000009187168202177fffff000000000000ffffffffffffffffffffffffffffffffffffffffffffffff8116600160c01b9688168702908117988990558a5160a081018c5291881690881617815293870486169784019790975290850484169682019690965293830482169484019490945292900490911691810191909152905061291961336d565b61293561292e6000546001600160a01b031690565b85856133a8565b827f1106ee9d020bfbb5ee34cf5535a5fbf024a011bd130078088cbf124ab3092478826040516129a69190815165ffffffffffff9081168252602080840151821690830152604080840151821690830152606080840151821690830152608092830151169181019190915260a00190565b60405180910390a2509092915050565b6000818152600360205260408120546001600160a01b0316612a2f5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610cd8565b6000612a3a836113c1565b9050806001600160a01b0316846001600160a01b03161480612a755750836001600160a01b0316612a6a84610c63565b6001600160a01b0316145b80612a855750612a858185612313565b949350505050565b826001600160a01b0316612aa0826113c1565b6001600160a01b031614612b1c5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f74206f776e00000000000000000000000000000000000000000000006064820152608401610cd8565b6001600160a01b038216612b7e5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610cd8565b612b8983838361353e565b612b946000826126bf565b6001600160a01b0383166000908152600460205260408120805460019290612bbd908490614259565b90915550506001600160a01b0382166000908152600460205260408120805460019290612beb9084906141a1565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000612c57826113c1565b9050612c658160008461353e565b612c706000836126bf565b6001600160a01b0381166000908152600460205260408120805460019290612c99908490614259565b909155505060008281526003602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b606081612d3357505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b8115612d5d5780612d478161431c565b9150612d569050600a83614203565b9150612d37565b60008167ffffffffffffffff811115612d7857612d786143a3565b6040519080825280601f01601f191660200182016040528015612da2576020820181803683370190505b5090505b8415612a8557612db7600183614259565b9150612dc4600a86614337565b612dcf9060306141a1565b60f81b818381518110612de457612de461438d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350612e1e600a86614203565b9450612da6565b6000612e30836111ec565b6001600160a01b038481166000818152600b602052604080822080546001600160a01b031916888616908117909155905194955093928516927f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a46000612e98846122e7565b9050611bbc828483613561565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b612f00848484612a8d565b612f0c8484848461370f565b611bbc5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610cd8565b60008060145442612f8f9190614259565b601954909150811015612fa457505060165490565b60185460195460009190612fb89084614203565b612fc2919061423a565b601754601654919250612fd491614259565b8110612fe4575050601754919050565b601654612ff2908290614259565b9250505090565b3080613004836113c1565b6001600160a01b0316146130805760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f742061646472657373000000000000000000000000000000000000006064820152608401610cd8565b6001600160a01b0383166130e25760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610cd8565b6130ed81848461353e565b6001600160a01b0381166000908152600460205260408120805460019290613116908490614259565b90915550506001600160a01b03831660009081526004602052604081208054600192906131449084906141a1565b909155505060008281526003602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000816c0100000000000000000000000084106131d55760405162461bcd60e51b8152600401610cd89190614053565b509192915050565b600060016131ea8461144c565b6131f49190614259565b600083815260086020526040902054909150808214613247576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b60095460009061328c90600190614259565b6000838152600a6020526040812054600980549394509092849081106132b4576132b461438d565b9060005260206000200154905080600983815481106132d5576132d561438d565b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548061330d5761330d614377565b6001900381819060005260206000200160009055905550505050565b60006133348361144c565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b4260148190556040519081527f821964bd9a1d2293691ad21ae7e91848254493a40c1c13fc88e032e6a14a94c99060200160405180910390a1565b6001600160a01b0382166133fe5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610cd8565b6000818152600360205260409020546001600160a01b0316156134635760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610cd8565b61346f6000838361353e565b6001600160a01b03821660009081526004602052604081208054600192906134989084906141a1565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b03868116919091179091559051839291861691907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b61354983838361256c565b610e2a613555846111ec565b61355e846111ec565b60015b816001600160a01b0316836001600160a01b03161415801561358c57506000816001600160601b0316115b15610e2a576001600160a01b03831615613652576001600160a01b0383166000908152600d602052604081205463ffffffff1690816135cc576000613619565b6001600160a01b0385166000908152600c60205260408120906135f0600185614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b90506000613640828560405180606001604052806037815260200161449c60379139613872565b905061364e868484846138b4565b5050505b6001600160a01b03821615610e2a576001600160a01b0382166000908152600d602052604081205463ffffffff16908161368d5760006136da565b6001600160a01b0384166000908152600c60205260408120906136b1600185614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b9050600061370182856040518060600160405280603681526020016143e560369139613acc565b9050611f68858484846138b4565b60006001600160a01b0384163b1561386757604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613753903390899088908890600401614017565b602060405180830381600087803b15801561376d57600080fd5b505af192505050801561379d575060408051601f3d908101601f1916820190925261379a91810190613dd4565b60015b61384d573d8080156137cb576040519150601f19603f3d011682016040523d82523d6000602084013e6137d0565b606091505b5080516138455760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610cd8565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612a85565b506001949350505050565b6000836001600160601b0316836001600160601b0316111582906138a95760405162461bcd60e51b8152600401610cd89190614053565b50612a858385614295565b60006138d84360405180608001604052806044815260200161441b60449139613b19565b905060008463ffffffff1611801561393257506001600160a01b0385166000908152600c6020526040812063ffffffff831691613916600188614270565b63ffffffff908116825260208201929092526040016000205416145b156139b6576001600160a01b0385166000908152600c60205260408120839161395c600188614270565b63ffffffff168152602081019190915260400160002080546001600160601b0392909216640100000000027fffffffffffffffffffffffffffffffff000000000000000000000000ffffffff909216919091179055613a77565b60408051808201825263ffffffff80841682526001600160601b0380861660208085019182526001600160a01b038b166000908152600c82528681208b8616825290915294909420925183549451909116640100000000027fffffffffffffffffffffffffffffffff00000000000000000000000000000000909416911617919091179055613a468460016141b9565b6001600160a01b0386166000908152600d60205260409020805463ffffffff191663ffffffff929092169190911790555b604080516001600160601b038086168252841660208201526001600160a01b038716917fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724910160405180910390a25050505050565b600080613ad984866141e1565b9050846001600160601b0316816001600160601b031610158390613b105760405162461bcd60e51b8152600401610cd89190614053565b50949350505050565b60008164010000000084106131d55760405162461bcd60e51b8152600401610cd89190614053565b805165ffffffffffff81168114613b5757600080fd5b919050565b600060208284031215613b6e57600080fd5b8135611217816143b9565b600060208284031215613b8b57600080fd5b8151611217816143b9565b60008060408385031215613ba957600080fd5b8235613bb4816143b9565b91506020830135613bc4816143b9565b809150509250929050565b600080600060608486031215613be457600080fd5b8335613bef816143b9565b92506020840135613bff816143b9565b929592945050506040919091013590565b60008060008060808587031215613c2657600080fd5b8435613c31816143b9565b93506020850135613c41816143b9565b925060408501359150606085013567ffffffffffffffff811115613c6457600080fd5b8501601f81018713613c7557600080fd5b8035613c88613c8382614179565b614148565b818152886020838501011115613c9d57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60008060408385031215613cd257600080fd5b8235613cdd816143b9565b915060208301358015158114613bc457600080fd5b60008060408385031215613d0557600080fd5b8235613d10816143b9565b946020939093013593505050565b60008060008060008060c08789031215613d3757600080fd5b8635613d42816143b9565b95506020870135945060408701359350606087013560ff81168114613d6657600080fd5b9598949750929560808101359460a0909101359350915050565b60008060408385031215613d9357600080fd5b8235613d9e816143b9565b9150602083013563ffffffff81168114613bc457600080fd5b600060208284031215613dc957600080fd5b8135611217816143ce565b600060208284031215613de657600080fd5b8151611217816143ce565b600060208284031215613e0357600080fd5b815167ffffffffffffffff811115613e1a57600080fd5b8201601f81018413613e2b57600080fd5b8051613e39613c8382614179565b818152856020838501011115613e4e57600080fd5b61139a8260208301602086016142b5565b600060a08284031215613e7157600080fd5b613e7961411f565b82358152602083013560208201526040830135604082015260608301356060820152608083013560808201528091505092915050565b600060a08284031215613ec157600080fd5b613ec961411f565b613ed283613b41565b8152613ee060208401613b41565b6020820152613ef160408401613b41565b6040820152613f0260608401613b41565b6060820152613f1360808401613b41565b60808201529392505050565b600060208284031215613f3157600080fd5b5035919050565b60008151808452613f508160208601602086016142b5565b601f01601f19169290920160200192915050565b6a02737bab7103637bb32b9160ad1b815260008251613f8a81600b8501602087016142b5565b91909101600b0192915050565b6a02737bab7103637bb32b9160ad1b815260008251613fbd81600b8501602087016142b5565b7f20697320612066756e206f6620746865204e6f756e732044414f20616e64204e600b9390910192830152507f6f756e732041727420466573746976616c000000000000000000000000000000602b820152603c01919050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526140496080830184613f38565b9695505050505050565b6020815260006112176020830184613f38565b60e08152600061407960e0830186613f38565b828103602084015261408b8186613f38565b915050612a856040830184805465ffffffffffff8082168452808260301c166020850152808260601c166040850152808260901c166060850152808260c01c16608085015250505050565b828152815465ffffffffffff8082166020840152603082901c81166040840152606082811c821690840152609082901c8116608084015260c091821c1660a08301528101611217565b60405160a0810167ffffffffffffffff81118282101715614142576141426143a3565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715614171576141716143a3565b604052919050565b600067ffffffffffffffff821115614193576141936143a3565b50601f01601f191660200190565b600082198211156141b4576141b461434b565b500190565b600063ffffffff8083168185168083038211156141d8576141d861434b565b01949350505050565b60006001600160601b038083168185168083038211156141d8576141d861434b565b60008261421257614212614361565b500490565b600063ffffffff8084168061422e5761422e614361565b92169190910492915050565b60008160001904831182151516156142545761425461434b565b500290565b60008282101561426b5761426b61434b565b500390565b600063ffffffff8381169083168181101561428d5761428d61434b565b039392505050565b60006001600160601b038381169083168181101561428d5761428d61434b565b60005b838110156142d05781810151838201526020016142b8565b83811115611bbc5750506000910152565b600181811c908216806142f557607f821691505b6020821081141561431657634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156143305761433061434b565b5060010190565b60008261434657614346614361565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146113be57600080fd5b6001600160e01b0319811681146113be57600080fdfe455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e74206f766572666c6f7773455243373231436865636b706f696e7461626c653a3a5f7772697465436865636b706f696e743a20626c6f636b206e756d62657220657863656564732033322062697473455243373231436865636b706f696e7461626c653a3a766f746573546f44656c65676174653a20616d6f756e7420657863656564732039362062697473455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e7420756e646572666c6f7773a264697066735822122057fdd914ff699d91ab97f68752982d596dca9304662b8326e9fedeb8bf02527a64736f6c63430008060033455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e74206f766572666c6f7773455243373231436865636b706f696e7461626c653a3a5f7772697465436865636b706f696e743a20626c6f636b206e756d62657220657863656564732033322062697473ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e7420756e646572666c6f7773",
  deployedBytecode:
    "0x60806040526004361061034a5760003560e01c8063782d6fe1116101bb578063c3cda520116100f7578063e9580e9111610095578063f0503e801161006f578063f0503e8014610a25578063f1127ed814610ad8578063f2fde38b14610b4d578063ff70fa4914610b6d57600080fd5b8063e9580e91146109d0578063e985e9c5146109f0578063ef2d174614610a1057600080fd5b8063d4ddce8a116100d1578063d4ddce8a14610949578063d864e74014610969578063d96a094a14610989578063e7a324dc1461099c57600080fd5b8063c3cda520146108e9578063c87b56dd14610909578063ca4b208b1461092957600080fd5b806395d89b4111610164578063b4b5ea571161013e578063b4b5ea5714610855578063b50cbd9f14610875578063b88d4fde146108a9578063bddae40e146108c957600080fd5b806395d89b41146107c9578063a22cb465146107de578063a4a28168146107fe57600080fd5b8063864a28ec11610195578063864a28ec146107765780638a4068dd146107965780638da5cb5b146107ab57600080fd5b8063782d6fe1146106fb5780637ecebe0014610733578063864781221461076057600080fd5b8063313ce5671161028a5780635ac1e3bb11610233578063684931ed1161020d578063684931ed1461065e5780636fcfff451461067e57806370a08231146106c6578063715018a6146106e657600080fd5b80635ac1e3bb146105fe5780635c19a95c1461061e5780636352211e1461063e57600080fd5b806342966c681161026457806342966c681461059e5780634f6ccce7146105be578063587cde1e146105de57600080fd5b8063313ce567146105415780633c35a0c11461056857806342842e0e1461057e57600080fd5b80631249c58b116102f757806323b872dd116102d157806323b872dd146104cc5780632f745c59146104ec578063303e74df1461050c5780633053ea2b1461052c57600080fd5b80631249c58b1461046e57806318160ddd1461048357806320606b701461049857600080fd5b806306fdde031161032857806306fdde03146103f2578063081812fc14610414578063095ea7b31461044c57600080fd5b806301ffc9a71461034f578063026833c71461038457806303e65c96146103d3575b600080fd5b34801561035b57600080fd5b5061036f61036a366004613db7565b610b8d565b60405190151581526020015b60405180910390f35b34801561039057600080fd5b50601654601754601854601954601a546103ab949392919085565b604080519586526020860194909452928401919091526060830152608082015260a00161037b565b3480156103df57600080fd5b506014545b60405190815260200161037b565b3480156103fe57600080fd5b50610407610bd1565b60405161037b9190614053565b34801561042057600080fd5b5061043461042f366004613f1f565b610c63565b6040516001600160a01b03909116815260200161037b565b34801561045857600080fd5b5061046c610467366004613cf2565b610cfd565b005b34801561047a57600080fd5b506103e4610e2f565b34801561048f57600080fd5b506009546103e4565b3480156104a457600080fd5b506103e47f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a86681565b3480156104d857600080fd5b5061046c6104e7366004613bcf565b610f24565b3480156104f857600080fd5b506103e4610507366004613cf2565b610fab565b34801561051857600080fd5b50601054610434906001600160a01b031681565b34801561053857600080fd5b5061046c611053565b34801561054d57600080fd5b50610556600081565b60405160ff909116815260200161037b565b34801561057457600080fd5b506103e460155481565b34801561058a57600080fd5b5061046c610599366004613bcf565b61109c565b3480156105aa57600080fd5b5061046c6105b9366004613f1f565b6110b7565b3480156105ca57600080fd5b506103e46105d9366004613f1f565b611148565b3480156105ea57600080fd5b506104346105f9366004613b5c565b6111ec565b34801561060a57600080fd5b50610407610619366004613f1f565b61121e565b34801561062a57600080fd5b5061046c610639366004613b5c565b6113a3565b34801561064a57600080fd5b50610434610659366004613f1f565b6113c1565b34801561066a57600080fd5b50601154610434906001600160a01b031681565b34801561068a57600080fd5b506106b1610699366004613b5c565b600d6020526000908152604090205463ffffffff1681565b60405163ffffffff909116815260200161037b565b3480156106d257600080fd5b506103e46106e1366004613b5c565b61144c565b3480156106f257600080fd5b5061046c6114e6565b34801561070757600080fd5b5061071b610716366004613cf2565b61154c565b6040516001600160601b03909116815260200161037b565b34801561073f57600080fd5b506103e461074e366004613b5c565b600e6020526000908152604090205481565b34801561076c57600080fd5b506103e460145481565b34801561078257600080fd5b5061046c610791366004613e5f565b6117ec565b3480156107a257600080fd5b5061046c6118e6565b3480156107b757600080fd5b506000546001600160a01b0316610434565b3480156107d557600080fd5b5061040761197b565b3480156107ea57600080fd5b5061046c6107f9366004613cbf565b61198a565b34801561080a57600080fd5b50610813611a4f565b60405161037b9190600060a082019050825182526020830151602083015260408301516040830152606083015160608301526080830151608083015292915050565b34801561086157600080fd5b5061071b610870366004613b5c565b611ab6565b34801561088157600080fd5b506104347f000000000000000000000000000000000000000000000000000000000000000081565b3480156108b557600080fd5b5061046c6108c4366004613c10565b611b34565b3480156108d557600080fd5b5061046c6108e4366004613b5c565b611bc2565b3480156108f557600080fd5b5061046c610904366004613d1e565b611c3e565b34801561091557600080fd5b50610407610924366004613f1f565b611f70565b34801561093557600080fd5b50601b54610434906001600160a01b031681565b34801561095557600080fd5b506103e4610964366004613f1f565b612098565b34801561097557600080fd5b50600f54610434906001600160a01b031681565b6103e4610997366004613f1f565b612123565b3480156109a857600080fd5b506103e47fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf81565b3480156109dc57600080fd5b5061071b6109eb366004613b5c565b6122e7565b3480156109fc57600080fd5b5061036f610a0b366004613b96565b612313565b348015610a1c57600080fd5b506013546103e4565b348015610a3157600080fd5b50610a9f610a40366004613f1f565b60126020526000908152604090205465ffffffffffff80821691660100000000000081048216916c01000000000000000000000000820481169172010000000000000000000000000000000000008104821691600160c01b9091041685565b6040805165ffffffffffff968716815294861660208601529285169284019290925283166060830152909116608082015260a00161037b565b348015610ae457600080fd5b50610b29610af3366004613d80565b600c60209081526000928352604080842090915290825290205463ffffffff81169064010000000090046001600160601b031682565b6040805163ffffffff90931683526001600160601b0390911660208301520161037b565b348015610b5957600080fd5b5061046c610b68366004613b5c565b612411565b348015610b7957600080fd5b5061046c610b88366004613b5c565b6124f0565b60006001600160e01b031982167f780e9d63000000000000000000000000000000000000000000000000000000001480610bcb5750610bcb82612624565b92915050565b606060018054610be0906142e1565b80601f0160208091040260200160405190810160405280929190818152602001828054610c0c906142e1565b8015610c595780601f10610c2e57610100808354040283529160200191610c59565b820191906000526020600020905b815481529060010190602001808311610c3c57829003601f168201915b5050505050905090565b6000818152600360205260408120546001600160a01b0316610ce15760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600560205260409020546001600160a01b031690565b6000610d08826113c1565b9050806001600160a01b0316836001600160a01b03161415610d925760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e6560448201527f72000000000000000000000000000000000000000000000000000000000000006064820152608401610cd8565b336001600160a01b0382161480610dae5750610dae8133612313565b610e205760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610cd8565b610e2a83836126bf565b505050565b600080546001600160a01b03163314610e8a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b60135415610eda5760405162461bcd60e51b815260206004820152600f60248201527f4669727374206d696e74206f6e6c7900000000000000000000000000000000006044820152606401610cd8565b610f08610eef6000546001600160a01b031690565b60138054906000610eff8361431c565b9190505561272d565b5060138054610f1f913091906000610eff8361431c565b905090565b610f2e33826129b6565b610fa05760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f7665640000000000000000000000000000006064820152608401610cd8565b610e2a838383612a8d565b6000610fb68361144c565b821061102a5760405162461bcd60e51b815260206004820152602b60248201527f455243373231456e756d657261626c653a206f776e657220696e646578206f7560448201527f74206f6620626f756e64730000000000000000000000000000000000000000006064820152608401610cd8565b506001600160a01b03919091166000908152600760209081526040808320938352929052205490565b6000601454426110639190614259565b601a549091508111156110825761108260016013546105b99190614259565b60138054611098913091906000610eff8361431c565b5050565b610e2a83838360405180602001604052806000815250611b34565b6000546001600160a01b031633146111115760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b61111a81612c4c565b60405181907f806be94a2ac8b92d74e99aa8add5a8e54528a01ec914a9e00d201a6480ed986390600090a250565b600061115360095490565b82106111c75760405162461bcd60e51b815260206004820152602c60248201527f455243373231456e756d657261626c653a20676c6f62616c20696e646578206f60448201527f7574206f6620626f756e647300000000000000000000000000000000000000006064820152608401610cd8565b600982815481106111da576111da61438d565b90600052602060002001549050919050565b6001600160a01b038082166000908152600b602052604081205490911680156112155780611217565b825b9392505050565b6000818152600360205260409020546060906001600160a01b03166112995760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b60006112a483612cf3565b90506000816040516020016112b99190613f64565b60405160208183030381529060405290506000826040516020016112dd9190613f97565b60408051601f1981840301815282825260105460008981526012602052929092207f87db11bd0000000000000000000000000000000000000000000000000000000084529093506001600160a01b03909116916387db11bd916113469186918691600401614066565b60006040518083038186803b15801561135e57600080fd5b505afa158015611372573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f1916820160405261139a9190810190613df1565b95945050505050565b6001600160a01b0381166113b45750335b6113be3382612e25565b50565b6000818152600360205260408120546001600160a01b031680610bcb5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201527f656e7420746f6b656e00000000000000000000000000000000000000000000006064820152608401610cd8565b60006001600160a01b0382166114ca5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a6560448201527f726f2061646472657373000000000000000000000000000000000000000000006064820152608401610cd8565b506001600160a01b031660009081526004602052604090205490565b6000546001600160a01b031633146115405760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b61154a6000612ea5565b565b60004382106115c35760405162461bcd60e51b815260206004820152603760248201527f455243373231436865636b706f696e7461626c653a3a6765745072696f72566f60448201527f7465733a206e6f74207965742064657465726d696e65640000000000000000006064820152608401610cd8565b6001600160a01b0383166000908152600d602052604090205463ffffffff16806115f1576000915050610bcb565b6001600160a01b0384166000908152600c602052604081208491611616600185614270565b63ffffffff9081168252602082019290925260400160002054161161168a576001600160a01b0384166000908152600c6020526040812090611659600184614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03169150610bcb9050565b6001600160a01b0384166000908152600c6020908152604080832083805290915290205463ffffffff168310156116c5576000915050610bcb565b6000806116d3600184614270565b90505b8163ffffffff168163ffffffff1611156117a657600060026116f88484614270565b6117029190614217565b61170c9083614270565b6001600160a01b0388166000908152600c6020908152604080832063ffffffff8581168552908352928190208151808301909252549283168082526401000000009093046001600160601b03169181019190915291925087141561177a57602001519450610bcb9350505050565b805163ffffffff168711156117915781935061179f565b61179c600183614270565b92505b50506116d6565b506001600160a01b0385166000908152600c6020908152604080832063ffffffff909416835292905220546001600160601b036401000000009091041691505092915050565b6000546001600160a01b031633146118465760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b60208101518151116118c05760405162461bcd60e51b815260206004820152602760248201527f4d6178207072696365206d757374206265206c6172676572207468616e204d6960448201527f6e205072696365000000000000000000000000000000000000000000000000006064820152608401610cd8565b805160165560208101516017556040810151601855606081015160195560800151601a55565b6000546001600160a01b031633146119405760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b600f546040516001600160a01b039091169081904780156108fc02916000818181858888f19350505050158015611098573d6000803e3d6000fd5b606060028054610be0906142e1565b6001600160a01b0382163314156119e35760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610cd8565b3360008181526006602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b611a816040518060a0016040528060008152602001600081526020016000815260200160008152602001600081525090565b506040805160a08101825260165481526017546020820152601854918101919091526019546060820152601a54608082015290565b6001600160a01b0381166000908152600d602052604081205463ffffffff1680611ae1576000611217565b6001600160a01b0383166000908152600c6020526040812090611b05600184614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03169392505050565b611b3e33836129b6565b611bb05760405162461bcd60e51b815260206004820152603160248201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f60448201527f776e6572206e6f7220617070726f7665640000000000000000000000000000006064820152608401610cd8565b611bbc84848484612ef5565b50505050565b6000546001600160a01b03163314611c1c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b600f80546001600160a01b0319166001600160a01b0392909216919091179055565b60007f8cad95687ba82c2ce50e74f7b754645e5117c3a5bec8151c0726d5857980a866611c69610bd1565b80519060200120611c774690565b60408051602080820195909552808201939093526060830191909152306080808401919091528151808403909101815260a0830182528051908401207fe48329057bfd03d55e49b547132e39cffd9c1820ad7b9d4c5307691425d15adf60c08401526001600160a01b038b1660e084015261010083018a90526101208084018a9052825180850390910181526101408401909252815191909301207f1901000000000000000000000000000000000000000000000000000000000000610160830152610162820183905261018282018190529192506000906101a20160408051601f198184030181528282528051602091820120600080855291840180845281905260ff8a169284019290925260608301889052608083018790529092509060019060a0016020604051602081039080840390855afa158015611dbe573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b038116611e475760405162461bcd60e51b815260206004820152603660248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a20696e76616c6964207369676e6174757265000000000000000000006064820152608401610cd8565b6001600160a01b0381166000908152600e60205260408120805491611e6b8361431c565b919050558914611ee35760405162461bcd60e51b815260206004820152603260248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a20696e76616c6964206e6f6e636500000000000000000000000000006064820152608401610cd8565b87421115611f595760405162461bcd60e51b815260206004820152603660248201527f455243373231436865636b706f696e7461626c653a3a64656c6567617465427960448201527f5369673a207369676e61747572652065787069726564000000000000000000006064820152608401610cd8565b611f63818b612e25565b505050505b505050505050565b6000818152600360205260409020546060906001600160a01b0316611feb5760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b6010546000838152601260205260409081902090517f3cfdafd30000000000000000000000000000000000000000000000000000000081526001600160a01b0390921691633cfdafd391612044918691906004016140d6565b60006040518083038186803b15801561205c57600080fd5b505afa158015612070573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bcb9190810190613df1565b6000818152600360205260408120546001600160a01b03166121105760405162461bcd60e51b815260206004820152602b60248201527f4e6f756e73546f6b656e3a2055524920717565727920666f72206e6f6e65786960448201526a39ba32b73a103a37b5b2b760a91b6064820152608401610cd8565b506000908152601c602052604090205490565b60008061212f836113c1565b905033600061213c612f7e565b90506001600160a01b03831630146121965760405162461bcd60e51b815260206004820152601960248201527f4f776e6572206973206e6f742074686520636f6e7472616374000000000000006044820152606401610cd8565b60016013546121a59190614259565b85146121f35760405162461bcd60e51b815260206004820152600f60248201527f4e6f74206c6174657374204e6f756e00000000000000000000000000000000006044820152606401610cd8565b803410156122435760405162461bcd60e51b815260206004820152601f60248201527f4d7573742073656e64206174206c656173742063757272656e745072696365006044820152606401610cd8565b6000858152601c6020526040902034905561225e8286612ff9565b600a60135461226d9190614337565b61229357601b5460138054612291926001600160a01b0316916000610eff8361431c565b505b6040516001600160a01b038316815285907ff3919fe9a709ec82fb9fd1c54a2af7cf717bfe52a6c9b1f1ed8ea42d52ba392f9060200160405180910390a26013805461139a913091906000610eff8361431c565b6000610bcb6122f58361144c565b6040518060600160405280603d815260200161445f603d91396131a5565b6040517fc45527910000000000000000000000000000000000000000000000000000000081526001600160a01b038381166004830152600091818416917f0000000000000000000000000000000000000000000000000000000000000000169063c45527919060240160206040518083038186803b15801561239457600080fd5b505afa1580156123a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906123cc9190613b79565b6001600160a01b031614156123e357506001610bcb565b6001600160a01b0380841660009081526006602090815260408083209386168352929052205460ff16611217565b6000546001600160a01b0316331461246b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b6001600160a01b0381166124e75760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610cd8565b6113be81612ea5565b6000546001600160a01b0316331461254a5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610cd8565b601b80546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160a01b0383166125c7576125c281600980546000838152600a60205260408120829055600182018355919091527f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af0155565b6125ea565b816001600160a01b0316836001600160a01b0316146125ea576125ea83826131dd565b6001600160a01b03821661260157610e2a8161327a565b826001600160a01b0316826001600160a01b031614610e2a57610e2a8282613329565b60006001600160e01b031982167f80ac58cd00000000000000000000000000000000000000000000000000000000148061268757506001600160e01b031982167f5b5e139f00000000000000000000000000000000000000000000000000000000145b80610bcb57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b0319831614610bcb565b600081815260056020526040902080546001600160a01b0319166001600160a01b03841690811790915581906126f4826113c1565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6011546010546040517f422e2e99000000000000000000000000000000000000000000000000000000008152600481018490526001600160a01b0391821660248201526000928392169063422e2e999060440160a06040518083038186803b15801561279857600080fd5b505afa1580156127ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906127d09190613eaf565b6000848152601260209081526040918290208351815485840151868601516060808901516080998a015165ffffffffffff9687166bffffffffffffffffffffffff199096169590951766010000000000009487168502177fffffffffffffffff000000000000000000000000ffffffffffffffffffffffff166c0100000000000000000000000093871684027fffffffffffffffff000000000000ffffffffffffffffffffffffffffffffffff161772010000000000000000000000000000000000009187168202177fffff000000000000ffffffffffffffffffffffffffffffffffffffffffffffff8116600160c01b9688168702908117988990558a5160a081018c5291881690881617815293870486169784019790975290850484169682019690965293830482169484019490945292900490911691810191909152905061291961336d565b61293561292e6000546001600160a01b031690565b85856133a8565b827f1106ee9d020bfbb5ee34cf5535a5fbf024a011bd130078088cbf124ab3092478826040516129a69190815165ffffffffffff9081168252602080840151821690830152604080840151821690830152606080840151821690830152608092830151169181019190915260a00190565b60405180910390a2509092915050565b6000818152600360205260408120546001600160a01b0316612a2f5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610cd8565b6000612a3a836113c1565b9050806001600160a01b0316846001600160a01b03161480612a755750836001600160a01b0316612a6a84610c63565b6001600160a01b0316145b80612a855750612a858185612313565b949350505050565b826001600160a01b0316612aa0826113c1565b6001600160a01b031614612b1c5760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f74206f776e00000000000000000000000000000000000000000000006064820152608401610cd8565b6001600160a01b038216612b7e5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610cd8565b612b8983838361353e565b612b946000826126bf565b6001600160a01b0383166000908152600460205260408120805460019290612bbd908490614259565b90915550506001600160a01b0382166000908152600460205260408120805460019290612beb9084906141a1565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000612c57826113c1565b9050612c658160008461353e565b612c706000836126bf565b6001600160a01b0381166000908152600460205260408120805460019290612c99908490614259565b909155505060008281526003602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b606081612d3357505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b8115612d5d5780612d478161431c565b9150612d569050600a83614203565b9150612d37565b60008167ffffffffffffffff811115612d7857612d786143a3565b6040519080825280601f01601f191660200182016040528015612da2576020820181803683370190505b5090505b8415612a8557612db7600183614259565b9150612dc4600a86614337565b612dcf9060306141a1565b60f81b818381518110612de457612de461438d565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350612e1e600a86614203565b9450612da6565b6000612e30836111ec565b6001600160a01b038481166000818152600b602052604080822080546001600160a01b031916888616908117909155905194955093928516927f3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f9190a46000612e98846122e7565b9050611bbc828483613561565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b612f00848484612a8d565b612f0c8484848461370f565b611bbc5760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610cd8565b60008060145442612f8f9190614259565b601954909150811015612fa457505060165490565b60185460195460009190612fb89084614203565b612fc2919061423a565b601754601654919250612fd491614259565b8110612fe4575050601754919050565b601654612ff2908290614259565b9250505090565b3080613004836113c1565b6001600160a01b0316146130805760405162461bcd60e51b815260206004820152602d60248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201527f73206e6f742061646472657373000000000000000000000000000000000000006064820152608401610cd8565b6001600160a01b0383166130e25760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610cd8565b6130ed81848461353e565b6001600160a01b0381166000908152600460205260408120805460019290613116908490614259565b90915550506001600160a01b03831660009081526004602052604081208054600192906131449084906141a1565b909155505060008281526003602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6000816c0100000000000000000000000084106131d55760405162461bcd60e51b8152600401610cd89190614053565b509192915050565b600060016131ea8461144c565b6131f49190614259565b600083815260086020526040902054909150808214613247576001600160a01b03841660009081526007602090815260408083208584528252808320548484528184208190558352600890915290208190555b5060009182526008602090815260408084208490556001600160a01b039094168352600781528383209183525290812055565b60095460009061328c90600190614259565b6000838152600a6020526040812054600980549394509092849081106132b4576132b461438d565b9060005260206000200154905080600983815481106132d5576132d561438d565b6000918252602080832090910192909255828152600a9091526040808220849055858252812055600980548061330d5761330d614377565b6001900381819060005260206000200160009055905550505050565b60006133348361144c565b6001600160a01b039093166000908152600760209081526040808320868452825280832085905593825260089052919091209190915550565b4260148190556040519081527f821964bd9a1d2293691ad21ae7e91848254493a40c1c13fc88e032e6a14a94c99060200160405180910390a1565b6001600160a01b0382166133fe5760405162461bcd60e51b815260206004820181905260248201527f4552433732313a206d696e7420746f20746865207a65726f20616464726573736044820152606401610cd8565b6000818152600360205260409020546001600160a01b0316156134635760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20616c7265616479206d696e746564000000006044820152606401610cd8565b61346f6000838361353e565b6001600160a01b03821660009081526004602052604081208054600192906134989084906141a1565b909155505060008181526003602052604080822080546001600160a01b0319166001600160a01b03868116919091179091559051839291861691907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a480826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b61354983838361256c565b610e2a613555846111ec565b61355e846111ec565b60015b816001600160a01b0316836001600160a01b03161415801561358c57506000816001600160601b0316115b15610e2a576001600160a01b03831615613652576001600160a01b0383166000908152600d602052604081205463ffffffff1690816135cc576000613619565b6001600160a01b0385166000908152600c60205260408120906135f0600185614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b90506000613640828560405180606001604052806037815260200161449c60379139613872565b905061364e868484846138b4565b5050505b6001600160a01b03821615610e2a576001600160a01b0382166000908152600d602052604081205463ffffffff16908161368d5760006136da565b6001600160a01b0384166000908152600c60205260408120906136b1600185614270565b63ffffffff16815260208101919091526040016000205464010000000090046001600160601b03165b9050600061370182856040518060600160405280603681526020016143e560369139613acc565b9050611f68858484846138b4565b60006001600160a01b0384163b1561386757604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290613753903390899088908890600401614017565b602060405180830381600087803b15801561376d57600080fd5b505af192505050801561379d575060408051601f3d908101601f1916820190925261379a91810190613dd4565b60015b61384d573d8080156137cb576040519150601f19603f3d011682016040523d82523d6000602084013e6137d0565b606091505b5080516138455760405162461bcd60e51b815260206004820152603260248201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560448201527f63656976657220696d706c656d656e74657200000000000000000000000000006064820152608401610cd8565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050612a85565b506001949350505050565b6000836001600160601b0316836001600160601b0316111582906138a95760405162461bcd60e51b8152600401610cd89190614053565b50612a858385614295565b60006138d84360405180608001604052806044815260200161441b60449139613b19565b905060008463ffffffff1611801561393257506001600160a01b0385166000908152600c6020526040812063ffffffff831691613916600188614270565b63ffffffff908116825260208201929092526040016000205416145b156139b6576001600160a01b0385166000908152600c60205260408120839161395c600188614270565b63ffffffff168152602081019190915260400160002080546001600160601b0392909216640100000000027fffffffffffffffffffffffffffffffff000000000000000000000000ffffffff909216919091179055613a77565b60408051808201825263ffffffff80841682526001600160601b0380861660208085019182526001600160a01b038b166000908152600c82528681208b8616825290915294909420925183549451909116640100000000027fffffffffffffffffffffffffffffffff00000000000000000000000000000000909416911617919091179055613a468460016141b9565b6001600160a01b0386166000908152600d60205260409020805463ffffffff191663ffffffff929092169190911790555b604080516001600160601b038086168252841660208201526001600160a01b038716917fdec2bacdd2f05b59de34da9b523dff8be42e5e38e818c82fdb0bae774387a724910160405180910390a25050505050565b600080613ad984866141e1565b9050846001600160601b0316816001600160601b031610158390613b105760405162461bcd60e51b8152600401610cd89190614053565b50949350505050565b60008164010000000084106131d55760405162461bcd60e51b8152600401610cd89190614053565b805165ffffffffffff81168114613b5757600080fd5b919050565b600060208284031215613b6e57600080fd5b8135611217816143b9565b600060208284031215613b8b57600080fd5b8151611217816143b9565b60008060408385031215613ba957600080fd5b8235613bb4816143b9565b91506020830135613bc4816143b9565b809150509250929050565b600080600060608486031215613be457600080fd5b8335613bef816143b9565b92506020840135613bff816143b9565b929592945050506040919091013590565b60008060008060808587031215613c2657600080fd5b8435613c31816143b9565b93506020850135613c41816143b9565b925060408501359150606085013567ffffffffffffffff811115613c6457600080fd5b8501601f81018713613c7557600080fd5b8035613c88613c8382614179565b614148565b818152886020838501011115613c9d57600080fd5b8160208401602083013760006020838301015280935050505092959194509250565b60008060408385031215613cd257600080fd5b8235613cdd816143b9565b915060208301358015158114613bc457600080fd5b60008060408385031215613d0557600080fd5b8235613d10816143b9565b946020939093013593505050565b60008060008060008060c08789031215613d3757600080fd5b8635613d42816143b9565b95506020870135945060408701359350606087013560ff81168114613d6657600080fd5b9598949750929560808101359460a0909101359350915050565b60008060408385031215613d9357600080fd5b8235613d9e816143b9565b9150602083013563ffffffff81168114613bc457600080fd5b600060208284031215613dc957600080fd5b8135611217816143ce565b600060208284031215613de657600080fd5b8151611217816143ce565b600060208284031215613e0357600080fd5b815167ffffffffffffffff811115613e1a57600080fd5b8201601f81018413613e2b57600080fd5b8051613e39613c8382614179565b818152856020838501011115613e4e57600080fd5b61139a8260208301602086016142b5565b600060a08284031215613e7157600080fd5b613e7961411f565b82358152602083013560208201526040830135604082015260608301356060820152608083013560808201528091505092915050565b600060a08284031215613ec157600080fd5b613ec961411f565b613ed283613b41565b8152613ee060208401613b41565b6020820152613ef160408401613b41565b6040820152613f0260608401613b41565b6060820152613f1360808401613b41565b60808201529392505050565b600060208284031215613f3157600080fd5b5035919050565b60008151808452613f508160208601602086016142b5565b601f01601f19169290920160200192915050565b6a02737bab7103637bb32b9160ad1b815260008251613f8a81600b8501602087016142b5565b91909101600b0192915050565b6a02737bab7103637bb32b9160ad1b815260008251613fbd81600b8501602087016142b5565b7f20697320612066756e206f6620746865204e6f756e732044414f20616e64204e600b9390910192830152507f6f756e732041727420466573746976616c000000000000000000000000000000602b820152603c01919050565b60006001600160a01b038087168352808616602084015250836040830152608060608301526140496080830184613f38565b9695505050505050565b6020815260006112176020830184613f38565b60e08152600061407960e0830186613f38565b828103602084015261408b8186613f38565b915050612a856040830184805465ffffffffffff8082168452808260301c166020850152808260601c166040850152808260901c166060850152808260c01c16608085015250505050565b828152815465ffffffffffff8082166020840152603082901c81166040840152606082811c821690840152609082901c8116608084015260c091821c1660a08301528101611217565b60405160a0810167ffffffffffffffff81118282101715614142576141426143a3565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715614171576141716143a3565b604052919050565b600067ffffffffffffffff821115614193576141936143a3565b50601f01601f191660200190565b600082198211156141b4576141b461434b565b500190565b600063ffffffff8083168185168083038211156141d8576141d861434b565b01949350505050565b60006001600160601b038083168185168083038211156141d8576141d861434b565b60008261421257614212614361565b500490565b600063ffffffff8084168061422e5761422e614361565b92169190910492915050565b60008160001904831182151516156142545761425461434b565b500290565b60008282101561426b5761426b61434b565b500390565b600063ffffffff8381169083168181101561428d5761428d61434b565b039392505050565b60006001600160601b038381169083168181101561428d5761428d61434b565b60005b838110156142d05781810151838201526020016142b8565b83811115611bbc5750506000910152565b600181811c908216806142f557607f821691505b6020821081141561431657634e487b7160e01b600052602260045260246000fd5b50919050565b60006000198214156143305761433061434b565b5060010190565b60008261434657614346614361565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052603160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146113be57600080fd5b6001600160e01b0319811681146113be57600080fdfe455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e74206f766572666c6f7773455243373231436865636b706f696e7461626c653a3a5f7772697465436865636b706f696e743a20626c6f636b206e756d62657220657863656564732033322062697473455243373231436865636b706f696e7461626c653a3a766f746573546f44656c65676174653a20616d6f756e7420657863656564732039362062697473455243373231436865636b706f696e7461626c653a3a5f6d6f766544656c6567617465733a20616d6f756e7420756e646572666c6f7773a264697066735822122057fdd914ff699d91ab97f68752982d596dca9304662b8326e9fedeb8bf02527a64736f6c63430008060033",
  linkReferences: {},
  deployedLinkReferences: {},
};
export default abi;
