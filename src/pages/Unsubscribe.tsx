//src/pages/Unsubscribe.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { subscriberAPI } from '../services/api';

const Unsubscribe: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
  }>({ loading: false, success: false, error: null });

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      await subscriberAPI.unsubscribe(email);
      setStatus({ loading: false, success: true, error: null });
      setEmail('');
    } catch (error: any) {
      setStatus({
        loading: false,
        success: false,
        error: error.response?.data?.error || 'Failed to unsubscribe',
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          {!status.success ? (
            <>
              {/* Header */}
              <div className="mb-10 text-center">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                  Unsubscribe
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                  Sorry to see you go. Enter your email to unsubscribe from our newsletter.
                </p>
              </div>

              {/* Error Message */}
              {status.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-800 text-sm">{status.error}</p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUnsubscribe(e)}
                    disabled={status.loading}
                    placeholder="you@example.com"
                    className="w-full px-5 py-3.5 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 transition-all"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleUnsubscribe}
                  disabled={status.loading}
                  className="w-full px-5 py-3.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {status.loading ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <a href="/" className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
                  ← Back to home
                </a>
              </div>
            </>
          ) : (
            // Success State
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
                Successfully unsubscribed
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8">
                You've been removed from our mailing list. You won't receive any more emails from us.
              </p>
              <a
                href="/"
                className="inline-block px-8 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Return to home
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Unsubscribe;