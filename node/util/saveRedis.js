// 7天
const EX = 7 * 24 * 3600;

module.exports = async(key, value) => new Promise((resolve, reject) => {
  if(typeof value === 'object') {
    value = JSON.stringify(value);
  }
  global.redisServer.set(key, value, 'EX', EX, (err) => {
    if(err) {
      reject(err);
    } else {
      resolve(true);
    }
  });
});
