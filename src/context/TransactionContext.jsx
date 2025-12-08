import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const TransactionContext = createContext();

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within TransactionProvider');
  }
  return context;
};

// Helper function to get user-specific localStorage key
const getUserKey = (baseKey, userId) => {
  return userId ? `${baseKey}_user_${userId}` : baseKey;
};

// Helper to load user-specific data from storage (localStorage or sessionStorage)
const loadUserData = (baseKey, userId, defaultValue) => {
  try {
    const key = getUserKey(baseKey, userId);
    // prefer localStorage (remember) then fallback to sessionStorage
    const savedLocal = localStorage.getItem(key);
    if (savedLocal) return JSON.parse(savedLocal);
    const savedSession = sessionStorage.getItem(key);
    return savedSession ? JSON.parse(savedSession) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Helper to save user-specific data to either localStorage or sessionStorage
// If the user is signed in using session storage (i.e. remember = false), write to sessionStorage
const saveUserData = (baseKey, userId, data) => {
  try {
    const key = getUserKey(baseKey, userId);
    const isSession = sessionStorage.getItem('isAuthenticated') === 'true' && sessionStorage.getItem('userId') === userId;
    if (isSession) {
      sessionStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (e) {
    console.error('Error saving user data to storage:', e);
  }
};

export const TransactionProvider = ({ children }) => {
  // Get current userId from localStorage - but only if authenticated
  const [userId, setUserId] = useState(() => {
    // Support both localStorage and sessionStorage for "remember me" behavior
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    return storedLocal || storedSession || null;
  });
  
  // current user info (name/email/id) - make reactive across app
  const [userName, setUserName] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    return isAuthLocal ? (localStorage.getItem('userName') || '') : isAuthSession ? (sessionStorage.getItem('userName') || '') : '';
  });
  const [userEmail, setUserEmail] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    return isAuthLocal ? (localStorage.getItem('userEmail') || '') : isAuthSession ? (sessionStorage.getItem('userEmail') || '') : '';
  });

  const [transactions, setTransactions] = useState(() => {
    // Load data from either local or session storage depending on where the user is signed in
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendsmart-transactions', uid, []) : [];
  });

  const [settings, setSettings] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendsmart-settings', uid, {
      currency: 'USD',
      theme: 'light',
      defaultView: 'dashboard',
      monthlyBudget: 0,
      dailyBudget: 0,
    }) : {
      currency: 'USD',
      theme: 'light',
      defaultView: 'dashboard',
      monthlyBudget: 0,
      dailyBudget: 0,
    };
  });

  // Bills (upcoming bills) - saved separately so we can persist and manage them
  const [bills, setBills] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendwise-bills', uid, []) : [];
  });

  // Savings goals
  const [goals, setGoals] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendwise-goals', uid, []) : [];
  });

  // Spare-change balance (accumulated) - persisted
  const [spareBalance, setSpareBalance] = useState(() => {
    try {
      const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
      const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
      const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
      const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
      const storedUserId = storedUserIdLocal || storedUserIdSession;
      if (!storedUserId) return 0;

      const key = getUserKey('spendwise-sparechange', storedUserId);
      const saved = sessionStorage.getItem(key) ?? localStorage.getItem(key);
      return saved ? parseFloat(saved) : 0;
    } catch (e) {
      return 0;
    }
  });

  // Most recent round-up contributions (simple history to show recent contributions)
  const [recentRoundUps, setRecentRoundUps] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendwise-recent-roundups', uid, []) : [];
  });

  // Profile save logs (history of profile save attempts)
  const [profileSaveLogs, setProfileSaveLogs] = useState(() => {
    const isAuthLocal = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthSession = sessionStorage.getItem('isAuthenticated') === 'true';
    const storedUserIdLocal = isAuthLocal ? localStorage.getItem('userId') : null;
    const storedUserIdSession = isAuthSession ? sessionStorage.getItem('userId') : null;
    const uid = storedUserIdLocal || storedUserIdSession;
    return uid ? loadUserData('spendwise-user-save-logs', uid, []) : [];
  });

  // Save to localStorage whenever data changes (user-specific)
  useEffect(() => {
    if (userId) {
      saveUserData('spendsmart-transactions', userId, transactions);
    }
  }, [transactions, userId]);

  useEffect(() => {
    if (userId) {
      saveUserData('spendwise-bills', userId, bills);
    }
  }, [bills, userId]);

  useEffect(() => {
    if (userId) {
      saveUserData('spendwise-goals', userId, goals);
    }
  }, [goals, userId]);

  useEffect(() => {
    if (userId) {
      // save spare balance to the storage used by this session (local or session)
      saveUserData('spendwise-sparechange', userId, String(spareBalance));
    }
  }, [spareBalance, userId]);

  useEffect(() => {
    if (userId) {
      saveUserData('spendwise-recent-roundups', userId, recentRoundUps);
    }
  }, [recentRoundUps, userId]);

  useEffect(() => {
    if (userId) {
      saveUserData('spendwise-user-save-logs', userId, profileSaveLogs);
    }
  }, [profileSaveLogs, userId]);

  // Save settings to localStorage
  useEffect(() => {
    if (userId) {
      saveUserData('spendsmart-settings', userId, settings);
    }
  }, [settings, userId]);

  // keep user info in localStorage in sync
  useEffect(() => {
    if (userName !== undefined) {
      const isSession = sessionStorage.getItem('isAuthenticated') === 'true' && sessionStorage.getItem('userId') === userId;
      if (isSession) sessionStorage.setItem('userName', userName || '');
      else localStorage.setItem('userName', userName || '');
    }
  }, [userName, userId]);

  useEffect(() => {
    if (userEmail !== undefined) {
      const isSession = sessionStorage.getItem('isAuthenticated') === 'true' && sessionStorage.getItem('userId') === userId;
      if (isSession) sessionStorage.setItem('userEmail', userEmail || '');
      else localStorage.setItem('userEmail', userEmail || '');
    }
  }, [userEmail, userId]);

  // Apply theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  const addTransaction = (transaction) => {
    // Check balance before adding an expense: do not allow expenses that exceed available balance
    if (transaction.type === 'expense') {
      const currentTotals = transactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += parseFloat(t.amount) || 0;
        else acc.expense += parseFloat(t.amount) || 0;
        return acc;
      }, { income: 0, expense: 0 });

      const currentBalance = currentTotals.income - currentTotals.expense;
      const amount = parseFloat(transaction.amount) || 0;

      if (amount > currentBalance) {
        toast.error('Low balance — transaction cancelled');
        return null;
      }
    }
    const newTransaction = {
      id: Date.now().toString(),
      ...transaction,
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Auto round-up: when an expense is added, round up to next whole number and add the difference
    try {
      const roundUp = computeRoundUpForTransaction(newTransaction);
      if (roundUp && roundUp > 0) {
        setSpareBalance(prev => +(prev + Number(roundUp)).toFixed(2));
      }
    } catch (e) {
      // silently ignore if compute fails
    }
    
    // update spare balance
    if (newTransaction.type === 'expense') {
      const roundUp = computeRoundUpForTransaction(newTransaction);
      if (roundUp > 0) {
        // add to recent round-ups (keep only latest 12)
        const roundItem = {
          id: `r_${Date.now().toString()}`,
          transactionId: newTransaction.id,
          amount: +roundUp.toFixed(2),
          category: newTransaction.category || 'Expense',
          date: newTransaction.date,
        };
        setRecentRoundUps(prev => [roundItem, ...prev].slice(0, 12));
      }
      
      // Check daily budget
      if (settings.dailyBudget > 0) {
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = [...transactions, newTransaction]
          .filter(t => t.type === 'expense' && t.date === today)
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
        if (todayExpenses > settings.dailyBudget) {
          toast.warning(`⚠️ Your daily budget has been exceeded! Spent: ${todayExpenses.toFixed(2)} / Budget: ${settings.dailyBudget.toFixed(2)}`, {
            position: "top-center",
            autoClose: 5000,
          });
        }
      }
      
      // Check monthly budget as well
      if (settings.monthlyBudget > 0) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const monthExpenses = [...transactions, newTransaction]
          .filter(t => t.type === 'expense')
          .filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

        if (monthExpenses > settings.monthlyBudget) {
          toast.warning(`⚠️ Your monthly budget has been exceeded! Spent: ${monthExpenses.toFixed(2)} / Budget: ${settings.monthlyBudget.toFixed(2)}`, {
            position: 'top-center',
            autoClose: 7000,
          });
        }
      }
    }
    
    return newTransaction;
  };

  const updateTransaction = (id, updatedTransaction) => {
    // If updating an expense, ensure the new amount doesn't exceed available balance
    if (updatedTransaction.type === 'expense') {
      const otherTransactions = transactions.filter(t => t.id !== id);
      const totalsExcept = otherTransactions.reduce((acc, t) => {
        if (t.type === 'income') acc.income += parseFloat(t.amount) || 0;
        else acc.expense += parseFloat(t.amount) || 0;
        return acc;
      }, { income: 0, expense: 0 });
      const balanceExcept = totalsExcept.income - totalsExcept.expense;
      const newAmount = parseFloat(updatedTransaction.amount) || 0;
      if (newAmount > balanceExcept) {
        toast.error('Low balance — transaction update cancelled');
        return false;
      }
    }

    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, ...updatedTransaction } : t)
    );

    return true;
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const clearAllTransactions = () => {
    setTransactions([]);
    if (userId) {
      const key = getUserKey('spendsmart-transactions', userId);
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // update profile locally and try to persist to JSON Server if userId is available
  const updateUserProfile = async ({ name, email } = {}) => {
    // update local state right away so UI is responsive
    if (name !== undefined) setUserName(name);
    if (email !== undefined) setUserEmail(email);

    // Attempt to persist to JSON Server if userId is available
    const id = userId;
    if (!id) {
      // No remote persistence available — record a local-only log and return
      const log = { id: `log_${Date.now()}`, when: new Date().toISOString(), persisted: false, local: true, message: 'No server (local-only)' };
      setProfileSaveLogs(prev => [log, ...prev].slice(0, 25));
      return { persisted: false, local: true };
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), fullName: name || userName, email: email || userEmail }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        const log = { id: `log_${Date.now()}`, when: new Date().toISOString(), persisted: false, local: true, message: `Server responded ${response.status} ${text}` };
        setProfileSaveLogs(prev => [log, ...prev].slice(0, 25));
        return { persisted: false, local: true, error: `Server responded ${response.status} ${text}` };
      }

      const successLog = { id: `log_${Date.now()}`, when: new Date().toISOString(), persisted: true, local: true, message: 'Persisted to server' };
      setProfileSaveLogs(prev => [successLog, ...prev].slice(0, 25));
      return { persisted: true, local: true };
    } catch (e) {
      console.warn('Could not persist user profile to server', e);
      const errLog = { id: `log_${Date.now()}`, when: new Date().toISOString(), persisted: false, local: true, message: e?.message || String(e) };
      setProfileSaveLogs(prev => [errLog, ...prev].slice(0, 25));
      return { persisted: false, local: true, error: e?.message || String(e) };
    }
  };

  const clearProfileSaveLogs = () => setProfileSaveLogs([]);

  // Bills API
  const addBill = (bill) => {
    const newBill = { id: Date.now().toString(), ...bill };
    setBills(prev => [newBill, ...prev]);
    return newBill;
  };

  const updateBill = (id, updates) => {
    // Find the bill before updating
    const bill = bills.find(b => b.id === id);
    
    // Check if bill is being marked as paid
    if (bill && updates.paid === true && !bill.paid) {
      // Create an expense transaction for this bill
      addTransaction({
        type: 'expense',
        category: 'Bills',
        amount: bill.amount,
        notes: `Bill payment: ${bill.name}`,
        date: new Date().toISOString().split('T')[0],
      });
    }
    
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const removeBill = (id) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  // Goals API
  const createGoal = (goal) => {
    const newGoal = { id: Date.now().toString(), ...goal };
    setGoals(prev => [newGoal, ...prev]);
    return newGoal;
  };

  const contributeToGoal = (id, amount) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, saved: (g.saved || 0) + Number(amount) } : g));
  };

  const removeGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  // Spare change calculation and transfer
  const computeRoundUpForTransaction = (t) => {
    if (!t || t.type !== 'expense') return 0;
    const amt = parseFloat(t.amount) || 0;
    const rounded = Math.ceil(amt);
    const roundUp = +(rounded - amt).toFixed(2);
    return roundUp > 0 ? roundUp : 0;
  };

  const computeSpareFromAll = () => {
    return transactions.reduce((acc, t) => acc + computeRoundUpForTransaction(t), 0);
  };

  const transferSpareToBalance = (amount) => {
    setSpareBalance(prev => +(prev + Number(amount)).toFixed(2));
  };

  const resetSpareBalance = () => setSpareBalance(0);

  // Calculate totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += parseFloat(t.amount) || 0;
      } else {
        acc.expense += parseFloat(t.amount) || 0;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  totals.balance = totals.income - totals.expense;

  const value = {
    transactions,
    settings,
    totals,
    bills,
    goals,
    spareBalance,
    recentRoundUps,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    updateSettings,
    // bills
    addBill,
    updateBill,
    removeBill,
    // goals
    createGoal,
    contributeToGoal,
    removeGoal,
    // spare change helpers
    computeRoundUpForTransaction,
    computeSpareFromAll,
    transferSpareToBalance,
    resetSpareBalance,
    // user profile
    userName,
    userEmail,
    updateUserProfile,
    profileSaveLogs,
    // Auth actions
    login: (userData, remember = true) => {
      // Set user info
      setUserId(userData.id);
      setUserName(userData.name);
      setUserEmail(userData.email);
      // Save auth info to chosen storage
      if (remember) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userName', userData.name);
        localStorage.setItem('userEmail', userData.email);
        // ensure sessionStorage cleared for this user
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userEmail');
      } else {
        // store to sessionStorage
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userId', userData.id);
        sessionStorage.setItem('userName', userData.name);
        sessionStorage.setItem('userEmail', userData.email);
        // ensure localStorage doesn't carry old auth for this user
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
      }

      // Load user-specific data
      setTransactions(loadUserData('spendsmart-transactions', userData.id, []));
      setSettings(loadUserData('spendsmart-settings', userData.id, {
        currency: 'USD',
        theme: 'light',
        defaultView: 'dashboard',
        monthlyBudget: 0,
        dailyBudget: 0,
      }));
      setBills(loadUserData('spendwise-bills', userData.id, []));
      setGoals(loadUserData('spendwise-goals', userData.id, []));
      setRecentRoundUps(loadUserData('spendwise-recent-roundups', userData.id, []));
      setProfileSaveLogs(loadUserData('spendwise-user-save-logs', userData.id, []));
      
      // Load spare balance
      try {
        const key = getUserKey('spendwise-sparechange', userData.id);
        const saved = sessionStorage.getItem(key) ?? localStorage.getItem(key);
        setSpareBalance(saved ? parseFloat(saved) : 0);
      } catch (e) {
        setSpareBalance(0);
      }
    },
    logout: () => {
      // Clear user info
      setUserId(null);
      setUserName('');
      setUserEmail('');
      
      // Clear all data states
      setTransactions([]);
      setSettings({
        currency: 'USD',
        theme: 'light',
        defaultView: 'dashboard',
        monthlyBudget: 0,
      });
      setBills([]);
      setGoals([]);
      setSpareBalance(0);
      setRecentRoundUps([]);
      setProfileSaveLogs([]);
      
      // Remove auth info from both storages
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userEmail');
    },
    clearProfileSaveLogs,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
