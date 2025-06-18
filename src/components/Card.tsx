import { useEffect, useRef, useState } from 'react';

// Mock Button component for demo
const Button = ({ 
  className = '', 
  title, 
  variant = 'primary', 
  size = 'md', 
  onClick 
}: {
  className?: string;
  title: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}) => {
  const baseClasses = "font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {title}
    </button>
  );
};

// TypeScript declarations for Twitter widget
declare global {
  interface Window {
    twttr?: {
      widgets: {
        createTweet: (tweetId: string, element: HTMLElement, options?: any) => Promise<any>;
      };
    };
  }
}

interface CardProps {
  type: "YOUTUBE" | "TWITTER" | "DOCUMENT";
  title: string;
  link: string;
  date: Date;
  tags: string[];
  onClick?: () => void;
  className?: string;
}

const Card = ({
  type,
  title,
  link,
  date,
  tags,
  onClick,
  className = '',
}: CardProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);
  const [twitterLoaded, setTwitterLoaded] = useState(false);

  const extractYouTubeVideoId = (url: string) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?[^#]*v=([^&\s]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&\s]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&\s]+)/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?[^#]*v=([^&\s]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([^?&\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }

    return null;
  };

  const extractTweetId = (url: string) => {
    const patterns = [
      /(?:twitter\.com\/\w+\/status\/)(\d+)/,
      /(?:x\.com\/\w+\/status\/)(\d+)/,
      /status\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  useEffect(() => {
    if (type === 'TWITTER' && !window.twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.onload = () => setTwitterLoaded(true);
      document.head.appendChild(script);
    } else if (window.twttr) {
      setTwitterLoaded(true);
    }
  }, [type]);

  useEffect(() => {
    if (type === 'TWITTER' && twitterLoaded && tweetRef.current) {
      const tweetId = extractTweetId(link);
      if (tweetId && window.twttr) {
        tweetRef.current.innerHTML = '';
        window.twttr.widgets.createTweet(tweetId, tweetRef.current, {
          theme: 'light',
          width: 'auto',
          align: 'center'
        }).catch((error: any) => {
          console.error('Error loading tweet:', error);
          if (tweetRef.current) {
            tweetRef.current.innerHTML = `
              <div class="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p class="text-sm text-red-600 font-medium mb-2">Failed to load tweet</p>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline text-sm transition-colors">
                  View on Twitter/X →
                </a>
              </div>
            `;
          }
        });
      }
    }
  }, [type, link, twitterLoaded]);

  const getTypeIcon = () => {
    switch (type) {
      case 'YOUTUBE':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        );
      case 'TWITTER':
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
            </svg>
          </div>
        );
    }
  };

  const renderContent = () => {
    if (type === 'YOUTUBE') {
      const videoId = extractYouTubeVideoId(link);

      if (videoId) {
        const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`;

        return (
          <div className="relative overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-black/5 h-full">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={title || "YouTube video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              frameBorder="0"
            />
          </div>
        );
      } else {
        return (
          <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-2xl h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-700 font-medium">Invalid YouTube link</p>
            </div>
            <p className="text-sm text-red-600 mb-3 break-all bg-white/50 p-2 rounded-lg">{link}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
            >
              Try opening on YouTube
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        );
      }
    }

    if (type === 'TWITTER') {
      const tweetId = extractTweetId(link);
      if (!tweetId) {
        return (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-blue-700 font-medium">Invalid Twitter/X link</p>
            </div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors break-all"
            >
              {link}
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        );
      }

      return (
        <div className="relative h-full">
          <div ref={tweetRef} className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 flex items-center justify-center">
            {!twitterLoaded && (
              <div className="flex items-center gap-3 text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm font-medium">Loading tweet...</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Document and Upload preview functionality (treat them the same)
    if (type === 'DOCUMENT') {
      const getDocumentPreview = () => {
        const url = link.toLowerCase();
        
        // Check if it's a PDF
        if (url.includes('.pdf') || url.includes('pdf')) {
          return (
            <div className="relative h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"></div>
              <iframe
                src={`${link}#page=1`}
                className="w-full h-full"
                title="Document Preview"
                loading="lazy"
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-600 font-medium shadow-sm">
                Page 1
              </div>
            </div>
          );
        }
        
        // Check if it's an image
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
        const isImage = imageExtensions.some(ext => url.includes(ext));
        
        if (isImage) {
          return (
            <div className="relative h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <img
                src={link}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback to document icon if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `
                    <div class="h-full flex flex-col justify-center items-center p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                      <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-3-3v6m5 1V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h6" />
                        </svg>
                      </div>
                      <p class="text-gray-600 text-sm text-center">Image preview unavailable</p>
                    </div>
                  `;
                }}
              />
              <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-600 font-medium shadow-sm">
                Image
              </div>
            </div>
          );
        }
        
        // Check if it's a Google Doc, Sheet, or Slide
        if (url.includes('docs.google.com') || url.includes('drive.google.com')) {
          const docId = extractGoogleDocId(link);
          if (docId) {
            return (
              <div className="relative h-full bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <iframe
                  src={`https://docs.google.com/document/d/${docId}/preview`}
                  className="w-full h-full"
                  title="Google Doc Preview"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-600 font-medium shadow-sm">
                  Google Doc
                </div>
              </div>
            );
          }
        }
        
        // Default document view
        return (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-gray-200 shadow-sm h-full flex flex-col justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
            <div className="relative p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m5 1V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h6" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-2 text-gray-800 hover:text-indigo-600 font-medium text-sm transition-colors"
                  >
                    <span className="break-all leading-relaxed">{title}</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 flex-shrink-0 mt-0.5 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      };

      return getDocumentPreview();
    }

    return null;
  };

  // Helper function to extract Google Doc ID
  const extractGoogleDocId = (url: string) => {
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /\/document\/d\/([a-zA-Z0-9-_]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) return match[1];
    }
    return null;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div
      className={`
        group relative bg-white border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl 
        transition-all duration-500 ease-out transform hover:-translate-y-1
        w-full max-w-md backdrop-blur-sm overflow-hidden h-[500px] flex flex-col
        ${className}
      `}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-gray-50/30 pointer-events-none"></div>
      
      <div className="relative p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {getTypeIcon()}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 line-clamp-2">
                {title}
              </h3>
              {date && (
                <time className="text-sm text-gray-500 font-medium">
                  {formatDate(date)}
                </time>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 flex-1 min-h-0">
          <div className="h-full">
            {renderContent()}
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 flex-shrink-0">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold 
                           bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border border-blue-200/50
                           hover:from-blue-200 hover:to-indigo-200 hover:border-blue-300 
                           transition-all duration-200 cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center pt-2 flex-shrink-0">
          <Button 
            className="rounded-xl px-6 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
            title="Delete" 
            variant="primary" 
            size="md" 
            onClick={onClick} 
          />
        </div>
      </div>
    </div>
  );
};

export default Card;