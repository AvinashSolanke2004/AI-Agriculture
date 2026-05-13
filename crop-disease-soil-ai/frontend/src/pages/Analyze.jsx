import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../api';
import UploadBox from '../components/UploadBox';
import Loader from '../components/Loader';

function Analyze() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    farmerName: '', cropName: '', location: '', temperature: '', humidity: '', rainfall: '', symptoms: ''
  });
  const [cropImage, setCropImage] = useState(null);
  const [soilImage, setSoilImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!cropImage || !soilImage) {
      setError('Please upload both crop and soil images');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    data.append('cropImage', cropImage);
    data.append('soilImage', soilImage);

    try {
      setLoading(true);
      const result = await analyzeImage(data);
      if (result.success && result.report) {
        navigate('/result', { state: { report: result.report } });
      } else {
        setError('Analysis completed but no report data was returned');
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader message="AI is analyzing your crop and soil..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crop & Soil Analysis Form</h1>
        <p className="text-gray-500">Fill in the details and upload images for AI-powered diagnosis</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-2">
          <span className="mt-0.5">❌</span><span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Farmer Name <span className="text-red-500">*</span></label>
            <input type="text" name="farmerName" required value={formData.farmerName} onChange={handleChange} placeholder="Enter your name" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Crop Name <span className="text-red-500">*</span></label>
            <input type="text" name="cropName" required value={formData.cropName} onChange={handleChange} placeholder="e.g. Rice, Wheat, Tomato" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Pune, Maharashtra" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Temperature °C</label>
            <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="e.g. 32" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Humidity %</label>
            <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="e.g. 65" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Rainfall mm</label>
            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="e.g. 120" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Symptoms Noticed</label>
          <textarea name="symptoms" rows={3} value={formData.symptoms} onChange={handleChange} placeholder="Describe any visible symptoms on the crop..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <UploadBox label="Crop / Leaf Image" name="cropImage" onChange={(e) => setCropImage(e.target.files[0])} />
          <UploadBox label="Soil Image" name="soilImage" onChange={(e) => setSoilImage(e.target.files[0])} />
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
          Analyze with AI 🌿
        </button>
      </form>
    </div>
  );
}

export default Analyze;
