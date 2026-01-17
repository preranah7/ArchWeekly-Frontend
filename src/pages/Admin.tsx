//src/pages/Admin.tsx
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { subscriberAPI, newsletterAPI } from '../services/api';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Subscriber {
  email: string;
  isActive: boolean;
  referralCode: string;
  subscribedAt: string;
}

const Admin: React.FC = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();
  const [testEmail, setTestEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Cleanup status message after timeout
  useEffect(() => {
    if (statusMessage.type) {
      const timeoutId = setTimeout(() => {
        setStatusMessage({ type: null, message: '' });
      }, 5000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [statusMessage.type]);

  const getAuthHeaders = () => {
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const { data: subscribersData, isLoading: subscribersLoading } = useQuery({
    queryKey: ['subscribers'],
    queryFn: async () => {
      const response = await subscriberAPI.getAll(1, 100);
      return response.data;
    },
  });

  const { data: countData } = useQuery({
    queryKey: ['subscriberCount'],
    queryFn: async () => {
      const response = await subscriberAPI.getCount();
      return response.data;
    },
  });

  const { data: systemDesignStats } = useQuery({
    queryKey: ['systemDesignStats'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/system-design/stats`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    },
    enabled: !!token,
    retry: 1,
  });

  const sendTestMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await newsletterAPI.sendTest(email || undefined);
      return response.data;
    },
    onSuccess: () => {
      setStatusMessage({
        type: 'success',
        message: 'Test email sent successfully!',
      });
      setTestEmail('');
    },
    onError: (error: any) => {
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send test email',
      });
    },
  });

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const response = await newsletterAPI.sendToAll();
      return response.data;
    },
    onSuccess: (data) => {
      setStatusMessage({
        type: 'success',
        message: `Newsletter sent to ${data.stats.sent}/${data.stats.total} subscribers!`,
      });
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
    onError: (error: any) => {
      setStatusMessage({
        type: 'error',
        message: error.response?.data?.error || 'Failed to send newsletter',
      });
    },
  });

  const triggerWorkflowMutation = useMutation({
    mutationFn: async () => {
      const response = await newsletterAPI.triggerWorkflow();
      return response.data;
    },
    onSuccess: (data) => {
      setStatusMessage({
        type: 'success',
        message: `Workflow complete! Sent to ${data.stats?.sent || 0}/${data.stats?.total || 0} subscribers.`,
      });
      queryClient.invalidateQueries({ queryKey: ['latestNewsletter'] });
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
    onError: (error: any) => {
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        setStatusMessage({
          type: 'success',
          message: 'Workflow is running in the background. Check your email in 2-3 minutes!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          message: error.response?.data?.error || 'Failed to trigger workflow',
        });
      }
    },
  });

  const triggerSystemDesignMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await axios.post(
        `${API_URL}/admin/trigger-system-design-update`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 200000,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setStatusMessage({
        type: 'success',
        message: `\u2705 System Design update completed! Successfully processed ${data.total || 0} resources.`,
      });
      queryClient.invalidateQueries({ queryKey: ['systemDesignStats'] });
      queryClient.invalidateQueries({ queryKey: ['systemDesignResources'] });
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.error || error.message || 'Failed to update System Design resources';
      setStatusMessage({
        type: 'error',
        message: `\u274C ${errorMsg}`,
      });
    },
  });

  const handleSendTest = (e: React.FormEvent) => {
    e.preventDefault();
    sendTestMutation.mutate(testEmail);
  };

  const handleBroadcast = () => {
    if (window.confirm('Send newsletter to ALL subscribers?')) {
      broadcastMutation.mutate();
    }
  };

  const handleTriggerWorkflow = () => {
    if (window.confirm('Trigger complete workflow (scrape + score + send)?')) {
      triggerWorkflowMutation.mutate();
    }
  };

  const handleTriggerSystemDesign = () => {
    if (window.confirm('Trigger System Design update (scrape GitHub + YouTube + Blogs)?')) {
      triggerSystemDesignMutation.mutate();
    }
  };

  return (
    <Layout>
      <main className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
            Admin Panel
          </h1>
          <p className="text-lg text-gray-600">
            Manage newsletters, subscribers, and system design resources
          </p>
        </div>

        {statusMessage.type && (
          <div
            className={`mb-8 p-5 rounded-xl border-2 ${
              statusMessage.type === 'success'
                ? 'bg-green-50 border-green-300 text-green-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <p className="text-sm font-medium">{statusMessage.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-sm text-gray-600 mb-2">Total Subscribers</p>
            <p className="text-4xl font-serif text-gray-900">{countData?.totalSubscribers || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-2xl p-8">
            <p className="text-sm text-orange-900 mb-2">Active</p>
            <p className="text-4xl font-serif text-orange-600">{countData?.activeSubscribers || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <p className="text-sm text-gray-600 mb-2">Verified Users</p>
            <p className="text-4xl font-serif text-gray-900">{countData?.verifiedUsers || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-8">
            <p className="text-sm text-blue-900 mb-2">SD Resources</p>
            <p className="text-4xl font-serif text-blue-600">{systemDesignStats?.total || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-3">Send Test Email</h2>
            <p className="text-sm text-gray-600 mb-6">
              Send a test newsletter to your email to preview.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="your@email.com (optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
              <button
                onClick={handleSendTest}
                disabled={sendTestMutation.isPending}
                className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {sendTestMutation.isPending ? 'Sending...' : 'Send Test'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-3">Broadcast Newsletter</h2>
            <p className="text-sm text-gray-600 mb-6">
              Send the latest newsletter to all active subscribers.
            </p>
            <button
              onClick={handleBroadcast}
              disabled={broadcastMutation.isPending}
              className="w-full px-4 py-3 bg-orange-600 text-white font-medium rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {broadcastMutation.isPending ? 'Sending...' : `Send to ${countData?.activeSubscribers || 0} subscribers`}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-3">📧 Newsletter Workflow</h2>
            <p className="text-sm text-gray-600 mb-6">
              Scrape articles → AI scoring → Save to DB → Send to subscribers.
              Takes ~2-3 minutes.
            </p>
            <button
              onClick={handleTriggerWorkflow}
              disabled={triggerWorkflowMutation.isPending}
              className="w-full px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {triggerWorkflowMutation.isPending ? 'Running (2-3 mins)...' : 'Trigger Newsletter Workflow'}
            </button>

            {triggerWorkflowMutation.isPending && (
              <p className="text-xs text-gray-600 mt-4">
                ⏳ Please wait...
                <br />
                <span className="text-xs">Scraping → AI Scoring → Saving → Sending</span>
              </p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8">
            <h2 className="text-2xl font-serif text-gray-900 mb-3">🎓 System Design Update</h2>
            <p className="text-sm text-gray-600 mb-6">
              Scrape GitHub, YouTube, Blogs → AI scoring → Save to DB.
              Takes ~2-3 minutes to complete.
            </p>
            <button
              onClick={handleTriggerSystemDesign}
              disabled={triggerSystemDesignMutation.isPending}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
            >
              {triggerSystemDesignMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing (2-3 mins)...</span>
                </>
              ) : (
                'Update System Design Resources'
              )}
            </button>

            {triggerSystemDesignMutation.isPending && (
              <div className="mt-5 p-4 bg-white/50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900 mb-2">Update in progress...</p>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Scraping GitHub repositories → Fetching YouTube videos → Crawling engineering blogs → AI scoring with Gemini → Saving to database
                    </p>
                    <p className="text-xs text-blue-600 mt-2 italic">
                      Please keep this page open until complete.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-serif text-gray-900 mb-6">Recent Subscribers</h2>
          {subscribersLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 text-gray-900 font-semibold">Email</th>
                    <th className="text-left py-3 px-2 text-gray-900 font-semibold">Status</th>
                    <th className="text-left py-3 px-2 text-gray-900 font-semibold">Referral Code</th>
                    <th className="text-left py-3 px-2 text-gray-900 font-semibold">Subscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersData?.subscribers?.slice(0, 10).map((subscriber: Subscriber) => (
                    <tr key={subscriber.email} className="border-b border-gray-100">
                      <td className="py-3 px-2 text-gray-800">{subscriber.email}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            subscriber.isActive
                              ? 'bg-green-50 text-green-700 border border-green-200'
                              : 'bg-gray-100 text-gray-600 border border-gray-200'
                          }`}
                        >
                          {subscriber.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-gray-600 font-mono text-xs">
                        {subscriber.referralCode}
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {new Date(subscriber.subscribedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default Admin;