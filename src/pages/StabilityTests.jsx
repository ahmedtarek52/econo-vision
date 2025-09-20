import { useState } from 'react';

const RenderResults = ({ testId, results }) => {
  // ... (الكود الخاص بعرض النتائج، لا داعي لتغييره)
  if (!results) return null;
  switch (testId) {
    case 'stationarity':
      return (
        <table className="min-w-full divide-y divide-gray-200 border">
            <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Variable</th><th className="px-4 py-2 text-left">P-value</th><th className="px-4 py-2 text-left">Result</th></tr></thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {results.map(res => (
                <tr key={res.variable}><td className="px-4 py-2">{res.variable}</td><td className="px-4 py-2">{res.p_value.toFixed(4)}</td><td className={`px-4 py-2 font-semibold ${res.is_stationary ? 'text-green-600' : 'text-red-600'}`}>{res.is_stationary ? 'Stationary' : 'Non-Stationary'}</td></tr>
                ))}
            </tbody>
        </table>
      );
    case 'vif':
        return (
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-50"><tr><th className="px-4 py-2 text-left">Variable</th><th className="px-4 py-2 text-left">VIF Factor</th></tr></thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map(res => (
                  <tr key={res.variable}><td className="px-4 py-2">{res.variable}</td><td className={`px-4 py-2 font-semibold ${res.vif_factor > 5 ? 'text-red-600' : 'text-green-600'}`}>{res.vif_factor.toFixed(2)}</td></tr>
                ))}
              </tbody>
            </table>
        );
    case 'lag_order':
      return <div className="overflow-x-auto" dangerouslySetInnerHTML={{ __html: results.html_table }} />;
    case 'johansen':
      return (
        <div className="bg-gray-50 p-4 rounded-md"><p className="font-bold text-blue-600">{results.interpretation}</p><pre className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{results.details}</pre></div>
      );
    case 'autocorrelation':
        return (
            <div className="space-y-2">{results.map(res => (<div key={res.variable} className="bg-gray-50 p-3 rounded-md"><p className="font-bold">{res.variable}</p><pre className="text-xs mt-1">ACF: {res.acf.map(v => v.toFixed(2)).join(', ')}</pre><pre className="text-xs mt-1">PACF: {res.pacf.map(v => v.toFixed(2)).join(', ')}</pre></div>))}</div>
        );
    default:
      return <pre>{JSON.stringify(results, null, 2)}</pre>;
  }
};

const StabilityTests = ({ analysisData }) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [testResults, setTestResults] = useState(null);

  const tests = [
    { id: 'stationarity', title: 'Stationarity Test (ADF)', description: 'Checks if each series has a unit root. Essential for all time-series models.' },
    { id: 'vif', title: 'Multicollinearity Test (VIF)', description: 'Measures correlation between independent variables. Crucial for OLS and ARDL.' },
    { id: 'lag_order', title: 'Optimal Lag Selection', description: 'Helps determine the appropriate number of lags for VAR and VECM models.' },
    { id: 'johansen', title: 'Johansen Cointegration Test', description: 'Checks for long-run equilibrium relationships. Decides if VECM is applicable.' },
    { id: 'autocorrelation', title: 'Autocorrelation (ACF/PACF)', description: 'Identifies the p and q orders for an ARIMA model by analyzing autocorrelations.' },
  ];

  const runTest = async (testId) => {
    setSelectedTest(testId); setIsLoading(true); setError(''); setTestResults(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/tests/run-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: analysisData.fullDataset,
          testId: testId,
          independent_vars: analysisData.independentVars
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setTestResults(result);
    } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-8">
      <div><h2 className="text-3xl font-bold">🛡️ Pre-Estimation Diagnostic Tests</h2><p className="text-lg text-gray-600 mt-2">Select a test to understand the properties of your data before building a model.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">{tests.map((test) => (<div key={test.id} className={`bg-white border-2 rounded-lg p-4 cursor-pointer transition-all ${selectedTest === test.id ? 'border-indigo-500 bg-indigo-50 shadow-md' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => runTest(test.id)}><h4 className="text-lg font-bold text-gray-800">{test.title}</h4><p className="text-gray-600 text-sm mt-1">{test.description}</p></div>))}</div>
          <div className="bg-white rounded-lg shadow-md p-6"><h3 className="text-xl font-bold mb-4">Test Results</h3><div className="min-h-[200px]">{isLoading ? (<p className="text-center py-12 text-indigo-600 font-semibold">Running test...</p>) : error ? (<p className="text-red-500 bg-red-50 p-3 rounded-md">{error}</p>) : testResults ? (<RenderResults testId={selectedTest} results={testResults} />) : (<p className="text-gray-500 text-center py-12">Select a test from the left panel to see the results here.</p>)}</div></div>
        </div>
    </div>
  );
};

export default StabilityTests;
