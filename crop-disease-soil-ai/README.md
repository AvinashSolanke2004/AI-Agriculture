# 🌿 CropAI — AI-Driven Crop Disease Prediction & Soil Management System

An intelligent full-stack web application that helps Indian farmers diagnose crop diseases and assess soil health using AI-powered image analysis via Google Gemini.

## ✨ Features

- **AI-Powered Disease Detection** — Upload crop/leaf images for instant disease identification with confidence scores
- **Soil Health Analysis** — Visual soil type, moisture, and nutrient deficiency assessment from soil images
- **Expert Recommendations** — Actionable treatment plans including organic remedies, chemical treatments, and preventive measures
- **Fertilizer & Irrigation Advice** — Crop-specific fertilizer suggestions and watering tips
- **Analysis History** — Browse, search, and manage all past analyses
- **Dashboard** — Visualize trends with stats, charts, and recent report summaries
- **Mobile Responsive** — Fully optimized for mobile devices used in the field
- **Farmer-Friendly Summaries** — Simple English explanations suitable for all literacy levels

## 📋 Prerequisites

- **Node.js 18+** — [Download](https://nodejs.org/)
- **MongoDB Atlas account** — [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key** — [Get yours at AI Studio](https://aistudio.google.com)

## 🚀 Setup & Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd crop-disease-soil-ai
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (use `.env.example` as template):

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend on `http://localhost:5000`.

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload images + form data for AI analysis |
| GET | `/api/reports` | Get all reports (newest first) |
| GET | `/api/reports/:id` | Get a single report by ID |
| DELETE | `/api/reports/:id` | Delete a report by ID |
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### POST /api/analyze — Request Body (multipart/form-data)

| Field | Type | Required |
|-------|------|----------|
| farmerName | string | ✅ |
| cropName | string | ✅ |
| location | string | ❌ |
| temperature | string | ❌ |
| humidity | string | ❌ |
| rainfall | string | ❌ |
| symptoms | string | ❌ |
| cropImage | file (image) | ✅ |
| soilImage | file (image) | ✅ |

## 🗂️ Folder Structure

```
crop-disease-soil-ai/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json
│   ├── .env                   # Environment variables (create from .env.example)
│   ├── .env.example
│   ├── uploads/               # Auto-created for uploaded images
│   ├── models/
│   │   └── Report.js          # Mongoose schema
│   ├── routes/
│   │   └── analyzeRoutes.js   # API route definitions
│   ├── controllers/
│   │   └── analyzeController.js # Route handlers + Multer config
│   └── services/
│       └── geminiService.js   # Google Gemini AI integration
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx           # React entry point
│       ├── App.jsx            # Router setup
│       ├── api.js             # Axios API layer
│       ├── pages/
│       │   ├── Home.jsx       # Landing page
│       │   ├── Analyze.jsx    # Analysis form
│       │   ├── Result.jsx     # Report display
│       │   ├── History.jsx    # All reports
│       │   └── Dashboard.jsx  # Statistics dashboard
│       ├── components/
│       │   ├── Navbar.jsx     # Navigation bar
│       │   ├── UploadBox.jsx  # Image upload component
│       │   ├── ResultCard.jsx # Styled card component
│       │   └── Loader.jsx     # Loading spinner
│       └── styles/
│           └── index.css      # Tailwind + custom CSS
└── README.md
```

## 🔑 Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env` file as `GEMINI_API_KEY`

## ⚠️ Known Limitations

- Soil analysis is based on visual image analysis only — **not a substitute for lab testing**
- Disease detection accuracy depends on image quality and clarity
- The AI may misidentify diseases if symptoms overlap with multiple conditions
- Image uploads are limited to 5MB per file (JPG, PNG, WEBP only)
- Requires active internet for Gemini API calls
- No user authentication system (single-user mode)

## 🔮 Future Scope

- Multi-language support (Hindi, Tamil, Telugu, etc.)
- User authentication and role-based access
- Push notifications for high-risk alerts
- Integration with government agriculture APIs
- Offline mode with cached AI models
- Weather API integration for real-time environmental data
- Community forum for farmer discussions
- Export reports as PDF

## 📄 License

MIT License — built for Indian farmers with ❤️
