//src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import { subscriberAPI, newsletterAPI } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (copySuccess) {
      const timeoutId = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copySuccess]);

  const { data: referralData, isLoading: referralLoading } = useQuery({
    queryKey: ['referralStats', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const response = await subscriberAPI.getReferralStats(user.email);
      return response.data;
    },
    enabled: !!user?.email,
  });

  const { data: countData } = useQuery({
    queryKey: ['subscriberCount'],
    queryFn: async () => {
      const response = await subscriberAPI.getCount();
      return response.data;
    },
  });

  const { data: newsletterData } = useQuery({
    queryKey: ['latestNewsletter'],
    queryFn: async () => {
      const response = await newsletterAPI.getLatest();
      return response.data;
    },
  });

  const referralLink = user?.email 
    ? `${window.location.origin}/?ref=${referralData?.referralCode || 'loading'}`
    : '';

  const copyReferralLink = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopySuccess(true);
    }
  };

  return (
    <Layout>
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Welcome back, <span className="text-gray-900 font-medium">{user?.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-sm text-gray-600 mb-2">Total Subscribers</p>
            <p className="text-4xl font-serif text-gray-900">
              {countData?.totalUnique || 0}
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl p-8">
            <p className="text-sm text-orange-900 mb-2">Your Referrals</p>
            {referralLoading ? (
              <div className="h-12 flex items-center">
                <LoadingSpinner size="sm" />
              </div>
            ) : (
              <p className="text-4xl font-serif text-orange-600">
                {referralData?.totalReferrals || 0}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-sm text-gray-600 mb-2">Active Subscribers</p>
            <p className="text-4xl font-serif text-gray-900">
              {countData?.activeSubscribers || 0}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 md:p-10 mb-12">
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4">
            Referral Program
          </h2>
          <p className="text-base text-gray-600 mb-8">
            Share your unique referral link with friends and track how many people subscribe using your link.
          </p>
          
          {referralLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-5 py-3.5 bg-white border border-gray-300 rounded-xl text-gray-700 text-sm font-mono focus:outline-none"
                />
                <button
                  onClick={copyReferralLink}
                  className="px-6 py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  {copySuccess ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Your referral code: <code className="text-orange-600 font-mono font-semibold">{referralData?.referralCode}</code>
              </p>
            </>
          )}
        </div>

        {newsletterData?.newsletter && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10">
            <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6">
              Latest Newsletter
            </h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-lg text-gray-900 font-semibold mb-1">
                  {newsletterData.newsletter.title}
                </p>
                <p className="text-sm text-gray-600">
                  {new Date(newsletterData.newsletter.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full">
                <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-semibold text-orange-700">
                  {newsletterData.newsletter.totalArticles} articles
                </span>
              </div>
            </div>
            <a
              href="/newsletter"
              className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 text-base font-medium transition-colors"
            >
              Read this week's issue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default Dashboard;