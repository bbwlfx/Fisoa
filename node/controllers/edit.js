
const Mysql = require('../lib/mysql/query');
const { logEvent } = require('../lib/logger');

module.exports.index = async function(ctx) {
  const { aid } = ctx.params;
  const { uid } = ctx.session;
  if(!uid) {
    ctx.redirect('/');
    return;
  }
  let articleInfo = {};
  try {
    articleInfo = await Mysql.selectArticleByAid(aid);
  } catch(e) {
    logEvent(`[edit article:${aid} info error!]:${e.sqlMessage}`);
  }
  // 非作者本人，无编辑权限
  if(uid !== articleInfo[0].uid) {
    ctx.redirect('/');
    return;
  }
  const { content, title, tags, cover, banner } = articleInfo[0];
  const initState = {
    content,
    title,
    tags: (tags || '').split(','),
    cover,
    banner,
    aid
  };
  ctx.render('editor', {
    __INITSTATE__: JSON.stringify(initState),
    title: `文章编辑-${title}`
  });
};
