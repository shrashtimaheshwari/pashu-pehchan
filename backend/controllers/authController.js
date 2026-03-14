const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: generateToken(user._id),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Forgot Password - Send reset code
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Return success even if not found to prevent email enumeration
            return res.status(200).json({ success: true, message: 'Reset code sent to email' });
        }

        // Generate a 6-digit random code
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB and set expiration (10 minutes)
        user.resetPasswordCode = resetCode;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Send email
        const message = `Your password reset code is: ${resetCode}\n\nIt expires in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Code - Pashu Pehchan',
                message
            });

            res.status(200).json({ success: true, message: 'Email sent' });
        } catch (err) {
            user.resetPasswordCode = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            console.error("Nodemailer Error: ", err);
            res.status(500).json({ success: false, message: 'Email could not be sent' });
        }
    } catch (err) {
        console.error("Outer ForgotPassword Error: ", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Verify Reset Code
// @route   POST /api/auth/verify-reset-code
// @access  Public
exports.verifyResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Just confirming valid, don't clear code quite yet as they still need to submit new password
        res.status(200).json({ success: true, message: 'Code verified' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// @desc    Reset Password with verified code
// @route   PUT /api/auth/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        const { email, code, password } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordCode: code,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+password');

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid or expired code' });
        }

        // Check if new password is same as old password
        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: 'New password cannot be the same as the old password',
                errorCode: 'PASSWORD_SAME'
            });
        }

        // Set the new password
        user.password = password;

        // Clear reset codes
        user.resetPasswordCode = undefined;
        user.resetPasswordExpire = undefined;

        await user.save(); // pre-save middleware will hash the new password

        res.status(200).json({
            success: true,
            message: 'Password completely reset',
            token: generateToken(user._id)
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
