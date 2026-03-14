const PDFDocument = require('pdfkit');
const Prediction = require('../models/Prediction');
const path = require('path');
const fs = require('fs');

// Hindi breed name map
const HINDI_BREEDS = {
    'Gir': 'गिर',
    'Sahiwal': 'साहीवाल',
    'Red Sindhi': 'लाल सिंधी',
    'Tharparkar': 'थारपारकर',
    'Murrah': 'मुर्रा',
    'Jaffrabadi': 'जाफराबादी',
    'Mehsana': 'मेहसना',
    'Nili_Ravi': 'नीली रवि',
    'Alambadi': 'अलंबादी',
    'Himachali Pahari': 'हिमाचली पहाड़ी',
    'Kangayam': 'कंगायम',
    'Kasargod': 'कासरगोड',
    'Kenkatha': 'केनकाठा',
    'Umblachery': 'उंबलाचेरी',
    'Khariar': 'खारियार',
    'Kosali': 'कोसली',
    'motu': 'मोटु',
    'Nimari': 'निमाड़ी',
    'Red kandhari': 'लाल कंधारी',
    'Vechur': 'वेचुर',
    'Bargur': 'बरगुर',
    'Guernsey': 'गर्नसे',
    'Poda Thirupu': 'पोड़ा तिरुप्पु',
    'Rathi': 'राठी',
    'Dangi': 'डांगी',
    'ponwar': 'पोनवार',
    'siri': 'सिरी',
    'Amritmahal': 'अमृतमहल',
    'dagri': 'डागरी',
    'gangatari': 'गंगातारी',
    'Hariana': 'हरियाणा',
    'nagori': 'नागोरी',
    'ongole': 'ओंगोल'
};

// Hindi labels for PDF content
const HINDI_LABELS = {
    appTitle: 'पशु पहचान',
    reportSubtitle: 'AI पशु नस्ल पहचान रिपोर्ट',
    reportId: 'रिपोर्ट ID',
    dateOfScan: 'स्कैन की तारीख',
    fieldWorker: 'फील्ड वर्कर',
    analysisResults: 'विश्लेषण परिणाम',
    primaryBreed: 'प्राथमिक पहचानी गई नस्ल',
    confidenceScore: 'विश्वास स्कोर',
    blurWarning: 'चेतावनी: कम छवि स्पष्टता का पता चला',
    probabilities: 'भविष्यवाणी प्रायिकताएँ',
    imageError: '(छवि इस रिपोर्ट में लोड नहीं हो सकी)'
};

const ENGLISH_LABELS = {
    appTitle: 'Pashu Pehchan',
    reportSubtitle: 'AI Cattle Breed Identification Report',
    reportId: 'Report ID',
    dateOfScan: 'Date of Scan',
    fieldWorker: 'Field Worker',
    analysisResults: 'Analysis Results',
    primaryBreed: 'Primary Breed Detected',
    confidenceScore: 'Confidence Score',
    blurWarning: 'WARNING: Low Image Clarity Detected',
    probabilities: 'Prediction Probabilities',
    imageError: '(Image could not be loaded into this report)'
};

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

        const lang = req.query.lang || 'en';
        const isHindi = lang === 'hi';
        const labels = isHindi ? HINDI_LABELS : ENGLISH_LABELS;

        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Set response headers for PDF download
        res.setHeader('Content-disposition', `attachment; filename=Pashu_Pehchan_Report_${prediction._id}.pdf`);
        res.setHeader('Content-type', 'application/pdf');

        // Pipe PDF to response
        doc.pipe(res);

        // Register Hindi font if available
        const hindiFontPath = path.join(__dirname, '..', 'fonts', 'NotoSansDevanagari-Regular.ttf');
        const hindiFontBoldPath = path.join(__dirname, '..', 'fonts', 'NotoSansDevanagari-Bold.ttf');
        let hindiFont = null;
        let hindiFontBold = null;

        if (isHindi) {
            if (fs.existsSync(hindiFontPath)) {
                doc.registerFont('Hindi', hindiFontPath);
                hindiFont = 'Hindi';
            }
            if (fs.existsSync(hindiFontBoldPath)) {
                doc.registerFont('HindiBold', hindiFontBoldPath);
                hindiFontBold = 'HindiBold';
            }
        }

        const useFont = (bold = false) => {
            if (isHindi) {
                if (bold && hindiFontBold) doc.font(hindiFontBold);
                else if (hindiFont) doc.font(hindiFont);
                else doc.font('Helvetica');
            } else {
                doc.font(bold ? 'Helvetica-Bold' : 'Helvetica');
            }
        };

        // Translate breed name
        const translateBreed = (breed) => {
            if (isHindi) {
                return HINDI_BREEDS[breed] || breed;
            }
            return breed;
        };

        // Format date
        const dateLocale = isHindi ? 'hi-IN' : 'en-US';

        // Header
        useFont(true);
        doc.fontSize(24).fillColor('#2D5A27').text(labels.appTitle, { align: 'center' });
        useFont();
        doc.fontSize(14).fillColor('#8B4513').text(labels.reportSubtitle, { align: 'center' });
        doc.moveDown(2);

        // Details Section
        useFont();
        doc.fontSize(12).fillColor('black');
        doc.text(`${labels.reportId}: ${prediction._id}`);
        doc.text(`${labels.dateOfScan}: ${new Date(prediction.date).toLocaleDateString(dateLocale, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })}`);
        doc.text(`${labels.fieldWorker}: ${prediction.user.name}`);
        doc.moveDown(1);

        // Results Section
        useFont(true);
        doc.fontSize(16).fillColor('#2D5A27').text(labels.analysisResults, { underline: true });
        doc.moveDown(0.5);
        useFont();
        doc.fontSize(14).fillColor('black');
        doc.text(`${labels.primaryBreed}: ${translateBreed(prediction.breed)}`);
        doc.text(`${labels.confidenceScore}: ${Math.round(prediction.confidence)}%`);
        if (prediction.blurWarning) {
            doc.fillColor('red').text(labels.blurWarning, { continued: false });
            doc.fillColor('black');
        }
        doc.moveDown(1);

        // Probabilities
        useFont(true);
        doc.fontSize(14).text(`${labels.probabilities}:`);
        useFont();
        doc.fontSize(12);
        prediction.probabilities.forEach(p => {
            doc.text(`- ${translateBreed(p.breed)}: ${Math.round(p.score * 100)}%`);
        });
        doc.moveDown(2);

        // Fetch and embed image
        try {
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
            useFont();
            doc.text(labels.imageError);
        }

        doc.end();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};
