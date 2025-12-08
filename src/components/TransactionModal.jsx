import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TransactionModal = ({ isOpen, onClose, onSubmit, transaction, categories }) => {
  const [formData, setFormData] = useState(
    transaction || {
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Empty description
    if (!formData.description || !formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    // Validation: Amount must be positive
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }

    // Validation: No negative amounts
    if (parseFloat(formData.amount) < 0) {
      toast.error('Amount cannot be negative');
      return;
    }

    // Validation: Category required
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    // Validation: Date cannot be in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
    
    if (selectedDate > today) {
      toast.error('Transaction date cannot be in the future');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((cat) => cat.type === formData.type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600">
          <h2 className="text-2xl font-bold text-white">
            {transaction ? '✏️ Edit Transaction' : '➕ Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Transaction Type */}
          <div>
            <label className="label">Transaction Type</label>
            <div className="flex gap-4">
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="income"
                  checked={formData.type === 'income'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`cursor-pointer p-3 rounded-lg text-center font-medium transition-all ${
                    formData.type === 'income'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Income
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="expense"
                  checked={formData.type === 'expense'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`cursor-pointer p-3 rounded-lg text-center font-medium transition-all ${
                    formData.type === 'expense'
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Expense
                </div>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="label">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              placeholder="Enter amount"
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Amount must be greater than zero</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="input"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="input"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Date cannot be in the future</p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1">
              {transaction ? 'Update' : 'Add'} Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
