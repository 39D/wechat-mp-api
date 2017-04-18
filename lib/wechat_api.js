const debug = require('debug')('wechat-mp-api');
const crypto  = require('crypto')
/**
 * Wechat MP API
 */
class WechatApi {
  /**
   * 根据配置，进行微信公众号 API 初始化
   * @param {Object} config api 配置
   */
  constructor(config) {
    this.config = Object.assign({}, WechatApi.defaultProps, config);
    // 参数检查
    Object.keys(WechatApi.propTypes).forEach((k) => {
      if(typeof(this.config[k]) !== WechatApi.propTypes[k]) {
        throw new TypeError(`Unexpected type of ${k}: ${typeof(this.config[k])}, expected: ${WechatApi.propTypes[k]}`);
      }
    });
  }

  /**
   * 服务器签名认证
   * @param {String} signature 微信公众平台传入的签名
   * @param {String} timestamp 微信公众平台传入的时间戳
   * @param {String} nonce 微信公众平台传入的随机串
   */
  validateSignature(signature, timestamp, nonce) {
    const { token } = this.config;
    debug('signature: %s\ntimestamp: %s\nnonce: %s\ntoken: %s', signature, timestamp, nonce, token);
    let arr = [token, timestamp, nonce].sort((s1, s2) => (s1.localeCompare(s2)));
    arr = arr.sort((s1, s2) => (s1.localeCompare(s2)));
    let _signature = crypto.createHash('sha1').update(arr.join('')).digest('hex');

    debug('local signature: %s', _signature);
    return (signature === _signature);
  }

}

// 默认配置
WechatApi.defaultProps = {
  timeoutMillis: 5000
}

// 配置类型
WechatApi.propTypes = {
  appid: 'string',
  secret: 'string',
  AESKey: 'string',
  token: 'string',
  timeoutMillis: 'number'
}


module.exports = WechatApi;
