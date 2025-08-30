import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AIReports = ({ modelResults }) => {
  const [englishReport, setEnglishReport] = useState('');
  const [arabicReport, setArabicReport] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const generateReport = async () => {
    if (!modelResults) {
      setError('No model results found. Please run an analysis on the previous page first.');
      return;
    }
    setIsGenerating(true);
    setError('');
    setEnglishReport('');
    setArabicReport('');

    try {
      const response = await fetch('http://localhost:5000/api/report/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelSummary: modelResults }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setEnglishReport(result.englishReport);
      setArabicReport(result.arabicReport);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (language) => {
    const content = language === 'en' ? englishReport : arabicReport;
    const filename = language === 'en' ? 'AI_Econometrics_Report_EN.txt' : 'AI_Econometrics_Report_AR.txt';
    
    if (!content) {
      alert('Report content is not available.');
      return;
    }
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasGeneratedReport = englishReport && arabicReport;

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🤖 AI-Powered Analytical Reports
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          Generate comprehensive reports with AI-driven insights, model interpretation, and policy implications.
        </p>

        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4 text-center">{error}</p>}

        {!hasGeneratedReport && !isGenerating && (
          <div className="text-center mb-12">
            <button
              onClick={generateReport}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-xl font-bold py-6 px-12 rounded-2xl shadow-lg"
            >
              Generate Professional Report
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
            <p className="text-2xl font-bold text-indigo-600">Generating Your Report...</p>
          </div>
        )}

        {hasGeneratedReport && (
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8 shadow-inner border">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Professional Econometric Report (English)
              </h3>
              <div className="bg-white border rounded-xl p-6 max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {englishReport}
                </pre>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => downloadReport('en')} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg">
                Download English Report
              </button>
              <button onClick={() => downloadReport('ar')} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg">
                تنزيل التقرير العربي
              </button>
              <button onClick={() => { setEnglishReport(''); setArabicReport(''); }} className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg">
                Generate New Report
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-12">
          <button onClick={() => navigate('/models-analysis')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg">
            ← Back to Models
          </button>
          <button onClick={() => navigate('/contact-us')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Next: Contact Us →
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReports;
