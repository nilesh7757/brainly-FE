import { useRef, useState } from 'react';
import Input from './Input';
import axios from 'axios';
type ContentType = 'YOUTUBE' | 'TWITTER' | 'DOCUMENT';
import { REACT_APP_API_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
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

  const contentTypes: { value: ContentType; label: string }[] = [
    { value: 'YOUTUBE', label: 'YouTube' },
    { value: 'TWITTER', label: 'Twitter' },
    { value: 'DOCUMENT', label: 'Document' },
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
      try {
        console.log('API URL being used:', REACT_APP_API_URL);
        console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing');
        
        const response = await axios.post(
          `${REACT_APP_API_URL}/api/v1/content`,
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
        await refetch(); // Refetch content after successful creation
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
      }
    } else {
      alert("Please fill in both the title and link fields.");
    }
  };

  return (
    <div>
      <ToastContainer />
      {open && (
        <div className="flex flex-col justify-center items-center gap-4 h-auto max-w-[90vw] rounded-md bg-white border border-red-500 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Create Content</h2>

          {/* Content Type Selection */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <div className="flex gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedType === type.value
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Fields */}
          <div className="w-full space-y-3">
            <Input reference={titleRef} placeholder="Title" />
            <Input
              reference={linkRef}
              placeholder={
                selectedType === 'YOUTUBE'
                  ? 'YouTube URL'
                  : selectedType === 'TWITTER'
                  ? 'Twitter URL'
                  : 'Document URL or File Path'
              }
            />

            {/* Tag Input as Chips */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded px-3 py-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button onClick={() => removeTag(index)} className="text-xs font-bold hover:text-red-900">×</button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1 min-w-[100px] border-none focus:outline-none text-sm"
                  placeholder="Enter a tag and press Enter"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Create
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateContent;
