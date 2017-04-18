exports.testConfig = {
  appid: process.env.appid || 'testAppid',
  secret: process.env.secret || 'testSecret',
  AESKey: process.env.AESKey || 'testAES',
  token: process.env.token || 'helloworld',
  timeoutMillis: 3000
}
