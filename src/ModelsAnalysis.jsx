// src/pages/ModelsAnalysis.jsx
import React from 'react';

const ModelsAnalysis = ({ analysisData, setModelResults }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">📈 Models & Analysis</h1>
      <p className="text-gray-700">
        This is the model estimation page. Based on the results from the diagnostic tests, you can now select and run the appropriate econometric model.
      </p>
      <div className="mt-8 p-6 bg-gray-50 rounded-md text-center">
        <p className="font-semibold">Coming Soon: Model Selection Panel</p>
        <p className="text-sm text-gray-500">(OLS, ARDL, VAR, VECM, ARIMA)</p>
      </div>
    </div>
  );
};

export default ModelsAnalysis;
