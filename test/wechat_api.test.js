'use strict';

const _ = require('lodash');
const assert = require('assert');
const WechatApi = require('../lib/wechat_api');
const testConfig = require('./config').testConfig;

describe('wechat_api.test.js', () => {
  describe('constructor', () => {

    it('should set config', () => {
      let api = new WechatApi(testConfig);
      assert(api.config.appid = testConfig.appid);
      assert(api.config.secret = testConfig.secret);
      assert(api.config.AESKey = testConfig.AESKey);
      assert(api.config.token = testConfig.token);
      assert(api.config.timeoutMillis = testConfig.timeoutMillis);
    });

    it('should generate new config object', () => {
      let api = new WechatApi(testConfig);
      assert(api.config !== testConfig);
    });

    it('should validate config', () => {
      let config = {}
      try {
        let api = new WechatApi(config);
      } catch (e) {
        assert(e instanceof TypeError);
        assert(e.message.indexOf('appid') > 0);
      }
    });

    it('should fill default props', () => {
      let customConfig = _.omit(testConfig, 'timeoutMillis');
      let api = new WechatApi(customConfig);
      assert(api.config.timeoutMillis === WechatApi.defaultProps.timeoutMillis);
    });
  });

  describe('validateSignature', () => {
    it('should be a function', () => {
      let api = new WechatApi(testConfig);
      assert(typeof(api.validateSignature) === 'function');
    });

    it('should validate signature', () => {
      let api = new WechatApi(testConfig);
      let result = api.validateSignature(
        '5cb3be3dce9725aa84012f0179d38949bba3b284',
        '1492488976',
        '1715648023'
      );
      assert(result);
    });
  })
});
