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
  alchemy: "9kNMUxVidDBUvCJUv41IUWE3_gXTZW9T",
};

export const defaultMapConfig = {
  lan: 35.6762, //tokyo
  lng: 139.6503, //tokyo
  zoom: 10, //for kanto area
  mapkey: "AIzaSyC-sE86tDfCgxPjsx1heo2iwvDRgmOYsFo",
};

export const privacyCircleConfig = {
  pLevel: 5, //about 5km
  color: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillOpacity: 0.35,
  baseShiftRate: 0.1,
  kmToDeg: 1 / 50, //about 1degree = 0-111km
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
