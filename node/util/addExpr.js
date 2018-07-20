const Mysql = require('../lib/mysql/query');
const saveRedis = require('../util/saveRedis');

const level = {
  '1': 100,
  '2': 250,
  '3': 600,
  '4': 1000,
  '5': 2250,
  '6': 5000,
  '7': 9999
};

const addLV = async(ctx, userInfo, lv) => {
  const { uid } = userInfo;
  try {
    await Mysql.addLV(uid, lv);
  } catch(e) {
    ctx.logger(`[set user:${uid} lv error!]:${e.sqlMessage}`);
  }
};

const addExpr = async(ctx, userInfo, add = 0) => {
  const { uid, expr, lv, id } = userInfo;
  if(lv === 7) {
    return;
  }
  let _expr = expr + add;
  if(_expr < 0) {
    _expr = 0;
  }
  try {
    await Mysql.setExpr(uid, _expr);
  } catch(e) {
    ctx.logger(`[set user:${uid} expr error!]:${e.sqlMessage}`);
  }
  let _lv = lv;
  if(_expr >= level[_lv]) {
    _lv = lv + 1;
    try {
      await addLV(ctx, userInfo, _lv);
    } catch(e) {
      ctx.logger(`[add user:${uid} lv error!]:${e.sqlMessage}`);
    }
  }
  try {
    await saveRedis(id, Object.assign({}, ctx.session, {
      expr: _expr,
      lv: _lv
    }));
  } catch(e) {
    ctx.logger('[save redis error!]:', JSON.stringify(e));
  }
};
module.exports = addExpr;
