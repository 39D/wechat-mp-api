const debug = require('debug')('wechat-mp-api');
const crypto  = require('crypto');
const fetch = require('node-fetch');
const queryString = require('query-string');

const WechatError = require('./wechat_error');

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
   * @return {Boolean} 验证结果
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

  /**
   * 获取 access token
   * @return {Object} { "access_token": "", "expires_in": 7200 }
   */
  getAccessToken() {
    const { appid, secret } = this.config;

    return this._fetchJSON('https://api.weixin.qq.com/cgi-bin/token', {
      method: 'GET',
      qs: {
        grant_type: 'client_credential',
        appid, secret
      }
    });
  }

  /**
   * 根据微信接口定制的 fetch
   * @param {String} url URL
   * @param {Object} options 选项
   */
  _fetchJSON(url, options) {
    if(options && options.qs) {
      url = `${url}?${queryString.stringify(options.qs)}`;
      delete options.qs;
    }
    debug('Fetch URL: %s, config: %s', url, JSON.stringify(options));
    return new Promise((resolve, reject) => {
      fetch(url, options).then((response) => {
        // 状态码正确
        if (response.ok) {
          let contentType = response.headers.get('content-type');
          // json 类型反馈
          if (contentType.indexOf('application/json') >= 0) {
            response.json().then((jsonData) => {
              debug('Fetched json: %s', jsonData);
              if (jsonData.errcode) {
                reject(new WechatError(jsonData.errcode, jsonData.errmsg));
              } else {
                resolve(jsonData);
              }
            }).catch(reject);
          }
          // text 类型反馈
          else if (contentType.indexOf('text/html') >= 0) {
            response.text().then((textData) => {
              debug('Fetched textData: %s', textData);
              reject(new WechatError('Unknown', `Text response: ${textData}`, { zh_cn: `收到文本反馈: ${textData}` }));
            }).catch(reject);
          }
          // 其他 类型反馈
          else {
            reject(new WechatError('Unknown', `Unknown content-type: ${contentType}`, { zh_cn: `未知的 content-type: ${contentType}` }));
          }
        }
        // 状态码异常
        else {
          debug('Fetch Status: %s', response.status);
          reject(new Error(`Http status: ${response.status}`));
        }
      }).catch((err) => {
        debug('Fetch error: ' + err);
        reject(err);
      });
    });
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
