import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaTrophy, FaCrown, FaStar, FaFire, FaAward, FaGem } from 'react-icons/fa';
import { formatCurrency } from './SummaryCard';

const MonthlySuperlatives = () => {
  const { transactions, settings } = useTransactions();

  const superlatives = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Filter transactions for current month
    const monthTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const expenses = monthTransactions.filter(t => t.type === 'expense');
    const incomes = monthTransactions.filter(t => t.type === 'income');

    // Calculate superlatives
    const results = [];

    // Biggest Single Purchase
    if (expenses.length > 0) {
      const biggest = expenses.reduce((max, t) => 
        parseFloat(t.amount) > parseFloat(max.amount) ? t : max
      );
      results.push({
        icon: FaCrown,
        title: 'Biggest Single Purchase',
        value: formatCurrency(parseFloat(biggest.amount), settings.currency),
        subtitle: biggest.category || 'Uncategorized',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
        textColor: 'text-yellow-700 dark:text-yellow-300'
      });
    }

    // Most Active Category
    if (expenses.length > 0) {
      const categoryCount = {};
      expenses.forEach(t => {
        const cat = t.category || 'Uncategorized';
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const mostActive = Object.entries(categoryCount).reduce((max, [cat, count]) => 
        count > max.count ? { category: cat, count } : max
      , { category: '', count: 0 });

      results.push({
        icon: FaFire,
        title: 'Most Active Category',
        value: mostActive.category,
        subtitle: `${mostActive.count} transaction${mostActive.count !== 1 ? 's' : ''}`,
        color: 'from-red-500 to-pink-500',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        textColor: 'text-red-700 dark:text-red-300'
      });
    }

    // Highest Spending Day
    if (expenses.length > 0) {
      const dailySpending = {};
      expenses.forEach(t => {
        const date = t.date;
        dailySpending[date] = (dailySpending[date] || 0) + parseFloat(t.amount);
      });
      const highestDay = Object.entries(dailySpending).reduce((max, [date, amount]) => 
        amount > max.amount ? { date, amount } : max
      , { date: '', amount: 0 });

      results.push({
        icon: FaStar,
        title: 'Highest Spending Day',
        value: new Date(highestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        subtitle: formatCurrency(highestDay.amount, settings.currency),
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-700 dark:text-purple-300'
      });
    }

    // Best Savings Week (if any income)
    if (monthTransactions.length > 0) {
      const weeklyBalance = {};
      monthTransactions.forEach(t => {
        const date = new Date(t.date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyBalance[weekKey]) weeklyBalance[weekKey] = 0;
        weeklyBalance[weekKey] += t.type === 'income' 
          ? parseFloat(t.amount) 
          : -parseFloat(t.amount);
      });

      const bestWeek = Object.entries(weeklyBalance).reduce((max, [week, balance]) => 
        balance > max.balance ? { week, balance } : max
      , { week: '', balance: -Infinity });

      if (bestWeek.balance > 0) {
        results.push({
          icon: FaAward,
          title: 'Best Savings Week',
          value: formatCurrency(bestWeek.balance, settings.currency),
          subtitle: `Week of ${new Date(bestWeek.week).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          color: 'from-green-500 to-emerald-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          textColor: 'text-green-700 dark:text-green-300'
        });
      }
    }

    // Total Transactions
    results.push({
      icon: FaGem,
      title: 'Total Transactions',
      value: monthTransactions.length.toString(),
      subtitle: `${expenses.length} expenses, ${incomes.length} income`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300'
    });

    // Average Daily Spending
    if (expenses.length > 0) {
      const totalExpense = expenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      const daysWithExpenses = new Set(expenses.map(t => t.date)).size;
      const avgDaily = totalExpense / Math.max(daysWithExpenses, 1);

      results.push({
        icon: FaTrophy,
        title: 'Average Daily Spending',
        value: formatCurrency(avgDaily, settings.currency),
        subtitle: `Over ${daysWithExpenses} active day${daysWithExpenses !== 1 ? 's' : ''}`,
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        textColor: 'text-indigo-700 dark:text-indigo-300'
      });
    }

    return results;
  }, [transactions, settings.currency]);

  const monthName = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-3 rounded-xl shadow-lg">
          <FaTrophy className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Superlatives</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{monthName} highlights</p>
        </div>
      </div>

      {superlatives.length === 0 ? (
        <div className="text-center py-12">
          <FaTrophy className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            No transactions this month yet. Start tracking to see your highlights!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {superlatives.map((award, index) => {
            const IconComponent = award.icon;
            return (
              <div
                key={index}
                className={`${award.bgColor} rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-start gap-3">
                  <div className={`bg-gradient-to-br ${award.color} p-3 rounded-lg shadow-md flex-shrink-0`}>
                    <IconComponent className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                      {award.title}
                    </h3>
                    <p className={`text-lg font-bold ${award.textColor} truncate`}>
                      {award.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 truncate">
                      {award.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fun footer message */}
      {superlatives.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            🎉 Keep up the great tracking! Your financial journey is looking awesome!
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlySuperlatives;
