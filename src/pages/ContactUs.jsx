import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config.js';


const ContactUs = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSubmitted(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subject,
          message: feedback,
          rating,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      
      setSubmitted(true);
      // Reset form
      setEmail('');
      setSubject('');
      setFeedback('');
      setRating(0);
      
      setTimeout(() => setSubmitted(false), 5000); // Hide success message after 5 seconds

    } catch (err) {
      setError(err.message || 'Failed to send feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const StarRating = () => (
    <div className="flex justify-center items-center mb-8">
      <div className="flex space-x-2">
        {[5, 4, 3, 2, 1].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className={`text-5xl transition-all duration-200 transform hover:scale-110 ${
              star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-12 shadow-2xl">
        <h2 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          ✉️ Contact Us & Rate Us
        </h2>
        <p className="text-center text-xl text-gray-600 mb-12">
          We value your feedback! Please rate our platform and get in touch with any questions or suggestions.
        </p>

        <div className="bg-yellow-50 rounded-2xl p-8 mb-12 border">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            🌟 Rate Your Experience
          </h3>
          <StarRating />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Send Us Your Feedback
            </h3>
            
            {submitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-6">
                <p className="font-semibold">Thank you for your feedback!</p>
                <p className="text-sm">We'll review your message and get back to you soon.</p>
              </div>
            )}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleSubmitFeedback} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" placeholder="your.email@example.com" required />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl" required>
                  <option value="">Select a topic...</option>
                  <option value="General Feedback">General Feedback</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Technical Support">Technical Support</option>
                </select>
              </div>
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                <textarea id="feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none" placeholder="Tell us about your experience..." required />
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-xl disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Feedback'}
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Get In Touch Directly</h3>
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-blue-50 rounded-2xl p-6 border">
                <h4 className="text-lg font-bold text-blue-900">Email</h4>
                <p className="text-sm md:text-lg font-semibold text-blue-800">
                  mohamed.fawzy.0999@gmail.com
                </p>
              </div>

              {/* Phone */}
              <div className="bg-green-50 rounded-2xl p-6 border">
                <h4 className="text-lg font-bold text-green-900">Phone</h4>
                <p className="text-lg font-semibold text-green-800">+201111500461</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-6 mt-8 text-2xl text-gray-600">
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-500"
              >
                <i className="fab fa-x"></i>
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-700"
              >
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>

        </div>

        <div className="flex justify-between items-center pt-12 mt-8 border-t">
          <button onClick={() => navigate('/ai-reports')} className="bg-gray-200 text-gray-800 font-bold py-3 px-6 me-3 md:me-0 rounded-lg">
            ← Back to Reports
          </button>
          <button onClick={() => navigate('/support-us')} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            Next: Support Us →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
