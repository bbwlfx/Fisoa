const crypto = require('crypto');
const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');
const mailServer = require('../../util/mailServer');
const saveRedis = require('../../util/saveRedis');

const createSecretPassword = (psd) => {
  const secret = 'Fisoa';
  return crypto.createHmac('sha256', secret).update(psd).digest('hex');
};

module.exports.userHasExist = async(ctx) => {
  const { username } = ctx.query;
  try {
    const exist = await Mysql.selectUser(username);
    if(exist[0]) {
      ctx.body = {
        type: code.userExist,
        data: {
          msg: errorMsg.userExist
        }
      };
      return;
    }
    ctx.body = {
      type: code.success,
      data: {}
    };
  } catch(e) {
    ctx.body = serverError;
  }
};

module.exports.userLogin = async function(ctx) {
  const { id } = ctx.session;
  if(!id) {
    ctx.body = serverError;
    return;
  }
  const { password, user_name } = ctx.request.body;
  const hashPsd = createSecretPassword(password);
  let ret = null;
  try {
    ret = await Mysql.selectUser(user_name);
  } catch(e) {
    ctx.logger(`[select user error!]: ${JSON.stringify(e)}`);
    ctx.body = serverError;
    return;
  }
  if(ret[0]) {
    if(ret[0].password !== hashPsd) {
      ctx.body = {
        type: code.paramsError,
        data: {
          msg: errorMsg.passwordError
        }
      };
      return;
    }
    if(ret[0].status === 0) {
      ctx.body = {
        type: code.accountBanned,
        data: {
          msg: errorMsg.accountBanned
        }
      };
      return;
    }
    delete ret[0].account;
    delete ret[0].password;
    try {
      await saveRedis(id, Object.assign({}, ctx.session, {
        hasLogin: true,
        ...ret[0]
      }));
    } catch(e) {
      ctx.logger('[save redis error!]:', JSON.stringify(e));
    }
    ctx.body = {
      type: code.success,
      data: {
        hasLogin: true,
        ...ret[0]
      }
    };
    return;
  }
  ctx.body = {
    type: code.paramsError,
    data: {
      msg: errorMsg.userNotExist
    }
  };
};

