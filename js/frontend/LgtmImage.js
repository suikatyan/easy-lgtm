class LgtmImage {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array}  app
   * @param {object} data - 画像に関するデータ
   * @param {string} inputTarget - 画像を挿入する対象
   */
  constructor(app, data, inputTarget) {
    this.app = app;
    this.data = data;
    this.inputTarget = inputTarget;
    this.vue = null;
  }

  /**
   * 画像を配置する。
   */
  create() {
    this.app.templater.insert(
      "lgtmImage",
      ".lgtm_images_wrapper",
      this.app.templater.METHOD_TYPE_PREPEND,
      this.getVueData_()
    ).then(vue => {
      this.vue = vue;
      $(this.vue.$el).slideDown(500);
    });
  }

  /**
   * 画像用のVueデータを取得する。
   *
   * @return {object}
   */
  getVueData_() {
    return {
      data: {
        src: this.data.image
      },
      methods: {
        onClick: event => {
          if (event.shiftKey) {
            this.input_("img");
          } else {
            this.input_("markdown");
          }
          this.clearBrothers();
          $("#lgtm_button_close").hide(120);
          $("input[value='approve']").click();
        },
      }
    };
  }

  /**
   * 自分と他のLGTM画像を全部削除する。
   */
  clearBrothers() {
    $(".lgtm_image").slideUp(500, () => {
      $(this).remove();
    });
    $("#hint").hide();
  }

  /**
   * 画像がクリックされたとき、テキストエリアに画像URL（マークダウン形式）を挿入する。
   */
  input_(mode) {
    let text;
    switch (mode) {
      case "img":
        text = `\n\n<img src="${this.data.imageUrl}" alt="LGTM" width="320">`;
        break;
      case "markdown":
      default:
        text = `\n\n![LGTM](${this.data.imageUrl})`;
        break;
    }
    let $target = $(this.inputTarget);
    $target.val($target.val() + text);
  }
}
