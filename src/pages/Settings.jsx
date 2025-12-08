import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaSun, FaMoon, FaTrash, FaExclamationTriangle, FaUser, FaSave, FaHistory } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import BackButton from '../components/BackButton';

const Settings = () => {
  const { settings, updateSettings, clearAllTransactions, updateUserProfile, profileSaveLogs, clearProfileSaveLogs } = useTransactions();
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  // Profile fields (local client-only profile stored in localStorage)
  const [fullName, setFullName] = useState(localStorage.getItem('userName') || '');
  const [emailAddress] = useState(localStorage.getItem('userEmail') || '');
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | saved | saved-local | error
  const [saveError, setSaveError] = useState('');

  const currencies = [
    { code: 'USD', symbol: '', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CAD', symbol: '', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: '', name: 'Australian Dollar' },
  ];

  const handleClearData = () => {
    clearAllTransactions();
    setIsClearModalOpen(false);
    alert('All data has been cleared successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your app preferences and account
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Information Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <FaUser className="text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
              <p className="text-sm text-gray-500">Update your personal details</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailAddress}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Email cannot be changed</p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={async () => {
                  if (!fullName?.trim()) { toast.error('Please enter a valid name'); return; }
                  setSaveError('');
                  setSaveStatus('saving');
                  try {
                    const res = await updateUserProfile({ name: fullName.trim() });
                    // res.persisted === true if server persisted, otherwise local-only
                    if (res && res.persisted) {
                      setSaveStatus('saved');
                      toast.success('Profile updated (saved to server)');
                    } else {
                      // local-only success
                      setSaveStatus('saved-local');
                      setSaveError(res?.error || 'Saved locally');
                      toast.success('Profile updated (saved locally)');
                    }
                  } catch (err) {
                    // Unexpected error — show error but local changes remain
                    setSaveStatus('error');
                    setSaveError(err?.message || 'Unknown error');
                    // ensure local storage fallback
                    localStorage.setItem('userName', fullName.trim());
                    toast.error('Failed to save to server — saved locally');
                  }

                  // reset visual status after a short delay
                  setTimeout(() => setSaveStatus('idle'), 2500);
                }}
                aria-live="polite"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                {saveStatus === 'saving' ? (
                  <span className="flex items-center gap-3">
                    <FaSave className="animate-spin" /> Saving...
                  </span>
                ) : saveStatus === 'saved' ? (
                  <span className="flex items-center gap-3">✅ Saved</span>
                ) : saveStatus === 'saved-local' ? (
                  <span className="flex items-center gap-3">💾 Saved (local)</span>
                ) : saveStatus === 'error' ? (
                  <span className="flex items-center gap-3">⚠️ Error</span>
                ) : (
                  <span className="flex items-center gap-3"><FaSave /> Save Changes</span>
                )}
              </button>

              {/* small status text / accessible message */}
              <div className="text-sm text-gray-500 dark:text-gray-300">
                {saveStatus === 'saved' && <span className="text-green-600 dark:text-green-400">Saved to server</span>}
                {saveStatus === 'saved-local' && <span className="text-yellow-600 dark:text-yellow-400">Saved locally</span>}
                {saveStatus === 'error' && <span className="text-red-600 dark:text-red-400">{saveError || 'Save failed'}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => updateSettings({ theme: 'light' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    settings.theme === 'light'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaSun /> Light
                </button>
                <button
                  onClick={() => updateSettings({ theme: 'dark' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    settings.theme === 'dark'
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <FaMoon /> Dark
                </button>
              </div>
            </div>
          </div>
        </div>



        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-4">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Once you delete your data, there is no going back. Please be certain.
          </p>
          <button
            onClick={() => setIsClearModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <FaTrash /> Clear All Data
          </button>
        </div>
      </div>

      {/* Clear Data Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Clear All Data"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <FaExclamationTriangle className="text-red-600 dark:text-red-400 text-xl mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 dark:text-red-400 mb-1">
                Warning: This action cannot be undone
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                This will permanently delete all your transactions and reset all settings. Make sure you have backed up any important data.
              </p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsClearModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClearData}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Yes, Clear All Data
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
