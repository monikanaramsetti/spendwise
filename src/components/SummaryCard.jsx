import { FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';
import { useTransactions } from '../context/TransactionContext';

const SummaryCard = ({ title, amount, type, icon: Icon, trend, trendText }) => {
  const { settings } = useTransactions();
  const colors = {
    income: {
      bg: 'from-emerald-500 to-teal-600',
      icon: 'text-emerald-600',
      text: 'text-emerald-600',
    },
    expense: {
      bg: 'from-red-500 to-rose-600',
      icon: 'text-red-600',
      text: 'text-red-600',
    },
    balance: {
      bg: amount >= 0 ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600',
      icon: amount >= 0 ? 'text-emerald-600' : 'text-red-600',
      text: amount >= 0 ? 'text-emerald-600' : 'text-red-600',
    },
  };

  const colorScheme = colors[type] || colors.balance;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
            {title}
          </p>
          <h3 className={`text-3xl font-bold ${colorScheme.text}`}>
            {typeof amount === 'number' ? formatCurrency(amount, settings.currency) : amount}
          </h3>
        </div>
        <div className={`bg-gradient-to-br ${colorScheme.bg} p-3.5 rounded-lg shadow-md`}>
          {Icon ? (
            <Icon className="text-white text-2xl" />
          ) : (
            <FaWallet className="text-white text-2xl" />
          )}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-2 text-sm">
          {trend > 0 ? (
            <FaArrowUp className="text-emerald-600" />
          ) : (
            <FaArrowDown className="text-red-600" />
          )}
          <span className="text-gray-600 dark:text-gray-400">{trendText}</span>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

// Format currency based on settings
export const formatCurrency = (amount, currency = 'USD') => {
  const value = Number(amount) || 0;
  // Always show Rupee symbol on dashboard / summary views
  try {
    return `₹${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
  } catch (e) {
    return `₹${value.toFixed(2)}`;
  }
};

