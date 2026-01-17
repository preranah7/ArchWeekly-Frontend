// src/components/ArticleCard.tsx
import React, { useState } from 'react';
import type { Article, NewsletterArticle } from '../types';

interface ArticleCardProps {
  article: Article | NewsletterArticle;
  index?: number;
}

// Format date helper
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Estimate reading time based on description length
const estimateReadingTime = (description?: string): number => {
  if (!description) return 5;
  const words = description.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Get author badge based on source
const getAuthorBadge = (source: string): { name: string; verified: boolean } => {
  const verifiedSources = ['Netflix', 'Meta', 'Google', 'Amazon', 'Microsoft', 'Stripe', 'Airbnb', 'Uber'];
  const isVerified = verifiedSources.some(s => source.toLowerCase().includes(s.toLowerCase()));
  return { name: source, verified: isVerified };
};

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullArticle = article as Article;
  const hasFullData = 'upvotes' in article && '_id' in article;
  
  const readingTime = estimateReadingTime(article.description || article.reasoning);
  const authorBadge = getAuthorBadge(article.source);

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = encodeURIComponent(article.url);
    const text = encodeURIComponent(article.title);
    
    try {
      switch (platform) {
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
          break;
        case 'copy':
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(article.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = article.url;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
          break;
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error('Share operation failed:', error);
      // Silently fail - user can try again
    }
  };

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <article className="group relative">
      {/* Rank number - subtle */}
      {typeof index === 'number' && (
        <div className="absolute -left-12 top-0 hidden lg:block">
          <span className="text-2xl font-serif text-gray-300 font-light">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      )}

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block border-b border-gray-200 pb-12 mb-12"
      >
        {/* Category & Reading time */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          {article.category && (
            <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
              {article.category}
            </span>
          )}
          
          {article.category && <span className="text-gray-300" aria-hidden="true">·</span>}
          
          {/* Reading Time */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readingTime} min read</span>
          </div>

          {hasFullData && fullArticle.createdAt && (
            <>
              <span className="text-gray-300" aria-hidden="true">·</span>
              <time className="text-sm text-gray-500" dateTime={fullArticle.createdAt}>
                {formatDate(fullArticle.createdAt)}
              </time>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4 leading-tight group-hover:text-orange-600 transition-colors duration-200">
          {article.title}
        </h3>

        {/* Description */}
        {(article.description || article.reasoning) && (
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
            {article.description || article.reasoning}
          </p>
        )}

        {/* Footer - Source & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Source badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full">
              <div className="w-2 h-2 bg-orange-500 rounded-full" aria-hidden="true"></div>
              <span className="text-sm font-medium text-gray-700">{authorBadge.name}</span>
              {authorBadge.verified && (
                <svg 
                  className="w-4 h-4 text-blue-500" 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                  aria-label="Verified source"
                  role="img"
                >
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>

            {hasFullData && fullArticle.upvotes && (
              <span className="text-sm text-gray-500" aria-label={`${fullArticle.upvotes} upvotes`}>
                ▲ {fullArticle.upvotes}
              </span>
            )}
            {hasFullData && fullArticle.comments && (
              <span className="text-sm text-gray-500" aria-label={`${fullArticle.comments} comments`}>
                💬 {fullArticle.comments}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              onClick={toggleBookmark}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
              aria-pressed={isBookmarked}
            >
              <svg 
                className={`w-5 h-5 ${isBookmarked ? 'fill-orange-600 text-orange-600' : 'text-gray-400'}`}
                fill={isBookmarked ? 'currentColor' : 'none'} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>

            {/* Share */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowShareMenu(!showShareMenu);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Share article"
                aria-label="Share article"
                aria-expanded={showShareMenu}
                aria-haspopup="true"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <div 
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                  role="menu"
                  aria-label="Share options"
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare('twitter');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare('linkedin');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    role="menuitem"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare('copy');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    role="menuitem"
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </article>
  );
};