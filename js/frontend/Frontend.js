class Frontend {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.app = app;

    this.lgtmButtons = new Map();
  }

  /**
   * 初期処理。
   */
  initialize() {
    setTimeout(() => {
      if (window.location.href.match(/pull\/\d+(?:$|#|\?)/)) {
        this.createLgtmButton_("#issue-comment-box");
      } else if (window.location.href.match(/pull\/\d+\/(?:commits|files)/)) {
        if ($("#overlay-show-review-changes-modal").length > 0) {
          this.createLgtmButton_("#review-changes-modal .js-previewable-comment-form");
        } else {
          setInterval(() => {
            if ($(".easy_lgtm_app").length === 0) {
              this.createLgtmButton_("div:has(> h1#anchored-review-title) + div > div:first-child");
            }
          }, 1000);
        }
      }
    }, 3000);
  }

  /**
   * LGTM ボタンを作成する。
   * 対象が無い場合はスキップする。
   * @param  {string|null} target
   */
  async createLgtmButton_(target) {
    if (target == null || $(target).length == 0) {
      return;
    }

    if (this.lgtmButtons.has(target)) {
      this.lgtmButtons.get(target).destroy();
      this.lgtmButtons.delete(target);
    }

    let options = null;
    switch (target) {
      case "#issue-comment-box":
        options = {
          target: target,
          methodType: this.app.templater.METHOD_TYPE_PREPEND,
          template: "lgtmButton",
          inputTarget: "#new_comment_field",
          requestImageCount: 1,
        };
        break;

      case "#review-changes-modal .js-previewable-comment-form":
        options = {
          target: target,
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButtonSubmit",
          inputTarget: "#pull_request_review_body",
          requestImageCount: 1,
        };
        break;

      case "div:has(> h1#anchored-review-title) + div > div:first-child":
        options = {
          target: target,
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButtonSubmit",
          inputTarget: "div:has(> h1#anchored-review-title) + div > div:first-child textarea",
          requestImageCount: 1,
        };
        break;
    }

    this.lgtmButtons.set(target, new LgtmButton(this.app, options));
    this.lgtmButtons.get(target).create();
  }
}
