const _ = require('lodash');
const assert = require('assert');
const WechatApi = require('../lib/wechat_api');
const WechatError = require('../lib/wechat_error');
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
  });

  describe('getAccessToken', () => {
    it('should be a function', () => {
      let api = new WechatApi(testConfig);
      assert(typeof(api.getAccessToken) === 'function');
    });

    it('should get access token', () => {
      let api = new WechatApi(testConfig);
      return api.getAccessToken().then((jsonData) => {
        assert(typeof(jsonData.access_token) === 'string');
        assert(typeof(jsonData.expires_in) === 'number');
      }).catch((err) => {
        console.log(err)
      })
    });

    it('should throw wechat error', () => {
      let customConfig = _.omit(testConfig, 'secret');
      customConfig.secret = "foo";
      let api = new WechatApi(customConfig);
      return api.getAccessToken().then((jsonData) => {
        assert(false);
      }).catch((err) => {
        assert(err instanceof WechatError);
        assert(err.message.en.indexOf('secret') >= 0);
      })
    });
  });

  describe('_fetchJSON', () => {
    it('should be a function', () => {
      let api = new WechatApi(testConfig);
      assert(typeof(api._fetchJSON) === 'function');
    });

    it('should throw text response error', () => {
      let api = new WechatApi(testConfig);
      return api._fetchJSON('https://api.weixin.qq.com/cgi-bin/token').then((jsonData) => {
        assert(false);
      }).catch((err) => {
        assert(err instanceof WechatError);
        assert(err.message.en && err.message.en.toLowerCase().indexOf('text response') >= 0);
      })
    });

    it('should throw content type error', () => {
      let api = new WechatApi(testConfig);
      return api._fetchJSON('http://www.xmlfiles.com/examples/note.xml').then((jsonData) => {
        assert(false);
      }).catch((err) => {
        assert(err instanceof WechatError);
        assert(err.message.en && err.message.en.toLowerCase().indexOf('content-type') >= 0);
      })
    });

    it('should throw http status error', () => {
      let api = new WechatApi(testConfig);
      return api._fetchJSON('http://404.github.io/').then((jsonData) => {
        assert(false);
      }).catch((err) => {
        assert(err instanceof Error);
        assert(err.message.indexOf('404') >= 0);
      })
    });

    it('should throw fetch error', () => {
      let api = new WechatApi(testConfig);
      return api._fetchJSON('http://').then((jsonData) => {
        assert(false);
      }).catch((err) => {
        assert(err instanceof Error);
      })
    });
  });
});
