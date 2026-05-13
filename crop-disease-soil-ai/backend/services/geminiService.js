const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze crop and soil images using Google Gemini API
 * @param {string} cropImagePath - Absolute path to the crop/leaf image
 * @param {string} soilImagePath - Absolute path to the soil image
 * @param {object} formData - Environmental and farmer data
 * @returns {object} Parsed JSON analysis result from Gemini
 */
async function analyzeWithGemini(cropImagePath, soilImagePath, formData) {
  const { farmerName, cropName, location, temperature, humidity, rainfall, symptoms } = formData;

  // Read images and convert to base64
  const cropImageData = fs.readFileSync(cropImagePath);
  const soilImageData = fs.readFileSync(soilImagePath);

  const cropImageBase64 = cropImageData.toString('base64');
  const soilImageBase64 = soilImageData.toString('base64');

  // Detect MIME type from file extension
  const getMimeType = (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  };

  const cropImagePart = {
    inlineData: {
      data: cropImageBase64,
      mimeType: getMimeType(cropImagePath)
    }
  };

  const soilImagePart = {
    inlineData: {
      data: soilImageBase64,
      mimeType: getMimeType(soilImagePath)
    }
  };

  const textPrompt = `You are an expert agricultural AI assistant for Indian farmers.
Analyze the two uploaded images (first = crop/leaf image, second = soil image) and the environmental data provided below.

Environmental Data:
- Farmer Name: ${farmerName}
- Crop Name: ${cropName}
- Location: ${location}
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- Rainfall: ${rainfall} mm
- Symptoms noticed by farmer: ${symptoms}

Return ONLY a valid JSON object with NO markdown, NO explanation, NO extra text. Format:

{
  "cropDisease": {
    "detectedDisease": "string — name of disease or 'No disease detected' or 'Unclear — need expert verification'",
    "confidence": "string — e.g. High (85%), Medium (60%), Low (35%)",
    "visibleSymptoms": ["array of observed symptoms from image"],
    "possibleCauses": ["array of likely causes"],
    "riskLevel": "Low | Medium | High",
    "severity": "string — Mild / Moderate / Severe"
  },
  "soilAnalysis": {
    "soilTypeGuess": "string — e.g. Red loamy soil, Black cotton soil",
    "soilCondition": "string — description of visible soil condition",
    "moistureGuess": "string — Dry / Moist / Wet (approximate)",
    "possibleNutrientDeficiency": ["array of likely deficiencies based on crop symptoms"],
    "soilHealthScore": "string — e.g. 6/10 (approximate, not lab-tested)"
  },
  "recommendations": {
    "immediateActions": ["array of urgent things the farmer should do right now"],
    "organicTreatment": ["array of natural/organic remedies"],
    "chemicalTreatment": ["array of chemical treatments — use safe general guidance only"],
    "preventiveMeasures": ["array of future prevention steps"],
    "fertilizerSuggestion": ["array of recommended fertilizers with approximate quantities"],
    "irrigationAdvice": ["array of watering and irrigation tips"]
  },
  "farmerFriendlySummary": "string — 3 to 5 sentences in simple English explaining what is wrong and what to do, suitable for a farmer with basic literacy",
  "expertVerificationNeeded": true or false
}

Rules you must follow:
1. If image quality is poor or disease is unclear, set confidence to Low and expertVerificationNeeded to true.
2. Always mention that soil analysis from image is approximate and not lab-tested.
3. For riskLevel High, always include 'Contact your local agriculture officer immediately' in immediateActions.
4. Use simple, farmer-friendly language throughout.
5. Do NOT recommend specific brand names for pesticides — use generic chemical names only.
6. Do NOT claim laboratory-level accuracy for any result.`;

  // Call Gemini API
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const result = await model.generateContent([cropImagePart, soilImagePart, textPrompt]);
  const response = await result.response;
  const responseText = response.text();

  // Strip markdown code fences if present, then parse JSON
  let cleanedText = responseText;
  const jsonMatch = cleanedText.match(/```json\n?([\s\S]*?)\n?```/);
  if (jsonMatch) {
    cleanedText = jsonMatch[1];
  }

  // Also try stripping generic code fences
  const genericMatch = cleanedText.match(/```\n?([\s\S]*?)\n?```/);
  if (genericMatch && !jsonMatch) {
    cleanedText = genericMatch[1];
  }

  try {
    const parsedResult = JSON.parse(cleanedText.trim());
    return parsedResult;
  } catch (parseError) {
    console.error('Failed to parse Gemini response as JSON:', parseError.message);
    console.error('Raw response:', responseText);
    return {
      error: 'AI response could not be parsed',
      raw: responseText
    };
  }
}

module.exports = { analyzeWithGemini };
