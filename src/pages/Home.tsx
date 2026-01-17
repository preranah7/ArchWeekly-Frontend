//src/pages/Home.tsx
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { NewsletterList } from '../components/NewsletterList';
import { useAuthStore } from '../stores/authStore';
import { subscriberAPI } from '../services/api';
import { useQuery } from '@tanstack/react-query';

export const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: string | null;
    referralCode?: string;
  }>({ loading: false, success: false, error: null });

  const { data: countData } = useQuery({
    queryKey: ['subscriberCount'],
    queryFn: async () => {
      const response = await subscriberAPI.getCount();
      return response.data;
    },
  });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus({ loading: true, success: false, error: null });

    try {
      const response = await subscriberAPI.subscribe(email);
      setSubscribeStatus({ 
        loading: false, 
        success: true, 
        error: null,
        referralCode: response.data.subscriber.referralCode,
      });
      setEmail('');
    } catch (error: any) {
      setSubscribeStatus({
        loading: false,
        success: false,
        error: error.response?.data?.error || 'Failed to subscribe',
      });
    }
  };

  const totalSubscribers = countData?.totalSubscribers || 10000;
  const formattedCount = totalSubscribers.toLocaleString();

  return (
    <Layout>
      <section className="border-b border-gray-200 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-8">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Issue #{new Date().getDay()} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              This week's best in DevOps & System Design
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12">
              Five hand-picked articles from engineering teams at Netflix, Meta, Stripe, and more. Curated for engineers who build at scale.
            </p>

            {!isAuthenticated && !subscribeStatus.success && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
                    disabled={subscribeStatus.loading}
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-3.5 border border-gray-300 rounded-full text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribeStatus.loading}
                    className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {subscribeStatus.loading ? 'Subscribing...' : 'Subscribe free'}
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Join {formattedCount} engineers · Free · Unsubscribe anytime
                </p>
              </div>
            )}

            {subscribeStatus.success && subscribeStatus.referralCode && (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-green-50 border border-green-200 rounded-full max-w-xl">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800 font-medium">
                  You're subscribed! Check your email.
                </span>
              </div>
            )}

            {subscribeStatus.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-xl">
                <p className="text-red-800 text-sm">{subscribeStatus.error}</p>
              </div>
            )}

            {isAuthenticated && (
              <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-full max-w-xl">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-800 font-medium">
                  Subscribed as {user?.email}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-16">
          <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3">
            This week's picks
          </h3>
          <p className="text-lg text-gray-600">
            Top 5 articles from 50+ sources, scored by relevance and depth
          </p>
        </div>

        <div className="lg:ml-12">
          <NewsletterList />
        </div>

        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
              Never miss an issue
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the week's best DevOps and System Design articles delivered to your inbox every Sunday.
            </p>
            {!isAuthenticated && !subscribeStatus.success && (
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 border border-gray-300 rounded-full text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <button
                  onClick={handleSubscribe}
                  className="px-8 py-3.5 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};