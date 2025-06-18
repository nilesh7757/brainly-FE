import { useState, useEffect } from 'react';
import { ExternalLink, Tag, Brain, Share2, Calendar, User, Globe, Copy, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { REACT_APP_API_URL } from '../config';

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
  createdAt?: string;
}

interface Params {
  shareId: string;
}

// Replace with your actual hook for getting params
const useParams = (): Params => {
  // Implement your routing logic here
  return { shareId: '' };
};

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const SharePage: React.FC = () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [content, setContent] = useState<Content[]>([]);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/api/v1/brain/${shareId}`);
        setUsername(res.data.username);
        setContent(res.data.content);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Invalid or expired share link.');
        setLoading(false);
      }
    };

    fetchData();
  }, [shareId]);

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      article: 'bg-blue-100 text-blue-800 border-blue-200',
      tutorial: 'bg-purple-100 text-purple-800 border-purple-200',
      documentation: 'bg-green-100 text-green-800 border-green-200',
      resource: 'bg-orange-100 text-orange-800 border-orange-200',
      video: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'article':
        return '📄';
      case 'tutorial':
        return '🎯';
      case 'documentation':
        return '📚';
      case 'resource':
        return '🔗';
      case 'video':
        return '🎥';
      default:
        return '📝';
    }
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const getUniqueTags = (): string[] => {
    const allTags = content.flatMap((item) => item.tags);
    return [...new Set(allTags)];
  };

  const getTypeStats = (): Record<string, number> => {
    return content.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex mb-6">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading shared content...</h2>
          <p className="text-gray-500">This might take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {username}'s Knowledge Hub
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Share2 size={16} className="mr-2" />
                  Shared collection • {content.length} items
                </p>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              <span className="font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {content.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Brain className="text-gray-400" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Content Shared</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              This collection is empty. The owner hasn't shared any content yet.
            </p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="text-3xl font-bold text-indigo-600">{content.length}</div>
                <div className="text-gray-600 font-medium flex items-center mt-1">
                  <Globe size={16} className="mr-2" />
                  Total Items
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="text-3xl font-bold text-purple-600">{getUniqueTags().length}</div>
                <div className="text-gray-600 font-medium flex items-center mt-1">
                  <Tag size={16} className="mr-2" />
                  Unique Tags
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="text-3xl font-bold text-blue-600">{Object.keys(getTypeStats()).length}</div>
                <div className="text-gray-600 font-medium flex items-center mt-1">
                  <User size={16} className="mr-2" />
                  Content Types
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Shared Collection</h2>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {content.length} items
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {content.map((item) => (
                  <div
                    key={item._id}
                    className="group bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-white/90"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(item.type)}`}>
                        <span className="mr-1">{getTypeIcon(item.type)}</span>
                        {item.type}
                      </div>
                      <button
                        onClick={() => window.open(item.link, '_blank')}
                        className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <ExternalLink size={16} />
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {item.title}
                    </h3>

                    {/* Link */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:text-indigo-600 text-sm font-medium transition-colors mb-4 block truncate bg-indigo-50 px-3 py-2 rounded-lg"
                    >
                      🔗 {item.link}
                    </a>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs rounded-full font-medium"
                        >
                          <Tag size={10} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 4 && (
                        <span className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                          +{item.tags.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                      {item.createdAt && (
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      )}
                      <button
                        onClick={() => window.open(item.link, '_blank')}
                        className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors flex items-center space-x-1"
                      >
                        <span>Open</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 text-center py-8 border-t border-gray-200">
              <p className="text-gray-500 mb-4">
                Powered by <span className="font-semibold text-indigo-600">Knowledge Hub</span>
              </p>
              <p className="text-sm text-gray-400">
                Create your own knowledge collection and share it with the world
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SharePage;