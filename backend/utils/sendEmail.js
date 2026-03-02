const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Construct the email options
    const mailOptions = {
        from: `Pashu Pehchan Support <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
