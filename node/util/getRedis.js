module.exports = async key => new Promise((resolve, reject) => {
  global.redisServer.get(key, (err, reply) => {
    if(err) {
      reject(err);
    } else {
      if(typeof reply === 'object') {
        resolve(reply);
      }
      try {
        resolve(JSON.parse(reply));
      } catch(e) {
        resolve('');
      }
    }
  });
});
