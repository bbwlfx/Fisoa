const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');

module.exports.readMessage = async(ctx) => {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.loginError
      }
    };
    return;
  }
  try {
    await Mysql.readMessage(uid);
  } catch(e) {
    ctx.logger(`[uid: ${uid} read message error!]: ${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getUnreadMessage = async(ctx) => {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.loginError
      }
    };
    return;
  }
  // 未读消息
  let ret = null;
  try {
    ret = await Mysql.getUnreadMessage(uid);
  } catch(e) {
    ctx.logger(`[uid: ${uid} get unread message error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // 新动态
  let newDynamic = null;
  try {
    newDynamic = await Mysql.getNewRecord(uid);
  } catch(e) {
    ctx.logger(`[uid: ${uid} get new dynamic record error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }

  ctx.body = {
    type: code.success,
    data: {
      unread: ret[0] ? ret[0].unread : 0,
      new_record: newDynamic[0] ? newDynamic[0].exist : 0
    }
  };
};
