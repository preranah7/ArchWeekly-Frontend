//src/pages/NewsletterArchive.tsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '../components/Layout';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { newsletterAPI } from '../services/api';
import { ArticleCard } from '../components/ArticleCard';

const NewsletterArchive: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['newsletterArchive', page],
    queryFn: async () => {
      const response = await newsletterAPI.getArchive(page);
      return response.data;
    },
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-orange-50/30 to-white">
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              Newsletter Archive
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
              Browse past curated articles from top engineering teams
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner text="Loading archive..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-800 font-semibold mb-2">Failed to load archive</p>
            <p className="text-sm text-red-700">
              {(error as any).message || 'Please try again later'}
            </p>
          </div>
        )}

        {/* Articles List */}
        {!isLoading && !error && data?.articles && (
          <>
            {data.articles.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 border border-gray-200 rounded-2xl">
                <p className="text-lg text-gray-600 mb-2">No archived newsletters yet</p>
                <p className="text-sm text-gray-500">Check back later for past issues</p>
              </div>
            ) : (
              <>
                {/* Articles with numbering */}
                <div className="lg:ml-12 space-y-0 mb-12">
                  {data.articles.map((article: any, index: number) => (
                    <ArticleCard 
                      key={article.url || index} 
                      article={article}
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {data.pagination && data.pagination.pages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 pt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {data.pagination.pages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(data.pagination.pages, p + 1))}
                      disabled={page === data.pagination.pages}
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

export default NewsletterArchive;