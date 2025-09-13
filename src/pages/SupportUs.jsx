import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';

const SupportUs = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(1000); // fallback value

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/report/report-count`)
      .then((res) => setCount(res.data.count))
      .catch(() => setCount(1000)); // fallback if backend doesn’t respond
  }, []);

  

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
           Support us to continue❤️
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          We strive to provide the best analytical tools to support researchers and economists.
           Your financial support helps us cover operating costs, develop new features, and keep this platform available and free.
           Every contribution, no matter how small, makes a big difference.
        </p>


        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">500+</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">{count.toLocaleString()}+</div>
            <div className="text-green-100">Reports Generated</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">5+</div>
            <div className="text-purple-100">Countries Served</div>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">100%</div>
            <div className="text-orange-100">Free Platform</div>
          </div>
        </div>
         </div>
          </div>
          );
        };
        export default SupportUs;