import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { transactionService } from '../services/api';
import { formatCurrency, calculateCategoryTotals, getCurrentMonth, getMonthlyTransactions, generateMonthsList } from '../utils/helpers';
import { FaPiggyBank } from 'react-icons/fa';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [viewType, setViewType] = useState('category'); // 'category' or 'trend'

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      
      const [transactionsData, budgetsData, goalsData] = await Promise.all([
        transactionService.getAll(),
        fetch('http://localhost:3001/budgets').then(res => res.json()),
        fetch('http://localhost:3001/savingsGoals').then(res => res.json())
      ]);
      
      const userTransactions = transactionsData.filter(t => t.userId === parseInt(userId));
      const userBudgets = budgetsData.filter(b => b.userId === parseInt(userId) && b.month === selectedMonth);
      const userGoals = goalsData.filter(g => g.userId === parseInt(userId));
      
      setTransactions(userTransactions);
      setBudgets(userBudgets);
      setSavingsGoals(userGoals);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get monthly transactions
  const monthlyTransactions = getMonthlyTransactions(transactions, selectedMonth);
  const expenses = monthlyTransactions.filter((t) => t.type === 'expense');
  const income = monthlyTransactions.filter((t) => t.type === 'income');

  // Calculate category totals
  const expenseCategoryTotals = calculateCategoryTotals(expenses);
  const incomeCategoryTotals = calculateCategoryTotals(income);

  // Prepare data for pie chart
  const COLORS = ['#7C3AED', '#8B5CF6', '#C4B5FD', '#A78BFA', '#10B981', '#EF4444', '#F59E0B', '#14B8A6'];
  
  const expensePieData = expenseCategoryTotals.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  const incomePieData = incomeCategoryTotals.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  // Prepare data for bar chart
  const barChartData = expenseCategoryTotals.map((item) => ({
    category: item.category,
    amount: item.total,
  }));

  // Prepare data for trend analysis (last 6 months)
  const months = generateMonthsList(6);
  const trendData = months.map((month) => {
    const monthTransactions = getMonthlyTransactions(transactions, month.value);
    const totalIncome = monthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpense = monthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return {
      month: month.label.split(' ')[0], // Get month name only
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-stone-200 relative overflow-hidden">
      {/* Background Financial Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {/* Coins */}
        <svg className="absolute top-20 right-32 w-12 h-12 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 6v12M8 10h8M8 14h8"/>
        </svg>
        <svg className="absolute bottom-40 left-24 w-16 h-16 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 6v12M8 10h8M8 14h8"/>
        </svg>
        <svg className="absolute top-1/3 right-16 w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M12 6v12M8 10h8M8 14h8"/>
        </svg>
        
        {/* Charts */}
        <svg className="absolute top-32 left-1/4 w-14 h-14 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <svg className="absolute bottom-24 right-1/4 w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <svg className="absolute top-2/3 left-20 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        
        {/* Piggy Banks */}
        <svg className="absolute top-1/4 right-48 w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg className="absolute bottom-1/3 left-40 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {/* Wallets */}
        <svg className="absolute top-48 left-16 w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <svg className="absolute bottom-32 right-40 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        
        {/* Trending Arrows */}
        <svg className="absolute top-1/2 left-1/3 w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <svg className="absolute bottom-1/2 right-1/3 w-14 h-14 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
        
        {/* Calculator */}
        <svg className="absolute top-56 right-20 w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <svg className="absolute bottom-48 left-1/2 w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        
        {/* Credit Cards */}
        <svg className="absolute top-20 left-48 w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        <svg className="absolute bottom-20 right-56 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        
        {/* Money Bills */}
        <svg className="absolute top-3/4 right-1/4 w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <svg className="absolute bottom-16 left-1/4 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        {/* Percentage/Discount */}
        <svg className="absolute top-40 right-1/3 w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <svg className="absolute bottom-1/4 right-20 w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        {/* Target/Goal */}
        <svg className="absolute top-1/3 left-1/4 w-14 h-14 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg className="absolute bottom-2/3 right-48 w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        {/* Shopping Bag */}
        <svg className="absolute top-2/3 right-32 w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <svg className="absolute bottom-40 left-1/3 w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-text mb-2">📊 Reports & Analytics</h1>
        <p className="text-gray-600">Visualize your financial data</p>
      </div>

      {/* Controls */}
      <div className="card relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Select Month</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="label">View Type</label>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              className="input"
            >
              <option value="category">Category Analysis</option>
              <option value="trend">Trend Analysis</option>
            </select>
          </div>
        </div>
      </div>

      {viewType === 'category' ? (
        <>
          {/* Category Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
            {/* Expense Breakdown */}
            <div className="card">
              <h2 className="text-2xl font-bold text-text mb-6">💸 Expense Breakdown</h2>
              {expensePieData.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No expense data available</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Category List */}
                  <div className="mt-6 space-y-2">
                    {expenseCategoryTotals.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <span className="text-sm font-bold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Income Breakdown */}
            <div className="card">
              <h2 className="text-2xl font-bold text-text mb-6">💰 Income Breakdown</h2>
              {incomePieData.length === 0 ? (
                <p className="text-gray-500 text-center py-12">No income data available</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={incomePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={100}
                        fill="#82ca9d"
                        dataKey="value"
                      >
                        {incomePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Category List */}
                  <div className="mt-6 space-y-2">
                    {incomeCategoryTotals.map((item, index) => (
                      <div key={item.category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span className="text-sm font-medium">{item.category}</span>
                        </div>
                        <span className="text-sm font-bold">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="card relative z-10">
            <h2 className="text-2xl font-bold text-text mb-6">📈 Expense by Category</h2>
            {barChartData.length === 0 ? (
              <p className="text-gray-500 text-center py-12">No expense data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="amount" fill="#7C3AED" name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Trend Analysis */}
          <div className="card relative z-10">
            <h2 className="text-2xl font-bold text-text mb-6">📉 6-Month Trend</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} name="Expense" />
                <Line type="monotone" dataKey="balance" stroke="#7C3AED" strokeWidth={2} name="Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Comparison */}
          <div className="card relative z-10">
            <h2 className="text-2xl font-bold text-text mb-6">📊 Monthly Comparison</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Income" />
                <Bar dataKey="expense" fill="#EF4444" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Budget vs Actual Comparison */}
      {budgets.length > 0 && (
        <div className="card relative z-10">
          <h2 className="text-2xl font-bold text-text mb-6">💰 Budget vs Actual Spending</h2>
          <div className="space-y-4">
            {budgets.map((budget) => {
              const monthlyExpenses = getMonthlyTransactions(transactions, selectedMonth).filter(
                t => t.type === 'expense' && t.category === budget.category
              );
              const actualSpent = monthlyExpenses.reduce((sum, t) => sum + parseFloat(t.amount), 0);
              const percentage = budget.amount > 0 ? (actualSpent / budget.amount) * 100 : 0;
              
              return (
                <div key={budget.id} className="border-b border-slate-200 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-slate-700">{budget.category}</span>
                    <div className="text-right">
                      <span className={`font-bold ${percentage > 100 ? 'text-red-600' : percentage > 80 ? 'text-orange-600' : 'text-green-600'}`}>
                        {formatCurrency(actualSpent)}
                      </span>
                      <span className="text-slate-500"> / {formatCurrency(budget.amount)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        percentage > 100 ? 'bg-red-600' : percentage > 80 ? 'bg-orange-500' : 'bg-green-600'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">
                    {percentage.toFixed(1)}% used • {formatCurrency(Math.max(0, budget.amount - actualSpent))} remaining
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Savings Goals Progress */}
      {savingsGoals.length > 0 && (
        <div className="card relative z-10">
          <h2 className="text-2xl font-bold text-text mb-6">🎯 Savings Goals Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsGoals.map((goal) => {
              const progress = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
              const remaining = goal.targetAmount - goal.savedAmount;
              
              return (
                <div key={goal.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FaPiggyBank className="text-blue-600 text-xl" />
                      <h3 className="font-bold text-slate-800">{goal.title}</h3>
                    </div>
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      progress >= 100 ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Saved:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(goal.savedAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Target:</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3 mt-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      {remaining > 0 ? `${formatCurrency(remaining)} to go` : 'Goal achieved! 🎉'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
