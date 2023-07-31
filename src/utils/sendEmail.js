const nodemailer = require("nodemailer");
const customError = require("./customError");
require('dotenv').config();
const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text
        });

      
    } catch (error) {
        console.error(error);
        throw new customError(error.message, 500);
    }
};
async function sendUpdateNotification(subscribers, articleTitle, articleId) {
    try{
    const totalSubscribers = subscribers.length;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    console.log('function ',' ',subscribers,articleTitle,articleId)
    
      // Send the email
      
    let recipients='';
    for (let i = 0; i < totalSubscribers; i++) {
      recipients+=subscribers[i]+',';
    }
    console.log(recipients)
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: recipients,
        subject: 'Article Update Notification',
        html: `Dear subscriber, <br/><br/>Check out the updated article: <a href="http://127.0.0.1:5501/page-kb-question.html?articleId=${articleId}">${articleTitle}</a>`
    });
}catch(err){
    console.log(err)
}
  }

module.exports = {sendEmail,sendUpdateNotification};