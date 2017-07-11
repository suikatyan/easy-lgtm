class Frontend {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.app = app;

    this.observer = null;
    this.lgtmButton = null;

    this.urlPatterns = {
      "partial-pull-merging": /pull\/\d+(?:$|#)/,
      "submit-review": /pull\/\d+\/files(?:$|#)/,
    };
  }

  /**
   * 初期処理。
   */
  initialize() {
    this.startObservation();

    this.createLgtmButton(this.getTarget());
  }

  /**
   * MutationObserverを実行する。
   * すでに実行済みなら、スキップする。
   * Githubはページ遷移の仕組みが特殊であるため、エクステンションのrun_atでは不十分。
   * ページの上部にあるプログレスバーに変化があれば実行するようにする。
   */
  startObservation() {
    if (this.observer !== null) {
      return;
    }

    this.observer = new MutationObserver((changedNodes) => {
      let target = this.getTarget();

      if (target != null && $("#" + target).length) {
        this.createLgtmButton(target);
      }
    });

    this.observer.observe($("#js-pjax-loader-bar")[0], {attributes: true});
  }

  /**
   * URL から対象を取得する。
   * 対象でない URL の場合は null を返す。
   * @return {string|null}
   */
  getTarget() {
    let target = null;

    $.each(this.urlPatterns, function (key, pattern) {
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
  createLgtmButton(target) {
    if (target == null) {
      return;
    }

    if (this.lgtmButton != null) {
      this.lgtmButton.destroy();
    }

    switch (target) {
      case "partial-pull-merging":
        this.lgtmButton = new LgtmButton(this.app, {
          target: "#" + target,
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButton",
          inputTarget: "#new_comment_field",
        });
        break;

      case "submit-review":
        this.lgtmButton = new LgtmButton(this.app, {
          target: "#" + target + " .write-content",
          methodType: this.app.templater.METHOD_TYPE_AFTER,
          template: "lgtmButtonSubmit",
          inputTarget: "#pull_request_review_body",
        });
        break;
    }

    this.lgtmButton.create();
  }
}
