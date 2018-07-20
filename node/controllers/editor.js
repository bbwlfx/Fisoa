module.exports.index = async function(ctx) {
  const uid = ctx.session && ctx.session.uid;
  if(!uid) {
    ctx.redirect('/');
    return;
  }
  ctx.render('editor');
};

