const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (options) => {
    try {
        const msg = {
            from: 'Pashu Pehchan Support <noreply@pashupehchan.me>',
            to: options.email,
            subject: options.subject,
            text: options.message,
        };
        console.log('Sending email to:', options.email, 'from:', process.env.EMAIL_USER);
        const response = await sgMail.send(msg);
        console.log('Email sent successfully. Status:', response[0].statusCode);
    } catch (error) {
        console.error('SendGrid Error:', error.message);
        if (error.response) {
            console.error('SendGrid Error Body:', JSON.stringify(error.response.body));
        }
        throw error;
    }
};

module.exports = sendEmail;

