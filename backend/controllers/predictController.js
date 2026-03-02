const Prediction = require('../models/Prediction');

// Generic helper to simulate ML Service for the hackathon/demo
const mockMLService = () => {
    const breeds = ['Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Murrah', 'Jafarabadi'];
    const topBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const confScore = Math.random() * (99.9 - 65.0) + 65.0; // Random between 65% and 99.9%
    const blurWarn = Math.random() > 0.8; // 20% chance of blur warning

    // Generate mock probabilities matching PRD data shape
    const probabilities = [
        { breed: topBreed, score: (confScore / 100).toFixed(2) },
        { breed: breeds[(breeds.indexOf(topBreed) + 1) % breeds.length], score: ((100 - confScore) / 200).toFixed(2) },
        { breed: breeds[(breeds.indexOf(topBreed) + 2) % breeds.length], score: ((100 - confScore) / 200).toFixed(2) }
    ];

    const infoCard = {
        origin: 'Indian Subcontinent',
        milk_yield: Math.floor(Math.random() * 2000 + 1500) + ' Liters/Lactation',
        characteristics: 'High heat tolerance and resistance to tropical diseases.'
    };

    return { breed: topBreed, confidence: confScore, probabilities, blurWarning: blurWarn, info_card: infoCard };
};

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

        // Simulate calling the ML python container
        // In production, you would do an axios.post('http://ml-service/predict', { image: imageUrl })
        const mlResult = mockMLService();

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
