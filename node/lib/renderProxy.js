const readVersionFile = require('../util/readVersionFile');

const debug = process.env.NODE_ENV === 'development';

module.exports = function(app, config) {
  const ctx = app.context;
  const renderer = ctx.render;
  const version = debug ? {} : readVersionFile();
  const proxy = function(tpl, locals, options, noCache) {
    let userInfo;
    try {
      userInfo = JSON.stringify(this.session);
    } catch(e) {
      userInfo = '{}';
    }
    const localConfig = {
      DEBUG: config.debug,
      amplitudeToken: config.amplitudeToken,
      picPath: config.picPath,
      localPath: config.localPath,
      cdnPath: config.cdnPath,
      version,
      userInfo,
      platform: this.userAgent.isMobile ? 'platform-mobile' : 'platform-pc',
      isIE: this.userAgent.isIE,
      isSafari: this.userAgent.isSafari,
      isChrome: this.userAgent.isChrome,
      browser: this.userAgent.browser,
      browserVersion: this.userAgent.version
    };
    const mergeLocals = Object.assign(localConfig, locals);
    return renderer.call(this, tpl, mergeLocals, options, noCache);
  };
  app.context.render = proxy;
};
