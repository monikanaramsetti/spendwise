import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaCheck, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

import { useTransactions } from '../context/TransactionContext';
import BackButton from '../components/BackButton';

const SignUp = () => {
  const { login } = useTransactions();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validatePassword = (password) => {
    return {
      length: password.length >= 6,
    };
  };

  const passwordStrength = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordStrength).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.fullName.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      // First, check if email already exists (case-insensitive)
      const checkEmailResponse = await fetch('http://localhost:3001/users');
      
      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email availability');
      }

      const allUsers = await checkEmailResponse.json();
      
      // Check for duplicate email (case-insensitive)
      const emailExists = allUsers.some(
        (user) => user.email && user.email.toLowerCase() === formData.email.toLowerCase()
      );
      
      if (emailExists) {
        toast.error('An account with this email already exists. Please use a different email.');
        setLoading(false);
        return;
      }

      // Save user to db.json via JSON Server
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
          password: formData.password,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create account' }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store user session via context
      login({
        id: data.id,
        name: data.fullName,
        email: data.email
      });

      toast.success(`Welcome, ${data.fullName}! 🎉`);
      navigate('/dashboard');
      setLoading(false);
    } catch (error) {
      console.error('Error creating account:', error);
      
      // Check if it's a network error
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        toast.error('Cannot connect to server. Please make sure JSON Server is running on port 3001.');
      } else {
        toast.error(error.message || 'Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-transparent">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <BackButton className="text-white hover:text-white/80 mb-6" />
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl mb-4 border border-white/30">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black font-montserrat text-white mb-2">Join Spendwise</h1>
          <p className="text-white/80 text-lg font-bold">Start your journey to financial freedom</p>
        </div>

        {/* Form Card */}
        <div className="glass-strong rounded-3xl shadow-2xl p-8 border border-white/30">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
            <p className="text-gray-600 text-sm">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@email.com"
                  className="input"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className={`flex items-center gap-2 ${passwordStrength.length ? 'text-emerald-600' : 'text-gray-400'}`}>
                    <FaCheck size={10} /> At least 6 characters
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-2 text-xs text-red-600 font-medium">Passwords do not match</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="w-5 h-5 mt-0.5 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                required
              />
              <label className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-indigo-600 font-semibold hover:text-indigo-700">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <FaArrowRight />
                </span>
              )}
            </button>
          </form>

          {/* Sign-in Link */}
          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-white/70 text-sm">
          © 2025 Spendwise. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
