import { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { FaBullseye, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Progress = ({ value }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
    <div className="h-3 bg-gradient-to-r from-indigo-600 to-purple-600" style={{ width: `${Math.min(100, Math.round(value))}%` }} />
  </div>
);

const SavingTargets = () => {
  const { goals, createGoal, contributeToGoal, spareBalance, transferSpareToBalance, removeGoal } = useTransactions();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', target: '', initial: '' });
  const [contribute, setContribute] = useState({ id: '', amount: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title || !form.target) return;
    createGoal({ title: form.title, target: Number(form.target), saved: Number(form.initial || 0) });
    setForm({ title: '', target: '', initial: '' });
    setAdding(false);
  };

  const handleContribute = (e) => {
    e.preventDefault();
    if (!contribute.id || !contribute.amount) return;
    
    // Find the goal before contribution
    const goal = goals.find(g => g.id === contribute.id);
    if (!goal) return;
    
    const previousSaved = goal.saved || 0;
    const newSaved = previousSaved + Number(contribute.amount);
    const wasNotComplete = previousSaved < goal.target;
    const isNowComplete = newSaved >= goal.target;
    
    contributeToGoal(contribute.id, Number(contribute.amount));
    
    // Show notification if target was just reached
    if (wasNotComplete && isNowComplete) {
      toast.success(`🎉 Congratulations! You have reached your target for "${goal.title}"!`, {
        position: "top-center",
        autoClose: 5000,
      });
    }
    
    setContribute({ id: '', amount: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Saving Targets</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500"><FaBullseye className="text-indigo-600" /> Goals & progress</div>
      </div>

      {goals.length === 0 ? (
        <div className="text-sm text-gray-400">No active goals yet — create one to get started.</div>
      ) : (
        <div className="space-y-4">
          {goals.map(g => {
            const pct = g.target > 0 ? (g.saved / g.target) * 100 : 0;
            return (
              <div key={g.id} className="bg-white dark:bg-gray-900/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{g.title}</div>
                    <div className="text-xs text-gray-400">Saved {g.saved?.toFixed(2)} of {g.target.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(pct)}%</div>
                    <button 
                      onClick={() => removeGoal(g.id)} 
                      className="text-sm text-red-500 hover:text-red-600" 
                      aria-label="Delete goal"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <Progress value={pct} />
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 border-t pt-3">
        {adding ? (
          <form onSubmit={handleCreate} className="space-y-2">
            <input className="input" placeholder="Goal title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <div className="flex gap-2">
              <input className="input" placeholder="Target amount" type="number" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
              <input className="input" placeholder="Initial saved" type="number" value={form.initial} onChange={(e) => setForm({ ...form, initial: e.target.value })} />
            </div>
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 rounded-lg border" onClick={() => setAdding(false)} type="button">Cancel</button>
              <button className="btn btn-primary px-3 py-1" type="submit"><FaPlus /> Create</button>
            </div>
          </form>
        ) : (
          <div className="flex gap-2 items-center justify-between">
            <div className="text-xs text-gray-400">Want to reach a goal? Create or contribute below.</div>
            <div className="flex items-center gap-2">
              <select value={contribute.id} onChange={(e) => setContribute(prev => ({ ...prev, id: e.target.value }))} className="input text-sm w-40 text-gray-900 dark:text-white">
                <option value="">Select goal</option>
                {goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
              <input value={contribute.amount} onChange={(e) => setContribute(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className="input w-24 text-sm" />
              <button onClick={handleContribute} className="btn btn-success px-3 py-1">Contribute</button>
              <button onClick={() => setAdding(true)} className="px-3 py-1 rounded-lg border">New</button>
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default SavingTargets;
