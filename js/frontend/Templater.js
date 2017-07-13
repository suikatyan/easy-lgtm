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
   * elを指定して、Vue形式で配置する。
   *
   * @param  {string} name       - テンプレート名
   * @param  {string} [target]     - 対象のクエリ
   * @param  {string} [methodType] - 挿入の方法
   * @param  {object} [data]       - Vueデータ
   * @return {Promise}
   */
  render(name, target = "body", methodType = this.METHOD_TYPE_APPEND, data = {}) {
    this.readFile_(name).then(content => {
      switch (methodType) {
        case this.METHOD_TYPE_APPEND:
          $(content).appendTo(target);
          break;
        case this.METHOD_TYPE_AFTER:
          $(content).insertAfter(target);
          break;
      }
      new Vue(data);
    });
  }

  /**
   * elを指定せず、動的にIDを設定し、Vue形式で配置する。
   *
   * @param  {string} name         - テンプレート名
   * @param  {string} [target]     - 対象のクエリ
   * @param  {string} [methodType] - 挿入の方法
   * @param  {object} [data]       - Vueデータ
   * @return {Promise}
   */
  insert(name, target = "body", methodType = this.METHOD_TYPE_APPEND, data = {}) {
    return new Promise(resolve => {
      this.readFile_(name).then(content => {
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
        }

        let id = this.PREFIX_DOM_ID_NAME + this.app.utilities.unique();
        $dom.prop("id", id);
        data.el = `#${id}`;
        resolve(new Vue(data));
      });
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
    return chrome.extension.getURL(`templates/${name}.html`);
  }
}
