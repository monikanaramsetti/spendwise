import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import SummaryCard from '../components/SummaryCard';
import TransactionForm from '../components/TransactionForm';
import Modal from '../components/Modal';
import { FaArrowUp, FaArrowDown, FaWallet, FaPlus } from 'react-icons/fa';
import { formatCurrency } from '../components/SummaryCard';
import { Link } from 'react-router-dom';
import BillRemainder from '../components/BillRadar';
import SavingTargets from '../components/GoalBoost';

const Dashboard = () => {
  const { transactions, totals, addTransaction, settings } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  const handleAddTransaction = (formData) => {
    return addTransaction(formData);
  };

  const { userName } = useTransactions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          {/* Welcome header with user's name from context */}
          <h1 className="text-3xl font-bold font-montserrat text-gradient mb-2">{`Welcome, ${userName || 'User'}`}</h1>
          <p className="text-gray-600 dark:text-gray-400">Here's your financial snapshot for today</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
        >
          <FaPlus /> Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Balance"
          amount={totals.balance}
          type="balance"
          icon={FaWallet}
        />
        <SummaryCard
          title="Total Income"
          amount={totals.income}
          type="income"
          icon={FaArrowUp}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totals.expense}
          type="expense"
          icon={FaArrowDown}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Feature widgets grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <BillRemainder />
          <SavingTargets />
        </div>
        {/* Recent Transactions */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Transactions
              </h2>
              <Link
                to="/transactions"
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                View All →
              </Link>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <FaWallet className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">No transactions yet</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Your First Transaction
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                      transaction.type === 'income'
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {transaction.category}
                        </span>
                      </div>
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.notes}</p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          transaction.type === 'income'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount), settings.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      </div>

      {/* Modal for Quick Add */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Transaction"
        size="md"
      >
        <TransactionForm
          onSubmit={handleAddTransaction}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
