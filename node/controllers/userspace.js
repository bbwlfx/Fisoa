const Mysql = require('../lib/mysql/query');

module.exports.userspace = async function(ctx) {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.redirect('/');
    return;
  }
  const info = ctx.session;
  // get attention count
  let attention = 0;
  try {
    attention = await Mysql.showAttention(uid);
  } catch(e) {
    ctx.logger('[show attention error!]:', e.sqlMessage);
  }
  if(attention[0]) {
    info.attention = attention[0].count;
  }
  // get fans count
  let fans = 0;
  try {
    fans = await Mysql.showFans(uid);
  } catch(e) {
    ctx.logger('[show fans error!]:', e.sqlMessage);
  }
  if(fans[0]) {
    info.fans_count = fans[0].count;
  } else {
    info.fans_count = 0;
  }

  ctx.render('userspace', {
    userInfo: JSON.stringify(info)
  });
};
