export const firebaseConfig = {
  apiKey: "AIzaSyB6Rj9kOnPlKG_aSOQT5_lGDBP01JmR-7U",
  authDomain: "nounsmap-web-prod.firebaseapp.com",
  projectId: "nounsmap-web-prod",
  storageBucket: "nounsmap-web-prod.appspot.com",
  messagingSenderId: "297116670466",
  appId: "1:297116670466:web:c00780dd6d818858bae51b",
  measurementId: "G-2TR3L7VH0H"
};

export const nounsMapConfig = {
  siteName: "NounsMapWeb",
  pageTitle: "NounsMap",
  siteDescription: "find world with Nouns",
  region: "JP",
  hostName: "dev.nounsmap.com",
  introduction: "Comming soon. NOOOOOOOOOOOOOUNS map!!",
};

export const ethereumConfig = {
  validTokenContracts:[
    {
      name:"NounsLove(testnets)",
      chainId: "0x4", 
      contractAddress: "0x1602155eB091F863e7e776a83e1c330c828ede19",
      openseaUrl: "https://testnets.opensea.io/assets/rinkeby",
      filter: null,
      idmask: 0,
    },
    {
      name:"NamedNoun(polygon)",
      chainId: "0x89", 
      contractAddress: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      openseaUrl: "https://opensea.io/assets/matic",
      filter: "0x4e4cd175f812f1ba784a69c1f8ac8daa52ad7e2b000000000000010000000001",
      idmask: 12,
    },
  ]
};

