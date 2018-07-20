const OSS = require('ali-oss');
const co = require('co');
const path = require('path');
const fs = require('fs');

module.exports = async(file, config) => {
  const { region, accessKeyId, accessKeySecret, bucket } = config;
  // 线上模式，将数据上传至阿里云OSS资源服务器
  if(region && accessKeyId && accessKeySecret && bucket) {
    const client = new OSS({
      region: config.endPoint,
      accessKeyId: config.AccessKey,
      accessKeySecret: config.AccessKeySecret,
      bucket: config.Bucket
    });
    return new Promise((resolve) => {
      co(function* () {
        try {
          const result = yield client.put(file.rename, file.path);
          resolve(result);
        } catch(e) {
          Promise.reject(e);
        }
      });
    });
  }

  // 本地测试模式 图片存储到/resources/images/目录下
  const imagePath = path.join(__dirname, `../../resources/images/${file.rename}`);
  fs.createReadStream(file.path).pipe(fs.createWriteStream(imagePath));
  return { url: `/images/${file.rename}` };
};

