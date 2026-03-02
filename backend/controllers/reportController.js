const PDFDocument = require('pdfkit');
const Prediction = require('../models/Prediction');

// @desc    Download prediction report (PDF)
// @route   GET /api/predictions/:id/report
// @access  Private
exports.downloadReport = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id).populate('user', 'name');

        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        // Ensure user owns the prediction
        if (prediction.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized for this report' });
        }

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for PDF download
        res.setHeader('Content-disposition', `attachment; filename=Pashu_Pehchan_Report_${prediction._id}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe PDF to response
        doc.pipe(res);

        // Header
        doc.fontSize(24).fillColor('#2D5A27').text('Pashu Pehchan', { align: 'center' });
        doc.fontSize(14).fillColor('#8B4513').text('AI Cattle Breed Identification Report', { align: 'center' });
        doc.moveDown(2);

        // Details Section
        doc.fontSize(12).fillColor('black');
        doc.text(`Report ID: ${prediction._id}`);
        doc.text(`Date of Scan: ${new Date(prediction.date).toLocaleString()}`);
        doc.text(`Field Worker: ${prediction.user.name}`);
        doc.moveDown(1);

        // Results Section
        doc.fontSize(16).fillColor('#2D5A27').text('Analysis Results', { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(14).fillColor('black');
        doc.text(`Primary Breed Detected: ${prediction.breed}`);
        doc.text(`Confidence Score: ${Math.round(prediction.confidence)}%`);
        if (prediction.blurWarning) {
            doc.fillColor('red').text('WARNING: Low Image Clarity Detected', { continued: false });
            doc.fillColor('black');
        }
        doc.moveDown(1);

        // Probabilities
        doc.fontSize(14).text('Prediction Probabilities:');
        doc.fontSize(12);
        prediction.probabilities.forEach(p => {
            doc.text(`- ${p.breed}: ${Math.round(p.score * 100)}%`);
        });
        doc.moveDown(2);

        // Fetch and embed image
        try {
            // Only download remote cloudinary images for the PDF
            if (prediction.imageUrl && prediction.imageUrl.startsWith('http')) {
                const imageResponse = await fetch(prediction.imageUrl);
                const arrayBuffer = await imageResponse.arrayBuffer();
                const imageBuffer = Buffer.from(arrayBuffer);
                doc.moveDown(1);
                doc.image(imageBuffer, {
                    fit: [400, 300],
                    align: 'center',
                    valign: 'center'
                });
            }
        } catch (imgErr) {
            console.error('PDF image error:', imgErr);
            doc.text('(Image could not be loaded into this report)');
        }

        doc.end();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
