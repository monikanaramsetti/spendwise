import { useState, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../components/SummaryCard';
import { FaMoneyBillWave, FaEdit, FaCheck, FaTimes, FaChartLine, FaExclamationTriangle, FaCalendarDay } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const Budget = () => {
  const { transactions, settings, updateSettings } = useTransactions();
  const [isEditing, setIsEditing] = useState(!settings.monthlyBudget || settings.monthlyBudget === 0);
  const [budgetAmount, setBudgetAmount] = useState(settings.monthlyBudget || 0);
  const [isEditingDaily, setIsEditingDaily] = useState(false);
  const [dailyBudgetAmount, setDailyBudgetAmount] = useState(settings.dailyBudget || 0);

  // Calculate current month's spending
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && 
             tDate.getFullYear() === currentYear;
    });

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const categoryBreakdown = {};
    monthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'Uncategorized';
        categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + parseFloat(t.amount || 0);
      });

    return {
      totalIncome,
      totalExpense,
      categoryBreakdown,
      transactionCount: monthTransactions.length
    };
  }, [transactions]);

  // Calculate today's spending
  const todaySpending = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return transactions
      .filter(t => t.type === 'expense' && t.date === today)
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
  }, [transactions]);

  const budget = settings.monthlyBudget || 0;
  const spent = currentMonthData.totalExpense;
  const remaining = budget - spent;
  const percentageUsed = budget > 0 ? (spent / budget) * 100 : 0;

  // Get days in current month and days remaining
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = daysInMonth - currentDay;
  const dailyAllowance = daysRemaining > 0 ? remaining / daysRemaining : 0;

  // Daily budget calculations
  const dailyBudget = settings.dailyBudget || 0;
  const dailyRemaining = dailyBudget - todaySpending;
  const dailyPercentageUsed = dailyBudget > 0 ? (todaySpending / dailyBudget) * 100 : 0;

  // Determine status
  const getStatus = () => {
    if (budget === 0) return { text: 'No Budget Set', color: 'gray', icon: FaExclamationTriangle };
    if (percentageUsed < 50) return { text: 'On Track', color: 'green', icon: FaCheck };
    if (percentageUsed < 75) return { text: 'Doing Well', color: 'blue', icon: FaChartLine };
    if (percentageUsed < 90) return { text: 'Approaching Limit', color: 'yellow', icon: FaExclamationTriangle };
    if (percentageUsed < 100) return { text: 'Almost Over Budget', color: 'orange', icon: FaExclamationTriangle };
    return { text: 'Over Budget', color: 'red', icon: FaTimes };
  };

  const status = getStatus();

  const handleSaveBudget = () => {
    updateSettings({ monthlyBudget: parseFloat(budgetAmount) || 0 });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setBudgetAmount(settings.monthlyBudget || 0);
    setIsEditing(false);
  };

  const handleSaveDailyBudget = () => {
    updateSettings({ dailyBudget: parseFloat(dailyBudgetAmount) || 0 });
    setIsEditingDaily(false);
  };

  const handleCancelDailyEdit = () => {
    setDailyBudgetAmount(settings.dailyBudget || 0);
    setIsEditingDaily(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Budget Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your monthly and daily budget and spending habits
        </p>
      </div>

      {/* Monthly Budget Setup Card */}
      <div className="bg-indigo-600 rounded-2xl shadow-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaMoneyBillWave className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Monthly Budget</h2>
              <p className="text-sm text-white/80">
                {now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaEdit /> Edit Budget
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-xl font-bold"
              placeholder="Enter monthly budget"
              step="0.01"
              min="0"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveBudget}
                className="flex-1 px-4 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="text-4xl font-bold">
            {formatCurrency(budget, settings.currency)}
          </div>
        )}
      </div>

      {/* Daily Budget Setup Card */}
      <div className="bg-purple-600 rounded-2xl shadow-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <FaCalendarDay className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Budget</h2>
              <p className="text-sm text-white/80">
                Today: {now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          {!isEditingDaily && (
            <button
              onClick={() => setIsEditingDaily(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaEdit /> Edit Daily Budget
            </button>
          )}
        </div>

        {isEditingDaily ? (
          <div className="space-y-3">
            <input
              type="number"
              value={dailyBudgetAmount}
              onChange={(e) => setDailyBudgetAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 text-xl font-bold"
              placeholder="Enter daily budget"
              step="0.01"
              min="0"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveDailyBudget}
                className="flex-1 px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <FaCheck /> Save
              </button>
              <button
                onClick={handleCancelDailyEdit}
                className="flex-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-4xl font-bold mb-2">
              {formatCurrency(dailyBudget, settings.currency)}
            </div>
            <div className="text-sm text-white/80">
              Today's spending: {formatCurrency(todaySpending, settings.currency)} ({dailyPercentageUsed.toFixed(1)}%)
            </div>
          </div>
        )}
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Spent */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(spent, settings.currency)}
          </div>
          <div className="text-xs text-gray-400 mt-1">{percentageUsed.toFixed(1)}% of budget</div>
        </div>

        {/* Remaining */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            {remaining >= 0 ? 'Remaining' : 'Extra Amount'}
          </div>
          <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(Math.abs(remaining), settings.currency)}
          </div>
          <div className="text-xs text-gray-400 mt-1">{remaining >= 0 ? 'Left to spend' : 'Over budget'}</div>
        </div>

        {/* Daily Allowance card removed per request (daily allowance shown in BudgetCountdown) */}

        {/* Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
          <div className={`flex items-center gap-2 text-2xl font-bold text-${status.color}-600 dark:text-${status.color}-400`}>
            <status.icon />
            <span className="text-base">{status.text}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{currentMonthData.transactionCount} transactions</div>
        </div>
      </div>

      {/* Progress Bar */}
      {budget > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Budget Progress</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {percentageUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-6 overflow-hidden">
            <div 
              className={`h-6 transition-all duration-500 ${
                percentageUsed < 75 ? 'bg-gradient-to-r from-emerald-500 to-green-600' :
                percentageUsed < 90 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                percentageUsed < 100 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                'bg-gradient-to-r from-red-600 to-red-700'
              }`}
              style={{ width: `${Math.min(100, percentageUsed)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
            <span>{formatCurrency(0, settings.currency)}</span>
            <span>{formatCurrency(budget, settings.currency)}</span>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      {Object.keys(currentMonthData.categoryBreakdown).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {Object.entries(currentMonthData.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = budget > 0 ? (amount / budget) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{category}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(amount, settings.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${Math.min(100, percentage)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{percentage.toFixed(1)}% of budget</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* No Budget Message */}
      {budget === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-center">
          <FaExclamationTriangle className="text-4xl text-yellow-600 dark:text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Budget Set</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Set a monthly budget to start tracking your spending and get insights
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Set Your Budget
          </button>
        </div>
      )}
    </div>
  );
};

export default Budget;
