import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';


const Dashboard = ({ analysisData }) => {
  const navigate = useNavigate();
  const [numericColumns, setNumericColumns] = useState([]);
  const [selectedVariable, setSelectedVariable] = useState('');
  const [summaryStats, setSummaryStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  const chartInstances = useRef({});
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const scatterChartRef = useRef(null);

  // Effect to load Chart.js library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    script.onload = () => {
      // Once script is loaded, fetch data and render charts
      fetchSummaryData();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      Object.values(chartInstances.current).forEach(chart => chart?.destroy());
    };
  }, [analysisData.fullDataset]);

  // Effect to update charts when selected variable changes
  useEffect(() => {
    if (window.Chart && selectedVariable && analysisData.fullDataset) {
      updateCharts();
    }
  }, [selectedVariable, summaryStats]);

  const fetchSummaryData = async () => {
    if (!analysisData.fullDataset || analysisData.fullDataset.length === 0) {
      navigate('/');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset: analysisData.fullDataset }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      const numericCols = Object.keys(result.summary);
      setNumericColumns(numericCols);
      setSummaryStats(result.summary);
      if (numericCols.length > 0) {
        setSelectedVariable(numericCols[0]);
      }
    } catch (error) {
      console.error("Failed to fetch summary stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCharts = () => {
    if (!window.Chart || !selectedVariable) return;

    const labels = analysisData.fullDataset.map((_, index) => index + 1);
    const variableData = analysisData.fullDataset.map(row => row[selectedVariable]);

    Object.values(chartInstances.current).forEach(chart => chart?.destroy());

    // Line Chart
    if (lineChartRef.current) {
      const lineCtx = lineChartRef.current.getContext('2d');
      chartInstances.current.line = new window.Chart(lineCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: selectedVariable,
            data: variableData,
            borderColor: '#48bb78',
            backgroundColor: 'rgba(72, 187, 120, 0.2)',
            borderWidth: 2,
            tension: 0.1,
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Trend of ${selectedVariable}` } } }
      });
    }

    // Bar Chart
    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext('2d');
      chartInstances.current.bar = new window.Chart(barCtx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: selectedVariable,
            data: variableData,
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderColor: '#667eea',
            borderWidth: 1
          }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Distribution of ${selectedVariable}` } } }
      });
    }
    
    // Scatter Plot (Example: Variable vs. Index)
    if (scatterChartRef.current) {
        const scatterCtx = scatterChartRef.current.getContext('2d');
        const scatterData = variableData.map((y, i) => ({ x: i + 1, y }));
        chartInstances.current.scatter = new window.Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: selectedVariable,
                    data: scatterData,
                    backgroundColor: '#ed8936'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { title: { display: true, text: `Scatter Plot of ${selectedVariable}` } } }
        });
    }
  };

  const currentStats = summaryStats[selectedVariable] || {};

  if (isLoading) {
    return <p>Loading Dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          📊 Interactive Dashboard
        </h2>

        <div className="flex justify-center items-center gap-4 mb-12">
          <label htmlFor="variableFilter" className="text-lg font-semibold text-gray-700">Select Variable:</label>
          <select
            id="variableFilter"
            value={selectedVariable}
            onChange={(e) => setSelectedVariable(e.target.value)}
            className="px-4 py-2 text-lg border-2 border-gray-300 rounded-lg bg-white shadow-sm focus:border-indigo-500"
          >
            {numericColumns.map(variable => <option key={variable} value={variable}>{variable}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg h-96"><canvas ref={lineChartRef}></canvas></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg h-96"><canvas ref={barChartRef}></canvas></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg h-96"><canvas ref={scatterChartRef}></canvas></div>
          
          <div className="bg-gray-50 rounded-2xl p-6 shadow-lg">
            <h4 className="text-2xl font-bold mb-4 text-gray-800 text-center">Data Statistics for {selectedVariable}</h4>
            <div className="space-y-4">
              {Object.entries(currentStats).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                  <span className="font-semibold text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="text-lg font-bold text-indigo-600">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-8">
          <button onClick={() => navigate('/data-preparation')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-gray-300">
            ← Back to Preparation
          </button>
          <button onClick={() => navigate('/stability-tests')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Next: Stability Tests →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
