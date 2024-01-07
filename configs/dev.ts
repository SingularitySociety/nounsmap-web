export const firebaseConfig = {
  apiKey: "AIzaSyD06LTp_w__4yULKReZYDQdPXH8FRVfeAg",
  authDomain: "nounsmap-web-dev.firebaseapp.com",
  projectId: "nounsmap-web-dev",
  storageBucket: "nounsmap-web-dev.appspot.com",
  messagingSenderId: "921564152867",
  appId: "1:921564152867:web:f52be744b25a8648059d96",
  measurementId: "G-8HBS0HJ881",
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
  icon_size: 40,
  nouns_icon_h: 15,
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
  validTokenContracts: [
    {
      name: "NounsDaoJapan",
      chainId: "0x1",
      contractAddress: "0x898a7dbfddf13962df089fbc8f069fa7ce92cdbb",
      openseaUrl: "https://opensea.io/assets/ethereum",
      filter: null,
      idmask: 0,
    },
    {
      name: "NounsBatonRelay",
      chainId: "0x1",
      contractAddress: "0x34758B0D303608B05B0BF6A35714162ac8797DC2",
      openseaUrl: "https://opensea.io/assets/ethereum",
      filter: null,
      idmask: 0,
    },
    {
      name: "NamedNoun(polygon)",
      chainId: "0x89",
      contractAddress: "0x2953399124F0cBB46d2CbACD8A89cF0599974963",
      openseaUrl: "https://opensea.io/assets/matic",
      filter:
        "0x4e4cd175f812f1ba784a69c1f8ac8daa52ad7e2b000000000000010000000001",
      idmask: 12,
    },
  ],
};

export const ContentsContract = {
  name: "ContentsToken(testnets)",
  chainId: "0x4",
  network: "rinkeby",
  wabi: require("../abi/ContentsToken.json"), // wrapped abi
  address: "0xdc21b1FDAb45002AFEB117Ba146683AbB01BD040",
  group: "photo",
  category: "",
  width: 512,
  height: 512,
  openseaUrl: "https://testnets.opensea.io/assets/rinkeby/",
  alchemyUrl: "https://eth-rinkeby.alchemyapi.io/v2/",
  authorityToken: "0x1602155eB091F863e7e776a83e1c330c828ede19", //nouns love
  authorityTokenName: "NounsLove(TestNets)", //nouns love
  authorityTokenFilter: null,
  authorityTokenIdmask: 0,
};

export const featureConfig = {
  enableNFTReq: false,
};

export const supportingEvents = [
  {
    eventId: 0,
    name: {
      ja: "自分の記録",
      en: "self history",
    },
    lat:35.9910113,
    lng:139.769615,
    zoom:8.4,    
    expired: 0,
  },
  {
    eventId: 1,
    name: {
      ja: "nouns全国バトンリレー",
      en: "nousns All Japan baton relay",
    },
    lat:35.9910113,
    lng:139.769615,
    zoom:8.4,    
    expired: 90,
  },
  {
    eventId: 2,
    name: {
      ja: "今日のNouns",
      en: "Daily Nouns",
    },
    lat:35.9910113,
    lng:139.769615,
    zoom:8.4,    
    expired: 1,
  },
  {
    eventId: 3,
    name: {
      ja: "nounsバトンリレー北海道・東北!",
      en: "nousns baton relay HOKKAIDO/TOHOKU",
    },
    lat:40.8325873,
    lng:140.3115816,
    zoom:6.5,
    expired: 90,
  },
  {
    eventId: 5,
    name: {
      ja: "nounsバトンリレー関東!",
      en: "nousns baton relay KANTO",
    },
    lat:35.9910113,
    lng:139.769615,
    zoom:8.4,
    expired: 90,
  },
  {
    eventId: 6,
    name: {
      ja: "nounsバトンリレー中部!",
      en: "nousns baton relay CHUBU",
    },
    lat:36.153819,
    lng:137.1862116,
    zoom:8.1,
    expired: 90,
  },
  {
    eventId: 7,
    name: {
      ja: "nounsバトンリレー近畿!",
      en: "nousns baton relay KINKI",
    },
    lat:34.9430808,
    lng:135.7382852,
    zoom:8.2,
    expired: 90,
  },
  {
    eventId: 8,
    name: {
      ja: "nounsバトンリレー中国、四国!",
      en: "nousns baton relay CHUGOKU SIKOKU",
    },
    lat:34.3055142,
    lng:133.3779946,
    zoom:8.1,
    expired: 90,
  },
  {
    eventId: 9,
    name: {
      ja: "nounsバトンリレー九州・沖縄!",
      en: "nousns baton relay KYUSHU OKINAWA",
    },
    lat:30.0528169,
    lng:127.5497001,
    zoom:6.7,
    expired: 90,
  },  
];

export const playbackConfig = {
  wait: 8, //secs
  defaultZoom: 7,
  animateStep: 15,
  animateSec: 1,
};
