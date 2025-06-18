import { useEffect, useRef, useState } from 'react';
import Button from './Button';

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
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([^?&\s]+)/, // Added pattern for live URLs
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
              <div class="p-4 bg-red-50 rounded-xl">
                <p class="text-sm text-red-600">Failed to load tweet</p>
                <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline text-xs">
                  View on Twitter/X
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
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        );
      case 'TWITTER':
        return (
          <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
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
          <div className="relative overflow-hidden rounded-xl bg-black mt-3">
            <iframe
              className="w-full aspect-video"
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
          <div className="p-4 bg-red-50 rounded-xl mt-3">
            <p className="text-sm text-red-600 mb-1">Invalid YouTube link</p>
            <p className="text-xs text-gray-600 mb-2 break-all">{link}</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              Try opening on YouTube
            </a>
          </div>
        );
      }
    }

    if (type === 'TWITTER') {
      const tweetId = extractTweetId(link);
      if (!tweetId) {
        return (
          <div className="p-4 bg-red-50 rounded-xl mt-3">
            <p className="text-sm text-red-600 mb-2">Invalid Twitter/X link</p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-xs"
            >
              {link}
            </a>
          </div>
        );
      }

      return (
        <div className="mt-3">
          <div ref={tweetRef} className="w-full min-h-[100px] bg-gray-50 rounded-xl p-4 flex items-center justify-center">
            {!twitterLoaded && (
              <div className="text-gray-500 text-sm">Loading tweet...</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl mt-3">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium text-sm break-all transition-colors"
        >
          {title}
        </a>
      </div>
    );
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
        bg-white border border-gray-200 rounded-2xl p-4 shadow-lg hover:shadow-xl 
        transition-all duration-300 cursor-pointer transform hover:scale-105
        w-full max-w-sm backdrop-blur-sm
        ${className}
      `}
      // onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          {getTypeIcon()}
          <h3 className="font-medium text-gray-900 text-sm truncate">{title}</h3>
        </div>
        {date && (
          <span className="text-xs text-gray-500 flex-shrink-0">
            {formatDate(date)}
          </span>
        )}
      </div>

      <div className="mb-3">{renderContent()}</div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                         bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800
                         hover:from-blue-200 hover:to-purple-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className='flex justify-center'>
        <Button className='rounded-md py-2 px-4' title="delete" variant='primary' size='md' onClick={onClick} />
      </div>
    </div>
  );
};

export default Card;
