const fs = require('fs');
const exec = require('child_process').exec;
const path = require('path');
const OSS = require('ali-oss');
const co = require('co');

const assets_css = 'assets/css/';
const assets_js = 'assets/js/';
const output = 'versionFile.json';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/config.json')));
const client = new OSS({
  region: config.endPoint,
  accessKeyId: config.AccessKey,
  accessKeySecret: config.AccessKeySecret,
  bucket: config.Bucket
});

const uploadFile = (dirPath, assets) => {
  const _path = path.join(__dirname, '..', assets, dirPath);
  const key = assets === assets_js ? `/js/${dirPath}` : `/css/${dirPath}`;
  co(function* () {
    var result = yield client.put(key, _path);
    console.log(`upload ${dirPath} success`);
  }).catch(function (err) {
    console.log(err);
  });
}
const readDir = (dirPath = '.') => new Promise((resolve, reject) => {
  fs.readdir(path.resolve(dirPath), (err, files) => {
    if(err) {
      reject(err);
    } else {
      resolve(files);
    }
  });
});

const execPromise = (command, config = {}) => new Promise((resolve, reject) => {
  exec(command, config, (err, stdout) => {
    if(err) {
      console.log(err);
      reject(err);
    } else {
      console.log(command, 'finished');
      resolve(stdout);
    }
  });
});

readDir(assets_js).then((files) => {
  if(files.length === 0) {
    throw 'js directory is empty!';
  }
  const md5 = {};
  files.forEach((filename) => {
    const reg = /^([\w-]+)\.min\.(\w+)\.js$/g;
    const match = reg.exec(filename);
    if(match) {
      md5[`js/${match[1]}`] = match[2];
      uploadFile(filename, assets_js);
    }
  });

  return md5;
}).then((md5) => {
  return new Promise((resolve) => {
    readDir(assets_css).then((files) => {
      if(files.length === 0) {
        throw 'css directory is empty';
      }

      files.forEach((filename) => {
        const reg = /^([\w-]+)\.min\.(\w+)\.css$/g;
        const match = reg.exec(filename);
        if(match) {
          md5[`css/${match[1]}`] = match[2];
          uploadFile(filename, assets_css);
        }
      });

      resolve(md5);
    });
  });
}).then((md5) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(output, JSON.stringify(md5, null, '\t'), (err) => {
      if(err) {
        reject(err);
      } else {
        resolve('write versionFile success');
      }
    });
  }).then((msg) => {
    console.log(msg);
  }).catch((err) => {
    console.log(err);
  });
});
