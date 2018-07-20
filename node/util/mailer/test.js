const mailer = require('./index');

const test = async() => {
  let info = null;
  const to = 'bbwlfx@126.com';
  const html = '<p>欢迎加入Fisoa社区，请遵守国家相关的法律法规规定</p>';
  try {
    info = await mailer(null, to, html);
  } catch(e) {
    console.log('error---', e);
  }
  console.log(info);
};

test();
