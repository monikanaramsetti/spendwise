import { Link } from 'react-router-dom';
import { FaWallet, FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-indigo-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FaWallet className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold font-montserrat text-white">Spendwise</span>
            </div>
            <p className="text-gray-400 mb-4">
              Track your expenses, manage your budget, and achieve your financial goals with Spendwise.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/transactions" className="hover:text-white transition-colors">Transactions</Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-white transition-colors">Analytics</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-white transition-colors">Help Center</Link>
              </li>
              <li>
                <Link to="/help#faq" className="hover:text-white transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/help#feedback" className="hover:text-white transition-colors">Feedback</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Spendwise. All rights reserved. Built with ❤️ for better financial management.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
