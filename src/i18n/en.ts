import languages from "./languages";

const lang = {
  menu: {
    map: "Map",
    nft: "NFT photos",
    upload: "Upload",
    user: "User",
    nftRequest: "NFT Request contents",
    nftMinted: "NFT Minted contents",
  },
  function: {
    requestAccount: "Connect MetaMask",
    fetchNFT: "Refresh!",
    signinTwitter: "SignIn(Twitter)",
    signinWallet: "SignIn(Wallet)",
    signout: "SignOut",
    trynow: "Start!",
    tryphoto: "Upload now!",
    requestNFT: "Request to make NFT!",
  },
  label: {
    name: "title",
    description: "description",
    event: "event",
    viewEvent: "viewing",
    showPhoto: "photos",
    creator: "creator",
    mint: "Mint",
    mintNotHasAuthority: "Mint(AuthorityToken needed)",
    minting: "Minting,,",
    syncing: "NFT contents syncing,,",
    requestCount: "Rquest count",
    nftCount: "NFT Photo count",
    nftOwnCount: "Your owned NFT Photo count",
    downloadOriginal: "Get Download Link of Original photo!",
    downloadLink: "Download Original quality photo!",
  },
  message: {
    hello: "hello world",
    guidesignin: "You can share(Tweet) photo with maps, Try it now!",
    guidephoto:
      "Click on the above button to upload your photos. Or try it with following button now!",
    pleasesignin:
      "Please SignIn. (If you want to convert your photos to NFT, please log in with MetaMask)",
    selectImage: "Select image",
    uploadImage: "Upload Image!",
    spotPrivacyLevel: "SpotPrivacyLevel",
    shareTwitter: "Share(Twitter)!!",
    processing: "Processing...",
    selectPhotoLocation:
      "Please move the map so that the location of the photo is in the center.",
    selectContract: "Please select your NFT token contract",
    selectToken: "Please select your Token",
    youNeedMeta: "Please install MetaMask.",
    youNeedNet: "You need to connect to {networkName}",
    youDonthaveToken: 'If you have tokens of "{tokenName}", you can select it!',
    NFTuploadTitle: "Will you request to make this photo to NFT?",
    NFTuploadDetail:
      "To make this photo to  NFT, please upload original imgae again (upload time depends on original photo quality, size), and input NFT title and description which is show with NFT.",
    NFTAlreadyRequested:
      "you already requested this contents. please go to NFT menu to check",
    nftFileError: "please select original image file",
    nameError: "please input title",
    descError: "please input descriptio",
    nftRequestButton: "If You can request make NFT this photo.",
    nftRequestTitle: "Photo content that someone wants to be NFT",
    nftRequestDesc:
      "If you have a {tokenName}, the mint button below the photo is enabled and can support NFT conversion of the photo content (it costs gas).NFTed photos will be available for sale on OpenSea. For example, by distributing photos posted by people who have been affected by wars or disasters, we can directly support those who have been affected by the disaster. Please cooperate in NFT conversion of photos that you would like to support by carefully looking at the contents and explanations of the photos.",
    nftMintedTitle: "NFT Photo Contents",
    nftMintedDesc:
      "You can purchase photos at OpenSea by clicking on the photos below. When you become the owner of a photo and login with MetaMask, it will be displayed in the Owned NFT photo and you can download and use the original image.",
    mintCaution: "(You need to pay gas fee)",
    noAccount: "there are no Account",
    invalidNetwork: "invalid network: we neeed to connect ",
    switchNetwork: "Switch Network",
    justMint: "Thank you for minting. Please wait a little bit...",
    errorAccount:
      "You haven't loign with valid wallet, Please  Click top-right User menu, and logout once, and then login with MetaMask",
  },
  languages,
};

export default lang;
