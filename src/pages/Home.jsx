import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';

// A dedicated component to display data quality warnings after upload.
const UploadWarnings = ({ issues }) => {
  if (!issues || issues.length === 0) {
    return null;
  }
  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mt-6 rounded-r-lg" role="alert">
      <p className="font-bold">Data Insights</p>
      <p>Your file was uploaded successfully. We recommend addressing the following issues in the next step:</p>
      <ul className="list-disc list-inside mt-2">
        {issues.map((issue, index) => <li key={index}>{issue}</li>)}
      </ul>
    </div>
  );
};

// A component for displaying critical server errors.
const ErrorMessage = ({ message, details }) => {
  if (!message) {
    return null;
  }
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 text-left">
      <p className="font-bold">Error: {message}</p>
      {details && details.length > 0 && (
        <ul className="list-disc list-inside mt-2">
          {details.map((detail, index) => <li key={index}>{detail}</li>)}
        </ul>
      )}
    </div>
  );
};

const Home = ({ setAnalysisData }) => {
  const [userName, setUserName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState({ message: null, details: [] });
  const [uploadWarnings, setUploadWarnings] = useState([]); // State to hold quality warnings
  const navigate = useNavigate();

  const registerUser = () => {
    if (userName.trim() !== '') {
      setIsRegistered(true);
    }
  };

  const handleFileUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    // Reset UI states for a new upload
    setUploadedFile(file);
    setIsUploading(true);
    setUploadSuccess(false);
    setError({ message: null, details: [] });
    setUploadWarnings([]); // Reset warnings

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/data/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw data; // Throw error object from backend
      }
      
      // On success, update the parent state with all data
      setAnalysisData(data);
      
      // Check for and set any quality report warnings
      if (data.qualityReport && !data.qualityReport.is_ok) {
        setUploadWarnings(data.qualityReport.issues);
      }
      
      setUploadSuccess(true);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError({ message: err.error || 'An unexpected error occurred.', details: err.details || [] });
      setUploadedFile(null); // Clear the failed upload from UI
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const proceedToNextStep = () => {
    if (uploadSuccess) {
      navigate('/data-preparation');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            🏛️ DataNomics
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          👋 Welcome to Advanced Economic Analysis
        </h2>

        {!isRegistered ? (
          // Registration Form
          <div className="max-w-2xl mx-auto text-center">
             <div className="relative mb-8">
               <input
                 type="text"
                 value={userName}
                 onChange={(e) => setUserName(e.target.value)}
                 className="w-full p-6 text-xl border-2 border-gray-300 rounded-2xl bg-white/90 backdrop-blur focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                 placeholder="Enter Your Full Name"
                 required
               />
             </div>
             <button
               onClick={registerUser}
               className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xl font-bold py-5 px-10 rounded-2xl hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
             >
               🚀 Start Your Economic Journey
             </button>
          </div>
        ) : (
          // Welcome Message & Data Upload
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-2">🎉 Welcome, {userName}!</h3>
              <p>Ready to turn your data into insights? Let's get started! 📊</p>
            </div>
            
            <ErrorMessage message={error.message} details={error.details} />

            {/* Data Upload Section */}
            <div>
              <div
                className="border-4 border-dashed border-indigo-400 rounded-2xl p-16 text-center bg-gradient-to-br from-blue-50 to-indigo-50 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="text-8xl mb-6 text-indigo-500">📊</div>
                <h4 className="text-2xl font-semibold mb-4">Drag & Drop Your File Here</h4>
                <p className="text-lg text-gray-600">Supported formats: CSV, Excel (.xlsx, .xls), JSON</p>
                <p className="text-muted">Please make sure your data file name is written in English. 💡</p>

              </div>

              <input
                type="file"
                id="fileInput"
                accept=".csv,.xlsx,.xls,.json"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />

              {isUploading && <p className="text-center mt-4 text-indigo-600 font-medium">Processing your data...</p>}
              
              {uploadedFile && !isUploading && (
                <div className="mt-8 space-y-4">
                  <div className={`p-6 rounded-2xl shadow-md ${uploadSuccess ? 'bg-green-50 border-l-4 border-green-500' : 'bg-gray-50 border-l-4 border-gray-500'}`}>
                    <div className="font-semibold">File: {uploadedFile.name}</div>
                    <div className="text-gray-600">Size: {(uploadedFile.size / 1024).toFixed(2)} KB</div>
                  </div>
                </div>
              )}

              {uploadSuccess && (
                <>
                  <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-2xl mt-8 text-center">
                    <p className="font-semibold">Data processed successfully! You can now proceed to the next step.</p>
                  </div>
                  <UploadWarnings issues={uploadWarnings} />
                </>
              )}

              <div className="flex justify-end mt-8">
                <button
                  onClick={proceedToNextStep}
                  disabled={!uploadSuccess || isUploading}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xl font-bold py-4 px-8 rounded-2xl transform transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none hover:enabled:-translate-y-1"
                >
                  Next: Data Preparation →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
