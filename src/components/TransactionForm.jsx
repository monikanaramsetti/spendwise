import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { formatCurrency } from './SummaryCard';
import { useTransactions } from '../context/TransactionContext';

const TransactionForm = ({ transaction = null, onClose, onSubmit }) => {
  const { settings } = useTransactions();
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || '',
        type: transaction.type || 'expense',
        category: transaction.category || '',
        date: transaction.date || new Date().toISOString().split('T')[0],
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const categories = {
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Other',
    ],
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Investments',
      'Gift',
      'Other',
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    const result = onSubmit(formData);
    // if the parent returned null/false it means it rejected the transaction (e.g., low balance)
    if (result === null || result === false) {
      // do not close modal — allow user to correct the amount
      return;
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Type Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'expense', category: '' }))}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            formData.type === 'expense'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <FaArrowDown /> Expense
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: '' }))}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
            formData.type === 'income'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <FaArrowUp /> Income
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Amount ({settings.currency})
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Select category</option>
          {categories[formData.type].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          placeholder="Add a note..."
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex-1 px-4 py-2 rounded-lg font-semibold text-white transition-colors ${
            formData.type === 'income'
              ? 'bg-emerald-500 hover:bg-emerald-600'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          {transaction ? 'Update' : 'Add'} Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

