class ImageService {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.PRELOAD_IMAGES_MAX = 6;

    this.app = app;
  }

  /**
   * 画像を先読みする。
   *
   * @param {number} [number = null] - 先読みする画像の個数。省略すると残りの個数が設定される。
   */
  preloadImages(number = null) {
    let max     = this.PRELOAD_IMAGES_MAX;
    let current = this.app.storage.count();
    if (max <= current) {
      return;
    }

    let hasError = false;
    let left = number === null ? max - current : number;
    for (let i of this.app.utilities.counter(left)()) {
      let image = new LgtmImage(this.app);
      this.app.storage.reserveEntry();

      image.load().then(() => {
        if (image.isAvailable()) {
          // 正常な画像データなら保存する。
          this.saveImageIntoStorage_(image);
        } else {
          // 使えない画像データなら保存しない。
          this.app.storage.dropReservation();
          this.preloadImages(1);
        }
      });
    }
  }

  /**
   * ストレージから画像を取り出す。
   *
   * @param  {number}  number - 取り出す個数
   * @return {Promise}
   */
  spliceImages(number) {
    return new Promise((resolve) => {
      this.getImagesFromStorage_(number).then((result) => {
        this.preloadImages();
        resolve(result);
      });
    });

  }

  /**
   * ストレージへ画像取得の要求を出す。
   *　
   * @param  {number}  number - 取り出す個数
   * @return {Promise}
   */
  getImagesFromStorage_(number) {
    return this.app.storage.demand(number);
  }

  /**
   * ストレージへ画像を保存させる。
   *
   * @param  {LgtmImage} image - 保存するLgtmImageインスタンス
   */
  saveImageIntoStorage_(image) {
    this.app.storage.add(image.getId(), image);
  }
}
