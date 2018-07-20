const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');
const generateDescription = require('../../util/generateDescription');

module.exports.getCollectList = async function(ctx) {
  const { uid, show_num, count } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.paramsError
      }
    };
    return;
  }
  let collect_list = [];
  const start = count * show_num;
  const end = (count + 1) * show_num;
  let has_more = false;
  try {
    collect_list = await Mysql.selectCollectList(uid, start, end + 1);
  } catch(e) {
    ctx.logger(`[select collect list error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(collect_list.length > show_num) {
    has_more = true;
    collect_list = collect_list.slice(0, show_num);
  }
  for(const item of collect_list) {
    // generate the description according to the content;
    item.description = generateDescription(item);
    let comments_count = 0;
    try {
      // calc the comments count;
      comments_count = await Mysql.selectArticleCommentCount(item.aid);
    } catch(e) {
      ctx.logger(`[count article comments number error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(comments_count[0]) {
      item.comments_count = comments_count[0].count;
    }
    let support_count = 0;
    try {
      // calc the support count;
      support_count = await Mysql.selectArticleSupportCount(item.aid);
    } catch(e) {
      ctx.logger(`[count article support error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(support_count[0]) {
      item.support_count = support_count[0].count;
    }
  }
  ctx.body = {
    type: code.success,
    data: {
      collect_list,
      has_more
    }
  };
};

module.exports.removeCollect = async function(ctx) {
  const { aid } = ctx.request.body;
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
  if(!aid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.articleNotExist
      }
    };
    return;
  }
  try {
    await Mysql.removeCollect(aid, uid);
  } catch(e) {
    ctx.logger(`[remove collect error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.userAttention = async function(ctx) {
  const { atid } = ctx.request.body;
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
  try {
    await Mysql.insertAttention(uid, atid);
  } catch(e) {
    ctx.logger(`[user attention error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.deleteAttention = async function(ctx) {
  const { atid } = ctx.request.body;
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
  try {
    await Mysql.deleteAttention(uid, atid);
  } catch(e) {
    ctx.logger(`[delete user attention error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getAttentionList = async function(ctx) {
  const { uid } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.userNotExist
      }
    };
    return;
  }
  let attention_list = [];
  try {
    attention_list = await Mysql.getAttentionList(uid);
  } catch(e) {
    ctx.logger(`[get attention list error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: attention_list
  };
};

module.exports.getSystemMessageList = async(ctx) => {
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
  let info = [];
  try {
    info = await Mysql.getUserSystemMessage(uid);
  } catch(e) {
    ctx.logger(`[user get system message in profile error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: info
  };
};