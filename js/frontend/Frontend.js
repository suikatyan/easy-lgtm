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

    this.urlPatterns = new Map([
      ["partial-pull-merging", /pull\/\d+(?:$|#|\?)/],
      ["submit-review", /pull\/\d+\/(?:commits|files)/],
    ]);
  }

  /**
   * 初期処理。
   */
  initialize() {
    this.createLgtmButton_(this.getTarget_());
  }

  /**
   * URL から対象を取得する。
   * 対象でない URL の場合は null を返す。
   * @return {string|null}
   */
  getTarget_() {
    let target = null;

    this.urlPatterns.forEach((pattern, key) => {
      if (window.location.href.match(pattern)) {
        target = key;
      }
    });

    return target;
  }

  /**
   * LGTM ボタンを作成する。
   * 対象が無い場合はスキップする。
   * @param  {string|null} target
   */
  createLgtmButton_(target) {
    if (target == null || $("#" + target).length == 0) {
      return;
    }

    if (this.lgtmButtons.has(target)) {
      this.lgtmButtons.get(target).destroy();
      this.lgtmButtons.delete(target);
    }

    let options = null;
    switch (target) {
      case "partial-pull-merging":
        options = {
          target: "#" + target,
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButton",
          inputTarget: "#new_comment_field",
          requestImageCount: 2,
        };
        break;

      case "submit-review":
        options = {
          target: "#" + target + " .write-content",
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButtonSubmit",
          inputTarget: "#pull_request_review_body",
          requestImageCount: 1,
        };
        break;
    }

    this.lgtmButtons.set(target, new LgtmButton(this.app, options));
    this.lgtmButtons.get(target).create();
  }
}
