const Mysql = require('../lib/mysql/query');
const { logEvent } = require('../lib/logger');

module.exports.story = async function(ctx) {
  const { id } = ctx.params;
  if(typeof +id !== 'number') {
    ctx.render('error');
    return;
  }
  let info = null;
  try {
    info = await Mysql.selectArticleByAid(id);
  } catch(e) {
    logEvent('[get article info by aid error!]:', e.sqlMessage);
    ctx.render('error', {
      code: 500,
      status: '服务器异常'
    });
    return;
  }
  if(!info[0]) {
    ctx.render('error');
    return;
  }
  let author = null;
  // get authorname
  try {
    author = await Mysql.selectUserByUid(info[0].uid);
  } catch(e) {
    ctx.render('error', {
      code: 500,
      status: '服务器异常'
    });
    logEvent('[get article info by aid error!]:', e.sqlMessage);
  }
  if(!author[0]) {
    ctx.render('error');
    return;
  }
  // judgement if user has supported the article and if user has collected the article
  if(ctx.session.uid) {
    let has_support = null;
    try {
      has_support = await Mysql.selectArticleSupport(id, ctx.session.uid);
    } catch(e) {
      logEvent('[judgement user support article error!]:', e.sqlMessage);
      return;
    }
    if(has_support[0]) {
      info[0].has_support = 1;
    }
    let has_collect = null;
    try {
      has_collect = await Mysql.selectIfCollectArticle(id, ctx.session.uid);
    } catch(e) {
      logEvent('[judgement user collect article error!]:', e.sqlMessage);
      return;
    }
    if(has_collect[0]) {
      info[0].has_collect = 1;
    }
  }
  // get support count;
  let support_count = 0;
  try {
    support_count = await Mysql.selectArticleSupportCount(id);
  } catch(e) {
    logEvent('[select article support count error!]:', e.sqlMessage);
  }
  if(support_count[0]) {
    info[0].support_count = support_count[0].count;
  } else {
    info[0].support_count = 0;
  }
  // get collect count;
  let collect_count = 0;
  try {
    collect_count = await Mysql.selectCollectArticleCount(id);
  } catch(e) {
    logEvent('[select article collect count error!]:', e.sqlMessage);
  }
  if(collect_count[0]) {
    info[0].collect_count = collect_count[0].count;
  } else {
    info[0].collect_count = 0;
  }

  // if user has paied attention
  let has_pay_attention = 0;
  const { uid } = ctx.session;
  if(uid) {
    try {
      has_pay_attention = await Mysql.showIfPayAttention(uid, author[0].uid);
    } catch(e) {
      ctx.logger('[judgement if has paied attention in story page error!]:', JSON.stringify(e.sqlMessage));
    }
    info[0].followed = 0;
    if(has_pay_attention[0]) {
      info[0].followed = 1;
    }
  }

  // get fans count
  let fans_count = 0;
  try {
    fans_count = await Mysql.showFans(author[0].uid);
  } catch(e) {
    ctx.logger('[show fans error!]:', JSON.stringify(e.sqlMessage));
  }

  ctx.render('story', {
    article: JSON.stringify({
      author: author[0].nickname,
      avatar: author[0].avatar,
      author_fans_count: fans_count[0].count,
      ...info[0]
    }),
    title: info[0].title
  });
};

module.exports.question = async function(ctx) {
  const { id } = ctx.params;
  if(typeof +id !== 'number') {
    ctx.render('error');
    return;
  }
  let info = null;
  try {
    info = await Mysql.selectQuestionByQid(id);
  } catch(e) {
    logEvent('[select question by qid error!]:', e.sqlMessage);
    ctx.render('error', {
      code: 500,
      status: '服务器异常'
    });
    return;
  }
  if(!info[0]) {
    ctx.render('error');
    return;
  }
  // get authorname
  let author = null;
  try {
    author = await Mysql.selectUserByUid(info[0].uid);
  } catch(e) {
    logEvent('[get article info by aid error!]:', e.sqlMessage);
    ctx.render('error', {
      code: 500,
      status: '服务器异常'
    });
    return;
  }
  if(!author[0]) {
    ctx.render('error');
    return;
  }
  ctx.render('question', {
    questionInfo: JSON.stringify({
      ...info[0],
      author: author[0].nickname,
      avatar: author[0].avatar,
      author_uid: author[0].uid
    }),
    title: info[0].title
  });
};

module.exports.preview = async(ctx) => {
  ctx.render('preview');
};