module.exports.userExit = async function(ctx) {
  const { uid, id } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  await saveRedis(id, '');
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getUserDetail = async function(ctx) {
  const { id } = ctx.session;
  if(!id) {
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {
      data: ctx.session
    }
  };
};

module.exports.getUserInfo = async function(ctx) {
  const { uid } = ctx.query;
  let userInfo = null;
  try {
    userInfo = await Mysql.selectUserByUid(uid);
  } catch(e) {
    ctx.logger(`[get userInfo error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(!userInfo[0]) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.userNotExist
      }
    };
    return;
  }
  ctx.body = {
    type: code.success,
    data: userInfo[0]
  };
};

module.exports.forgetPassword = async(ctx) => {
  const { id } = ctx.session;
  if(!id) {
    ctx.body = serverError;
    return;
  }
  const { account } = ctx.request.body;
  if(!account) {
    ctx.body = {
      type: code.paramsError,
      data: {}
    };
    return;
  }
  // 用户不存在
  try {
    const exist = await Mysql.selectUser(account);
    if(!exist[0]) {
      ctx.body = {
        type: code.paramsError,
        data: {}
      };
      return;
    }
  } catch(e) {
    ctx.body = serverError;
    return;
  }
  try {
    const email = await Mysql.selectEmailByAccount(account);
    // 重置密码
    const originnew = Math.random().toString(36).slice(2, 10);
    const newpass = createSecretPassword(originnew);
    try {
      await Mysql.resetPasswordByAccount(account, newpass);
      // 发送邮件
      const html = `
        <p>您刚刚使用了忘记密码的功能，我们帮您重置了您的密码，您的新密码为<strong>${originnew}</strong></p>
        <p>请及时修改您的密码，以防对账号造成不必要的损失！</p>`;
      mailServer.emit('push', email[0].email, html);
    } catch(e) {
      ctx.logger(`[reset password by account error!]:${e.sqlMessage}`);
      ctx.body = {
        type: code.serverError,
        data: {
          msg: errorMsg.resetPassError
        }
      };
      return;
    }
  } catch(e) {
    ctx.logger(`[get email by account error!]:${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.handleUserRegister = async(ctx) => {
  const { id } = ctx.session;
  if(!id) {
    ctx.body = serverError;
    return;
  }
  const { register_user_name, register_password, register_user_email } = ctx.request.body;
  const password = createSecretPassword(register_password);
  let result = null;
  try {
    result = await Mysql.selectUser(register_user_name);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[select user error]: ${JSON.stringify(e)}`);
    return;
  }
  if(result && result[0]) {
    ctx.body = {
      type: code.otherError,
      data: {
        msg: errorMsg.userExist
      }
    };
    return;
  }
  try {
    await Mysql.insertUser(register_user_name, password, register_user_email);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[insert user error!]: ${e.sqlMessage}`);
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.ifUserLogin = async function(ctx) {
  const { id, hasLogin } = ctx.session;
  if(!id) {
    ctx.body = serverError;
    return;
  }
  if(hasLogin) {
    ctx.body = {
      type: code.success
    };
    return;
  }
  ctx.body = {
    type: code.otherError
  };
};

module.exports.updateInfo = async function(ctx) {
  const { uid, id } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  const { sex, school, area, nickname,
    blog, qq, wechat, weibo, description,
    overt, openmail, email } = ctx.request.body;
  try {
    await Mysql.updateUserInfo({
      sex,
      school,
      area,
      nickname: nickname || '萌新',
      blog,
      qq,
      wechat,
      weibo,
      description,
      overt,
      uid,
      openmail,
      email
    });
    await saveRedis(id, Object.assign({}, ctx.session, {
      hasLogin: true,
      ...ctx.request.body
    }));
  } catch(e) {
    ctx.logger(`[update user info error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.changePassword = async function(ctx) {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  const { oldpsw, newpsw } = ctx.request.body;
  let userInfo = null;
  try {
    userInfo = await Mysql.selectUserByUid(uid);
  } catch(e) {
    ctx.logger(`[change pws error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(!userInfo[0]) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.userNotExist
      }
    };
    return;
  }
  if(userInfo[0].password === createSecretPassword(oldpsw)) {
    try {
      await Mysql.changePassword(createSecretPassword(newpsw), uid);
    } catch(e) {
      ctx.logger(`[change pws error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
  } else {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.changePasswordError
      }
    };
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getDynamicContent = async(ctx) => {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.success,
      data: {}
    };
    return;
  }
  // 获取最后在线时间，若不存在记录则置为0
  let time = null;
  try {
    time = await Mysql.selectOnlineTime(uid);
    if(time[0]) {
      time = +time[0].lastTime;
    } else {
      time = 0;
    }
  } catch(e) {
    ctx.logger(`[select user:${uid} last online time error!:]${e.sqlMessage}`);
  }
  // 获取动态内容
  try {
    const ret = await Mysql.selectDynamicContent(uid);
    const _old = ret.filter(i => +i.time < time);
    const _new = ret.filter(i => +i.time >= time);
    const now = Date.now();
    // 更新用户在线时间
    try {
      await Mysql.updateOnlineTime(uid, now);
    } catch(e) {
      ctx.logger(`[update user:${uid} online time error!]:${e.sqlMessage}`);
    }
    ctx.body = {
      type: code.success,
      data: {
        old_record: _old.sort((a, b) => b.time - a.time),
        new_record: _new.sort((a, b) => b.time - a.time)
      }
    };
  } catch(e) {
    ctx.logger(`[get dynamic error!]:${e.sqlMessage}`);
    ctx.body = serverError;
  }
};
