const { code } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');
const generateDescription = require('../../util/generateDescription');

module.exports.getFeedList = async function(ctx) {
  const { count, show_num, type } = ctx.query;
  const start = count * show_num;
  const end = (count + 1) * show_num;
  let info = null;
  let has_more = false;
  const TYPE = {
    Article: '0',
    Question: '1'
  };
  try {
    if(type === TYPE.Article) {
      info = await Mysql.selectFeedArticle(start, end + 1);
    } else {
      info = await Mysql.selectFeedQuestion(start, end + 1);
    }
  } catch(e) {
    ctx.logger(`[get feed list error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
    return;
  }
  if(info.length > show_num) {
    info = info.slice(0, show_num);
    has_more = true;
  }
  for(const item of info) {
    if(type === TYPE.Article) {
      item.detail = generateDescription(item);
    }
    // get userInfo
    let userInfo = null;
    try {
      userInfo = await Mysql.selectUserByUid(item.uid);
    } catch(e) {
      ctx.logger(`[get feed list error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(userInfo[0]) {
      Object.assign(item, userInfo[0]);
    }
    // get comments count
    let comment_count = [];
    try {
      if(type === TYPE.Article) {
        comment_count = await Mysql.selectArticleCommentCount(item.aid);
      } else {
        comment_count = await Mysql.selectQuestionCommentCount(item.qid);
      }
    } catch(e) {
      ctx.logger(`[get feed list error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(comment_count[0]) {
      item.comment_count = comment_count[0].count;
    }
    // get collect count
    let collect_count = [];
    try {
      if(type === TYPE.Article) {
        collect_count = await Mysql.selectCollectArticleCount(item.aid);
      }
    } catch(e) {
      ctx.logger(`[get feed list error!]: ${e.sqlMessage}`);
      ctx.body = serverError;
      return;
    }
    if(collect_count[0]) {
      item.collect_count = collect_count[0].count;
    }
  }
  ctx.body = {
    type: code.success,
    data: {
      has_more,
      feed_list: info
    }
  };
};
