class Storage {
  /**
   * コンストラクタ。
   *
   * @constructor
   * @param {array} app
   */
  constructor(app) {
    this.storage          = new Map();
    this.reservationCount = 0;

    this.app = app;
  }

  /**
   * ストレージに入っている個数と予約数の和を返す。
   *
   * @return {number}
   */
  count() {
    return this.storage.size + this.reservationCount;
  }

  /**
   * ストレージに入っている個数のみを返す。
   *
   * @return {number}
   */
  size() {
    return this.storage.size;
  }

  /**
   * ストレージにキーを指定してデータを保存する。
   *
   * @param {string} key  - キー
   * @param {any}    data - セットするデータ
   */
  add(key, data) {
    this.storage.set(key, data);
    this.dropReservation();
    this.log_(`輸入：${data.lgtmUrl}`);
  }

  /**
   * ストレージから1個取り出す。
   *
   * @return {any}
   */
  pop() {
    if (this.size() === 0) {
      this.log_("輸出：null");
      return null;
    }

    let [firstKey, firstValue] = this.app.utilities.getFirstOneFromMap(this.storage);
    this.delete(firstKey);
    this.log_(`輸出：${firstValue.lgtmUrl}`);
    return firstValue;
  }

  /**
   * ストレージから指定した数の分だけ取り出す。
   * 常に指定した数の分だけ返ってくるわけではない。
   * （ストレージにある個数が足りない場合があるため）
   *
   * @param  {nubmer} number - 取得する個数
   * @return {array}
   */
  popSome(number) {
    let output = [];
    if (this.size() === 0) {
      return output;
    }

    for (let i of this.app.utilities.counter(number)()) {
      output.push(this.pop());
    }

    return output;
  }

  /**
   * ストレージにキーを指定してデータを削除する。
   *
   * @param {string} key - 削除するデータのキー
   */
  delete(key) {
    this.storage.delete(key);
  }

  /**
   * ストレージに対してエントリーを予約する。
   * 予約→データの準備→データ準備完了→予約破棄のように使う。
   */
  reserveEntry() {
    this.reservationCount++;
  }

  /**
   * ストレージにある予約を破棄する。
   * 予約→データの準備→データ準備完了→予約破棄のように使う。
   */
  dropReservation() {
    this.reservationCount--;
  }

  /**
   * ストレージから指定した個数分だけ取り出す。
   * 必ず指定した個数分が返却される。
   * TODO: 何度も呼ぶとおかしい挙動になってしまう。
   *
   * @param  {number}  number - 取得する個数
   * @return {Promise}
   */
  demand(number) {
    return new Promise(resolve => {
      // ストレージに十分な個数がある場合は、待たずに返却
      if (this.size() >= number) {
        resolve(this.popSome(number));
        return;
      }

      // ストレージに十分な個数が無い場合は、待ってから返却
      let output = [];
      let interval = setInterval(() => {
        if (this.size() > 0) {
          output.push(this.pop());
        }
        if (output.length >= number) {
          clearInterval(interval);
          resolve(output);
        }
      }, 200);
    });
  }

  /**
   * ストレージ内にある画像データの出入りをログ出力する。
   *
   * @param {string} [text] - 頭に置く文字列
   */
  log_(text = "") {
    console.log(text, `在庫：${this.count()}(実${this.storage.size}+予${this.reservationCount})`);
  }
}
