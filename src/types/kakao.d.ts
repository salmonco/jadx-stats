interface KakaoShareLink {
  sendDefault(params: {
    objectType: string;
    text: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
    // Add other properties as needed
  }): void;
}

interface Kakao {
  isInitialized(): boolean;
  init(appKey: string): void;
  Share: KakaoShareLink;
  // Add other Kakao properties/modules as needed
}

interface Window {
  Kakao: Kakao;
}
