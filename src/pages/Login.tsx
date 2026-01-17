//src/pages/Login.tsx
import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Layout } from '../components/Layout';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendOTP, verifyOTP, isLoading, error, clearError } = useAuthStore();
  
  const from = (location.state as any)?.from || '/newsletter';
  
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSentEmail, setOtpSentEmail] = useState('');
  const [localError, setLocalError] = useState('');
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(true);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !email.includes('@')) {
      setLocalError('Please enter a valid email');
      return;
    }

    try {
      await sendOTP(email);
      setOtpSentEmail(email);
      setStep('otp');
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch {
      setLocalError('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!otp || otp.length !== 6) {
      setLocalError('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      await verifyOTP(otpSentEmail, otp);
      
      if (subscribeToNewsletter) {
        try {
          await axios.post(`${API_URL}/subscribers/subscribe`, {
            email: otpSentEmail,
          });
        } catch (subscribeError: any) {
          if (subscribeError.response?.status !== 400) {
            // Already subscribed is fine, continue
          }
        }
      }
      
      navigate(from, { replace: true });
    } catch {
      setLocalError('Invalid or expired OTP. Please try again.');
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setLocalError('');
    clearError();
    setTimeout(() => emailInputRef.current?.focus(), 100);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-400px)] flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            {from !== '/newsletter' && (
              <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <p className="text-sm text-orange-800">
                   Sign in required to access <strong>System Design</strong> resources
                </p>
              </div>
            )}
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
              {step === 'email' ? 'Welcome back' : 'Check your email'}
            </h2>
            <p className="text-base md:text-lg text-gray-600">
              {step === 'email' 
                ? 'Sign in to access your dashboard' 
                : `We sent a code to ${otpSentEmail}`}
            </p>
          </div>

          {(localError || error) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-800 text-sm">{localError || error}</p>
            </div>
          )}

          {step === 'email' && (
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email address
                </label>
                <input
                  ref={emailInputRef}
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP(e)}
                  disabled={isLoading}
                  placeholder="you@example.com"
                  className="w-full px-5 py-3.5 border border-gray-300 rounded-xl text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 transition-all"
                  autoFocus
                />
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subscribeToNewsletter}
                    onChange={(e) => setSubscribeToNewsletter(e.target.checked)}
                    className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900 block mb-1">
                      📬 Subscribe to ArchWeekly Newsletter
                    </span>
                    <span className="text-xs text-gray-600">
                      Get weekly curated DevOps and System Design articles from top engineering teams
                    </span>
                  </div>
                </label>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full px-5 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending code...
                  </>
                ) : (
                  'Send verification code'
                )}
              </button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-5">
              {subscribeToNewsletter && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    You'll be subscribed to our newsletter
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-900 mb-2">
                  Verification code
                </label>
                <input
                  ref={otpInputRef}
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  onKeyPress={(e) => e.key === 'Enter' && otp.length === 6 && handleVerifyOTP(e)}
                  disabled={isLoading}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-[0.5em] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50 transition-all"
                  autoFocus
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter the 6-digit code we sent to your email
                </p>
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length !== 6}
                className="w-full px-5 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify & sign in'
                )}
              </button>

              <button
                onClick={handleBackToEmail}
                disabled={isLoading}
                className="w-full px-5 py-3 text-orange-600 hover:text-orange-700 font-medium rounded-xl transition-colors disabled:opacity-50"
              >
                ← Back to email
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              No account? We'll create one automatically.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};