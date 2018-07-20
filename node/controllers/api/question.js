const addExpr = require('../../util/addExpr');
const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const mailServer = require('../../util/mailServer');
const Mysql = require('../../lib/mysql/query');

module.exports.postQuestion = async function(ctx) {
  if(!ctx.session.uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  const { title, tags, content, time } = ctx.request.body;
  if(!title || !tags || !content) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.contentNotNull
      }
    };
    return;
  }
  try {
    await Mysql.insertQuestion(ctx.session.uid, title, tags, content, time);
  } catch(e) {
    ctx.logger(`[insert question error]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  try {
    await addExpr(ctx, ctx.session, 5);
  } catch(e) {
    ctx.logger(`[set user:${ctx.session.uid} expr error!]:${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.deleteQuestion = async function(ctx) {
  const { uid } = ctx.session;
  const { qid } = ctx.request.body;
  if(!uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  let info = null;
  try {
    info = await Mysql.selectQuestionByQid(qid);
  } catch(e) {
    ctx.logger(`[delete question error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(info[0] && ctx.session.status !== 5) {
    if(info[0].uid !== uid) {
      ctx.body = {
        type: code.otherError,
        data: {
          msg: errorMsg.cannotDeleteQuestion
        }
      };
      return;
    }
  }
  try {
    await Mysql.deleteQuestion(qid);
  } catch(e) {
    ctx.logger(`[delete question error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getQuestion = async function(ctx) {
  const { uid, count, show_num } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.paramsError
      }
    };
    return;
  }
  const start = count * show_num;
  const end = (count + 1) * show_num;
  let has_more = false;
  let question = null;
  try {
    question = await Mysql.selectQuestion(uid, start, end + 1);
  } catch(e) {
    ctx.logger(`[select question error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  for(const item of question) {
    let comments_count = 0;
    try {
      // calc the comments count;
      comments_count = await Mysql.selectQuestionCommentCount(item.qid);
    } catch(e) {
      ctx.logger(`[count article comments number error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(comments_count[0]) {
      item.comments_count = comments_count[0].count;
    }
  }
  if(question.length > show_num) {
    has_more = true;
    // delete the last one which id extra;
    question = question.slice(0, show_num);
  }
  ctx.body = {
    type: code.success,
    data: {
      question,
      has_more
    }
  };
};

module.exports.getAnswerList = async function(ctx) {
  const { qid } = ctx.query;
  if(!qid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.paramsError
      }
    };
    return;
  }
  let answer = null;
  try {
    answer = await Mysql.selectAnswer(qid);
  } catch(e) {
    ctx.logger(`[select answer error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(!answer) {
    return;
  }
  for(const item of answer) {
    // get user infomation
    let userInfo = null;
    try {
      userInfo = await Mysql.selectUserByUid(item.uid);
    } catch(e) {
      ctx.logger(`[select user info error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    // judgement if user has supported
    if(ctx.session.uid) {
      let has_thanks = 0;
      try {
        has_thanks = await Mysql.selectIfAnswerSupport(item.cid, ctx.session.uid);
      } catch(e) {
        ctx.logger(`[select if user support answer error!]: ${e.sqlMessage}`);
        ctx.body = serverError;
        return;
      }
      if(has_thanks[0]) {
        item.has_thanks = 1;
      }
    }
    // get support count
    let thanks_count = 0;
    try {
      thanks_count = await Mysql.selectAnswerSupportCount(item.cid);
    } catch(e) {
      ctx.logger(`[select answer support count error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(thanks_count) {
      item.thanks_count = thanks_count[0].count;
    }
    Object.assign(item, {
      author: userInfo[0].nickname,
      avatar: userInfo[0].avatar
    });
  }
  answer.sort((a, b) => a.thanks_count < b.thanks_count);
  ctx.body = {
    type: code.success,
    data: {
      answerList: answer
    }
  };
};

// uid 目标用户id， qid 问题id， title 问题标题
const pushMessage = async(ctx, qid) => {
  // 获取问题信息
  let info = null;
  try {
    info = await Mysql.selectQuestionByQid(qid);
  } catch(e) {
    ctx.logger(`[something wrong when selecting question by qid at pushing message to user]:${e.sqlMessage}`);
  }
  const { uid, title } = info[0];
  const time = Date.now().toString();
  const content = `<a href="/profile/${ctx.session.uid}">${ctx.session.nickname}</a> 刚刚回答了你的问题 <a href="/question/${qid}">《${title}》</a>`;
  try {
    await Mysql.postSystemMessage(uid, content, time);
  } catch(e) {
    ctx.logger(`[push answer to user:${uid} error!]: ${e.sqlMessage}`);
  }
};

module.exports.postAnswer = async function(ctx) {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.body = {
      type: code.otherError,
      data: {
        msg: errorMsg.userLogin
      }
    };
    return;
  }
  const { qid, content, time } = ctx.request.body;
  if(!qid) {
    ctx.body = {
      type: code.otherError,
      data: {
        msg: errorMsg.questionNotExist
      }
    };
    return;
  }
  try {
    await Mysql.insertAnswer(qid, uid, content, time);
  } catch(e) {
    ctx.logger(`[insert answer error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // 更新问题时间
  try {
    await Mysql.updateQuesionTime(qid, time);
  } catch(e) {
    ctx.logger(`[update question time error!]:${e.sqlMessage}`);
  }
  try {
    await addExpr(ctx, ctx.session, 10);
  } catch(e) {
    ctx.logger(`[set user:${ctx.session.uid} expr error!]:${e}`);
  }
  // 向目标用户发推送
  try {
    await pushMessage(ctx, qid);
  } catch(e) {
    ctx.logger(`[push answer error!]: ${e}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
  // 是否需要向目标发送邮件推送
  try {
    const ret = await Mysql.answerPushMessage(qid);
    const { openmail, email, title } = ret[0];
    if(openmail) {
      const html = `<p><a href="http://120.79.31.126/profile/${ctx.session.uid}">${ctx.session.nickname}</a> 刚刚回答了你的问题 <a href="http://120.79.31.126/question/${qid}">《${title}》</a></p>`;
      mailServer.emit('push', email, html);
    }
  } catch(e) {
    ctx.logger(`[Answer: push email to user:${uid} error!]:${e}`);
  }
};

module.exports.postAnswerSupport = async function(ctx) {
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
  const { cid } = ctx.request.body;
  if(!cid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.commentNotExist
      }
    };
    return;
  }
  try {
    await Mysql.insertAnswerSupport(cid, uid);
  } catch(e) {
    ctx.logger(`[support answer error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // 回答点赞增加对方用户经验值
  let targetInfo = {};
  try {
    targetInfo = await Mysql.selectUidByCid(cid);
  } catch(e) {
    ctx.logger(`[add user expr by post answer support error!]: ${e.sqlMessage}`);
  }
  try {
    await addExpr(ctx, targetInfo[0], 2);
  } catch(e) {
    ctx.logger(`[set user:${targetInfo.uid} expr error!]:${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};
