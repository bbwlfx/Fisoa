const Mysql = require('../lib/mysql/query');

module.exports.profile = async(ctx) => {
  const { id } = ctx.params;
  if(typeof +id !== 'number') {
    ctx.redirect('/');
    return;
  }
  let info = null;
  try {
    info = await Mysql.selectUserByUid(id);
  } catch(e) {
    ctx.logger('[get profile info fail!:]', JSON.stringify(e.sqlMessage));
  }
  if(!info[0]) {
    ctx.redirect('/');
    return;
  }
  let attention = 0;
  try {
    attention = await Mysql.showAttention(id);
  } catch(e) {
    ctx.logger('[show attention error!]:', JSON.stringify(e.sqlMessage));
  }
  if(attention[0]) {
    info[0].attention = attention[0].count;
  }
  // get fans count
  let fans = 0;
  try {
    fans = await Mysql.showFans(id);
  } catch(e) {
    ctx.logger('[show fans error!]:', JSON.stringify(e.sqlMessage));
  }
  if(fans[0]) {
    info[0].fans_count = fans[0].count;
  }

  // if user has attention
  let has_pay_attention = 0;
  const { uid } = ctx.session;
  if(uid) {
    try {
      has_pay_attention = await Mysql.showIfPayAttention(uid, id);
    } catch(e) {
      ctx.logger('[judgement if has pay attention error!]:', JSON.stringify(e.sqlMessage));
    }
    info[0].followed = 0;
    if(has_pay_attention[0]) {
      info[0].followed = 1;
    }
  }
  delete info[0].account;
  delete info[0].password;
  ctx.render('profile', {
    profileInfo: JSON.stringify(info[0]),
    title: info[0].nickname
  });
};
