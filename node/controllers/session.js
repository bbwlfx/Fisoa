const uuid = require('uuid4');
const getRedis = require('../util/getRedis');
const saveRedis = require('../util/saveRedis');

// 7days
const EXPIRES = 7 * 24 * 3600 * 1000;

const cookieName = 'SESSIONID';

const updateCookie = (id, ctx) => {
  const date = new Date();
  date.setTime(date.getTime() + EXPIRES);
  ctx.cookies.set(cookieName, id.toString(), {
    httpOnly: true,
    expires: date
  });
};

module.exports.access = async(ctx, next) => {
  let sessionId = ctx.cookies.get(cookieName) || null;
  // 防止出现sessionId为空的情况
  if(!sessionId) {
    sessionId = uuid();
    updateCookie(sessionId, ctx);
  }
  let info = '';
  try {
    info = await getRedis(sessionId);
  } catch(e) {
    ctx.logger(`get redis session info error! sessionId: ${sessionId}`);
  }
  if(info) {
    updateCookie(info.id, ctx);
  } else {
    const id = uuid();
    updateCookie(id, ctx);
    info = {
      id,
      hasLogin: false
    };
  }
  ctx.session = info;
  // 已登录用户更新expires时间，未登录用户注册session
  await saveRedis(sessionId, info);
  await next();
};
