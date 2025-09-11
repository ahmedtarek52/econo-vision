import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';


const AIReports = ({ modelResults }) => {
  const [englishReport, setEnglishReport] = useState('');
  const [arabicReport, setArabicReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateReport = async () => {
    if (!modelResults) {
      setError('No model results available to generate a report. Please run a model first.');
      return;
    }
    setIsGenerating(true);
    setError('');
    setEnglishReport('');
    setArabicReport('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/report/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelSummary: modelResults }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setEnglishReport(result.englishReport);
      setArabicReport(result.arabicReport);

    } catch (err) {
      setError(err.message || 'Failed to generate report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (language) => {
    const content = language === 'en' ? englishReport : arabicReport;
    const filename = language === 'en' ? 'AI_Econometrics_Report_EN.txt' : 'AI_Econometrics_Report_AR.txt';
    if (!content) return;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/95 p-12 rounded-3xl shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          🤖 AI-Powered Analytical Reports
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          Generate comprehensive reports with AI-driven insights, interpretation, and policy implications based on your model results.
        </p>

        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
        
        {!englishReport && !isGenerating && (
          <div className="text-center mb-12">
            <button onClick={generateReport} className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-6 px-12 rounded-2xl shadow-lg">
              Generate Professional Report
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
            <div className="text-2xl font-bold text-indigo-600">Generating Your Report...</div>
            <p className="text-lg text-gray-600">Our AI is analyzing your results. This may take a moment.</p>
          </div>
        )}

        {englishReport && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-inner border">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Professional Econometric Report (English)</h3>
              <div className="bg-white border rounded-xl p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm">{englishReport}</pre>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button onClick={() => downloadReport('en')} className="bg-green-500 text-white font-bold py-4 px-8 rounded-xl">Download English Report</button>
              <button onClick={() => downloadReport('ar')} className="bg-blue-500 text-white font-bold py-4 px-8 rounded-xl">تنزيل التقرير العربي</button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-12 mt-8 border-t">
          <button onClick={() => navigate('/models-analysis')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 me-3 md:me-0 rounded-lg">← Back to Models</button>
          <button onClick={() => navigate('/contact-us')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">Next: Contact Us →</button>
        </div>
      </div>
    </div>
  );
};
export default AIReports;