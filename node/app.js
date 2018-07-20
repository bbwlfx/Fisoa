const Koa = require('koa');
const KoaPug = require('koa-pug');
const KoaRouter = require('koa-router');
const path = require('path');
const fs = require('fs');
const koaBody = require('koa-body');
const server = require('koa-static');
const userAgent = require('koa-useragent');
const mysql = require('mysql');
const redis = require('redis');
const KoaHelmet = require('koa-helmet');
const nodeSchedule = require('node-schedule');
const calRank = require('./util/calcRank');
const { Logger, logEvent, reqLogger } = require('./lib/logger');

const mysql_config = process.env.NODE_ENV === 'development' ? require('./lib/mysql/dev_config') : require('./lib/mysql/config');

const redisClient = redis.createClient();

redisClient.on('ready', (err) => {
  if(err) {
    logEvent.fatal('[redis start error!]');
    return;
  }
  logEvent.info('[redis start success!]');
  global.redisServer = redisClient;
});

redisClient.on('error', (err) => {
  logEvent.fatal(`[something wrong happened to redis, reson:]${JSON.stringify(err)}`);
});

// 全局数据库对象
global.connection = {};

// 进行数据库连接和重连操作
const handleConnection = () => {
  const con = mysql.createConnection(mysql_config);
  con.connect((err) => {
    if(err) {
      logEvent.fatal('-----mysql start reconnect!-----');
      setTimeout(handleConnection, 2000);
    } else {
      logEvent.info('[mysql connection success!]');
    }
  });
  con.on('error', (err) => {
    logEvent.fatal('-----mysql connection error!-----');
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnection();
    } else {
      throw err;
    }
  });
  global.connection = con;
};

handleConnection();

logEvent.info(`<!--process.env.NODE_ENV = ${process.env.NODE_ENV}--!>`);

const config = JSON.parse(fs.readFileSync(path.join(__dirname, process.argv[2])));

global.STATIC_PATH = '../public/js';

// 定时执行计算文章分数排行 每天0点自动更新
nodeSchedule.scheduleJob('* * 0 * * *', async() => {
  await calRank();
});

const app = new Koa();

// 打印请求信息

app.use(koaBody({ multipart: true }));

new KoaPug({
  app,
  debug: false,
  pretty: false,
  compileDebug: false,
  basedir: '../template',
  viewPath: path.join(__dirname, '../template')
});

const router = new KoaRouter();

const sessionController = require('./controllers/session');
const renderProxy = require('./lib/renderProxy');

renderProxy(app, config);

app.use(userAgent)
  .use(KoaHelmet())
  .use(async(ctx, next) => {
    ctx.config = config;
    ctx.logger = Logger(ctx);
    reqLogger(ctx);
    await next();
  })
  .use(server(path.join(__dirname, '..', 'assets')))
  .use(server(path.join(__dirname, '..', 'resources')))
  .use(sessionController.access);

const indexRouter = require('./routes/index');
const storyRouter = require('./routes/story');
const apiRouter = require('./routes/api');
const userRouter = require('./routes/user');
const userspaceRouter = require('./routes/userspace');
const newRouter = require('./routes/new');
const profileRouter = require('./routes/profile');
const adminRouter = require('./routes/admin-system');
const adminApiRouter = require('./routes/adminApi');
const editRouter = require('./routes/edit');

router.use('', indexRouter.routes())
  .use('', storyRouter.routes())
  .use('/user', userRouter.routes())
  .use('/userspace', userspaceRouter.routes())
  .use('/new', newRouter.routes())
  .use('/api', apiRouter.routes())
  .use('/admin', adminApiRouter.routes())
  .use('/profile', profileRouter.routes())
  .use('/admin-system', adminRouter.routes())
  .use('/edit', editRouter.routes());

app.use(router.routes()).use(router.allowedMethods());

// page errorHandler
app.use((ctx) => {
  ctx.render('error');
});
app.on('error', (err) => {
  logEvent.fatal(`node runtime report error:${err}`);
});
process.on('uncaughtException', (err) => {
  logEvent.fatal('[catch the error, reason:]', err);
});

/* eslint-disable dot-notation */
app.listen(config['server_port'], (err) => {
  if(err) {
    console.error('Unable to start on port', config['server_port'], err);
    return;
  }
  logEvent.info(`server is running on port ${config['server_port']}`);
});
