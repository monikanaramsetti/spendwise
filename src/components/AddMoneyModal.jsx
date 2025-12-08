import { useState } from 'react';
import { FaTimes, FaCoins, FaRupeeSign } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddMoneyModal = ({ goal, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const remaining = goal.targetAmount - goal.savedAmount;

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = parseFloat(amount);
    
    // Validation: Amount must be positive
    if (!value || value <= 0) {
      toast.error('Please enter a valid amount greater than zero');
      return;
    }

    // Validation: Cannot exceed target amount
    if (goal.savedAmount + value > goal.targetAmount) {
      toast.error(`Adding ₹${value.toLocaleString('en-IN')} would exceed your target amount. Maximum you can add is ₹${remaining.toLocaleString('en-IN')}`);
      return;
    }

    onSubmit(value);
    onClose();
  };

  const handleQuickAdd = (value) => {
    setAmount(value.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCoins className="text-3xl text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Add Money</h2>
                <p className="text-blue-100 text-sm">{goal.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Goal Progress Info */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Current Savings:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(goal.savedAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Target Amount:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(goal.targetAmount)}</span>
            </div>
            <div className="h-px bg-slate-200 my-2"></div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 font-medium">Remaining:</span>
              <span className="font-bold text-blue-600 text-lg">{formatCurrency(remaining)}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-2">
                Amount to Add <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaRupeeSign className="text-slate-400 text-xl" />
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-11 pr-4 py-4 bg-white border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 text-2xl font-semibold placeholder:text-slate-400"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Quick Add Buttons */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Quick Add:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickAdd(value)}
                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition-colors"
                  >
                    ₹{value}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Full Remaining Amount */}
            {remaining > 0 && (
              <button
                type="button"
                onClick={() => handleQuickAdd(remaining.toFixed(2))}
                className="w-full px-4 py-3 bg-green-50 border-2 border-green-500 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition-colors"
              >
                Add Remaining {formatCurrency(remaining)}
              </button>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaCoins /> Add Money
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
