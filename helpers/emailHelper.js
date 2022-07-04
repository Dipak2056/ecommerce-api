import nodemailer from "nodemailer";
const emailProcessor = async (emaildata) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail(emaildata);
  console.log("message sent to ", info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));
};

export const sendMail = async (emailData) => {
  // send mail with defined transport object
  const mailBody = {
    from: '"Dipak ecommerce " <davon.waelchi72@ethereal.email>', // sender address
    to: "davon.waelchi72@ethereal.email", // list of receivers
    subject: "Please verify your email", // Subject line
    text: `hi there please follow the link to verify your email ${emailData.url}`, // plain text body
    html: `
    <p>Hi, ${emailData.fName}</p>
    <br />
    <br />
    <p>please follow the link provided to verify your account</p>
    <br />
    <br />
    <a href=${emailData.url}>${emailData.url}</a>
    kind regards 
    Dipak

    `,
  };
  emailProcessor(mailBody);
};

export const profileUpdateNotification = async (userInfo) => {
  // send mail with defined transport object
  const mailBody = {
    from: '"Dipak ecommerce " <davon.waelchi72@ethereal.email>', // sender address
    to: userInfo.email, // list of receivers
    subject: "Profile update notification", // Subject line
    text: `hi there youtr profile just have been updated, please contact adminurl}`, // plain text body
    html: `
    <p>Hi, ${emailData.fName}</p>
    <br />
    <br />
    <p>hi there youtr profile just have been updated, please contact adminurl</p>
    <br />
    <br />
    kind regards 
    Dipak

    `,
  };
  emailProcessor(mailBody);
};
export const OTPNotification = async (userInfo) => {
  // send mail with defined transport object
  const mailBody = {
    from: '"Dipak ecommerce " <davon.waelchi72@ethereal.email>', // sender address
    to: userInfo.email, // list of receivers
    subject: "Youu have received OTP", // Subject line
    text: `hi there use this OTP as per your request ${userInfo.token}}`, // plain text body
    html: `
    <p>Hi, there</p>
    <br />
    <br />
    <p>hi there user this otp as per your request ${userInfo.token}</p>
    <br />
    <br />
    kind regards 
    Dipak

    `,
  };
  emailProcessor(mailBody);
};
