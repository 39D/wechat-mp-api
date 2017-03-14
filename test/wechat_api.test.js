'use strict';

const assert = require('assert');
const WechatApi = require('../lib/wechat_api');

describe('wechat_api.test.js', function () {
  describe('constructor(_config)', function () {
    const customConfig = { appId: 'testId' };
    const api = new WechatApi(customConfig);

    it('should set config', function () {
      assert(api.config.appId = customConfig.appId);
    });
    
    it('should generate new config object', function () {
      assert(api.config !== customConfig);
    });
  });
});