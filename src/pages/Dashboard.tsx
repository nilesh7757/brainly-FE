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

  async function deleteContent(contentId: string) {
    try {
      console.log('Deleting content with ID:', contentId);
      await axios.delete(`${REACT_APP_API_URL}/api/v1/content`,{
        data: { contentId },
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
      });
      await refetch(); // Await refetch to ensure it completes after deletion
      toast("Content deleted successfully!");
    } catch (error: any) {
      console.error('Error deleting content:', error.response?.data || error.message);
      toast(`Failed to delete content: ${error.response?.data?.message || error.message}`);
    }
  }
  const navigate = useNavigate();
  function SignOut(){
    localStorage.removeItem("token");
    toast("Signed Out")
    navigate("/signIn")
  }

  async function Share() {
    // console.log("HELLO");
    try {
      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/brain/share`, {}, {
        headers: {
          Authorization: localStorage.getItem('token') || '',
        },
      });
      console.log(res.data.shareLink);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modal */}
      <ToastContainer />
      {open && (
        <>
          <div className="flex justify-center items-center w-full h-full fixed left-0 top-0 z-50 p-4">
            <CreateContent open={open} onClose={() => setOpen(false)} refetch={refetch} />
          </div>
          <div 
            className="bg-black bg-opacity-50 backdrop-blur-sm fixed left-0 top-0 w-full h-full z-40"
            onClick={() => setOpen(false)}
          />
        </>
      )}

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Notes
            </h1>
            <p className="text-gray-600 mt-2">Organize your content beautifully</p>
          </div>
          <div className="flex gap-3">
            <Button
              title="SignOut"
              size="sm"
              className={"sm:px-2 sm:py-2 px-2 py-1 rounded-md "}
              variant="primary"
              startIcon={<ShareButton />}
              onClick={()=>{SignOut()}}
            />
            <Button
              title="Share"
              size="sm"
              className={"sm:px-2 sm:py-2 px-2 py-1 rounded-md "}
              variant="primary"
              startIcon={<ShareButton />}
              onClick={()=>{Share()}}
            />
            <Button
              onClick={() => setOpen(true)}
              className={"sm:px-2 sm:py-1 px-2 rounded-md underd-md"}
              title="Add Content"
              size="sm"
              variant="primary"
              startIcon={<PlusIcon />}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading content...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-red-600">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 rounded-full text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && !error && content.length > 0 && (
          <div className="flex justify-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map(({ _id, type, link, title, tags, createdAt }) => {
                const parsedDate = new Date(createdAt);
                const contentDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate; // Fallback to current date if invalid
                return (
                  <Card
                    key={_id}
                    title={title}
                    link={link}
                    type={type}
                    tags={tags}
                    date={contentDate}
                    className={"sm:w-[90vw]"}
                    onClick={() => deleteContent(_id)}
                    // onUpdate={() => console.log('Update functionality not implemented yet')}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && content.length === 0 && (
          <div className="text-center py-16 opacity-60">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <PlusIcon />
            </div>
            <p className="text-gray-500">Add more content to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
