import { useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../components/SummaryCard';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import SummaryCard from '../components/SummaryCard';
import { FaChartPie, FaChartBar } from 'react-icons/fa';
import ExpenseCalendar from '../components/ExpenseCalendar';
import MonthlySuperlatives from '../components/MonthlySuperlatives';
import BackButton from '../components/BackButton';

const Analytics = () => {
  const { transactions, totals, settings } = useTransactions();

  // Category-wise spending
  const categoryData = useMemo(() => {
    const categoryMap = {};
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryMap[t.category] = (categoryMap[t.category] || 0) + parseFloat(t.amount || 0);
      }
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // Monthly data
  const monthlyData = useMemo(() => {
    const monthMap = {};
    
    transactions.forEach(t => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (!monthMap[month]) {
        monthMap[month] = { month, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        monthMap[month].income += parseFloat(t.amount || 0);
      } else {
        monthMap[month].expense += parseFloat(t.amount || 0);
      }
    });

    return Object.values(monthMap).sort((a, b) => 
      new Date(a.month) - new Date(b.month)
    );
  }, [transactions]);

  // Highest spending category
  const highestCategory = categoryData[0] || { name: 'N/A', value: 0 };

  // Current month total
  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const thisMonthData = monthlyData.find(d => d.month === currentMonth);
  const thisMonthTotal = thisMonthData 
    ? thisMonthData.expense 
    : transactions
        .filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === new Date().getMonth() && 
                 tDate.getFullYear() === new Date().getFullYear() &&
                 t.type === 'expense';
        })
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#6366f1', '#14b8a6', '#f97316'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visual insights into your spending patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total This Month"
          amount={thisMonthTotal}
          type="expense"
        />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
                Highest Spending Category
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {highestCategory.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {formatCurrency(highestCategory.value, settings.currency)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-4 rounded-xl shadow-lg">
              <FaChartPie className="text-white text-2xl" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
                Total Categories
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                {categoryData.length}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Active spending categories
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg">
              <FaChartBar className="text-white text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* New Unique Features */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="max-w-3xl mx-auto w-full">
          <ExpenseCalendar />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <MonthlySuperlatives />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(value, settings.currency)}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No expense data available
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Overview
          </h2>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => formatCurrency(value, settings.currency)}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500 dark:text-gray-400">
              No transaction data available
            </div>
          )}
        </div>
      </div>

      {/* Category-wise List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Category-wise Spending
        </h2>
        {categoryData.length > 0 ? (
          <div className="space-y-3">
            {categoryData.map((category, index) => {
              const percentage = (category.value / totals.expense) * 100 || 0;
              return (
                <div key={category.name} className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(category.value, settings.currency)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% of total expenses</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No expense data available
          </p>
        )}
      </div>
    </div>
  );
};

export default Analytics;

