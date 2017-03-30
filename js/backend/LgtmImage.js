class LgtmImage {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.API_URL = "http://suikatyan.sakura.ne.jp/lgtm/imagetobase64.php";

    this.app      = app;
    this.id       = Symbol("lgtm_image_id");
    this.image    = null;
    this.error    = null;
    this.imageUrl = null;
    this.lgtmUrl  = null;
  }

  /**
   * 画像データをlgtm.inから取得し、取得情報をメンバ変数にセットする。
   *
   * @return {Promise}
   */
  load() {
    return new Promise(resolve => {
      $.ajax({
        type: "POST",
        url: this.API_URL,
        dataType: "json",
        success: ({image, error, imageUrl, lgtmUrl}) => {
          Object.assign(this, {image, error, imageUrl, lgtmUrl});
        },
        complete: () => {
          resolve();
        }
      })
    });
  }

  /**
   * この画像データが使えるかどうか。
   *
   * @return {boolean}
   */
  isAvailable() {
    return this.error === false;
  }

  /**
   * IDを取得する。
   *
   * @return {symbol}
   */
  getId() {
    return this.id;
  }
}
