const _ = require('lodash');
const assert = require('assert');
const WechatError = require('../lib/wechat_error');
const dict = require('../lib/error_dicts/zh_cn');

describe('wechat_api.test.js', () => {
  describe('constructor', () => {
    it('should set config', () => {
      let error = new WechatError(40003, 'invalid openId');
      assert(error.code = '40003');
      assert(error.message && error.message.en === 'invalid openId');
      assert(error.message && error.message.zh_cn === dict.data['40003']);
    });

    it('should set manualMessage', () => {
      let error = new WechatError(40003, 'invalid openId', { zh_cn: '自定义', zh_tw: '自定義' });
      assert(error.code = '40003');
      assert(error.message);
      assert(error.message.en === 'invalid openId');
      assert(error.message.zh_cn === '自定义');
      assert(error.message.zh_tw === '自定義');
    });

    it('should set unknown error', () => {
      let error = new WechatError(-100, 'test');
      assert(error.code = '-100');
      assert(error.message);
      assert(error.message.en === 'test');
      assert(error.message.zh_cn === dict.unknown);
    });
  });

  describe('toString', () => {
    it('should be a function', () => {
      let error = new WechatError(40003, 'invalid openId');
      assert(typeof(error.toString) === 'function');
    });

    it('should explicit call', () => {
      let error = new WechatError(40003, 'invalid openId');
      assert(error.toString() === `WechatError: 40003, invalid openId(${dict.data['40003']})`);
    });

    it('should implicit call', () => {
      let error = new WechatError(40003, 'invalid openId');
      assert(error+"" === `WechatError: 40003, invalid openId(${dict.data['40003']})`);
    });
  });
});
