'use strict';

/**
 * Wechat MP API
 */
class WechatApi {
  /**
   * Set Wechat MP config to initialize
   * @param {Object} _config Wechat MP config
   */
  constructor(_config) {
    this.config = Object.assign({}, WechatApi.defaultConfig, _config);
  }
  
}

WechatApi.defaultConfig = {

}


module.exports = WechatApi;