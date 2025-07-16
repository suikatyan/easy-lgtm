class Backend {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.app = app;
  }

  /**
   * 初期処理。
   */
  initialize() {
    this.app.imageService.preloadImages();
    this.startListening_();
  }

  /**
   * ChromeのAPIを用いて、Frontend側の要求を受け付ける準備をする。
   */
  startListening_() {
    chrome.runtime.onMessage.addListener((request, sender, respond) => {
      let {action, query} = request;
      switch (action) {
        case 'requestImages':
          this.requestImages_(query).then((images) => {
            respond(images);
          });
          break;
      }

      // respond()で渡している値を有効とする（非同期処理対策）。
      return true;
    });
  }

  /**
   * Fronted側の要求に応えて、返却する画像を取得する。
   *
   * @param  {object}  object.number - 欲しい画像の個数
   * @return {Promise}
   */
  requestImages_({number = 0}) {
    return new Promise((resolve) => {
      this.app.imageService.spliceImages(number).then((images) => {
        for (let image of images) {
          //JSON.stringify()で循環参照と言われてエラーになっちゃうのでappを削除。
          image.app = null;
        }

        resolve(images);
      });
    });
  }
}
