import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction Services
export const transactionService = {
  // Get all transactions
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },

  // Get transaction by ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Create new transaction
  create: async (transaction) => {
    const response = await api.post('/transactions', {
      ...transaction,
      createdAt: new Date().toISOString(),
    });
    return response.data;
  },

  // Update transaction
  update: async (id, transaction) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },

  // Delete transaction
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Get transactions by type (income/expense)
  getByType: async (type) => {
    const response = await api.get(`/transactions?type=${type}`);
    return response.data;
  },

  // Get transactions by date range
  getByDateRange: async (startDate, endDate) => {
    const response = await api.get(
      `/transactions?date_gte=${startDate}&date_lte=${endDate}`
    );
    return response.data;
  },
};

// (Categories API removed) — categories are managed in-memory or via transactions

// Budget Services
export const budgetService = {
  // Get all budgets
  getAll: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },

  // Get budget by ID
  getById: async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  // Get budgets by month
  getByMonth: async (month) => {
    const response = await api.get(`/budgets?month=${month}`);
    return response.data;
  },

  // Create new budget
  create: async (budget) => {
    const response = await api.post('/budgets', budget);
    return response.data;
  },

  // Update budget
  update: async (id, budget) => {
    const response = await api.put(`/budgets/${id}`, budget);
    return response.data;
  },

  // Delete budget
  delete: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};

export default api;
