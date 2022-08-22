import languages from "./languages";

const lang = {
  menu: {
    map: "地図",
    upload: "写真投稿",
    nft: "写真コンテンツ",
    nftRequest: "NFT要望写真コンテンツ",
    nftMinted: "NFT済み写真コンテンツ",
    user: "ユーザ",
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
    sharePhoto: "写真を共有",
    editPhotoInfo: "写真の情報を編集",
    deletePhoto: "写真を削除",
    save: "保存",
    saveComplete: "保存完了",
    delete: "削除",
    cancel: "キャンセル",
    close: "閉じる",
  },
  label: {
    name: "タイトル",
    description: "説明",
    event: "イベント",
    viewEvent: "表示イベント",
    showPhoto: "写真表示",
    creator: "作者",
    owner: "所有者",
    mint: "ミント",
    mintNotHasAuthority: "ミントには認証トークンが必要です",
    minting: "ミント中です,,",
    syncing: "NFT写真コンテンツを取得中です,,",
    requestCount: "現在のリクエスト数",
    nftCount: "現在のNFT写真コンテンツ数",
    nftOwnCount: "ご自身で保有しているNFT写真コンテンツ数",
    downloadOriginal: "オリジナル画像のURLを取得",
    downloadLink: "オリジナル画像をダウンロードする",
  },
  message: {
    hello: "こんにちは、世界",
    guidesignin:
      "地図情報付きの写真を簡単にTwitterで共有できます！  今すぐ試してみませんか？",
    guidephoto:
      "写真を投稿するには上記のボタンをクリック！　もしくは下記ボタンですぐに投稿できます！(写真は公開、共有されますのでご注意ください)",
    pleasesignin:
      "ログイン方法を選んでください(投稿時のNounsアイコンを変更したい場合はMetaMaskでログインしてください)",
    selectImage: "画像を選んでください",
    uploadImage: "画像をアップロードしましょう!",
    shareTwitter: "Twitterにリンクを共有！",
    processing: "送信中です...",
    selectPhotoLocation:
      "写真の場所が中心になるように地図を移動してください。写真は公開、共有されますので、権利、プライバシーを確認の上投稿してください。",
    spotPrivacyLevel: "場所のプライバシーレベル",
    selectContract: "あなたのNFTの種類を選んでください",
    selectToken: "あなたのTokenを選んでください",
    youNeedMeta: "MetaMaskをインストールしてください.",
    youNeedNet: "{networkName}に切り替えてください",
    youDonthaveToken: '"{tokenName}"のNFTトークンを持っていると選択できます！',
    NFTuploadTitle: "この写真をNFTトークン化することをリクエストします",
    NFTuploadDetail:
      "写真のオリジナルファイルを再度アップロードしますので選択してください（ファイルサイズによりUpload時間がかかります）。NFTトークンとして表示される名前、説明も記入してください。",
    NFTAlreadyRequested:
      "すでにこのファイルはNFTコンテンツとしてリクエストされています。詳細は写真コンテンツメニューをクリックしてご確認ください",
    nftFileError: "オリジナルの画像を選択してください",
    nameError: "タイトルを入力してください",
    descError: "説明を入力してください",
    nftRequestButton:
      "ここをクリックすると写真のNFTコンテンツ化をリクエストできます",
    nftRequestTitle: "NFT化を希望する写真コンテンツ",
    nftRequestDesc:
      "あなたが{tokenName}を保持している場合、写真の下のミントボタンが有効化されていて、写真コンテンツのNFT化をサポートすることができます（ガス代がかかります）。NFT化された写真はOpenSeaで売買できるようになります。たとえば、戦争や、災害にあわれたみなさんから投稿された写真が流通することで、被災されたみなさんを直接支援することもできます。ご自身で写真の内容、説明をよく見てサポートしたいと思う写真のNFT化にご協力ください。",
    nftMintedTitle: "NFT 写真コンテンツ",
    nftMintedDesc:
      "下記の写真をクリックした先のOpenSeaで写真を購入することができます。写真のOwnerになると所有コンテンツに表示され、MetaMaskでログインすると元画像をDownload、利用することができます。",
    mintCaution: "（ガス代は発生します）",
    noAccount: "有効なWalletがありません",
    invalidNetwork:
      "ブロックチェーンのネットワークがNFTと異なります NFTネットワーク：",
    switchNetwork: "ネットワークを切り替える",
    justMint: "NFT化に協力ありがとうございます。しばらくお待ち下さい",
    errorAccount:
      "有効なWalletでログインしていません。一度右上のユーザーメニューから、ログアウトを選択して、MetaMaskでログインしなおしてください。",
    deletePhotoConfirm: "この写真を削除してもよろしいでしょうか？",
    deletePhotoComplete: "写真の削除は完了しました.",
  },
  languages,
};

export default lang;
