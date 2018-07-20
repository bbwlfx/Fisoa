/* eslint-disable */
const log4js = require('log4js');
const levels = log4js.levels;

log4js.configure({
  appenders: {
    stdout: {//控制台输出
      type: 'stdout'
    },
    error: {
      type: 'file',
      filename: 'logs/errorLog.log'
    },
    info: {
      type: 'file',
      filename: 'logs/infoLog.log'
    },
    req: {
      type: 'dateFile',
      filename: 'logs/reqlog/',
      pattern: 'req-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: {
      appenders: ['stdout', 'req'],
      level: 'debug'
    },
    error: {
      appenders: ['stdout', 'error'],
      level: 'error'
    },
    info: {
      appenders: ['stdout', 'info'],
      level: 'info'
    }
  }
});

const logger = log4js.getLogger();
const info = log4js.getLogger('info');
const error = log4js.getLogger('error');

const logEvent = (...msg) => error.error(msg.join(' '));

const Logger = ctx => logEvent;

const reqLogger = ctx => {
  if(ctx.url === '/favicon.ico') {
    return;
  }

  const start = new Date();
  // proxy for statusCode.
  const writeHead = ctx.response.writeHead
  ctx.response.writeHead = function (code, headers) {
    ctx.response.writeHead = writeHead;
    ctx.response.writeHead(code, headers);
    ctx.response.__statusCode = code;
    ctx.response.__headers = headers || {};
  }

  ctx.response.responseTime = new Date() - start
  
  const remoteAddr = ctx.headers['x-forwarded-for'] || ctx.ip || ctx.ips ||
    (ctx.socket && (ctx.socket.remoteAddress || (ctx.socket.socket && ctx.socket.socket.remoteAddress)));
  const method = ctx.method;
  const url = ctx.url;
  const userAgent = ctx.headers['user-agent'];
  // set default 200
  const status = 200 || ctx.response.status || ctx.response.__statusCode || ctx.res.statusCode;
  const responseTime = ctx.response.responseTime;
  const referrer = ctx.headers.referer || '';
  const httpVersion = ctx.req.httpVersionMajor + '.' + ctx.req.httpVersionMinor;
  logger.debug(`[${remoteAddr} ${method} ${url} ${status} ${responseTime}ms] [${referrer} HTTP/:${httpVersion} ${userAgent}]`);
}

module.exports = {
  Logger,
  logEvent,
  reqLogger
}

logEvent.trace = (...msg) => logger.trace(msg.join(' '));

logEvent.debug = (...msg) => info.debug(msg.join(' '));

logEvent.info = (...msg) => info.info(msg.join(' '));

logEvent.warn = (...msg) => error.warn(msg.join(' '));

logEvent.fatal = (...msg) => error.fatal(msg.join(' '));
