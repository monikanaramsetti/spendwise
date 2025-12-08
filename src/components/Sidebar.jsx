import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaChartPie, FaChartBar, FaSignOutAlt, FaUser, FaPiggyBank, FaCog } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTransactions } from '../context/TransactionContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: FaHome },
    { path: '/transactions', label: 'Transactions', icon: FaMoneyBillWave },
    { path: '/budget', label: 'Budget', icon: FaChartPie },
    { path: '/savings', label: 'Savings Goals', icon: FaPiggyBank },
    { path: '/reports', label: 'Reports', icon: FaChartBar },
    { path: '/settings', label: 'Settings', icon: FaCog },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    toast.success('Logged out successfully!');
    navigate('/signin');
  };

  const { userName } = useTransactions();

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 glass-strong border-r border-white/20 shadow-2xl flex flex-col z-50">
      {/* Logo Section */}
      <div className="p-8 border-b border-white/20">
        <Link to="/" className="flex items-center space-x-4 group">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <span className="text-2xl font-bold font-montserrat bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Spendwise
            </span>
            <p className="text-xs text-gray-500 font-medium">Financial Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`group flex items-center space-x-4 px-4 py-3.5 rounded-xl transition-all duration-300 relative ${
                active
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                  : 'text-gray-700 hover:bg-white/50 hover:text-indigo-600'
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
              <Icon className={`text-xl ${active ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'} transition-colors`} />
              {/* keep sidebar compact: hide label text and only show icon with tooltip on hover */}
              <span className={`sr-only group-hover:not-sr-only ml-2 font-semibold ${active ? 'text-white' : 'text-gray-700 group-hover:text-indigo-600'} transition-colors`}>
                {link.label}
              </span>
              {active && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-6 border-t border-white/20 space-y-4">
        <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <FaUser className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">{userName || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">Active User</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
