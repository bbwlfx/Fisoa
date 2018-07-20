const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	host: 'smtp.126.com',
	port: '25',
  auth: {
        user: 'l343009306@126.com',
        pass: 'FTHuko7758521'
  }
})
const psw = 54321;
const mailOptions = {
    from: 'imofish <l343009306@126.com>', // sender address
    to: 'imofish@126.com', // list of receivers
    subject: 'iMofish验证码', // Subject line
    // text: '欢迎登陆网站，您的验证码是1234X', // plaintext body
    html: '<strong><em>欢迎登陆网站，您的验证码是9877a<em></strong>'
};
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});