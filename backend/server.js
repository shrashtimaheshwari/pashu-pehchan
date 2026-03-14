const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const supportRoutes = require('./routes/supportRoutes');
const reportController = require('./controllers/reportController');
const { protect } = require('./middleware/auth');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', predictRoutes); // Contains /predict, /predictions, /predictions/:id
app.use('/api/analytics', analyticsRoutes);
app.use('/api/support', supportRoutes);

// Isolated Report Route
app.get('/api/predictions/:id/report', protect, reportController.downloadReport);

// Health Indicator Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        mlService: "online",
        backend: "online"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
