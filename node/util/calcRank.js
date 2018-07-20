const Mysql = require('../lib/mysql/query');
const { logEvent } = require('../lib/logger');

module.exports = async() => {
  // reset rank list
  try {
    await Mysql.resetArticleRank();
    try {
      // calc rank list
      await Mysql.calcArticleRank();
    } catch(e) {
      logEvent.warn('-----calc article rank error!-----');
    }
  } catch(e) {
    logEvent.warn('-----reset article rank list error!-----');
  }
};
