//src/pages/Subscribe.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { subscriberAPI } from '../services/api';
import { FaStripe, FaAmazon } from 'react-icons/fa';
import { SiNetflix, SiMeta } from 'react-icons/si';

export const Subscribe: React.FC = () => {
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
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-white">
      <main>
        <section className="border-b border-gray-200 bg-gradient-to-b from-orange-50/30 to-white">
          <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 text-center">
            <div className="mb-8 md:mb-12">
              <img 
                src="/images/newsletter-illustration.jpeg" 
                alt="Newsletter Illustration" 
                className="w-full max-w-md mx-auto rounded-2xl shadow-sm"
              />
            </div>

            <div className="mb-12 md:mb-16">
              <Link to="/newsletter" className="inline-block">
                <h1 className="text-3xl md:text-4xl font-serif text-gray-900 tracking-tight mb-2">
                  ArchWeekly
                </h1>
                <p className="text-sm text-gray-500">
                  DevOps & System Design
                </p>
              </Link>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-8 leading-tight">
              Weekly insights for engineers who build at scale
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
              Five hand-picked articles every Sunday. Curated from Netflix, Meta, Stripe, and 50+ top engineering teams.
            </p>

            {!subscribeStatus.success ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
                    placeholder="Enter your email"
                    disabled={subscribeStatus.loading}
                    className="flex-1 px-5 py-4 border border-gray-300 rounded-full text-base focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50"
                  />
                  <button
                    onClick={handleSubscribe}
                    disabled={subscribeStatus.loading}
                    className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {subscribeStatus.loading ? 'Subscribing...' : 'Subscribe free'}
                  </button>
                </div>
                
                {subscribeStatus.error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl max-w-xl mx-auto">
                    <p className="text-red-800 text-sm">{subscribeStatus.error}</p>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Join {formattedCount} engineers · Free · Unsubscribe anytime
                </p>
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                <div className="p-6 bg-green-50 border border-green-200 rounded-2xl mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-900 font-semibold text-lg">Successfully subscribed!</p>
                  </div>
                  <p className="text-sm text-green-800 mb-4">
                    Check your email for confirmation.
                  </p>
                  {subscribeStatus.referralCode && (
                    <div className="pt-4 border-t border-green-200">
                      <p className="text-xs text-gray-700 mb-2">Your referral code:</p>
                      <code className="px-3 py-1.5 bg-white border border-green-300 rounded-lg font-mono text-sm text-green-900">
                        {subscribeStatus.referralCode}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-8">
              <Link to="/newsletter" className="text-orange-600 hover:text-orange-700 font-medium">
                No thanks, take me to the latest issue →
              </Link>
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-16 text-center">
              Why engineers love ArchWeekly
            </h3>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">AI-Curated Quality</h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  Every article is scored for technical depth and relevance. Only the top 5 make the cut each week.
                </p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Save Time</h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  We scan 50+ sources so you don't have to. Get the week's best insights in just 5 minutes.
                </p>
              </div>

              <div className="text-center md:text-left">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-3 text-lg">Learn from the Best</h4>
                <p className="text-base text-gray-600 leading-relaxed">
                  Real engineering insights from teams at Netflix, Meta, Stripe, and other industry leaders.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-50 border-t border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6">
            <p className="text-sm text-gray-500 mb-8 text-center">Trusted by engineers at</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
              <div className="flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 48 48">
                  <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>

              <div className="flex items-center justify-center">
                <SiMeta className="w-12 h-12 text-[#0866FF]" />
              </div>

              <div className="flex items-center justify-center">
                <SiNetflix className="w-12 h-12 text-[#E50914]" />
              </div>

              <div className="flex items-center justify-center">
                <FaStripe className="w-12 h-12 text-[#635BFF]" />
              </div>

              <div className="flex items-center justify-center">
                <FaAmazon className="w-12 h-12 text-[#FF9900]" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-gray-500">
              © {currentYear} ArchWeekly · Made for engineers, by engineers
            </p>
            <div className="flex items-center gap-6">
              <Link 
                to="/newsletter" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                Newsletter
              </Link>
              <Link 
                to="/newsletters" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                Archive
              </Link>
              <Link 
                to="/unsubscribe" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                Unsubscribe
              </Link>
              <a 
                href="mailto:hello@archweekly.online" 
                className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Subscribe;