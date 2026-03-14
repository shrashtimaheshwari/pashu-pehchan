const Prediction = require('../models/Prediction');

// Generic helper to simulate ML Service for the hackathon/demo was removed.
// @desc    Upload image and get prediction
// @route   POST /api/predict
// @access  Private
exports.createPrediction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image file' });
        }

        // Cloudinary URL injected by multer-storage-cloudinary
        const imageUrl = req.file.path;

        // Call the ML python container
        let mlResult;
        try {
            const mlResponse = await fetch(process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000/predict_url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl })
            });

            if (!mlResponse.ok) {
                const errText = await mlResponse.text();
                throw new Error(`ML Service Error: ${mlResponse.status} - ${errText}`);
            }

            mlResult = await mlResponse.json();
            
            if (mlResult.error) {
                 if (mlResult.error === 'Not a cow or buffalo') {
                     return res.status(400).json({ success: false, message: 'Please upload an image of a Cow or Buffalo.' });
                 }
                 throw new Error(`ML Python Service Error: ${mlResult.error}`);
            }
        } catch (mlError) {
            console.error('Failed to get prediction from ML service:', mlError);
            return res.status(503).json({ success: false, message: 'ML Service is currently unavailable. Please try again later.', error: mlError.message });
        }

        // Store in DB mapping to PRD spec
        const prediction = await Prediction.create({
            user: req.user.id,
            breed: mlResult.breed,
            confidence: mlResult.confidence,
            probabilities: mlResult.probabilities,
            imageUrl: imageUrl,
            blurWarning: mlResult.blurWarning
        });

        res.status(201).json({
            success: true,
            predictionId: prediction._id,
            breed: mlResult.breed,
            confidence: mlResult.confidence,
            probabilities: mlResult.probabilities,
            imageUrl: imageUrl,
            blurWarning: mlResult.blurWarning,
            info_card: mlResult.info_card
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all predictions for a user
// @route   GET /api/predictions
// @access  Private
exports.getPredictions = async (req, res) => {
    try {
        // Fetch only user's scans, sorted by newest
        const predictions = await Prediction.find({ user: req.user.id }).sort({ date: -1 });

        // Map to frontend expected shape
        const formatted = predictions.map(p => ({
            id: p._id,
            img_url: p.imageUrl,
            breed: p.breed,
            confidence: p.confidence,
            probabilities: p.probabilities,
            date: p.date,
            blurWarning: p.blurWarning
        }));

        res.status(200).json(formatted);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a prediction
// @route   DELETE /api/predictions/:id
// @access  Private
exports.deletePrediction = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id);

        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        // Ensure user owns the prediction
        if (prediction.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this record' });
        }

        await prediction.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
