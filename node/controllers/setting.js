
module.exports.setting = async function(ctx) {
  const { uid } = ctx.session;
  if(!uid) {
    ctx.redirect('/');
    return;
  }
  ctx.render('setting');
};
