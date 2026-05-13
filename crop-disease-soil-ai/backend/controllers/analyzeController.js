const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeWithGemini } = require('../services/geminiService');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadFields = upload.fields([
  { name: 'cropImage', maxCount: 1 },
  { name: 'soilImage', maxCount: 1 }
]);

const uploadMiddleware = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// POST /api/analyze
const analyzeImage = async (req, res) => {
  try {
    const { farmerName, cropName, location, temperature, humidity, rainfall, symptoms } = req.body;

    // Validate required fields
    if (!farmerName || !cropName) {
      return res.status(400).json({ error: 'Farmer name and crop name are required' });
    }

    // Validate that both images are uploaded
    if (!req.files || !req.files.cropImage || !req.files.soilImage) {
      return res.status(400).json({ error: 'Please upload both crop and soil images' });
    }

    const cropImagePath = req.files.cropImage[0].path;
    const soilImagePath = req.files.soilImage[0].path;

    // Relative paths for storage
    const cropImageRelative = 'uploads/' + req.files.cropImage[0].filename;
    const soilImageRelative = 'uploads/' + req.files.soilImage[0].filename;

    // Call Gemini AI service
    const aiResult = await analyzeWithGemini(cropImagePath, soilImagePath, {
      farmerName,
      cropName,
      location: location || 'Not specified',
      temperature: temperature || 'Not specified',
      humidity: humidity || 'Not specified',
      rainfall: rainfall || 'Not specified',
      symptoms: symptoms || 'None mentioned'
    });

    // Construct a report object in memory to return to the frontend
    const report = {
      _id: Date.now().toString(), // fake ID for frontend logic
      farmerName,
      cropName,
      location: location || '',
      temperature: temperature || '',
      humidity: humidity || '',
      rainfall: rainfall || '',
      symptoms: symptoms || '',
      cropImagePath: cropImageRelative,
      soilImagePath: soilImageRelative,
      aiResult,
      createdAt: new Date().toISOString()
    };

    return res.status(200).json({
      success: true,
      reportId: report._id,
      report: report // Send full report back
    });
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    return res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
};

module.exports = {
  uploadMiddleware,
  analyzeImage
};
