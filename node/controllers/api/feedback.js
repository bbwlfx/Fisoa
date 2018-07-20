const { code } = require('../../code.config');
const serverError = require('../../util/commonBody');
const Mysql = require('../../lib/mysql/query');

module.exports.postFeedback = async(ctx) => {
  const { uid = 0 } = ctx.session;
  const { content } = ctx.request.body;
  try {
    await Mysql.postFeedback(uid, content);
  } catch(e) {
    ctx.logger('[post feedback error!:]', e.sqlMessage);
    ctx.body = serverError;
    return;
  }
  ctx.body = {
    type: code.success,
    data: {}
  };
};
