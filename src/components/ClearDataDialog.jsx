import { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ClearDataDialog = ({ isOpen, onClose, onConfirm }) => {
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const handleFirstConfirm = () => {
    setStep(2);
  };

  const handleFinalConfirm = () => {
    if (confirmText === 'DELETE ALL') {
      onConfirm();
      onClose();
      setStep(1);
      setConfirmText('');
    }
  };

  const handleClose = () => {
    onClose();
    setStep(1);
    setConfirmText('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FaExclamationTriangle className="text-lg text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">⚠️ Clear All Data</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        {step === 1 ? (
          <div className="p-6">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              This will permanently delete <strong>ALL</strong> your data including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>All Transactions</li>
              <li>All Budgets</li>
              <li>All Savings Goals</li>
              <li>All Categories</li>
            </ul>
            <p className="text-red-600 font-semibold">This action cannot be undone!</p>
          </div>
        ) : (
          <div className="p-6">
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              Type <strong className="text-red-600">DELETE ALL</strong> (case-sensitive) to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE ALL"
              className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-gray-900"
              autoFocus
            />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          {step === 1 ? (
            <button
              onClick={handleFirstConfirm}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium text-white"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleFinalConfirm}
              disabled={confirmText !== 'DELETE ALL'}
              className={`px-5 py-2.5 rounded-lg transition-colors font-medium text-white ${
                confirmText === 'DELETE ALL'
                  ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Delete Everything
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClearDataDialog;
