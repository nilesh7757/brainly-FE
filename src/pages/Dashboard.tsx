import { useState } from 'react';
import PlusIcon from '../icons/PlusIcon';
import Card from '../components/Card';
import Button from '../components/Button';
import CreateContent from '../components/CreateContent';
import ShareButton from '../icons/ShareButton';
import useContent from '../hooks/useContent';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import { REACT_APP_API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const { content, refetch, loading, error } = useContent();
  const navigate = useNavigate();
  async function deleteContent(contentId: string) {
    try {
      console.log('Deleting content with ID:', contentId);
      await axios.delete(`${REACT_APP_API_URL}/api/v1/content`, {
        data: { contentId },
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
      });
      await refetch();
      toast("Content deleted successfully!");
    } catch (error: any) {
      console.error('Error deleting content:', error);
      toast(`Failed to delete content: ${error.message}`);
    }
  }
  
  function SignOut() {
    localStorage.removeItem("token");
    toast("Signed Out")
    navigate("/signIn")
  }

  async function Share() {
    try {
      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/brain/share`, {}, {
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
      });
      const shareLink = res.data.shareLink;
  
      if (!shareLink) {
        toast("No share link found.");
        return;
      }
  
      await navigator.clipboard.writeText(shareLink);
      toast("Link copied to clipboard!");
    } catch (error) {
      console.error("Error sharing content:", error);
      toast("Error in sharing");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="mt-16"
      />

      {/* Modal */}
      {open && (
        <>
          <div className="flex justify-center items-center w-full h-full fixed left-0 top-0 z-50 p-4">
            <div className="animate-in fade-in zoom-in duration-300">
              <CreateContent open={open} onClose={() => setOpen(false)} refetch={refetch} />
            </div>
          </div>
          <div 
            className="bg-black/40 backdrop-blur-sm fixed left-0 top-0 w-full h-full z-40 animate-in fade-in duration-200"
            onClick={() => setOpen(false)}
          />
        </>
      )}

      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Content Library
              </h1>
              <p className="text-gray-600 text-lg">Your knowledge, beautifully organized</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <Button
                title="Sign Out"
                size="sm"
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                variant="primary"
                startIcon={<ShareButton />}
                onClick={SignOut}
              />
              <Button
                title="Share Collection"
                size="sm"
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                variant="primary"
                startIcon={<ShareButton />}
                onClick={Share}
              />
              <Button
                onClick={() => setOpen(true)}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 font-medium"
                title="Add Content"
                size="sm"
                variant="primary"
                startIcon={<PlusIcon />}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-indigo-600">{content?.length || 0}</div>
              <div className="text-gray-600 font-medium">Total Items</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-purple-600">
                {content ? new Set(content.flatMap(item => item.tags || [])).size : 0}
              </div>
              <div className="text-gray-600 font-medium">Unique Tags</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
              <div className="text-3xl font-bold text-blue-600">
                {content ? new Set(content.map(item => item.type)).size : 0}
              </div>
              <div className="text-gray-600 font-medium">Content Types</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="relative inline-flex">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animation-delay-150"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading your content...</p>
            <p className="text-gray-500 text-sm mt-2">This might take a moment</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-700 font-medium mb-4">{error}</p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {!loading && !error && content.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Your Collection</h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {content.length} items
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {content.map(({ _id, type, link, title, tags, createdAt }) => {
                const parsedDate = new Date(createdAt);
                const contentDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
                return (
                  <div 
                    key={_id} 
                    className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-105"
                  >
                    <Card
                      title={title}
                      link={link}
                      type={type}
                      tags={tags}
                      date={contentDate}
                      className="bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:bg-white/90"
                      onClick={() => deleteContent(_id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && content.length === 0 && (
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full flex items-center justify-center">
                  <PlusIcon className="text-indigo-600" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-pink-400 rounded-full animate-pulse animation-delay-300"></div>
              <div className="absolute top-8 -left-8 w-3 h-3 bg-green-400 rounded-full animate-pulse animation-delay-700"></div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-700 mb-4">Start Your Knowledge Collection</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Add your first piece of content to begin building your personal knowledge library. 
              Articles, links, notes - organize everything in one beautiful place.
            </p>
            
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <PlusIcon className="mr-2" />
              Add Your First Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;