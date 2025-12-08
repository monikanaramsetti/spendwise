import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useTransactions } from '../context/TransactionContext';
import BackButton from '../components/BackButton';

const SignIn = () => {
  const { login } = useTransactions();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.match(emailRegex)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Check credentials from db.json via JSON Server
      const response = await fetch('http://localhost:3001/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      
      // Find user with matching email
      const user = users.find(
        (u) => u.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (!user) {
        toast.error('No account found with this email.');
        setLoading(false);
        return;
      }

      // Check password
      if (user.password !== formData.password) {
        toast.error('Wrong password. Please try again.');
        setLoading(false);
        return;
      }

      // Successful login via context - pass remember flag from the form
      login({
        id: user.id,
        name: user.fullName,
        email: user.email
      }, formData.rememberMe);

      toast.success(`Welcome back, ${user.fullName}! 🎉`);
      navigate('/dashboard');
      setLoading(false);
    } catch (error) {
      console.error('Error logging in:', error);
      
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        toast.error('Cannot connect to server. Please make sure JSON Server is running on port 3001.');
      } else {
        toast.error('Failed to login. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem',
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Simple Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.1
      }}>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '384px',
          height: '384px',
          background: '#6366f1',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}></div>
      </div>

      {/* Main Form Container */}
      <div style={{ 
        width: '100%', 
        maxWidth: '28rem',
        position: 'relative',
        zIndex: 10
      }}>
        <BackButton className="text-white hover:text-white/80 mb-6" />
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1rem',
            marginBottom: '1rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <svg style={{ width: '40px', height: '40px', color: '#6366f1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '900', color: 'white', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.125rem', fontWeight: '700', fontFamily: "'Montserrat', 'Inter', sans-serif" }}>Login to continue to Spendwise</p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.25rem' }}>Login</h2>
            <p style={{ color: '#4a5568', fontSize: '0.875rem' }}>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Email Input */}
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />

                {/* Eye icon toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25rem'
                  }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    cursor: 'pointer'
                  }}
                />
                <label htmlFor="rememberMe" style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500, cursor: 'pointer' }}>
                  Remember me
                </label>
              </div>
              {/* Forgot password removed per UX request */}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: loading ? '#9ca3af' : 'linear-gradient(to right, #4f46e5, #7c3aed)',
                color: 'white',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  Logging in...
                </>
              ) : (
                <>
                  Login <FaArrowRight />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4a5568' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.875rem' }}>
          © 2025 Spendwise. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SignIn;
