const Prediction = require('../models/Prediction');

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private
exports.getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Total Scans
        const totalScans = await Prediction.countDocuments({ user: userId });

        if (totalScans === 0) {
            return res.status(200).json({
                totalScans: 0,
                mostCommonBreed: 'No Scans Yet',
                avgConfidence: 0,
                breedDistribution: []
            });
        }

        // 2. Average Confidence
        const avgConfResult = await Prediction.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, avgConfidence: { $avg: '$confidence' } } }
        ]);
        const avgConfidence = avgConfResult.length > 0 ? Math.round(avgConfResult[0].avgConfidence) : 0;

        // 3. Breed Distribution List
        const distributionResult = await Prediction.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$breed', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $project: { _id: 0, name: '$_id', value: '$count' } }
        ]);

        // 4. Most Common Breed
        const mostCommonBreed = distributionResult.length > 0 ? distributionResult[0].name : 'N/A';

        res.status(200).json({
            totalScans,
            mostCommonBreed,
            avgConfidence,
            breedDistribution: distributionResult
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
