const express = require('express');
const router = express.Router();
const { sendSupportRequest } = require('../controllers/supportController');

// @route   POST /api/support/contact
// @desc    Submit support/contact request
// @access  Public
router.post('/contact', sendSupportRequest);

module.exports = router;
