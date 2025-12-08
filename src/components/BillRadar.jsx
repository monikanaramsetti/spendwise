import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaBell, FaTrash, FaCheck, FaPlus } from 'react-icons/fa';

const daysUntil = (dateStr) => {
  const today = new Date();
  const d = new Date(dateStr + 'T00:00:00');
  return Math.ceil((d - today) / (1000 * 60 * 60 * 24));
};

const BillRemainder = () => {
  const { bills, addBill, updateBill, removeBill } = useTransactions();
  const [form, setForm] = useState({ name: '', amount: '', dueDate: '' });

  const upcoming = bills
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.dueDate) return;
    addBill({ ...form, amount: parseFloat(form.amount) });
    setForm({ name: '', amount: '', dueDate: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bill Remainder</h3>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <FaBell className="text-indigo-600" /> <span className="font-medium">Upcoming bills & alerts</span>
        </div>
      </div>

      {upcoming.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">No upcoming bills. Add one below to get reminders.</div>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((b) => {
            const d = daysUntil(b.dueDate);
            const isSoon = d <= 3 && d >= 0;
            const isOverdue = d < 0;
            return (
              <li key={b.id} className={`flex items-center justify-between p-3 rounded-lg border ${isSoon ? 'bg-amber-50 border-amber-300' : isOverdue ? 'bg-red-50 border-red-300' : 'bg-white dark:bg-gray-800'} `}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{b.name}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">{new Date(b.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Amount: <span className="font-semibold">{Number(b.amount).toFixed(2)}</span></div>
                </div>
                <div className="flex items-center gap-2">
                  {isOverdue ? <span className="text-xs text-red-600 font-semibold">Overdue</span> : <span className="text-xs text-gray-400">Due in {d} day{d !== 1 ? 's' : ''}</span>}
                  {!b.paid ? (
                    <button onClick={() => updateBill(b.id, { paid: true })} className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-sm hover:opacity-90">
                      <FaCheck /> Paid
                    </button>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700">Paid</span>
                  )}
                  <button onClick={() => removeBill(b.id)} className="text-sm text-red-500 hover:text-red-600 ml-2" aria-label="Remove bill"><FaTrash /></button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Add form */}
      <form onSubmit={handleAdd} className="mt-5 space-y-3">
        <div className="flex gap-2">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Bill name" className="input" />
          <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Amount" className="input w-32" />
        </div>
        <div className="flex gap-2 items-center">
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="input w-full" />
          <button className="btn btn-success px-4 py-2 flex items-center gap-2" type="submit">
            <FaPlus /> Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default BillRemainder;
