import { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DataPreparation from './pages/DataPreparation';
import Dashboard from './pages/Dashboard';
import DiagnosticsTests from './pages/DiagnosticsTests';
import AIReports from './pages/AIReports';
import ContactUs from './pages/ContactUs';
import SupportUs from './pages/SupportUs';

function App() {
   const [analysisData, setAnalysisData] = useState({
    filename: '',
    columns: [],
    previewData: [],
    suggestedTypes: {},
    fullDataset: [],
  });

   const [modelResults, setModelResults] = useState(''); 

    useEffect(() => {
    if (analysisData && analysisData.filename) {
      localStorage.setItem("analysisData", JSON.stringify(analysisData));
    }
  }, [analysisData]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-700">
        <Navbar />
        <main className="container mx-auto p-4 pt-20">
          <Routes>
            <Route path="/" element={<Home setAnalysisData={setAnalysisData} />} />
            <Route path="/data-preparation" element={<DataPreparation analysisData={analysisData} />} />
             <Route path="/dashboard" element={<Dashboard analysisData={analysisData} />} />
             <Route path="/stability-tests" element={<DiagnosticsTests analysisData={analysisData} />} />
          <Route path="/models-analysis" element={<ModelsAnalysis analysisData={analysisData}  setModelResults={setModelResults} />} />
             <Route path="/ai-reports" element={<AIReports modelResults={modelResults} />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/support-us" element={<SupportUs />} />   
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
