module.exports = {
  transport: {
    host: 'smtp.126.com',
    port: 465,
    auth: {
      user: 'l343009306@126.com',
      pass: 'FTHuko7758521'
    },
    secure: true
  },
  mailOptions: (to, html) => ({
    from: 'Fisoa <l343009306@126.com>',
    to,
    subject: '来自Fisoa的消息',
    html
  })
};
