import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              type === 'danger' ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <FaExclamationTriangle className={`text-lg ${
                type === 'danger' ? 'text-red-600' : 'text-orange-600'
              }`} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed">{message}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2.5 rounded-lg transition-colors font-medium text-white ${
              type === 'danger' 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-orange-600 hover:bg-orange-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
