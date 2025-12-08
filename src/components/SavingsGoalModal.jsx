import { useState, useEffect } from 'react';
import { FaTimes, FaPiggyBank, FaRupeeSign, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SavingsGoalModal = ({ goal, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline || '',
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation: Title cannot be empty
    if (!formData.title || !formData.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    // Validation: Target amount must be positive
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      toast.error('Target amount must be greater than zero');
      return;
    }

    // Validation: Deadline cannot be in the past (if provided)
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        toast.error('Deadline cannot be in the past');
        return;
      }
    }

    onSubmit({
      title: formData.title.trim(),
      targetAmount: parseFloat(formData.targetAmount),
      deadline: formData.deadline || null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaPiggyBank className="text-3xl text-white" />
              <h2 className="text-2xl font-bold text-white">
                {goal ? 'Edit Goal' : 'New Savings Goal'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
              Goal Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaPiggyBank className="text-slate-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Emergency Fund, Vacation, New Car"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Target Amount */}
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-semibold text-slate-700 mb-2">
              Target Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaRupeeSign className="text-slate-400" />
              </div>
              <input
                type="number"
                id="targetAmount"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Deadline (Optional) */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-semibold text-slate-700 mb-2">
              Deadline (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaCalendar className="text-slate-400" />
              </div>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          {/* Buttons */}
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
            >
              {goal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SavingsGoalModal;
