const nodemailer = require('nodemailer');
// 메일발송 객체
const mailSender = {
  // 메일발송 함수
  sendGmail: function (param) {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "cstonefg@gmail.com",
          pass: "fjhaofyosyhuozgc",
        }
      });
    // 메일 옵션
    var mailOptions = {
        from: `"해커톤" <'cstonefg@gmail.com'>`,
        to: param.toEmail,
        subject: "해커톤에서 보냄",
        text: param.text,
    };
    
    // 메일 발송    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  }
}

module.exports = mailSender;