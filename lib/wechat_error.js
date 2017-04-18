const dict = require('./error_dicts/zh_cn');

/**
 * 微信错误
 */
class WechatError {
  /**
   * 构造方法
   * @param {Number|String} code 错误代码
   * @param {String} message 服务器反馈的错误信息
   * @param {Object} customMessage 自定义的错误信息，会覆盖原有的 message 对象
   */
  constructor(code, message, customMessage = {}) {
    this.code = String(code);
    this.message = Object.assign({
      en: message,
      zh_cn: dict.data[this.code] || dict.unknown
    }, customMessage);
  }

  /**
   * 字符串表达形式
   */
  toString() {
    return `WechatError: ${this.code}, ${this.message.en}(${this.message.zh_cn})`;
  }
}

module.exports = WechatError;