class Templater {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.PREFIX_DOM_ID_NAME  = "easy_lgtm_";

    this.METHOD_TYPE_APPEND  = Symbol("append");
    this.METHOD_TYPE_AFTER   = Symbol("after");
    this.METHOD_TYPE_PREPEND = Symbol("prepend");

    this.app = app;
  }


  /**
   * テンプレートを指定位置に挿入する（jQueryのみ）。
   *
   * @param  {string} name       - テンプレート名
   * @param  {string} [target]     - 対象のクエリ
   * @param  {string} [methodType] - 挿入の方法
   * @return {Promise<jQuery>} 挿入したjQueryオブジェクトを返す
   */
  render(name, target = "body", methodType = this.METHOD_TYPE_APPEND) {
    return this.readFile_(name).then(content => {
      let $dom;
      switch (methodType) {
        case this.METHOD_TYPE_APPEND:
          $dom = $(content).appendTo(target);
          break;
        case this.METHOD_TYPE_AFTER:
          $dom = $(content).insertAfter(target);
          break;
        case this.METHOD_TYPE_PREPEND:
          $dom = $(content).prependTo(target);
          break;
        default:
          $dom = $(content).appendTo(target);
      }
      return $dom;
    });
  }


  /**
   * テンプレートを指定位置に挿入し、jQueryオブジェクトを返す（ID付与）。
   *
   * @param  {string} name         - テンプレート名
   * @param  {string} [target]     - 対象のクエリ
   * @param  {string} [methodType] - 挿入の方法
   * @return {Promise<jQuery>} 挿入したjQueryオブジェクトを返す
   */
  insert(name, target = "body", methodType = this.METHOD_TYPE_APPEND) {
    return this.readFile_(name).then(content => {
      let $dom;
      switch (methodType) {
        case this.METHOD_TYPE_APPEND:
          $dom = $(content).appendTo(target);
          break;
        case this.METHOD_TYPE_PREPEND:
          $dom = $(content).prependTo(target);
          break;
        case this.METHOD_TYPE_AFTER:
          $dom = $(content).insertAfter(target);
          break;
        default:
          $dom = $(content).appendTo(target);
      }
      let id = this.PREFIX_DOM_ID_NAME + this.app.utilities.unique();
      $dom.prop("id", id);
      return $dom;
    });
  }

  /**
   * ファイルを読み込み、その中身を返却する。
   *
   * @param  {string}　name　- テンプレート名
   * @return {Promise}
   */
  readFile_(name) {
    return new Promise(resolve => {
      $.ajax({
        url: this.getPath_(name),
        type: "GET",
        success: (content) => {
          resolve(content)
        }
      })
    });
  }

  /**
   * 読み込むテンプレートファイルのパスを取得する。
   *
   * @param  {string}　name　- テンプレート名
   * @return {string}
   */
  getPath_(name) {
    return chrome.runtime.getURL(`templates/${name}.html`);
  }
}
