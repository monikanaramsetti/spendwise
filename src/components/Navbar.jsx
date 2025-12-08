import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaHome, FaWallet, FaChartBar, FaCog, FaQuestionCircle, FaSun, FaMoon, FaSignOutAlt, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTransactions } from '../context/TransactionContext';

const Navbar = () => {
  const [isLeaving, setIsLeaving] = useState(false);
  const location = useLocation();
  const { settings, updateSettings, logout } = useTransactions();

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/budget', label: 'Budget', icon: FaMoneyBillWave },
    { path: '/transactions', label: 'Transactions', icon: FaWallet },
    { path: '/analytics', label: 'Analytics', icon: FaChartBar },
    { path: '/settings', label: 'Settings', icon: FaCog },
    { path: '/help', label: 'Help', icon: FaQuestionCircle },
  ];

  const toggleTheme = () => {
    updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' });
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    // play slide-out animation then clear session and navigate
    setIsLeaving(true);
    // match the animation duration in index.css
    setTimeout(() => {
      logout();
      toast.success('Logged out successfully');
      navigate('/signin');
    }, 360);
  };

  return (
    <nav className={`bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50 ${isLeaving ? 'animate-slide-out' : 'animate-slide-in'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {/* Small brand symbol beside text (keeps header compact) */}
            <FaWallet className="text-purple-600 text-xl" aria-hidden />
            <span className="text-2xl font-bold font-montserrat bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              Spendwise
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-purple-100 text-purple-700 shadow-sm'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {settings.theme === 'light' ? <FaMoon className="text-xl" /> : <FaSun className="text-xl" />}
          </button>

          {/* Logout (desktop) */}
          <button
            onClick={handleLogout}
            className="ml-3 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 transition-colors flex items-center gap-2"
            aria-label="Logout"
          >
            <FaSignOutAlt />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="text-lg" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
          {/* Mobile logout */}
          <div className="px-3 py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-800"
            >
              <FaSignOutAlt className="text-lg" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
