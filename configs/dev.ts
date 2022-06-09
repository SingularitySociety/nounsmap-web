export const firebaseConfig = {
  apiKey: "AIzaSyD06LTp_w__4yULKReZYDQdPXH8FRVfeAg",
  authDomain: "nounsmap-web-dev.firebaseapp.com",
  projectId: "nounsmap-web-dev",
  storageBucket: "nounsmap-web-dev.appspot.com",
  messagingSenderId: "921564152867",
  appId: "1:921564152867:web:f52be744b25a8648059d96",
  measurementId: "G-8HBS0HJ881"
};

export const nounsMapConfig = {
  siteName: "NounsMapWeb",
  pageTitle: "NounsMap",
  siteDescription: "find world with Nouns",
  region: "JP",
  hostName: "dev.nounsmap.com",
  introduction: "Comming soon. NOOOOOOOOOOOOOUNS map!!",
  useEmulator: false,
};

export const ethereumConfig = {
  contracts:[
    {
      name:"NounsLove(testnets)",
      chainId: "0x4", 
      contractAddress: "0x1602155eB091F863e7e776a83e1c330c828ede19",
      openseaUrl: "https://testnets.opensea.io/assets/rinkeby",
      filter: null,
    },
    {
      name:"NamedNoun(polygon)",
      chainId: "0x89", 
      contractAddress: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      openseaUrl: "https://opensea.io/assets/matic",
      filter: "https://nounsfes",
    },
  ]
};
