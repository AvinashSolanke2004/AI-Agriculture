const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analyzeController');

// POST /api/analyze — Upload images + form data → call Gemini → save to MongoDB → return JSON
router.post('/analyze', analyzeController.uploadMiddleware, analyzeController.analyzeImage);

module.exports = router;
