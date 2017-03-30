class Utilities {
  /**
   * ユニークな文字列を生成し、取得する。
   *
   * @param  {number} [strength = 1000000] - 乱数の強度
   * @return {string}
   */
  unique(strength = 1000000) {
    return new Date().getTime().toString(32) + Math.floor(strength * Math.random()).toString(32);
  }

  /**
   * 指定した回数分のジェネレータを生成し、取得する。
   *
   * @param  {number} max - 回数
   * @param  {object} [object] - 設定
   *                  object.offset    - スタート時点での内部で使う数字の補正値
   *                  object.begin     - スタート時点の数字
   *                  object.increment - 増減値
   * @return {generator}
   */
  counter(max, {offset = -1, begin = 0, increment = 1} = {}) {
    let current = begin;
    max = max + offset;
    return function*() {
      while(current <= max) {
        yield current;
        current += increment;
      }
    }
  }

  /**
   * Mapから最初の要素を返却する。
   * ここでいう最初の要素とは、Mapから配列へ変換したときの最初の要素のこと。
   * Mapに要素がない場合はnullを返却。
   *
   * @param  {Map} map - 対象のMap
   * @return {string|null}
   */
  getFirstOneFromMap(map) {
    for (let [key, value] of map.entries()) {
      return [key, value];
    }

    return null;
  }
}
