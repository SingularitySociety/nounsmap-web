import languages from "./languages";

const lang = {
  message: {
    hello: "こんにちは、世界",
    uploadImage: "画像をアップロードしましょう!",
    shareTwitter: "Twitterにリンクを共有！",
    processing: "送信中です...",
    selectPhotoLocation: "写真の場所が中心になるように地図を移動してください",
    spotPrivacyLevel: "場所のプライバシーレベル",
    selectToken: "あなたのTokenを選んでください",
    youNeedMeta: "MetaMaskをインストールしてください.",
    youNeedNet: "{networkName}に切り替えてください",
    youDonthaveToken:
      '"{tokenSymbol}":"{tokenName}"のNFTトークンを持っていると選択できます！',
  },
  function: {
    requestAccount: "MetaMaskと接続",
    fetchNFT: "再取得",
    signinTwitter: "ログイン(Twitter)",
    signinWallet: "ログイン(Wallet)",
    signout: "ログアウト",
  },  
  languages,
};

export default lang;
