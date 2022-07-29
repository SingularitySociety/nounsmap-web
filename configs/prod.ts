export const firebaseConfig = {
  apiKey: "AIzaSyB6Rj9kOnPlKG_aSOQT5_lGDBP01JmR-7U",
  authDomain: "nounsmap-web-prod.firebaseapp.com",
  projectId: "nounsmap-web-prod",
  storageBucket: "nounsmap-web-prod.appspot.com",
  messagingSenderId: "297116670466",
  appId: "1:297116670466:web:c00780dd6d818858bae51b",
  measurementId: "G-2TR3L7VH0H",
};

export const nounsMapConfig = {
  siteName: "NounsMapWeb",
  pageTitle: "NounsMap",
  siteDescription: "find world with Nouns",
  region: "JP",
  hostName: "nounsmap.com",
  introduction: "Comming soon. NOOOOOOOOOOOOOUNS map!!",
  useEmulator: false,
  alchemy: "9kNMUxVidDBUvCJUv41IUWE3_gXTZW9T",
};

export const defaultMapConfig = {
  lan: 35.6762, //tokyo
  lng: 139.6503, //tokyo
  zoom: 10, //for kanto area
  mapkey: "AIzaSyBmHcCaWNs095d-jz7iiCSOmNRCOFFYs4E",
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
      name: "NounsLove(testnets)",
      chainId: "0x4",
      contractAddress: "0x1602155eB091F863e7e776a83e1c330c828ede19",
      openseaUrl: "https://testnets.opensea.io/assets/rinkeby",
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
      ja: "日常の一コマ",
      en: "DailyPhotos",
    },
  },
  {
    eventId: 1,
    name: {
      ja: "nouns全国バトンリレー",
      en: "nousns All Japan baton relay",
    },
  },
];
