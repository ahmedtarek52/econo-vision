import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';


const StabilityTests = ({ analysisData }) => {
  const navigate = useNavigate();
  
  const [numericColumns, setNumericColumns] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [selectedTest, setSelectedTest] = useState(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState({ formatted_results: '', interpretation: '' });

  useEffect(() => {
    if (!analysisData.fullDataset || analysisData.fullDataset.length === 0) {
      // navigate('/');
      return;
    }
    // Filter for numeric columns suitable for these tests
    const numericCols = analysisData.columns.filter(col => 
      typeof analysisData.fullDataset[0][col] === 'number'
    );
    setNumericColumns(numericCols);
    if (numericCols.length > 0) {
      setSelectedVariable(numericCols[0]);
    }
  }, [analysisData, navigate]);

  const tests = [
    { id: 'adf', title: 'Augmented Dickey-Fuller', description: 'Tests if a single series is stationary (has a unit root).' },
    { id: 'granger', title: 'Granger Causality', description: 'Checks if one series is useful in forecasting another.' },
  ];

  const runTest = async (testId) => {
    if ((testId === 'adf' && !selectedVariable)) {
      setError('Please select a variable for the ADF test.');
      return;
    }

    setSelectedTest(testId);
    setIsLoading(true);
    setError('');
    setTestResults({ formatted_results: '', interpretation: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/tests/run-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: analysisData.fullDataset,
          testId: testId,
          params: {
            variable: selectedVariable, // Sent for ADF
            max_lags: 2 // Sent for Granger
          }
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setTestResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🛡️ Stability & Statistical Tests
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          Perform diagnostic tests to understand the properties of your time-series data.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Test Selection Panel */}
          <div className="space-y-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className={`bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-lg transform hover:-translate-y-1 ${
                  selectedTest === test.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                }`}
                onClick={() => runTest(test.id)}
              >
                <h4 className="text-xl font-bold mb-2 text-gray-800">{test.title}</h4>
                <p className="text-gray-600 text-sm">{test.description}</p>
              </div>
            ))}
          </div>

          {/* Test Configuration Panel */}
          <div className="bg-gray-50 rounded-2xl p-6 border">
            <h3 className="text-xl font-bold mb-4">Test Configuration</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="variableSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Variable for ADF Test:
                </label>
                <select
                  id="variableSelect"
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  {numericColumns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>
                <p className="text-xs text-gray-500 mt-1">Granger test runs on all numeric variables automatically.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
        
        {isLoading ? (
          <p className="text-center py-12 text-indigo-600 font-semibold">Running test...</p>
        ) : (
          testResults.formatted_results && (
            <>
              <div className="bg-gray-50 rounded-2xl p-8 shadow-inner border mb-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Test Output</h3>
                <pre className="bg-white border rounded-xl p-6 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                  {testResults.formatted_results}
                </pre>
              </div>
              <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                <h4 className="text-xl font-bold mb-3 text-blue-900">Key Insights</h4>
                <p className="text-blue-800 whitespace-pre-wrap">{testResults.interpretation}</p>
              </div>
            </>
          )
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-12">
          <button onClick={() => navigate('/dashboard')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg">
            ← Back to Dashboard
          </button>
          <button onClick={() => navigate('/models-analysis')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Next: Models & Analysis →
          </button>
        </div>
      </div>
    </div>
  );
};

export default StabilityTests;
