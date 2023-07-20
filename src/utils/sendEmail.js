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

module.exports = sendEmail;