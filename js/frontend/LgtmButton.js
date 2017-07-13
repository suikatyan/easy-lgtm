class LgtmButton {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   * @param {array} options
   */
  constructor(app, options) {
    this.REQUEST_IMAGES_COUNT = 2;

    this.app = app;
    this.options = options;
    this.isLoading = false;
  }

  /**
   * ボタンを作成して、配置する。
   */
  create() {
    if ($(this.options.target).length === 0) {
      return;
    }

    this.app.templater.insert(
      this.options.template,
      this.options.target,
      this.options.methodType,
      this.getVueData_()
    ).then(vue => {
      this.vue = vue;
    });
  }

  /**
   * ボタンを削除する。
   */
  destroy() {
    $(`#${this.vue.$el.id}`).remove();
  }

  /**
   * ボタン用のVueデータを取得する。
   *
   * @return {object}
   */
  getVueData_() {
    return {
      data: {
        src: this.getIconUrl_()
      },
      methods: {
        onClick: () => {
          $("#lgtm_button_close").show(80);
          if (this.isLoading) {
            return;
          }
          this.isLoading = true;
          this.requestImages_().then((images) => {
            for (let image of images) {
              let lgtmImage = new LgtmImage(this.app, image, this.options.inputTarget);
              lgtmImage.create();
            }
            this.isLoading = false;
          });
        },
        onMouseenter: (event) => {
          $(event.target).find(".lgtm_not_initial").animate({"opacity": 0.1}, 100);
        },
        onMouseleave: (event) => {
          $(event.target).find(".lgtm_not_initial").animate({"opacity": 1}, 100);
        },
        onClickCloseButton: (event) => {
          // 消したいがためにインスタンスを作成します。ごめんなさい
          (new LgtmImage()).clearBrothers();
          $(event.target).hide(80);
        },
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

  /**
   * アイコンファイルのパスを取得する。
   *
   * @return {string}
   */
  getIconUrl_() {
    return "data:image/png;base64,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";
  }
}
