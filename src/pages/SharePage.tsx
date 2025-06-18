import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Tag, Brain, Share2, Calendar, User, Globe, Copy, CheckCircle, Youtube, Twitter, FileText, Filter, X } from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
  createdAt?: string;
}

type ContentType = 'YOUTUBE' | 'TWITTER' | 'DOCUMENT' | 'ALL';

// const REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

const SharePage: React.FC = () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [content, setContent] = useState<Content[]>([]);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<ContentType>('ALL');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/brain/${shareId}`);
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

  // Get all unique tags from content
  const allTags = useMemo(() => {
    const tags = content?.flatMap(item => item.tags || []) || [];
    return [...new Set(tags)].sort();
  }, [content]);

  // Content type configuration for filters
  const contentTypes: { value: ContentType; label: string; icon: any; gradient: string; count: number }[] = [
    { 
      value: 'ALL', 
      label: 'All', 
      icon: Filter,
      gradient: 'from-gray-500 to-gray-600',
      count: content?.length || 0
    },
    { 
      value: 'YOUTUBE', 
      label: 'YouTube', 
      icon: Youtube,
      gradient: 'from-red-500 to-red-600',
      count: content?.filter(item => item.type === 'YOUTUBE').length || 0
    },
    { 
      value: 'TWITTER', 
      label: 'Twitter', 
      icon: Twitter,
      gradient: 'from-blue-500 to-blue-600',
      count: content?.filter(item => item.type === 'TWITTER').length || 0
    },
    { 
      value: 'DOCUMENT', 
      label: 'Document', 
      icon: FileText,
      gradient: 'from-green-500 to-green-600',
      count: content?.filter(item => item.type === 'DOCUMENT').length || 0
    },
  ];

  // Filter content based on selected filter and tags
  const filteredContent = useMemo(() => {
    let filtered = content || [];

    // Filter by content type
    if (selectedFilter !== 'ALL') {
      filtered = filtered.filter(item => item.type === selectedFilter);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(item => 
        selectedTags.every(tag => item.tags?.includes(tag))
      );
    }

    return filtered;
  }, [content, selectedFilter, selectedTags]);

  // Add tag to filter
  const addTagFilter = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Remove tag from filter
  const removeTagFilter = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Clear all tag filters
  const clearTagFilters = () => {
    setSelectedTags([]);
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
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                {username}'s Knowledge Hub
              </h1>
              <p className="text-gray-600 text-lg flex items-center">
                <Share2 size={20} className="mr-2" />
                Shared collection • {content.length} items
              </p>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Shared Collection</h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {filteredContent.length} of {content.length} items
              </div>
            </div>

            {/* Tags Overview Section */}
            {allTags.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Collection Tags</h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {allTags.length} tags
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {allTags.map((tag) => {
                    const tagCount = content?.filter(item => item.tags?.includes(tag)).length || 0;
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <span className="bg-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">
                          {tagCount}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Section */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg space-y-6">
              {/* Content Type Filters */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Filter by type:</span>
                  {contentTypes.map((type) => {
                    const IconComponent = type.icon;
                    const isSelected = selectedFilter === type.value;
                    
                    return (
                      <button
                        key={type.value}
                        onClick={() => setSelectedFilter(type.value)}
                        className={`relative px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                          isSelected
                            ? `bg-gradient-to-r ${type.gradient} text-white shadow-lg`
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent hover:border-gray-300'
                        }`}
                      >
                        <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        <span className="text-sm font-medium">{type.label}</span>
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl ring-2 ring-white/30"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tag Filters */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-sm font-semibold text-gray-700 mr-2">Filter by tags:</span>
                  {selectedTags.length > 0 && (
                    <button
                      onClick={clearTagFilters}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {/* Selected Tags */}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button 
                          onClick={() => removeTagFilter(tag)} 
                          className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Available Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  {allTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    const tagCount = content?.filter(item => item.tags?.includes(tag)).length || 0;
                    
                    return (
                      <button
                        key={tag}
                        onClick={() => isSelected ? removeTagFilter(tag) : addTagFilter(tag)}
                        className={`relative px-3 py-1 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center gap-1 text-sm font-medium ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                        }`}
                      >
                        <Tag className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                        {tag}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          isSelected 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {tagCount}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map(({ _id, type, link, title, tags, createdAt }) => {
                const parsedDate = createdAt ? new Date(createdAt) : new Date();
                const contentDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                return (
                  <div 
                    key={_id} 
                    className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                  >
                    <Card
                      title={title}
                      link={link}
                      type={type as 'YOUTUBE' | 'TWITTER' | 'DOCUMENT'}
                      tags={tags}
                      date={contentDate}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/90"
                    />
                  </div>
                );
              })}
            </div>

            {/* No results for filter */}
            {filteredContent.length === 0 && content.length > 0 && (
              <div className="text-center py-16">
                <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Filter className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-gray-700 font-medium mb-4">
                    No content found
                    {selectedFilter !== 'ALL' && ` for ${selectedFilter.toLowerCase()}`}
                    {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    Try adjusting your filters
                  </p>
                  <button
                    onClick={() => {
                      setSelectedFilter('ALL');
                      setSelectedTags([]);
                    }}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 text-center py-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">
            Powered by <span className="font-semibold text-indigo-600">Knowledge Hub</span>
          </p>
          <p className="text-sm text-gray-400">
            Create your own knowledge collection and share it with the world
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharePage;