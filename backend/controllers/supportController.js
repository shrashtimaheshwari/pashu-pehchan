const sendEmail = require('../utils/sendEmail');

// @desc    Submit support/contact request
// @route   POST /api/support/contact
// @access  Public
exports.sendSupportRequest = async (req, res) => {
    try {
        const { name, email, category, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !category || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Prepare email message
        const emailBody = `
Support Request Received

User Details:
Name: ${name}
Email: ${email}
Category: ${category.toUpperCase()}

Subject: ${subject}

Message:
${message}
        `;

        // Send email to support team
        await sendEmail({
            email: 'shrashtimaheshwari313@gmail.com',
            subject: `[${category.toUpperCase()}] ${subject}`,
            message: emailBody
        });

        // Send confirmation email to user
        await sendEmail({
            email: email,
            subject: 'We received your support request - Pashu Pehchan',
            message: `
Hello ${name},

Thank you for contacting Pashu Pehchan Support!

We have received your message and our support team will review it shortly.
We typically respond to support requests within 24 hours on business days.

Your Request Details:
Subject: ${subject}
Category: ${category}

Best regards,
Pashu Pehchan Support Team
            `
        });

        res.status(200).json({
            success: true,
            message: 'Your support request has been submitted successfully. We will get back to you soon!'
        });

    } catch (err) {
        console.error('Support request error:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to send support request. Please try again later.'
        });
    }
};
