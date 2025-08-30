import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SupportUs = () => {
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();

  const predefinedAmounts = [
    { value: '50', label: '$50', description: 'Coffee for the team' },
    { value: '100', label: '$100', description: 'Support development' },
    { value: '250', label: '$250', description: 'Help us grow' },
    { value: '500', label: '$500', description: 'Major contribution' }
  ];

  const handleDonation = (method) => {
    setShowThankYou(true);
    setTimeout(() => setShowThankYou(false), 5000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/30">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          ❤️ ادعمنا لنستمر
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed" dir="rtl">
          نحن نسعى جاهدين لتوفير أفضل الأدوات التحليلية لدعم الباحثين والخبراء الاقتصاديين. دعمك المادي يساعدنا على تغطية تكاليف التشغيل، وتطوير ميزات جديدة، والحفاظ على هذه المنصة متاحة ومجانية. كل مساهمة، مهما كانت صغيرة، تحدث فرقاً كبيراً.
        </p>

        {/* Thank You Message */}
        {showThankYou && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-12 text-center animate-fade-in">
            <div className="text-6xl mb-4">🙏</div>
            <h3 className="text-2xl font-bold text-green-800 mb-2">شكراً لدعمكم!</h3>
            <p className="text-green-700 text-lg">Your support means the world to us and helps keep this platform free for everyone.</p>
          </div>
        )}

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">2,500+</div>
            <div className="text-blue-100">Active Users</div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">15,000+</div>
            <div className="text-green-100">Reports Generated</div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center shadow-lg transform hover:-translate-y-1 transition-all">
            <div className="text-3xl font-bold mb-2">50+</div>
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