const addExpr = require('../../util/addExpr');
const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');
const mailServer = require('../../util/mailServer');
const generateDescription = require('../../util/generateDescription');

module.exports.viewArticle = async(ctx) => {
  const { aid } = ctx.query;
  if(!aid) {
    ctx.body = {
      type: code.paramsError
    };
    return;
  }
  try {
    await Mysql.viewArticle(aid);
  } catch(e) {
    ctx.body = serverError;
    ctx.logger(`[view article :${aid} error!]:${JSON.stringify(e)}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.postCollectArticle = async function(ctx) {
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
  try {
    await Mysql.insertCollectArticle(aid, uid);
  } catch(e) {
    ctx.logger(`[collect article error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // 收藏文章增加对方用户经验值
  let targetInfo = {};
  try {
    targetInfo = await Mysql.selectUidByAid(aid);
  } catch(e) {
    ctx.logger(`[add user expr by collect article error!]: ${e.sqlMessage}`);
  }
  try {
    await addExpr(ctx, targetInfo[0], 3);
  } catch(e) {
    ctx.logger(`[set user:${targetInfo[0].uid} expr error!]:${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.postArticle = async function(ctx) {
  if(!ctx.session.uid) {
    ctx.body = {
      type: code.loginError,
      data: {
        msg: errorMsg.needLogin
      }
    };
    return;
  }
  const { title, tags, content, time, cover, banner, edit, aid } = ctx.request.body;
  const _tags = tags.join(',');

  const id = edit ? aid : ctx.session.uid;
  const func = edit ? Mysql.modifyArticle : Mysql.insertArticle;
  const msg = edit ? '[edit article content error!]:' : '[insert article error]:';

  try {
    await func(id, title, content, _tags, time, cover, banner);
  } catch(e) {
    ctx.logger(`${msg} ${e.sqlMessage}`);
    ctx.body = serverError;
  }

  if(!edit) {
    try {
      await addExpr(ctx, ctx.session, 20);
    } catch(e) {
      ctx.logger(`[set user:${ctx.session.uid} expr error!]:${e.sqlMessage}`);
    }
  }

  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.getSimpleArticleList = async(ctx) => {
  let article_list = [];
  const { uid } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {}
    };
    return;
  }
  try {
    article_list = await Mysql.selectSimpleArticle(uid);
  } catch(e) {
    ctx.logger(`[get article list error in story page]:${e.sqlMessage}`);
    ctx.body = serverError;
  }
  ctx.body = {
    type: code.success,
    data: article_list
  };
};

module.exports.getArticle = async function(ctx) {
  const { count, show_num, uid } = ctx.query;
  if(!uid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.userNotExist
      }
    };
    return;
  }
  const start = count * show_num;
  const end = (count + 1) * show_num;
  let ret = null;
  let has_more = false;
  try {
    // select one more to confirm that if we have more articles;
    ret = await Mysql.selectArticle(uid, start, end + 1);
  } catch(e) {
    ctx.logger(`[select article error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // delete the last one which id extra;
  if(ret.length > show_num) {
    has_more = true;
    ret = ret.slice(0, show_num);
  }
  for(const item of ret) {
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

    // calc the collect count;
    let collect_count = 0;
    try {
      collect_count = await Mysql.selectCollectArticleCount(item.aid);
      if(collect_count[0]) {
        item.collect_count = collect_count[0].count;
      }
    } catch(e) {
      ctx.logger(`[get collect article counts error!]:${e.sqlMessage}`);
    }
  }
  ctx.body = {
    type: code.success,
    data: {
      items: ret,
      has_more
    }
  };
};

module.exports.getArticleRank = async(ctx) => {
  try {
    const data = await Mysql.getArticleRank();
    ctx.body = {
      type: code.success,
      data
    };
  } catch(e) {
    ctx.logger('[get article rank error!]');
    ctx.body = serverError;
  }
};

module.exports.deleteArticle = async function(ctx) {
  const { aid } = ctx.query;
  if(!aid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.articleNotExist
      }
    };
  }
  const { uid } = ctx.session;
  let info = null;
  try {
    info = await Mysql.selectArticleByAid(aid);
  } catch(e) {
    ctx.logger(`[delete article error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(info[0] && ctx.session.status !== 5) {
    if(info[0].uid !== uid) {
      ctx.body = {
        type: code.otherError,
        data: {
          msg: errorMsg.cannotDeleteArticle
        }
      };
      return;
    }
  }
  try {
    await Mysql.deleteArticle(aid);
  } catch(e) {
    ctx.logger(`[delete article error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

// uid 目标用户id， aid 文章id， title 问题标题
const pushCommentMessage = async(ctx, aid) => {
  // 获取问题信息
  let info = null;
  try {
    info = await Mysql.selectArticleByAid(aid);
  } catch(e) {
    ctx.logger(`[something wrong when selecting article by aid at pushing message to user]:${e.sqlMessage}`);
  }
  const { uid, title } = info[0];
  const time = Date.now().toString();
  const content = `<a href="/profile/${ctx.session.uid}">${ctx.session.nickname}</a> 刚刚评论了你的文章 <a href="/article/${aid}">《${title}》</a>`;
  try {
    await Mysql.postSystemMessage(uid, content, time);
  } catch(e) {
    ctx.logger(`[push comment message to user:${uid} error!]: ${e.sqlMessage}`);
  }
};

module.exports.postArticleComment = async function(ctx) {
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
  const { aid, content, time } = ctx.request.body;
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
    await Mysql.insertArticleComment(aid, uid, content, time);
  } catch(e) {
    ctx.logger(`[post article comment error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }

  // 更新文章时间
  try {
    await Mysql.updateArticleTime(aid, time);
  } catch(e) {
    ctx.logger(`[update article time error!]:${e.sqlMessage}`);
  }

  try {
    await addExpr(ctx, ctx.session, 1);
  } catch(e) {
    ctx.logger(`[set user:${ctx.session.uid} expr error!]:${e.sqlMessage}`);
  }

  // 推送文章评论的消息通知
  try {
    await pushCommentMessage(ctx, aid);
  } catch(e) {
    ctx.logger(`[push article comment message to user error!]: ${e}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
  // 是否需要向目标发送邮件推送
  try {
    const ret = await Mysql.commentPushMessage(aid);
    const { openmail, email, title } = ret[0];
    if(openmail) {
      const html = `<p><a href="http://120.79.31.126/profile/${ctx.session.uid}">${ctx.session.nickname}</a> 刚刚回答了你的问题 <a href="http://120.79.31.126/article/${aid}">《${title}》</a></p>`;
      mailServer.emit('push', email, html);
    }
  } catch(e) {
    ctx.logger(`[Answer: push email to user:${uid} error!]:${e}`);
  }
};

module.exports.getArticleComment = async function(ctx) {
  const { aid } = ctx.query;
  if(!aid) {
    ctx.body = {
      type: code.paramsError,
      data: {
        msg: errorMsg.articleNotExist
      }
    };
    return;
  }
  let comments = [];
  try {
    comments = await Mysql.selectArticleComment(aid);
  } catch(e) {
    ctx.logger(`[get article comments error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  for(const item of comments) {
    // get user infomation
    let userInfo = null;
    try {
      userInfo = await Mysql.selectUserByUid(item.uid);
    } catch(e) {
      ctx.logger(`[select user error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    // get support counts;
    let support_count = 0;
    try {
      support_count = await Mysql.selectArticleCommentSupport(item.cid);
    } catch(e) {
      ctx.logger(`[select article comment support count error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    // judgement if user has supported
    let has_support = null;
    if(ctx.session.uid) {
      try {
        has_support = await Mysql.selectIfArticleCommentSupport(item.cid, ctx.session.uid);
      } catch(e) {
        ctx.logger(`[judgement if user has supported error!]: ${e.sqlMessage}`);
        ctx.body = serverError;
        return;
      }
      if(has_support[0]) {
        item.has_support = 1;
      }
    }
    Object.assign(item, {
      nickname: userInfo[0].nickname,
      avatar: userInfo[0].avatar,
      support_count: support_count[0].count
    });
  }
  comments.sort((a, b) => a.support_count < b.support_count);
  ctx.body = {
    type: code.success,
    data: {
      comments
    }
  };
};

module.exports.postArticleSupport = async function(ctx) {
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
  const { aid } = ctx.request.body;
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
    await Mysql.insertArticleSupport(aid, uid);
  } catch(e) {
    ctx.logger(`[support article error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  // 文章点赞增加对方用户经验值
  let targetInfo = {};
  try {
    targetInfo = await Mysql.selectUidByAid(aid);
  } catch(e) {
    ctx.logger(`[add user expr by post article support error!]: ${e.sqlMessage}`);
  }
  try {
    await addExpr(ctx, targetInfo[0], 1);
  } catch(e) {
    ctx.logger(`[set user:${targetInfo.uid} expr error!]:${e.sqlMessage}`);
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

module.exports.postArticleCommentSupport = async function(ctx) {
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
    await Mysql.insertArticleCommentSupport(cid, uid);
  } catch(e) {
    ctx.logger(`[support article comment error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};

