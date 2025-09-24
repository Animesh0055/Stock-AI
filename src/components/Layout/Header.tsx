import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket,
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X,
  Crown 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'Predictions', href: '/predictions' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Intel', href: '/news' },
    { name: 'My Team', href: '/team' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-accent rounded-lg shadow-glow-accent">
              <Rocket className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-bold text-text-primary">
              BlackBull
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-accent"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 rounded-lg hover:bg-surface-light transition-colors relative">
                  <Bell className="w-5 h-5 text-text-secondary" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-glow"></span>
                  </span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-light transition-colors"
                  >
                    <User className="w-5 h-5 text-text-secondary" />
                    {user.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                  </button>

                  <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 bg-surface rounded-lg shadow-lg border border-border"
                    >
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-medium text-text-primary">{user.name}</p>
                        <p className="text-xs text-text-secondary">{user.email}</p>
                        {user.isPremium && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-2 text-xs font-medium text-yellow-300 bg-yellow-900/50 rounded-full">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm text-danger hover:bg-danger/10"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="hidden md:inline-flex items-center px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-light transition-all transform hover:scale-105"
              >
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-light transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-text-secondary" />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-text-primary bg-surface-light'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {!user && (
                <div className="pt-4 mt-4 border-t border-border">
                  <Link
                    to="/auth"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-accent text-background font-semibold rounded-lg hover:bg-accent-light transition-all"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
