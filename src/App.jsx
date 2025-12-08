import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionProvider } from './context/TransactionContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import { Outlet } from 'react-router-dom';

const Layout = () => {
  // Show navbar only when user has authenticated (login/register completed)
  const isAuthenticated = typeof window !== 'undefined' && (localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true');

  return (
    <div className="min-h-screen flex flex-col transition-colors">
      {isAuthenticated && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <TransactionProvider>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes (require authentication) */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </TransactionProvider>
  );
}

export default App;
