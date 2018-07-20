const nodemailer = require('nodemailer');
const { logEvent } = require('../../lib/logger');
const { transport, mailOptions } = require('./config');

const transporter = nodemailer.createTransport(transport);

module.exports = (to, html) => {
  const options = mailOptions(to, html);
  transporter.sendMail(options, (err, info) => {
    if(err) {
      logEvent.warn(`[send mail to ${to} error!]:${err}`);
      return;
    }
    logEvent.info(`[send mail to ${to} success!]: ${info}`);
  });
};
