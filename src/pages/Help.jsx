import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaQuestionCircle, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const Help = () => {
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [feedbackSent, setFeedbackSent] = useState(false);

  const location = useLocation();

  // When navigated with a hash (e.g. /help#faq or /help#feedback), scroll to the target
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // wait for layout then scroll
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
      }
    }
  }, [location]);

  const faqs = [
    {
      question: 'How do I add a transaction?',
      answer: 'Click the "Add Transaction" button on the Dashboard or Transactions page. Fill in the amount, type (income/expense), category, date, and optional notes, then click "Add Transaction".',
    },
    {
      question: 'Can I edit or delete transactions?',
      answer: 'Yes! On the Transactions page, click the edit icon to modify a transaction or the delete icon to remove it. Changes are saved immediately.',
    },
    {
      question: 'Where is my data stored?',
      answer: 'All your data is stored locally in your browser using localStorage. This means your data stays on your device and is never sent to any servers. This ensures complete privacy.',
    },
    {
      question: 'How do I change the currency?',
      answer: 'Go to Settings and select your preferred currency from the "Default Currency" dropdown. All monetary values throughout the app will update to use your selected currency.',
    },
    {
      question: 'Can I set a monthly budget?',
      answer: 'Yes! In Settings, you can set a monthly budget. This helps you track your spending against your budget throughout the month.',
    },
    {
      question: 'How do I filter transactions?',
      answer: 'On the Transactions page, use the filter options to search by keyword, filter by type (income/expense), category, or date range. You can combine multiple filters.',
    },
    {
      question: 'What happens if I clear my browser data?',
      answer: 'Since data is stored in browser localStorage, clearing browser data will delete all your transactions. Consider exporting your data if needed before clearing.',
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Spendwise is a web app that works great on mobile browsers! Simply bookmark the website on your phone for easy access. The interface is fully responsive.',
    },
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    // Since there's no backend, we'll just show a success message
    setFeedbackSent(true);
    setFeedback({ name: '', email: '', message: '' });
    setTimeout(() => setFeedbackSent(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      {/* About Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FaInfoCircle className="text-indigo-600 dark:text-indigo-400 text-3xl" />
          <h1 className="text-3xl font-bold font-montserrat text-gray-900 dark:text-white">About Spendwise</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Spendwise is a modern, privacy-focused expense tracking application designed to help you take control of your finances. 
            Unlike many financial apps, Spendwise runs entirely in your browser, ensuring that all your financial data stays on your device.
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            <strong>Key Features:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2 mb-4">
            <li>Track income and expenses with detailed categories</li>
            <li>Visual analytics with charts and graphs</li>
            <li>Budget management and spending insights</li>
            <li>Complete privacy - no servers, no cloud storage</li>
            <li>Responsive design for all devices</li>
            <li>Dark mode support</li>
            <li>Multiple currency support</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Spendwise is free to use, open-source, and respects your privacy. Your data belongs to you, and it stays with you.
          </p>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Usage Guide</h2>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Getting Started</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Navigate to the Dashboard to see your financial overview</li>
              <li>Click "Add Transaction" to record your first income or expense</li>
              <li>Choose a category that best describes your transaction</li>
              <li>View your spending patterns in the Analytics page</li>
              <li>Customize settings like currency and theme to your preference</li>
            </ol>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <FaQuestionCircle className="text-indigo-600 dark:text-indigo-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4" id="faq">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div id="feedback">
        <div className="flex items-center gap-3 mb-6">
          <FaEnvelope className="text-indigo-600 dark:text-indigo-400 text-2xl" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {feedbackSent ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold">
                Thank you for your feedback! (Note: This is a frontend-only demo - feedback is not actually sent to a server)
              </p>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={feedback.name}
                  onChange={(e) => setFeedback(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={feedback.email}
                  onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  value={feedback.message}
                  onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Send Feedback
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Note: This is a frontend-only demo. Feedback is not actually sent to a server.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;

