import { FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { formatCurrency, formatDate } from '../utils/helpers';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="card-modern card-hover animate-slide-in border-l-4 transition-all duration-200 hover:shadow-xl" style={{ borderLeftColor: isIncome ? '#10B981' : '#EF4444' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Income/Expense Icon with Arrow */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100' : 'bg-red-100'}`}>
            {isIncome ? (
              <FaArrowUp className="text-green-600 text-xl" />
            ) : (
              <FaArrowDown className="text-red-600 text-xl" />
            )}
          </div>
          
          {/* Transaction Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{getCategoryIcon(transaction.category)}</span>
              <h3 className="font-semibold text-text text-lg">{transaction.description}</h3>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <p>{transaction.category}</p>
              <span>•</span>
              <p>{formatDate(transaction.date)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Amount */}
          <div className="text-right">
            <p className={`text-2xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {transaction.type}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Edit transaction"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete transaction"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get category icon
const getCategoryIcon = (category) => {
  const icons = {
    'Food & Dining': '🍔',
    Transportation: '🚗',
    Shopping: '🛍️',
    Entertainment: '🎬',
    'Bills & Utilities': '💡',
    Healthcare: '⚕️',
    Education: '📚',
    'Other Expenses': '📌',
    Salary: '💼',
    Business: '💰',
    Investments: '📈',
    'Other Income': '💵',
  };
  return icons[category] || '📌';
};

export default TransactionCard;
