// src/components/NewsletterList.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsletterAPI } from '../services/api';
import { ArticleCard } from './ArticleCard';
import { LoadingSpinner } from './LoadingSpinner';

// Constants
const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  RETRY_COUNT: 1,
} as const;

export const NewsletterList: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['latestNewsletter'],
    queryFn: async () => {
      const response = await newsletterAPI.getLatest();
      return response.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME,
    retry: QUERY_CONFIG.RETRY_COUNT,
    refetchOnWindowFocus: false
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner text="Loading newsletter..." />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred. Please try again later.';
      
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center" role="alert">
        <p className="text-red-800 font-semibold mb-2">Failed to load newsletter</p>
        <p className="text-sm text-red-700">{errorMessage}</p>
      </div>
    );
  }

  const articles = data?.articles || [];

  if (!articles.length) {
    return (
      <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-2xl">
        <svg 
          className="w-16 h-16 mx-auto mb-4 text-gray-300" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" 
          />
        </svg>
        <p className="text-lg text-gray-600 mb-2">No articles available yet</p>
        <p className="text-sm text-gray-500">Check back soon for curated content</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {articles.map((article, index) => (
        <ArticleCard 
          key={article.url || article.url || `article-${index}`} 
          article={article}
          index={index}
        />
      ))}
    </div>
  );
};