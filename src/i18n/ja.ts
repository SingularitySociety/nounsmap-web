import languages from "./languages";

const lang = {
  menu: {
    map: "地図",
    upload: "写真投稿",
    nft: "写真コンテンツ",
    nftRequest: "NFT要望写真コンテンツ",
    nftMinted: "NFT済み写真コンテンツ",
    user: "ユーザー",
  },
  label: {
    name: "タイトル",
    description: "説明",
    creator: "作者",
    mint: "ミント",
  },
  message: {
    hello: "こんにちは、世界",
    guidesignin:
      "地図情報付きの写真を簡単にTwitterで共有できます！  今すぐ試してみませんか？",
    guidephoto:
      "写真を投稿するには上記のボタンをクリック！　もしくは下記ボタンですぐに投稿できます！",
    pleasesignin: "ログイン方法を選んでください",
    selectImage: "画像を選んでください",
    uploadImage: "画像をアップロードしましょう!",
    shareTwitter: "Twitterにリンクを共有！",
    processing: "送信中です...",
    selectPhotoLocation: "写真の場所が中心になるように地図を移動してください",
    spotPrivacyLevel: "場所のプライバシーレベル",
    selectContract: "あなたのNFTの種類を選んでください",
    selectToken: "あなたのTokenを選んでください",
    youNeedMeta: "MetaMaskをインストールしてください.",
    youNeedNet: "{networkName}に切り替えてください",
    youDonthaveToken: '"{tokenName}"のNFTトークンを持っていると選択できます！',
    NFTuploadTitle: "この写真をNFTトークン化することをリクエストします",
    NFTuploadDetail:
      "写真のオリジナルファイルを再度アップロードしますので選択してください（ファイルサイズによりUpload時間がかかります）。NFTトークンとして表示される名前、説明も記入してください。",
    nftFileError: "オリジナルの画像を選択してください",
    nameError: "タイトルを入力してください",
    descError: "説明を入力してください",
    nftRequestTitle: "NFT化を希望する写真コンテンツ",
    nftRequestDesc:
      "あなたが{tokenName}を保持している場合、下記の写真の下のミントボタンが有効化されていて、写真コンテンツのNFT化をサポートすることができます（ガス代がかかります）。わたしたちは、写真の流通を通して戦争や、被災地のみなさんを直接支援したいとかんがえています。ご自身で写真の内容、説明をよく見てサポートしたいと写真にご協力ください。",
    nftMintedTitle: "NFT 写真コンテンツ",
    nftMintedDesc:
      "下記の写真をクリックした先のOpenSeaで写真を購入することができます。写真のOwnerになるとOwnerBoxに表示され元画像をDownload、利用することができます。",
    mintCaution: "（ガス代は発生します）",
  },
  function: {
    requestAccount: "MetaMaskと接続",
    fetchNFT: "再取得",
    signinTwitter: "ログイン(Twitter)",
    signinWallet: "ログイン(Wallet)",
    signout: "ログアウト",
    trynow: "使ってみる",
    tryphoto: "今すぐ投稿",
    requestNFT: "NFT化をリクエスト",
  },
  languages,
};

export default lang;
