//src/pages/SystemDesign.tsx
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface SystemDesignResource {
  _id: string;
  title: string;
  url: string;
  description: string;
  source: string;
  type: string;
  category: string;
  difficulty: string;
  score: number;
  reasoning: string;
  topics: string[];
  keyLearnings?: string[];
  estimatedTime?: number;
  hasVisuals: boolean;
  rank?: number;
}

const SystemDesign: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['systemDesignResources', selectedCategory, selectedDifficulty],
    queryFn: async () => {
      let url = `${API_URL}/system-design`;
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      
      if (params.toString()) url += `?${params.toString()}`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    enabled: isAuthenticated,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 3;
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/system-design' } });
      return;
    }

    if (error && (error as any)?.response?.status === 401) {
      navigate('/login', { state: { from: '/system-design' } });
    }
  }, [isAuthenticated, error, navigate]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedDifficulty]);

  if (!isAuthenticated) {
    return null;
  }

  const categories = [
    { value: 'all', label: 'All Categories', emoji: '🌍' },
    { value: 'Fundamentals', label: 'Fundamentals', emoji: '📚' },
    { value: 'Intermediate', label: 'Intermediate', emoji: '⚙️' },
    { value: 'Advanced', label: 'Advanced', emoji: '🚀' },
    { value: 'Case Studies', label: 'Case Studies', emoji: '🏢' },
    { value: 'Interview Problems', label: 'Interview Problems', emoji: '💼' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'Advanced':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const resources = data?.resources || [];
  const totalPages = Math.ceil(resources.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResources = resources.slice(startIndex, endIndex);

  return (
    <Layout>
      <section className="border-b border-gray-200 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-5xl mx-auto px-6 py-10 md:py-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-3 leading-tight">
              System Design Resources
            </h1>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              Curated from GitHub, engineering blogs, and expert engineers
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  <span className="mr-1.5">{cat.emoji}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Difficulty Level</label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setSelectedDifficulty(diff.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedDifficulty === diff.value
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400 hover:shadow-sm'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner text="Loading resources..." />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-800 font-semibold mb-2">Failed to load resources</p>
            <p className="text-sm text-red-700">
              {(error as any).message || 'Please try again later'}
            </p>
          </div>
        )}

        {!isLoading && !error && resources && (
          <>
            <div className="mb-6">
              <p className="text-base text-gray-600">
                Showing <span className="font-semibold text-gray-900">{resources.length}</span> {resources.length === 1 ? 'resource' : 'resources'}
              </p>
            </div>

            {resources.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-lg text-gray-600 mb-2">No resources found</p>
                <p className="text-sm text-gray-500">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="lg:ml-12 space-y-0 mb-12 relative">
                  {currentResources.map((resource: SystemDesignResource, index: number) => {
                    const globalIndex = startIndex + index;
                    return (
                      <article
                        key={resource._id}
                        className="group relative border-b border-gray-200 pb-12 mb-12"
                      >
                        <div className="absolute -left-12 top-0 hidden lg:block">
                          <span className="text-2xl font-serif text-gray-300 font-light">
                            {String(globalIndex + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block"
                        >
                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className={`px-3 py-1.5 border rounded-full text-xs font-medium ${getDifficultyColor(resource.difficulty)}`}>
                              {resource.difficulty}
                            </span>
                            <span className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                              {resource.category}
                            </span>
                            {resource.hasVisuals && (
                              <span className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700">
                                📊 Visual
                              </span>
                            )}
                            {resource.estimatedTime && (
                              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full">
                                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-xs font-medium text-gray-700">{resource.estimatedTime} min</span>
                              </div>
                            )}
                          </div>

                          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors duration-200">
                            {resource.title}
                          </h2>

                          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
                            {resource.description}
                          </p>

                          {resource.keyLearnings && resource.keyLearnings.length > 0 && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                              <p className="text-sm font-semibold text-gray-900 mb-3">Key Learnings:</p>
                              <ul className="space-y-2">
                                {resource.keyLearnings.map((learning, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                    <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{learning}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {resource.topics && resource.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {resource.topics.map((topic, i) => (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span className="text-sm font-medium text-gray-700">{resource.source}</span>
                            </div>

                            <span className="text-sm font-medium text-orange-600 group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                              Learn more
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </a>
                      </article>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </Layout>
  );
};

export default SystemDesign;