module.exports = {
  transport: {
    host: 'smtp.126.com',
    port: 465,
    auth: {
      user: '123456789@126.com',
      pass: 'password'
    },
    secure: true
  },
  mailOptions: (to, html) => ({
    from: 'Fisoa <123456789@126.com>',
    to,
    subject: '来自Fisoa的消息',
    html
  })
};
