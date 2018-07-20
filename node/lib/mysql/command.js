module.exports = {
  selectUser: 'select * from T_user where account=?;',
  insertUser: 'insert into T_user(account, password, email) values(?,?,?);',
  selectUserByUid: 'select * from T_user where uid=?;',
  selectEmailByAccount: 'select email from T_user where account=?;',
  showAttention: 'select COUNT(*) as count from T_user_attention where uid=?;',
  showFans: 'select COUNT(*) as count from T_user_attention where atid=?;',
  showIfPayAttention: 'select * from T_user_attention where uid=? and atid=?;',
  updateUserInfo: 'update T_user set sex=?, school=?, area=?, nickname=?, blog=?, qq=?, wechat=?, weibo=?, description=?, overt=?, openmail=?, email=? where uid=?;',
  changePassword: 'update T_user set password=? where uid=?;',
  insertAttention: 'insert into T_user_attention(uid, atid) values(?,?);',
  deleteAttention: 'delete from T_user_attention where uid=? and atid=?;',
  getAttentionList: 'select * from T_user where uid in (select atid from T_user_attention where uid=?);',
  updateAvatar: 'update T_user set avatar=? where uid=?',
  updateBanner: 'update T_user set banner=? where uid=?',
  changeStatus: 'update T_user set status=? where uid=?',
  banAccount: 'insert into T_banned_list(uid, time, reason) values(?,?,?)',
  addLV: 'update T_user set lv=? where uid=?',
  setExpr: 'update T_user set expr=? where uid=?',
  selectUidByAid: 'select * from T_user where uid = (select uid from T_article where aid=?)',
  selectUidByCid: 'select * from T_user where uid = (select uid from T_question_comment where cid=?)',
  resetPasswordByAccount: 'update T_user set password=? where account=?',
  commentPushMessage: 'select * from (select email, openmail, aid, title from T_user join T_article on T_user.uid = T_article.uid) as t1 where t1.aid=?;',
  answerPushMessage: 'select * from (select email, openmail, qid, title from T_user join T_question on T_user.uid = T_question.uid) as t1 where t1.qid=?;',

  // question
  insertQuestion: 'insert into T_question(uid, title, tags, content, time, updateTime) values(?,?,?,?,?,?);',
  selectQuestion: 'select * from T_question where uid=? order by time desc limit ?,?;',
  selectQuestionByQid: 'select * from T_question where qid=?;',
  selectQuestionCommentCount: 'select count(*) as count from T_question_comment where qid=?;',
  selectAnswer: 'select * from T_question_comment where qid=? order by thanks;',
  insertAnswer: 'insert into T_question_comment(qid, uid, content, time) values(?,?,?,?);',
  insertAnswerSupport: 'insert into T_support_quesion_comment(cid, uid) values(?,?);',
  selectAnswerSupportCount: 'select count(*) as count from T_support_quesion_comment where cid=?;',
  selectIfAnswerSupport: 'select * from T_support_quesion_comment where cid=? and uid=?;',
  deleteQuestion: 'delete from T_question where qid=?;',
  updateQuesionTime: 'update T_question set updateTime=? where qid=?',

  // article
  viewArticle: 'update T_article set view = view + 1 where aid=?',
  insertArticle: 'insert into T_article(uid, title, content, time, tags, cover, banner, updateTime) values(?,?,?,?,?,?,?,?);',
  modifyArticle: 'update T_article set title=?, content=?, time=?, tags=?, cover=?, banner=?, updateTime=? where aid=?;',
  selectSimpleArticle: 'select aid, title, cover, time, view from T_article where uid=? and aid not in (select aid from T_bulletin) order by time desc limit 0, 5',
  selectArticle: 'select * from T_article where uid=? and aid not in (select aid from T_bulletin) order by time desc limit ?,?;',
  selectArticleCommentCount: 'select count(*) as count from T_article_comment where aid=?;',
  selectArticleByAid: 'select * from T_article where aid=?;',
  deleteArticle: 'delete from T_article where aid=?;',
  insertArticleComment: 'insert into T_article_comment(aid, uid, content, time) values(?,?,?,?);',
  selectArticleComment: 'select * from T_article_comment where aid=? order by support desc;',
  insertArticleSupport: 'insert into T_support_article(aid, uid) values(?,?);',
  selectArticleSupportCount: 'select count(*) as count from T_support_article where aid=?;',
  selectArticleSupport: 'select * from T_support_article where aid=? and uid=?;',
  insertArticleCommentSupport: 'insert into T_support_article_comment(cid, uid) values(?,?);',
  selectArticleCommentSupport: 'select count(*) as count from T_support_article_comment where cid=?;',
  selectIfArticleCommentSupport: 'select * from T_support_article_comment where cid=? and uid=?;',
  insertCollectArticle: 'insert into T_collect_article(aid, uid) values(?,?);',
  selectIfCollectArticle: 'select * from T_collect_article where aid=? and uid=?;',
  selectCollectArticleCount: 'select count(*) as count from T_collect_article where aid=?;',
  selectCollectList: 'select * from T_article where aid in (select aid from T_collect_article where uid=?) limit ?,?;',
  removeCollect: 'delete from T_collect_article where aid=? and uid=?;',
  updateArticleTime: 'update T_article set updateTime=? where aid=?',

  // feed
  selectFeedArticle: 'select * from T_article where aid not in (select aid from T_bulletin) order by updateTime desc limit ?,?;',
  selectFeedQuestion: 'select * from T_question order by updateTime desc limit ?,?;',

  // bulletin
  selectBulletin: 'select * from T_bulletin order by time desc',
  postBulletin: 'insert into T_bulletin(aid, time, uid) values(?,?,?)',
  deleteBulletin: 'delete from T_bulletin where bid=?',

  // message
  postSystemMessage: 'insert into T_message_list(target, content, time) values(?,?,?)',
  getSystemMessage: 'select * from T_message_list',
  getUserSystemMessage: 'select * from T_message_list where target=? or target=? order by time desc',
  deleteSystemMessage: 'delete from T_message_list where mid=?',
  readMessage: 'update T_message_list set unread=0 where target=?',
  getUnreadMessage: 'select unread from T_message_list where target=? order by time desc limit 0,1',

  // feedback
  postFeedback: 'insert into T_feedback_list(uid, content) values(?,?)',
  getFeedbackList: 'select * from T_feedback_list',

  // banned list
  getBannedList: 'select * from T_banned_list order by time desc',
  deleteBannedRecord: 'delete from T_banned_list where uid=?',

  calcArticleRank: `
    insert into T_article_rank(
      aid,
      title,
      score,
      author
    )
    select
      aid,
      title,
      ROUND(
        (select view from T_article as t2 where t2.aid = t1.aid) * 2 +
        (select count(*) from T_support_article as t3 where t3.aid = t1.aid) * 5 +
        (select count(*) from T_collect_article as t4 where t4.aid = t1.aid) * 20 +
        (select count(*) from T_article_comment as t5 where t5.aid = t1.aid) * 50 +
        (UNIX_TIMESTAMP() * 1000 - t1.time)/200000, 3) as score,
      (select t6.nickname from T_user as t6 where t6.uid = t1.uid) as author
    from T_article as t1
    where t1.time >= UNIX_TIMESTAMP() * 1000 - (86400000 * 30);
  `,
  resetArticleRank: 'truncate table T_article_rank;',
  getArticleRank: 'select * from T_article_rank;',
  selectOnlineTime: 'select lastTime from T_online_time where uid = ?;',
  updateOnlineTime: 'insert into T_online_time values(?, ?) ON DUPLICATE KEY UPDATE lastTime=?;',
  selectDynamicContent: `
    (select
      title,
      aid as id,
      time,
      uid,
      0 as type,
      (select nickname from T_user as t2 where t2.uid = t1.uid) as nickname 
    from
    T_article as t1
    where
      uid in (select atid from T_user_attention where uid=?)
    limit 0, 20)
    union
    (select
      title,
      qid as id,
      time,
      uid,
      1 as type,
      (select nickname from T_user as t2 where t2.uid = t1.uid) as nickname
    from T_question as t1
    where
      uid in (select atid from T_user_attention where uid=?)
    limit 0, 20)
    order by time desc;`,
  getNewRecord: `select
    ifnull(
      (select time from T_article where uid in 
        (select atid from T_user_attention where uid=?) order by time desc limit 0,1)
        >=
          (select lastTime as time from T_online_time where uid=?)
      or
        (select time from T_question where uid in
          (select atid from T_user_attention where uid=?) order by time desc limit 0,1)
        >=
          (select lastTime as time from T_online_time where uid=?), 0)
    as exist`
};
