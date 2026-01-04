const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create Transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use SMTP_HOST/PORT from env
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // 2. Define Email Options
    const mailOptions = {
        from: `Rivaya Support <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    // 3. Send Email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
