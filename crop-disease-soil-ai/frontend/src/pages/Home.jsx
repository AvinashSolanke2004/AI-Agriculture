import { Link } from 'react-router-dom';

const features = [
  { icon: '🔬', title: 'Instant AI Diagnosis', description: 'Get real-time crop disease identification powered by Google Gemini AI with confidence scores.' },
  { icon: '🌱', title: 'Soil Health Check', description: 'Upload soil images for approximate soil type, moisture, and nutrient deficiency analysis.' },
  { icon: '📋', title: 'Expert Recommendations', description: 'Receive actionable treatment plans including organic remedies, preventive measures, and fertilizer advice.' }
];

function Home() {
  return (
    <div className="animate-fade-in">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 animated-gradient text-white">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <div className="animate-slide-up">
            <span className="inline-block text-6xl mb-6">🌾</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              AI-Powered Crop Disease<br /><span className="text-primary-200">& Soil Analysis</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload your crop and soil images for instant AI diagnosis. Get expert-level recommendations tailored for Indian farming conditions.
            </p>
            <div className="flex justify-center">
              <Link to="/analyze" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg shadow-xl hover:shadow-2xl hover:bg-primary-50 transition-all duration-300 pulse-glow">
                <span className="mr-2">🌿</span>Analyze My Crop
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 32L48 37.3C96 43 192 53 288 53.3C384 53 480 43 576 42.7C672 43 768 53 864 58.7C960 64 1056 64 1152 58.7C1248 53 1344 43 1392 37.3L1440 32V80H0V32Z" fill="#f9fafb" /></svg>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Three simple steps to diagnose and manage your crop health</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover text-center">
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-50/50 py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ v: 'AI-Powered', l: 'Disease Detection' }, { v: 'Real-Time', l: 'Soil Analysis' }, { v: 'Actionable', l: 'Treatment Plans' }, { v: 'Free', l: 'For All Farmers' }].map((s, i) => (
            <div key={i}><div className="text-2xl sm:text-3xl font-extrabold text-primary-700 mb-1">{s.v}</div><div className="text-sm text-gray-500 font-medium">{s.l}</div></div>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">

        </div>
      </footer>
    </div>
  );
}

export default Home;
