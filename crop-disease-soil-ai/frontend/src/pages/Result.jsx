import { useState, useEffect } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';

function Result() {
  const [activeTab, setActiveTab] = useState('immediate');
  const location = useLocation();
  const report = location.state?.report;

  if (!report) {
    return <Navigate to="/analyze" replace />;
  }

  const ai = report.aiResult || {};
  const disease = ai.cropDisease || {};
  const soil = ai.soilAnalysis || {};
  const recs = ai.recommendations || {};

  const getBadgeColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-600';
    const l = level.toLowerCase();
    if (l.includes('high')) return 'bg-red-100 text-red-700';
    if (l.includes('medium') || l.includes('moderate')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getConfidenceColor = (conf) => {
    if (!conf) return 'bg-gray-100 text-gray-600';
    const c = conf.toLowerCase();
    if (c.includes('high')) return 'bg-green-100 text-green-700';
    if (c.includes('medium')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  // Parse soil health score for progress bar
  const parseScore = (s) => {
    if (!s) return 0;
    const match = s.match(/(\d+)\s*\/\s*(\d+)/);
    return match ? (parseInt(match[1]) / parseInt(match[2])) * 100 : 50;
  };
  const soilScore = parseScore(soil.soilHealthScore);

  const tabs = [
    { key: 'immediate', label: 'Immediate Actions', data: recs.immediateActions },
    { key: 'treatment', label: 'Treatment', organic: recs.organicTreatment, chemical: recs.chemicalTreatment },
    { key: 'prevention', label: 'Prevention', data: recs.preventiveMeasures },
    { key: 'fertilizer', label: 'Fertilizer & Irrigation', fertilizer: recs.fertilizerSuggestion, irrigation: recs.irrigationAdvice }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
        <p className="text-gray-500">Report for <strong>{report.farmerName}</strong> — {report.cropName} | {new Date(report.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Disease Card */}
        <ResultCard title="🦠 Crop Disease Analysis" colorVariant={disease.riskLevel === 'High' ? 'red' : disease.riskLevel === 'Medium' ? 'yellow' : 'green'}>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{disease.detectedDisease || 'N/A'}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceColor(disease.confidence)}`}>Confidence: {disease.confidence || 'N/A'}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(disease.riskLevel)}`}>Risk: {disease.riskLevel || 'N/A'}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor(disease.severity)}`}>Severity: {disease.severity || 'N/A'}</span>
            </div>
            {disease.visibleSymptoms?.length > 0 && (
              <div><p className="text-sm font-semibold text-gray-600 mb-1">Visible Symptoms:</p><ul className="text-sm text-gray-600 space-y-1">{disease.visibleSymptoms.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-primary-500 mt-0.5">•</span>{s}</li>)}</ul></div>
            )}
            {disease.possibleCauses?.length > 0 && (
              <div><p className="text-sm font-semibold text-gray-600 mb-1">Possible Causes:</p><ul className="text-sm text-gray-600 space-y-1">{disease.possibleCauses.map((c, i) => <li key={i} className="flex items-start gap-2"><span className="text-yellow-500 mt-0.5">•</span>{c}</li>)}</ul></div>
            )}
          </div>
        </ResultCard>

        {/* Soil Card */}
        <ResultCard title="🌍 Soil Analysis" colorVariant="default">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-400 mb-1">Soil Type</p><p className="text-sm font-semibold text-gray-800">{soil.soilTypeGuess || 'N/A'}</p></div>
              <div className="bg-gray-50 p-3 rounded-lg"><p className="text-xs text-gray-400 mb-1">Moisture</p><p className="text-sm font-semibold text-gray-800">{soil.moistureGuess || 'N/A'}</p></div>
            </div>
            <div><p className="text-sm font-semibold text-gray-600 mb-1">Condition:</p><p className="text-sm text-gray-600">{soil.soilCondition || 'N/A'}</p></div>
            {soil.possibleNutrientDeficiency?.length > 0 && (
              <div><p className="text-sm font-semibold text-gray-600 mb-2">Nutrient Deficiencies:</p><div className="flex flex-wrap gap-2">{soil.possibleNutrientDeficiency.map((d, i) => <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">{d}</span>)}</div></div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Soil Health Score: {soil.soilHealthScore || 'N/A'}</p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-full rounded-full progress-bar" style={{ width: `${soilScore}%`, background: soilScore >= 70 ? '#22c55e' : soilScore >= 40 ? '#eab308' : '#ef4444' }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">⚠️ Approximate — not lab-tested</p>
            </div>
          </div>
        </ResultCard>
      </div>

      {/* Recommendations */}
      <ResultCard title="💡 Recommendations" colorVariant="green">
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key ? 'bg-primary-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab.label}</button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === 'immediate' && recs.immediateActions && (
            <ul className="space-y-2">{recs.immediateActions.map((a, i) => <li key={i} className="flex items-start gap-2 text-sm bg-red-50 p-3 rounded-lg border border-red-100"><span className="text-red-500 font-bold">!</span><span className="text-gray-700">{a}</span></li>)}</ul>
          )}
          {activeTab === 'treatment' && (
            <div className="space-y-4">
              {recs.organicTreatment?.length > 0 && <div><p className="text-sm font-semibold text-green-700 mb-2">🌿 Organic Treatments</p><ul className="space-y-2">{recs.organicTreatment.map((t, i) => <li key={i} className="text-sm bg-green-50 p-3 rounded-lg border border-green-100 text-gray-700">{t}</li>)}</ul></div>}
              {recs.chemicalTreatment?.length > 0 && <div><p className="text-sm font-semibold text-yellow-700 mb-2">🧪 Chemical Treatments</p><ul className="space-y-2">{recs.chemicalTreatment.map((t, i) => <li key={i} className="text-sm bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-gray-700">{t}</li>)}</ul><p className="text-xs text-yellow-600 mt-2">⚠️ Use with proper safety equipment. Follow local guidelines.</p></div>}
            </div>
          )}
          {activeTab === 'prevention' && recs.preventiveMeasures && (
            <ul className="space-y-2">{recs.preventiveMeasures.map((p, i) => <li key={i} className="flex items-start gap-2 text-sm bg-blue-50 p-3 rounded-lg border border-blue-100"><span className="text-blue-500">🛡️</span><span className="text-gray-700">{p}</span></li>)}</ul>
          )}
          {activeTab === 'fertilizer' && (
            <div className="space-y-4">
              {recs.fertilizerSuggestion?.length > 0 && <div><p className="text-sm font-semibold text-gray-700 mb-2">🧪 Fertilizers</p><ul className="space-y-2">{recs.fertilizerSuggestion.map((f, i) => <li key={i} className="text-sm bg-purple-50 p-3 rounded-lg border border-purple-100 text-gray-700">{f}</li>)}</ul></div>}
              {recs.irrigationAdvice?.length > 0 && <div><p className="text-sm font-semibold text-gray-700 mb-2">💧 Irrigation</p><ul className="space-y-2">{recs.irrigationAdvice.map((a, i) => <li key={i} className="text-sm bg-cyan-50 p-3 rounded-lg border border-cyan-100 text-gray-700">{a}</li>)}</ul></div>}
            </div>
          )}
        </div>
      </ResultCard>

      {/* Farmer Summary */}
      {ai.farmerFriendlySummary && (
        <div className="mt-6 bg-primary-50 border-l-4 border-primary-500 p-6 rounded-r-xl">
          <h3 className="text-lg font-bold text-primary-800 mb-3">📝 Summary for Farmer</h3>
          <p className="text-gray-700 leading-relaxed text-base">{ai.farmerFriendlySummary}</p>
        </div>
      )}

      {ai.expertVerificationNeeded && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div><p className="font-bold text-yellow-800">Expert Verification Needed</p><p className="text-sm text-yellow-700">The AI suggests consulting a local agriculture officer for confirmation of this diagnosis.</p></div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link to="/analyze" className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl text-center hover:bg-primary-700 transition-all shadow-md hover:shadow-lg">Analyze Another Crop</Link>
      </div>
    </div>
  );
}

export default Result;
