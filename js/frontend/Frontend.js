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
    this.flag = true;
  }

  /**
   * 初期処理。
   */
  initialize() {
    this.startObservation();

    let lgtmButton = new LgtmButton(this.app);
    lgtmButton.create();
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
      // たぶん以下にある条件で動くはず
      if (!window.location.href.match(/pull\/\d+(?:$|#)/)) {
        this.flag = true;
        return;
      }

      if (!this.flag) {
        return;
      }

      if ($("#partial-pull-merging").length) {
        this.flag = false;
        this.initialize();
      }
    });

    this.observer.observe($("#js-pjax-loader-bar")[0], {attributes: true});
  }
}
