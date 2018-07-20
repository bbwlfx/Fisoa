const command = require('./command');

const query = (sql, values) => new Promise((resolve, reject) => {
  global.connection.query(sql, values, (err, rows) => {
    if(err) {
      reject(err);
    } else {
      resolve(rows);
    }
  });
});
module.exports = {
  insertUser: (account, password, email) => query(command.insertUser, [account, password, email]),
  selectUser: account => query(command.selectUser, [account]),
  selectUserByUid: uid => query(command.selectUserByUid, [uid]),
  showAttention: uid => query(command.showAttention, [uid]),
  insertQuestion: (uid, title, tags, content, time) =>
    query(command.insertQuestion, [uid, title, tags, content, time, time]),
  insertArticle: (uid, title, content, tags, time, cover, banner) =>
    query(command.insertArticle, [uid, title, content, time, tags, cover, banner, time]),
  modifyArticle: (aid, title, content, tags, time, cover, banner) =>
    query(command.modifyArticle, [title, content, time, tags, cover, banner, time, aid]),
  selectArticle: (uid, start, end) => query(command.selectArticle, [uid, start, end]),
  selectArticleCommentCount: aid => query(command.selectArticleCommentCount, [aid]),
  selectArticleByAid: aid => query(command.selectArticleByAid, [aid]),
  deleteArticle: aid => query(command.deleteArticle, [aid]),
  insertArticleComment: (aid, uid, content, time) =>
    query(command.insertArticleComment, [aid, uid, content, time]),
  selectArticleComment: aid => query(command.selectArticleComment, [aid]),
  selectQuestion: (uid, start, end) => query(command.selectQuestion, [uid, start, end]),
  selectQuestionByQid: qid => query(command.selectQuestionByQid, [qid]),
  selectAnswer: qid => query(command.selectAnswer, [qid]),
  insertAnswer: (qid, uid, content, time) => query(command.insertAnswer, [qid, uid, content, time]),
  selectQuestionCommentCount: qid =>
    query(command.selectQuestionCommentCount, [qid]),
  insertArticleSupport: (aid, uid) => query(command.insertArticleSupport, [aid, uid]),
  selectArticleSupportCount: aid => query(command.selectArticleSupportCount, [aid]),
  selectArticleSupport: (aid, uid) => query(command.selectArticleSupport, [aid, uid]),
  insertArticleCommentSupport: (cid, uid) =>
    query(command.insertArticleCommentSupport, [cid, uid]),
  selectArticleCommentSupport: cid => query(command.selectArticleCommentSupport, [cid]),
  selectIfArticleCommentSupport: (cid, uid) =>
    query(command.selectIfArticleCommentSupport, [cid, uid]),
  insertAnswerSupport: (cid, uid) => query(command.insertAnswerSupport, [cid, uid]),
  selectAnswerSupportCount: cid => query(command.selectAnswerSupportCount, [cid]),
  selectIfAnswerSupport: (cid, uid) => query(command.selectIfAnswerSupport, [cid, uid]),
  updateUserInfo: (json) => {
    const { sex, school, area, nickname, blog, qq, wechat, weibo, description, uid, overt, openmail, email } = json;
    return query(
      command.updateUserInfo,
      [sex, school, area, nickname, blog, qq, wechat, weibo, description, +overt, +openmail, email, uid]
    );
  },
  changePassword: (password, uid) => query(command.changePassword, [password, uid]),
  insertCollectArticle: (aid, uid) => query(command.insertCollectArticle, [aid, uid]),
  selectIfCollectArticle: (aid, uid) => query(command.selectIfCollectArticle, [aid, uid]),
  selectCollectArticleCount: aid => query(command.selectCollectArticleCount, [aid]),
  selectCollectList: (uid, start, end) => query(command.selectCollectList, [uid, start, end]),
  removeCollect: (aid, uid) => query(command.removeCollect, [aid, uid]),
  deleteQuestion: qid => query(command.deleteQuestion, [qid]),
  insertAttention: (uid, atid) => query(command.insertAttention, [uid, atid]),
  deleteAttention: (uid, atid) => query(command.deleteAttention, [uid, atid]),
  showFans: atid => query(command.showFans, [atid]),
  showIfPayAttention: (uid, atid) => query(command.showIfPayAttention, [uid, atid]),
  getAttentionList: uid => query(command.getAttentionList, [uid]),
  selectFeedArticle: (start, end) => query(command.selectFeedArticle, [start, end]),
  selectFeedQuestion: (start, end) => query(command.selectFeedQuestion, [start, end]),
  updateAvatar: (uid, avatar) => query(command.updateAvatar, [avatar, uid]),
  updateBanner: (uid, avatar) => query(command.updateBanner, [avatar, uid]),
  selectBulletin: () => query(command.selectBulletin),
  postBulletin: (aid, time, uid) => query(command.postBulletin, [aid, time, uid]),
  deleteBulletin: bid => query(command.deleteBulletin, [bid]),
  postSystemMessage: (target, content, time) => query(command.postSystemMessage, [target, content, time]),
  getSystemMessage: () => query(command.getSystemMessage, []),
  getUserSystemMessage: uid => query(command.getUserSystemMessage, [uid, 'all']),
  deleteSystemMessage: mid => query(command.deleteSystemMessage, [mid]),
  postFeedback: (uid, content) => query(command.postFeedback, [uid, content]),
  getFeedbackList: () => query(command.getFeedbackList, []),
  changeStatus: (uid, status) => query(command.changeStatus, [status, uid]),
  banAccount: (uid, reason, time) => query(command.banAccount, [uid, time, reason]),
  getBannedList: () => query(command.getBannedList, []),
  deleteBannedRecord: uid => query(command.deleteBannedRecord, [uid]),
  addLV: (uid, lv) => query(command.addLV, [lv, uid]),
  setExpr: (uid, expr) => query(command.setExpr, [expr, uid]),
  selectUidByAid: aid => query(command.selectUidByAid, [aid]),
  selectUidByCid: cid => query(command.selectUidByCid, [cid]),
  readMessage: uid => query(command.readMessage, [uid.toString()]),
  getUnreadMessage: uid => query(command.getUnreadMessage, [uid]),
  resetPasswordByAccount: (account, pass) => query(command.resetPasswordByAccount, [pass.toString(), account.toString()]),
  commentPushMessage: aid => query(command.commentPushMessage, [aid]),
  answerPushMessage: qid => query(command.answerPushMessage, [qid]),
  selectEmailByAccount: account => query(command.selectEmailByAccount, [account]),
  viewArticle: aid => query(command.viewArticle, [aid]),
  calcArticleRank: () => query(command.calcArticleRank, []),
  resetArticleRank: () => query(command.resetArticleRank, []),
  getArticleRank: () => query(command.getArticleRank, []),
  updateQuesionTime: (qid, time) => query(command.updateQuesionTime, [time, qid]),
  updateArticleTime: (aid, time) => query(command.updateArticleTime, [time, aid]),
  selectSimpleArticle: uid => query(command.selectSimpleArticle, [uid]),
  updateOnlineTime: (uid, time) => query(command.updateOnlineTime, [uid, time, time]),
  selectOnlineTime: uid => query(command.selectOnlineTime, [uid]),
  selectDynamicContent: uid => query(command.selectDynamicContent, [uid, uid]),
  getNewRecord: uid => query(command.getNewRecord, [uid, uid, uid, uid])
};

