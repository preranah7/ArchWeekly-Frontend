// src/components/Layout.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/newsletter', label: 'Newsletter', primary: true },
  { path: '/newsletters', label: 'Archive', primary: false },
  { path: '/system-design', label: 'System Design', primary: false },
] as const;

const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    url: 'https://twitter.com/archweekly',
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    )
  },
  {
    name: 'GitHub',
    url: 'https://github.com/preranah7/archweekly',
    icon: (
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
    )
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/company/archweekly',
    icon: (
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    )
  }
] as const;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Sticky */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/subscribe" className="group">
              <h1 className="text-2xl md:text-3xl font-serif text-gray-900 tracking-tight">
                ArchWeekly
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 hidden md:block">
                DevOps & System Design
              </p>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm ${
                    item.primary
                      ? 'font-medium text-gray-900 hover:text-orange-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 bg-orange-600 text-white text-sm font-medium rounded-full hover:bg-orange-500 transition-colors"
                >
                  Sign in
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav 
              id="mobile-menu"
              className="md:hidden pt-6 pb-4 space-y-4 border-t border-gray-200 mt-6"
              aria-label="Mobile navigation"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block text-base ${
                    item.primary ? 'font-medium text-gray-900' : 'text-gray-600'
                  }`}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block text-base text-gray-600"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block text-base text-gray-600"
                      onClick={closeMobileMenu}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">{user?.email}</p>
                    <button
                      onClick={handleLogout}
                      className="text-base text-gray-600"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full px-5 py-3 bg-gray-900 text-white text-sm font-medium rounded-full text-center"
                  onClick={closeMobileMenu}
                >
                  Sign in
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h4 className="text-xl font-serif text-gray-900 mb-3">
                ArchWeekly
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
                Weekly curated newsletter featuring the best DevOps and System Design articles from top engineering teams worldwide.
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className="text-gray-400 hover:text-orange-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-4">Newsletter</h5>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/newsletter" 
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    Latest Issue
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/newsletters" 
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    Archive
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-gray-900 mb-4">Connect</h5>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://twitter.com/archweekly" 
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:newsletter@archweekly.online" 
                    className="text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200"
                  >
                    Email
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              © 2026 ArchWeekly · Made for engineers, by engineers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};