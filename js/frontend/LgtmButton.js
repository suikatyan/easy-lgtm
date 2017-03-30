class LgtmButton {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.REQUEST_IMAGES_COUNT = 2;

    this.app = app;
    this.isLoading = false;
  }

  /**
   * ボタンを作成して、配置する。
   */
  create() {
    let target = "#partial-pull-merging";
    if ($(target).length === 0) {
      return;
    }

    this.destroy();
    this.app.templater.render(
      "lgtmButton",
      target,
      this.app.templater.METHOD_TYPE_AFTER,
      this.getVueData_()
    );
  }

  /**
   * ボタンを削除する。
   */
  destroy() {
    $("#lgtm_wrapper").remove();
  }

  /**
   * ボタン用のVueデータを取得する。
   *
   * @return {object}
   */
  getVueData_() {
    return {
      el: "#lgtm_wrapper",
      methods: {
        onClick: () => {
          if (this.isLoading) {
            return;
          }
          this.isLoading = true;
          this.requestImages_().then((images) => {
            for (let image of images) {
              let lgtmImage = new LgtmImage(this.app, image);
              lgtmImage.create();
            }
            this.isLoading = false;
          });
        },
        onMouseover: () => {

        }
      }
    }
  }

  /**
   * Backendへ画像データを要求し、取得する。
   *
   * @return {Promise}
   */
  requestImages_() {
    return new Promise(resolve => {
      chrome.runtime.sendMessage({
        action: "requestImages",
        query : {number: this.REQUEST_IMAGES_COUNT}
      }, (response) => {
        resolve(response);
      });
    });
  }
}
