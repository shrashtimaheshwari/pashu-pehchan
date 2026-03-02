const express = require('express');
const router = express.Router();
const { register, login, getProfile, forgotPassword, verifyResetCode, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);

// Password Reset Flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.put('/reset-password', resetPassword);

module.exports = router;
