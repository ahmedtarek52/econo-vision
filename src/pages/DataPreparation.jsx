import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';


const DataPreparation = ({ analysisData, setAnalysisData }) => {
  const navigate = useNavigate();
  
  const [processedData, setProcessedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (analysisData.fullDataset && analysisData.fullDataset.length > 0) {
      setProcessedData(analysisData.fullDataset);
    } 
    // else {
    //   navigate('/');
    // }
  }, [analysisData.fullDataset, navigate]);

  const cleaningOptions = [
    { id: 'remove-missing', title: '🚫 Remove Missing Values', description: 'Automatically remove rows with missing values.' },
    { id: 'impute-missing', title: '🔄 Impute Missing Values', description: 'Replace empty cells in numeric columns with the column\'s average.' },
    { id: 'handle-outliers', title: '📉 Handle Outliers', description: 'Detect and remove or cap extreme values.' },
    { id: 'unify-formats', title: '📝 Unify Formats', description: 'Ensure consistent formatting for dates and text.' },
    { id: 'remove-duplicates', title: '🗃️ Remove Duplicates', description: 'Identify and remove duplicate rows for data integrity.' },
    { id: 'normalize-data', title: '⚖️ Normalize Data', description: 'Rescale numerical data to a standard range for better model performance.' }
  ];

  const applyCleaningOption = async (optionId) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/prepare/clean`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: processedData,
          operation: optionId,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'An unknown error occurred.');
      setProcessedData(result.cleanedDataset);
      console.log(result.cleanedDataset);
      

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCleanedData = () => {
    if (processedData.length === 0) {
      alert('No data available to download.');
      return;
    }

    const headers = Object.keys(processedData[0]);
    // Create header row
    const csvHeader = headers.join(',');
    // Create data rows
    const csvRows = processedData.map(row => 
      headers.map(header => {
        let value = row[header];
        // Handle null/undefined and values containing commas
        if (value === null || value === undefined) return '';
        const strValue = String(value);
        return strValue.includes(',') ? `"${strValue}"` : strValue;
      }).join(',')
    );

    const csvContent = [csvHeader, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cleaned_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const nextPage = () => {
    // setAnalysisData(prev => ({ ...prev, fullDataset: processedData }));
    navigate('/dashboard');
  };

  const renderDataPreview = () => {
    if (processedData.length === 0) {
      return <p className="text-center text-gray-500">No data to display.</p>;
    }
    const headers = Object.keys(processedData[0] || {});
    const previewData = processedData.slice(0, 5);
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {previewData.map((row, index) => (
              <tr key={index}>
                {headers.map(header => (
                  <td key={header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {row[header] === null ? <em>null</em> : String(row[header])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          🧹 Data Cleaning & Preparation
        </h2>
        <p className="text-center text-lg text-gray-600 mb-8">
          Apply transformations to ensure your data is clean. The preview below will update after each operation.
        </p>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">Data Preview ({processedData.length} rows)</h3>
          {renderDataPreview()}
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Cleaning Operations</h3>
          {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cleaningOptions.map(option => (
              <button
                key={option.id}
                onClick={() => applyCleaningOption(option.id)}
                disabled={isLoading}
                className="text-left p-6 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
              >
                <h4 className="font-bold text-lg text-gray-800">{option.title}</h4>
                <p className="text-gray-600">{option.description}</p>
              </button>
            ))}
          </div>
          {isLoading && <p className="text-center mt-4 text-indigo-600 font-medium">Applying operation...</p>}
        </div>

        <div className="flex justify-between items-center mt-12">
          <button onClick={() => navigate('/')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 transition-all">
            ← Back to Upload
          </button>
          <div className="flex items-center gap-4">
            <button onClick={downloadCleanedData} className="bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all">
              📥 Download Cleaned Data
            </button>
            <button onClick={nextPage} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold py-3 px-6 rounded-lg transform transition-all duration-300 shadow-lg hover:-translate-y-1">
              Next: Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreparation;