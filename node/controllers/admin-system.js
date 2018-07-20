module.exports.index = async(ctx) => {
  const { session } = ctx;
  const { status } = session;
  if(status !== 5) {
    ctx.redirect('/');
    return;
  }
  ctx.render('admin-system');
};
