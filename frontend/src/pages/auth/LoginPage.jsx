import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      if (response) {
        // Navigate to dashboard or intended page
        const intendedPath = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
        navigate(intendedPath);
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        submit: error.message || 'Login failed. Please check your credentials and try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="/favicon.ico" 
                alt="CauseHive Logo" 
                className="h-12 w-12 rounded-xl"
              />
              <span className="ml-3 text-2xl font-bold text-neutral-900">CauseHive</span>
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Welcome back</h2>
            <p className="text-neutral-600">Sign in to continue making a difference</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.email 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                    errors.password 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-neutral-300 hover:border-neutral-400'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 text-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </div>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-neutral-200">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-sm text-neutral-600">Secure & Trusted Platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Hero Image/Content */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 to-secondary-600 items-center justify-center p-8">
        <div className="text-center text-white max-w-md">
          <h3 className="text-3xl font-bold mb-6">Join the Movement</h3>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            Connect with causes that matter to you and make a real difference in the world.
          </p>
          
          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">$2.4M+</div>
              <div className="text-primary-100">Raised for causes</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">48K+</div>
              <div className="text-primary-100">Active donors</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="text-2xl font-bold">1.2K+</div>
              <div className="text-primary-100">Supported causes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}