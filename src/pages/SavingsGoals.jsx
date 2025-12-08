import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaPiggyBank, FaCalendar, FaCoins } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SavingsGoalModal from '../components/SavingsGoalModal';
import AddMoneyModal from '../components/AddMoneyModal';
import ConfirmDialog from '../components/ConfirmDialog';

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, goalId: null });

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (!loading && goals.length > 0) {
      checkGoalProgressAlerts();
    }
  }, [goals, loading]);

  const checkGoalProgressAlerts = () => {
    goals.forEach((goal) => {
      const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
      
      if (progress >= 100 && !sessionStorage.getItem(`goalComplete_${goal.id}`)) {
        toast.success(`🎉 Congratulations! You've achieved your "${goal.title}" goal!`, {
          autoClose: 6000,
        });
        sessionStorage.setItem(`goalComplete_${goal.id}`, 'true');
      } else if (progress >= 75 && progress < 100 && !sessionStorage.getItem(`goal75_${goal.id}`)) {
        toast.info(`💪 Great progress! You're 75% towards "${goal.title}"! Keep going!`, {
          autoClose: 5000,
        });
        sessionStorage.setItem(`goal75_${goal.id}`, 'true');
      }
    });
  };

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:3001/savingsGoals');
      const data = await response.json();
      const userGoals = data.filter(goal => goal.userId === parseInt(userId));
      setGoals(userGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (goalData) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:3001/savingsGoals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...goalData,
          userId: parseInt(userId),
          savedAmount: 0,
          createdAt: new Date().toISOString(),
        }),
      });
      const newGoal = await response.json();
      setGoals([...goals, newGoal]);
      toast.success('Savings goal created successfully! 🎯');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleUpdateGoal = async (goalData) => {
    try {
      const response = await fetch(`http://localhost:3001/savingsGoals/${editingGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingGoal,
          ...goalData,
        }),
      });
      const updatedGoal = await response.json();
      setGoals(goals.map((g) => (g.id === editingGoal.id ? updatedGoal : g)));
      toast.success('Goal updated successfully!');
      setEditingGoal(null);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = (id) => {
    setConfirmDialog({ isOpen: true, goalId: id });
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3001/savingsGoals/${confirmDialog.goalId}`, {
        method: 'DELETE',
      });
      setGoals(goals.filter((g) => g.id !== confirmDialog.goalId));
      toast.success('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleAddMoney = async (amount) => {
    try {
      const userId = localStorage.getItem('userId');
      
      // Update the savings goal
      const updatedGoal = {
        ...selectedGoal,
        savedAmount: selectedGoal.savedAmount + parseFloat(amount),
      };

      const response = await fetch(`http://localhost:3001/savingsGoals/${selectedGoal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      });

      const updated = await response.json();
      
      // Create an expense transaction for this savings contribution
      const transactionData = {
        userId: parseInt(userId),
        type: 'expense',
        category: 'Savings',
        amount: parseFloat(amount),
        description: `Contribution to ${selectedGoal.title}`,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };
      
      await fetch('http://localhost:3001/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      
      setGoals(goals.map((g) => (g.id === selectedGoal.id ? updated : g)));
      toast.success(`Added ₹${amount} to ${selectedGoal.title}! 💰`);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error adding money:', error);
      toast.error('Failed to add money');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleModalClose = () => {
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleModalSubmit = (data) => {
    if (editingGoal) {
      handleUpdateGoal(data);
    } else {
      handleAddGoal(data);
    }
  };

  const handleOpenAddMoney = (goal) => {
    setSelectedGoal(goal);
    setIsAddMoneyModalOpen(true);
  };

  const calculateProgress = (saved, target) => {
    return Math.min((saved / target) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen bg-stone-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FaPiggyBank className="text-5xl" />
              Savings Goals
            </h1>
            <p className="text-blue-100 text-lg">
              Track your financial goals and watch your savings grow
            </p>
          </div>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <FaPlus /> New Goal
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
          <FaPiggyBank className="text-6xl text-slate-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No Savings Goals Yet</h3>
          <p className="text-slate-500 mb-6">
            Start your savings journey by creating your first goal!
          </p>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center gap-2"
          >
            <FaPlus /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.savedAmount, goal.targetAmount);
            const remaining = goal.targetAmount - goal.savedAmount;
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isCompleted = progress >= 100;

            return (
              <div
                key={goal.id}
                className={`bg-white rounded-2xl shadow-lg border-2 hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                  isCompleted ? 'border-green-500' : 'border-slate-200'
                }`}
              >
                {/* Card Header */}
                <div className={`p-6 ${isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-purple-600'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white flex-1 pr-2">
                      {goal.title}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <FaEdit className="text-white" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Amount Display */}
                  <div className="text-white/90 text-sm mb-2">
                    <span className="text-3xl font-bold">{formatCurrency(goal.savedAmount)}</span>
                    <span className="text-white/70"> of {formatCurrency(goal.targetAmount)}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                    <div
                      className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-white font-semibold text-sm">
                    {progress.toFixed(1)}% Complete
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Remaining Amount */}
                  {!isCompleted && (
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl p-4">
                      <span className="text-slate-600 font-medium">Remaining:</span>
                      <span className="text-xl font-bold text-slate-900">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  )}

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-xl p-4 text-center">
                      <span className="text-2xl">🎉</span>
                      <p className="text-green-700 font-bold text-lg">Goal Achieved!</p>
                    </div>
                  )}

                  {/* Deadline */}
                  {goal.deadline && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-slate-600">
                        <FaCalendar className="text-slate-400" />
                        <span>Deadline:</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">
                          {formatDate(goal.deadline)}
                        </div>
                        {daysRemaining !== null && !isCompleted && (
                          <div
                            className={`text-xs font-medium ${
                              daysRemaining < 0
                                ? 'text-red-600'
                                : daysRemaining < 30
                                ? 'text-orange-600'
                                : 'text-slate-600'
                            }`}
                          >
                            {daysRemaining < 0
                              ? `${Math.abs(daysRemaining)} days overdue`
                              : `${daysRemaining} days left`}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Add Money Button */}
                  {!isCompleted && (
                    <button
                      onClick={() => handleOpenAddMoney(goal)}
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <FaCoins /> Add Money
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {isGoalModalOpen && (
        <SavingsGoalModal
          goal={editingGoal}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}

      {isAddMoneyModalOpen && selectedGoal && (
        <AddMoneyModal
          goal={selectedGoal}
          onClose={() => {
            setIsAddMoneyModalOpen(false);
            setSelectedGoal(null);
          }}
          onSubmit={handleAddMoney}
        />
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, goalId: null })}
        onConfirm={confirmDelete}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default SavingsGoals;
