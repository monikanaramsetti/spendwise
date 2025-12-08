// Format currency to Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get current month in YYYY-MM format
export const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Get month name from YYYY-MM format
export const getMonthName = (monthStr) => {
  const [year, month] = monthStr.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

// Calculate total by type
export const calculateTotal = (transactions, type) => {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
};

// Get transactions for current month
export const getMonthlyTransactions = (transactions, month) => {
  return transactions.filter((t) => t.date.startsWith(month));
};

// Group transactions by category
export const groupByCategory = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const category = transaction.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(transaction);
    return acc;
  }, {});
};

// Calculate category totals
export const calculateCategoryTotals = (transactions) => {
  const grouped = groupByCategory(transactions);
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    total: items.reduce((sum, item) => sum + parseFloat(item.amount), 0),
    count: items.length,
  }));
};

// Generate months array for dropdown
export const generateMonthsList = (count = 12) => {
  const months = [];
  const now = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months.push({
      value: monthStr,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  
  return months;
};

// Validate transaction form
export const validateTransaction = (transaction) => {
  const errors = {};

  if (!transaction.type) {
    errors.type = 'Transaction type is required';
  }

  if (!transaction.amount || parseFloat(transaction.amount) <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!transaction.category) {
    errors.category = 'Category is required';
  }

  if (!transaction.date) {
    errors.date = 'Date is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Calculate budget progress
export const calculateBudgetProgress = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  return Math.min(percentage, 100);
};

// Get budget status
export const getBudgetStatus = (spent, budget) => {
  const percentage = (spent / budget) * 100;
  
  if (percentage >= 100) return 'exceeded';
  if (percentage >= 80) return 'warning';
  return 'good';
};

// Filter transactions by search term
export const filterTransactions = (transactions, searchTerm) => {
  const term = searchTerm.toLowerCase();
  return transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term) ||
      t.amount.toString().includes(term)
  );
};

// Sort transactions
export const sortTransactions = (transactions, sortBy, sortOrder = 'desc') => {
  const sorted = [...transactions].sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'date':
        aVal = new Date(a.date);
        bVal = new Date(b.date);
        break;
      case 'amount':
        aVal = parseFloat(a.amount);
        bVal = parseFloat(b.amount);
        break;
      case 'category':
        aVal = a.category.toLowerCase();
        bVal = b.category.toLowerCase();
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return sorted;
};
