const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    probabilities: [{
        breed: String,
        score: Number
    }],
    imageUrl: {
        type: String,
        required: true
    },
    blurWarning: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
