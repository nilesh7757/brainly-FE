import { useRef, useState } from 'react';
import Input from './Input';
import axios from 'axios';
import { X, Plus, Youtube, Twitter, FileText, Tag } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

type ContentType = 'YOUTUBE' | 'TWITTER' | 'DOCUMENT';

const CreateContent = ({
  open,
  onClose,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  refetch: () => Promise<void>;
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<ContentType>('YOUTUBE');
  const [isLoading, setIsLoading] = useState(false);

  const contentTypes: { value: ContentType; label: string; icon: any; gradient: string }[] = [
    { 
      value: 'YOUTUBE', 
      label: 'YouTube', 
      icon: Youtube,
      gradient: 'from-red-500 to-red-600'
    },
    { 
      value: 'TWITTER', 
      label: 'Twitter', 
      icon: Twitter,
      gradient: 'from-blue-500 to-blue-600'
    },
    { 
      value: 'DOCUMENT', 
      label: 'Document', 
      icon: FileText,
      gradient: 'from-green-500 to-green-600'
    },
  ];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const title = titleRef.current?.value;
    const link = linkRef.current?.value;

    if (title && link) {
      setIsLoading(true);
      try {
        console.log('API URL being used:', import.meta.env.VITE_API_URL);
        console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
        
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/content`,
          {
            type: selectedType,
            title,
            link,
            tags,
          },
          {
            headers: {
              Authorization: localStorage.getItem('token') || '',
            },
          }
        );
        
        console.log('Response:', response.data);
        toast("Content created successfully!");
        setTags([]);
        setTagInput('');
        if (titleRef.current) titleRef.current.value = '';
        if (linkRef.current) linkRef.current.value = '';
        await refetch();
        onClose();
      } catch (error: any) {
        console.error('Failed to submit content:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          config: error.config
        });
        alert(`Failed to create content: ${error.response?.data?.message || error.message}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please fill in both the title and link fields.");
    }
  };

  if (!open) return null;

  return (
    <div>
      <ToastContainer />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
        <div className="relative w-full max-w-lg bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
          
          {/* Header */}
          <div className="relative p-8 pb-6">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Create Content</h2>
                <p className="text-gray-600 text-sm">Add new content to your collection</p>
              </div>
            </div>

            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Content Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {contentTypes.map((type) => {
                  const IconComponent = type.icon;
                  const isSelected = selectedType === type.value;
                  
                  return (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={`relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        isSelected
                          ? `bg-gradient-to-br ${type.gradient} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-150 border-2 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <IconComponent className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                      <span className="text-sm font-medium block">{type.label}</span>
                      {isSelected && (
                        <div className="absolute inset-0 rounded-2xl ring-4 ring-white/30"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <Input reference={titleRef} placeholder="Enter content title" />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Link</label>
                <Input
                  reference={linkRef}
                  placeholder={
                    selectedType === 'YOUTUBE'
                      ? 'https://youtube.com/watch?v=...'
                      : selectedType === 'TWITTER'
                      ? 'https://twitter.com/...'
                      : 'Document URL or file path'
                  }
                />
              </div>

              {/* Tag Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  Tags
                </label>
                <div className="min-h-[52px] flex flex-wrap items-center gap-2 border border-gray-200 rounded-xl px-4 py-3 bg-white/50 backdrop-blur-sm focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-200">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm animate-in slide-in-from-left duration-200"
                    >
                      {tag}
                      <button 
                        onClick={() => removeTag(index)} 
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    className="flex-1 min-w-[120px] border-none focus:outline-none text-sm bg-transparent placeholder-gray-500"
                    placeholder={tags.length === 0 ? "Enter tags and press Enter" : "Add more tags..."}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  'Create Content'
                )}
              </button>
              <button
                onClick={onClose}
                className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateContent;