import { useState, useEffect } from 'react';

const DataPreparation = ({ data, allVariables, onNavigate }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const cleaningOptions = [
    { id: 'remove-missing', title: '🚫 Remove Missing Values', description: 'Automatically remove rows with missing values.' },
    { id: 'impute-missing', title: '🔄 Impute Missing Values', description: 'Replace missing values with the mean or median.' },
    { id: 'handle-outliers', title: '📉 Handle Outliers', description: 'Detect and remove or cap extreme values.' },
    { id: 'unify-formats', title: '📝 Unify Formats', description: 'Ensure consistent formatting for dates and text.' },
    { id: 'remove-duplicates', title: '🗃️ Remove Duplicates', description: 'Identify and remove duplicate rows for data integrity.' },
    { id: 'normalize-data', title: '⚖️ Normalize Data', description: 'Rescale numerical data to a standard range for better model performance.' }
  ];

  const toggleOption = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const prevPage = () => {
    if (onNavigate) {
      onNavigate('previous');
    }
  };

  const nextPage = () => {
    if (onNavigate) {
      onNavigate('next');
    }
  };

  const downloadCleanedData = () => {
    if (!data || data.length === 0 || !data[0]) {
      alert('No data available to download');
      return;
    }

    // Apply selected cleaning operations to data
    let cleanedData = [...data];
    
    selectedOptions.forEach(option => {
      switch(option) {
        case 'remove-missing':
          cleanedData = cleanedData.filter(row => 
            Object.values(row).every(value => value !== null && value !== undefined && value !== '')
          );
          break;
        case 'remove-duplicates':
          cleanedData = cleanedData.filter((row, index, self) => 
            index === self.findIndex(r => JSON.stringify(r) === JSON.stringify(row))
          );
          break;
        // Add more cleaning logic as needed
        default:
          break;
      }
    });

    // Convert to CSV and download
    const headers = Object.keys(cleanedData[0] || {});
    const csvContent = [
      headers.join(','),
      ...cleanedData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'cleaned_data.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderDataPreview = () => {
    if (!data || data.length === 0 || !data[0]) {
      return (
        <div className="data-preview">
          <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2em' }}>
            📋 Data Preview will appear here after upload.
          </p>
        </div>
      );
    }

    const headers = Object.keys(data[0]);
    const previewData = data.slice(0, 5); // Show first 5 rows

    return (
      <div className="data-preview">
        <h4>Data Preview ({data.length} rows)</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                {headers.map(header => (
                  <th key={header} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index}>
                  {headers.map(header => (
                    <td key={header} style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          /* Core styles from your CSS */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%); min-height: 100vh; color: #333; overflow-x: hidden; direction: ltr; }
          
          .page { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border-radius: 25px; padding: 50px; margin-bottom: 30px; box-shadow: 0 30px 60px rgba(0, 0, 0, 0.2); border: 1px solid rgba(255, 255, 255, 0.3); animation: slideIn 0.8s ease-out; position: relative; overflow: hidden; }
          .page::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 3s infinite; }
          @keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }
          @keyframes slideIn { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
          
          .page-title { font-size: 2.8em; background: linear-gradient(135deg, #1e3c72, #2a5298); background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 40px; text-align: center; border-bottom: 4px solid transparent; border-image: linear-gradient(45deg, #667eea, #764ba2) 1; padding-bottom: 20px; position: relative; z-index: 2; }
          
          .data-preview { background: rgba(247, 250, 252, 0.9); backdrop-filter: blur(10px); border-radius: 15px; padding: 30px; margin: 30px 0; max-height: 400px; overflow: auto; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
          
          .cleaning-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 30px 0; }
          
          .option-card { background: rgba(248, 250, 255, 0.9); backdrop-filter: blur(10px); border: 3px solid rgba(226, 232, 240, 0.5); border-radius: 15px; padding: 25px; cursor: pointer; transition: all 0.4s ease; text-align: center; }
          .option-card:hover { border-color: #667eea; background: rgba(232, 242, 255, 0.9); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(102, 126, 234, 0.2); }
          .option-card.selected { border-color: #38a169; background: rgba(240, 255, 244, 0.9); transform: translateY(-3px); box-shadow: 0 10px 20px rgba(56, 161, 105, 0.2); }
          
          .btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 18px 35px; border-radius: 15px; font-size: 1.2em; cursor: pointer; transition: all 0.4s ease; margin: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); position: relative; overflow: hidden; }
          .btn::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transition: left 0.5s; }
          .btn:hover::before { left: 100%; }
          .btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4); }
          .btn:active { transform: translateY(-1px); }
          .btn-secondary { background: linear-gradient(135deg, #48bb78, #38a169); box-shadow: 0 10px 20px rgba(72, 187, 120, 0.3); }
          .btn-warning { background: linear-gradient(135deg, #ed8936, #dd6b20); box-shadow: 0 10px 20px rgba(237, 137, 54, 0.3); }
          
          .navigation { display: flex; justify-content: space-between; align-items: center; margin-top: 50px; position: relative; z-index: 2; }
          
          @media (max-width: 768px) { 
            .page { padding: 30px 20px; } 
            .page-title { font-size: 2.2em; } 
            .cleaning-options { grid-template-columns: 1fr; } 
            .navigation { flex-direction: column; gap: 20px; }
            .navigation > div { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
          }
        `}
      </style>
      
      <div className="page">
        <h2 className="page-title">🧹 Data Cleaning & Preparation</h2>
        <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>
          Review your uploaded data and apply necessary cleaning transformations. This step ensures the quality and reliability of your dataset for subsequent analysis.
        </p>
        
        {renderDataPreview()}
        
        <h3 style={{ margin: '40px 0 30px 0', fontSize: '1.8em', color: '#2d3748' }}>
          Choose Data Cleaning Options:
        </h3>
        
        <div className="cleaning-options">
          {cleaningOptions.map(option => (
            <div
              key={option.id}
              className={`option-card ${selectedOptions.includes(option.id) ? 'selected' : ''}`}
              onClick={() => toggleOption(option.id)}
            >
              <h4>{option.title}</h4>
              <p>{option.description}</p>
            </div>
          ))}
        </div>
        
        <div className="navigation">
          <button className="btn btn-warning" onClick={prevPage}>
            ← Previous
          </button>
          <div>
            <button className="btn btn-secondary" onClick={downloadCleanedData}>
              📥 Download Cleaned Data
            </button>
            <button className="btn" onClick={nextPage}>
              Next: Dashboard →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataPreparation;