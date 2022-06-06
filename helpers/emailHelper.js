import nodemailer from "nodemailer";
export const sendMail = async (emailData) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP,
    port: +process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
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
  });
  console.log("message sent to ", info.messageId);
  console.log(nodemailer.getTestMessageUrl(info));
};
