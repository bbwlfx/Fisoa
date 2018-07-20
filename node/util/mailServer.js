const Events = require('events');
const sendMail = require('./mailer/index');

const mailServer = new Events();

mailServer.on('push', (to, _html) => {
  const html = `
    <p>这是一封来自Fisoa的邮件</p>
    <p>-------------------------------------</p>
    ${_html}
  `;
  sendMail(to, html);
});

module.exports = mailServer;
