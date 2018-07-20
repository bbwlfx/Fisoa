const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');

module.exports.adminGetArticleInfo = async(ctx) => {
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
  const { aid } = ctx.query;
  if(!aid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.articleNotExist
      }
    };
  }
  let info = null;
  try {
    info = await Mysql.selectArticleByAid(aid);
  } catch(e) {
    ctx.logger('[get articleInfo in adminSystem error!:]', e.sqlMessage);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: info
  };
};

module.exports.adminGetQuestionInfo = async(ctx) => {
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
  const { qid } = ctx.query;
  if(!qid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.questionNotExist
      }
    };
  }
  let info = null;
  try {
    info = await Mysql.selectQuestionByQid(qid);
  } catch(e) {
    ctx.logger(`[get questionInfo in adminSystem error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
  }
  ctx.body = {
    type: code.success,
    data: info
  };
};

module.exports.adminGetBulletin = async(ctx) => {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.needLogin,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  let info = [];
  try {
    info = await Mysql.selectBulletin();
  } catch(e) {
    ctx.body = serverError;
    return;
  }
  for(const item of info) {
    try {
      const article = await Mysql.selectArticleByAid(item.aid);
      item.title = article[0].title;
    } catch(e) {
      ctx.logger(`[get articleInfo error in adminSystem bulletin!]: ${e.sqlMessage}`);
    }

    try {
      const user = await Mysql.selectUserByUid(item.uid);
      item.name = user[0].nickname;
    } catch(e) {
      ctx.logger(`[get userInfo error in adminSystem bulletin!]: ${e.sqlMessage}`);
    }
  }
  ctx.body = {
    type: code.success,
    data: info
  };
};

module.exports.adminPostBulletin = async(ctx) => {
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
  const { aid, time } = ctx.request.body;
  if(!aid || !time) {
    ctx.body = {
      type: code.otherError,
      data: {
        msg: errorMsg.paramsError
      }
    };
    return;
  }
  try {
    await Mysql.postBulletin(aid, time, uid);
  } catch(e) {
    ctx.logger(`[post bulletin error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.adminDeleteBulletin = async(ctx) => {
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
  const { bid } = ctx.request.body;
  try {
    await Mysql.deleteBulletin(bid);
  } catch(e) {
    ctx.logger(`[delete bulletin error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.adminPostSystemMessage = async(ctx) => {
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
  const { target, content, time } = ctx.request.body;
  try {
    await Mysql.postSystemMessage(target, content, time);
  } catch(e) {
    ctx.logger(`[post system message error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.adminGetSystemMessage = async(ctx) => {
  let info = [];
  try {
    info = await Mysql.getSystemMessage();
  } catch(e) {
    ctx.logger(`[get system message error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: info
  };
};

module.exports.adminDeleteSystemMessage = async(ctx) => {
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
  const { mid } = ctx.request.body;
  try {
    await Mysql.deleteSystemMessage(mid);
  } catch(e) {
    ctx.logger(`[delete system message error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.adminChangeStatus = async(ctx) => {
  const { uid, status } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {}
    };
    return;
  }
  try {
    await Mysql.changeStatus(uid, status);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[change user status error!]: ${e.sqlMessage}`);
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.banAccount = async(ctx) => {
  const { uid, reason = '' } = ctx.request.body;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {}
    };
    return;
  }
  const time = Date.now().toString();
  // change status
  try {
    await Mysql.changeStatus(uid, '0');
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[change user status error!]: ${e.sqlMessage}`);
    return;
  }
  // ban account
  try {
    await Mysql.banAccount(uid, reason, time);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[ban account error!]: ${e.sqlMessage}`);
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.unblockAccount = async(ctx) => {
  const { uid } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {}
    };
    return;
  }
  // change status
  try {
    await Mysql.changeStatus(uid, '1');
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[change user status error!]: ${e.sqlMessage}`);
    return;
  }

  // delete record from banned list
  try {
    await Mysql.deleteBannedRecord(uid);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[delete banned record error!]: ${e.sqlMessage}`);
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getBannedList = async(ctx) => {
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
  let data = [];
  try {
    data = await Mysql.getBannedList();
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[get banned list error!]: ${e.sqlMessage}`);
    return;
  }
  ctx.body = {
    type: code.success,
    data
  };
};

module.exports.getFeedbackList = async(ctx) => {
  let data = [];
  try {
    data = await Mysql.getFeedbackList();
  } catch(e) {
    ctx.logger(`[get feedback list in admin error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data
  };
};
