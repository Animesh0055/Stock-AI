import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Rocket, Crown } from 'lucide-react';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-3">
              <div className="p-3 bg-gradient-accent rounded-xl shadow-glow-accent">
                <Rocket className="w-8 h-8 text-background" />
              </div>
              <span className="text-2xl font-bold text-text-primary">BlackBull</span>
            </Link>
          </div>

          <Card>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {isLogin ? 'Welcome Back, Explorer' : 'Join the Expedition'}
              </h2>
              <p className="text-text-secondary">
                {isLogin ? 'Sign in to access your command center' : 'Start your journey into AI-powered trading'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                    <input
                      name="name" type="text" required={!isLogin} value={formData.name} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    name="email" type="email" required value={formData.email} onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
                  <input
                    name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 border border-border rounded-lg bg-surface text-text-primary focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" type="checkbox" className="h-4 w-4 text-accent focus:ring-accent border-border rounded bg-surface" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">Remember me</label>
                  </div>
                  <button type="button" className="text-sm text-accent hover:text-accent-light">Forgot password?</button>
                </div>
              )}

              <motion.button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex items-center justify-center px-4 py-3 bg-accent text-background font-semibold rounded-lg hover:bg-accent-light focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileTap={{ scale: 0.95 }}
              >
                {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                {isLogin ? 'Engage' : 'Launch'}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                {' '}
                <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:text-accent-light font-medium">
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            
            {!isLogin && (
              <div className="mt-6 p-4 bg-yellow-900/20 rounded-lg border border-yellow-700/50">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-yellow-400 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-300">Premium Access</h4>
                    <p className="text-xs text-yellow-500 mt-1">Upgrade to access advanced scanning and real-time alerts.</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="mt-8 text-center text-sm text-text-secondary">
            By continuing, you agree to our{' '}
            <a href="#" className="text-accent hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-accent hover:underline">Privacy Policy</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
