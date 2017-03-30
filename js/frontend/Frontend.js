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
   */
  startObservation() {
    if (this.observer !== null) {
      return;
    }

    this.observer = new MutationObserver((changedNodes) => {
      // たぶん以下にある条件で動くはず
      if (!window.location.href.match(/pull\/\d+(?:$|\/?\W)/)) {
        return;
      }

      let changedNode = changedNodes[0];
      let removedNodes = changedNode.removedNodes;
      if (removedNodes.length === 0) {
        return;
      }

      if (removedNodes[0].id !== "js-flash-container") {
        return;
      }

      this.initialize();
    });
    this.observer.observe($("body")[0], {childList: true});
  }
}
