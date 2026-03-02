const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createPrediction, getPredictions, deletePrediction } = require('../controllers/predictController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Rate Limiter: Max 5 predictions per minute per user as per PRD
const predictionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5,
    message: { success: false, message: 'Rate limit exceeded. Too many predictions from this IP, please try again after a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/predict', protect, predictionLimiter, upload.single('image'), createPrediction);
router.get('/predictions', protect, getPredictions);
router.delete('/predictions/:id', protect, deletePrediction);

module.exports = router;
