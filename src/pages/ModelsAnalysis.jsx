import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ModelsAnalysis = ({ analysisData , setModelResults}) => {
  const navigate = useNavigate();
  
  const [allVariables, setAllVariables] = useState([]);
  const [endogenousVariables, setEndogenousVariables] = useState([]);
  const [exogenousVariables, setExogenousVariables] = useState([]);
  const [selectedModelId, setSelectedModelId] = useState('ols');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // const [modelResults, setModelResults] = useState('');

  useEffect(() => {
    if (!analysisData.columns || analysisData.columns.length === 0) {
      navigate('/');
      return;
    }
    // Filter out non-numeric columns, as they can't be used in these models
    const numericCols = analysisData.columns.filter(col => 
      typeof analysisData.fullDataset[0][col] === 'number'
    );
    setAllVariables(numericCols);
  }, [analysisData, navigate]);

  const models = [
    { id: 'ols', title: 'Simple Linear Regression (OLS)', description: 'Predicts a dependent variable based on one or more independent variables.' },
    { id: 'var', title: 'Vector Autoregression (VAR)', description: 'Models interdependencies among multiple time series.' },
    { id: 'arima', title: 'ARIMA Model', description: 'Analyzes and forecasts a single time series variable.' },
  ];

  const moveVariable = (variable, targetGroup) => {
    setEndogenousVariables(prev => prev.filter(v => v !== variable));
    setExogenousVariables(prev => prev.filter(v => v !== variable));

    if (targetGroup === 'endogenous') {
      setEndogenousVariables(prev => [...prev, variable]);
    } else if (targetGroup === 'exogenous') {
      setExogenousVariables(prev => [...prev, variable]);
    }
  };

  const getAvailableVariables = () => {
    return allVariables.filter(v => !endogenousVariables.includes(v) && !exogenousVariables.includes(v));
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    setError('');
    setModelResults('');

    try {
      const response = await fetch('http://localhost:5000/api/model/run-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset: analysisData.fullDataset,
          modelId: selectedModelId,
          endogenous: endogenousVariables,
          exogenous: exogenousVariables,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setModelResults(result.model_summary);
      console.log(result.model_summary);
      
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const VariableCard = ({ variable, onClick }) => (
    <div
      className="bg-blue-100 border border-blue-200 rounded-lg px-3 py-1 cursor-pointer hover:bg-blue-200 text-center font-medium text-blue-800"
      onClick={onClick}
    >
      {variable}
    </div>
  );

  const DropZone = ({ title, variables, targetGroup }) => (
    <div className="bg-white rounded-xl p-4 shadow-md border flex-1">
      <h4 className="text-lg font-semibold mb-3 text-center text-gray-700">{title}</h4>
      <div className="flex flex-wrap justify-center gap-2 min-h-24 p-2 border-2 border-dashed rounded-lg bg-gray-50">
        {variables.length > 0 ? (
          variables.map(v => <VariableCard key={v} variable={v} onClick={() => moveVariable(v, 'available')} />)
        ) : (
          <p className="text-gray-400 self-center">Drop variables here</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          📈 Economic Models & Analysis
        </h2>
        
        {/* Variable Selection */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <DropZone title="Available Variables" variables={getAvailableVariables()} targetGroup="available" />
          <div className="flex flex-col gap-2 self-center">
            <button onClick={() => getAvailableVariables().forEach(v => moveVariable(v, 'endogenous'))} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">{'>>'}</button>
            <button onClick={() => getAvailableVariables().forEach(v => moveVariable(v, 'exogenous'))} className="p-2 bg-gray-200 rounded-md hover:bg-gray-300">{'>'}</button>
          </div>
          <DropZone title="Endogenous (Dependent)" variables={endogenousVariables} targetGroup="endogenous" />
          <DropZone title="Exogenous (Independent)" variables={exogenousVariables} targetGroup="exogenous" />
        </div>

        {/* Model Selection */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Choose Your Model</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model) => (
              <div
                key={model.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedModelId === model.id ? 'border-indigo-500 bg-indigo-50' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => setSelectedModelId(model.id)}
              >
                <h4 className="text-lg font-bold text-gray-800">{model.title}</h4>
                <p className="text-sm text-gray-600">{model.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mb-8">
            <button onClick={runAnalysis} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-lg font-bold py-4 px-12 rounded-xl hover:from-green-600 disabled:opacity-50">
                {isLoading ? 'Running...' : 'Run Analysis'}
            </button>
        </div>

        {/* Results */}
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
        {analysisData.modelResults && (
            <div className="bg-gray-50 rounded-2xl p-8 shadow-inner border">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Model Results</h3>
                <pre className="bg-white border rounded-xl p-6 font-mono text-sm whitespace-pre-wrap overflow-x-auto">
                    {analysisData.modelResults}
                </pre>
            </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-12">
          <button onClick={() => navigate('/stability-tests')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg">
            ← Back to Tests
          </button>
          <button onClick={() => navigate('/ai-reports')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Next: AI Reports →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelsAnalysis;
