import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaClock, FaCalendarAlt, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { formatCurrency } from './SummaryCard';

const BudgetCountdown = () => {
  const { transactions, settings } = useTransactions();

  const budgetStats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();

    // Get total days in current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDaysInMonth = lastDayOfMonth.getDate();
    const daysRemaining = totalDaysInMonth - today + 1; // including today

    // Calculate total spending this month
    const monthlyExpenses = transactions
      .filter(t => {
        if (t.type !== 'expense') return false;
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const monthlyBudget = settings.monthlyBudget || 0;
    const budgetRemaining = monthlyBudget - monthlyExpenses;
    const dailyAllowance = daysRemaining > 0 ? budgetRemaining / daysRemaining : 0;

    // Calculate if on track
    const expectedSpending = (monthlyBudget / totalDaysInMonth) * today;
    const isOnTrack = monthlyExpenses <= expectedSpending;

    // Progress percentage
    const progressPercentage = monthlyBudget > 0 
      ? Math.min((monthlyExpenses / monthlyBudget) * 100, 100)
      : 0;

    return {
      monthlyBudget,
      monthlyExpenses,
      budgetRemaining,
      dailyAllowance,
      daysRemaining,
      totalDaysInMonth,
      today,
      isOnTrack,
      progressPercentage
    };
  }, [transactions, settings]);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long' });

  // Determine status color
  const getStatusColor = () => {
    if (budgetStats.budgetRemaining < 0) return 'red';
    if (budgetStats.progressPercentage > 80) return 'orange';
    if (budgetStats.isOnTrack) return 'green';
    return 'yellow';
  };

  const statusColor = getStatusColor();
  const colorClasses = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      gradient: 'from-green-500 to-emerald-600'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-300',
      gradient: 'from-yellow-500 to-orange-600'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      gradient: 'from-orange-500 to-red-600'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      gradient: 'from-red-500 to-pink-600'
    }
  };

  const colors = colorClasses[statusColor];

  if (budgetStats.monthlyBudget === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <FaClock className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Countdown</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Daily spending guide</p>
          </div>
        </div>
        <div className="text-center py-8">
          <FaDollarSign className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set a monthly budget in Settings to track your daily allowance
          </p>
          <a
            href="/settings"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Go to Settings
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-gradient-to-br ${colors.gradient} p-3 rounded-xl shadow-lg`}>
          <FaClock className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Countdown</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{monthName} spending tracker</p>
        </div>
      </div>

      {/* Daily Allowance - Big Number */}
      <div className={`${colors.bg} rounded-xl p-6 border ${colors.border} mb-4`}>
        <div className="text-center">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase mb-2">
            You Can Spend Today
          </div>
          <div className={`text-4xl font-bold ${colors.text} mb-2`}>
            {budgetStats.dailyAllowance >= 0 
              ? formatCurrency(budgetStats.dailyAllowance, settings.currency)
              : formatCurrency(0, settings.currency)
            }
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            per day for the next {budgetStats.daysRemaining} day{budgetStats.daysRemaining !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Budget Remaining */}
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <FaDollarSign className="text-indigo-600 dark:text-indigo-400 text-sm" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Remaining</span>
          </div>
          <div className={`text-xl font-bold ${
            budgetStats.budgetRemaining >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {formatCurrency(Math.abs(budgetStats.budgetRemaining), settings.currency)}
          </div>
          {budgetStats.budgetRemaining < 0 && (
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">Over budget</div>
          )}
        </div>

        {/* Days Remaining */}
        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-sm" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Days Left</span>
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {budgetStats.daysRemaining}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            of {budgetStats.totalDaysInMonth} days
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Used</span>
          <span className={`text-sm font-bold ${colors.text}`}>
            {budgetStats.progressPercentage.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
            style={{ width: `${Math.min(budgetStats.progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formatCurrency(budgetStats.monthlyExpenses, settings.currency)} spent</span>
          <span>{formatCurrency(budgetStats.monthlyBudget, settings.currency)} budget</span>
        </div>
      </div>

      {/* Status Message */}
      <div className={`${colors.bg} rounded-lg p-3 border ${colors.border}`}>
        <div className="flex items-start gap-3">
          <FaChartLine className={`${colors.text} text-lg mt-0.5`} />
          <div className="flex-1">
            <div className={`text-sm font-semibold ${colors.text} mb-1`}>
              {budgetStats.budgetRemaining < 0 && "⚠️ Over Budget"}
              {budgetStats.budgetRemaining >= 0 && budgetStats.progressPercentage > 80 && "⚡ Almost There!"}
              {budgetStats.budgetRemaining >= 0 && budgetStats.isOnTrack && budgetStats.progressPercentage <= 80 && "✅ On Track"}
              {budgetStats.budgetRemaining >= 0 && !budgetStats.isOnTrack && budgetStats.progressPercentage <= 80 && "⚠️ Spending Fast"}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {budgetStats.budgetRemaining < 0 && 
                `You've exceeded your budget by ${formatCurrency(Math.abs(budgetStats.budgetRemaining), settings.currency)}. Consider reducing spending.`}
              {budgetStats.budgetRemaining >= 0 && budgetStats.progressPercentage > 80 && 
                `You're close to your budget limit. Spend wisely for the remaining days.`}
              {budgetStats.budgetRemaining >= 0 && budgetStats.isOnTrack && budgetStats.progressPercentage <= 80 && 
                `Great job! You're staying within your budget. Keep it up!`}
              {budgetStats.budgetRemaining >= 0 && !budgetStats.isOnTrack && budgetStats.progressPercentage <= 80 && 
                `You're spending faster than planned. Try to reduce daily expenses.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetCountdown;
