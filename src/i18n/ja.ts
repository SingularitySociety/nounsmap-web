import languages from "./languages";

const lang = {
  menu: {
    map: "地図",
    upload: "写真投稿",
    user: "ユーザー",
  },
  label: {
    name: "名前",
    description: "説明",
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
