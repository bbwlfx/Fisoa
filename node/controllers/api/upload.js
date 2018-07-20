const uploadImage = require('../../util/uploadImage');
const { code, errorMsg } = require('../../code.config');
const serverError = require('../../util/commonBody');
const saveRedis = require('../../util/saveRedis');
const Mysql = require('../../lib/mysql/query');

const testImageType = (file) => {
  const { type } = file;
  const fileType = type.split('/')[1];
  if(!/png|jpe?g/g.test(type)) {
    return false;
  }
  return fileType;
};

module.exports.uploadImage = async(ctx) => {
  const { files } = ctx.request.body;
  const { image } = files;
  const fileType = testImageType(image);
  if(!fileType) {
    ctx.body = {
      type: code.paramsError,
      data: {
        message: errorMsg.imageTypeError
      }
    };
    return;
  }
  image.createTime = Date.now().toString();
  image.rename = `${image.createTime.toString()}.${fileType}`;
  const result = await uploadImage(image, ctx.config);
  const { url } = result;
  ctx.body = {
    type: code.success,
    data: {
      url
    }
  };
};

module.exports.uploadAvatar = async function(ctx) {
  const { files } = ctx.request.body;
  const { avatar } = files;
  const fileType = testImageType(avatar);
  if(!fileType) {
    ctx.body = {
      type: code.paramsError,
      data: {
        message: errorMsg.imageTypeError
      }
    };
    return;
  }
  avatar.createTime = Date.now().toString();
  avatar.rename = `${avatar.createTime.toString()}.${fileType}`;
  const result = await uploadImage(avatar, ctx.config);
  const { url } = result;
  try {
    await Mysql.updateAvatar(ctx.session.uid, url);
    await saveRedis(ctx.session.id, Object.assign({}, ctx.session, {
      avatar: url
    }));
    ctx.body = {
      type: code.success,
      data: {
        url
      }
    };
  } catch(e) {
    ctx.logger(`[upload avatar error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
  }
};

module.exports.uploadBanner = async function(ctx) {
  const { files } = ctx.request.body;
  const { banner } = files;
  const fileType = testImageType(banner);
  if(!fileType) {
    ctx.body = {
      type: code.paramsError,
      data: {
        message: errorMsg.imageTypeError
      }
    };
    return;
  }
  banner.createTime = Date.now().toString();
  banner.rename = `${banner.createTime.toString()}.${fileType}`;
  const result = await uploadImage(banner, ctx.config);
  const { url } = result;
  try {
    await Mysql.updateBanner(ctx.session.uid, url);
    await saveRedis(ctx.session.id, Object.assign({}, ctx.session, {
      banner: url
    }));
    ctx.body = {
      type: code.success,
      data: {
        url
      }
    };
  } catch(e) {
    ctx.logger(`[upload banner error!]: ${e.sqlMessage}`);
    ctx.body = serverError;
  }
};
