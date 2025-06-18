import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Content {
  _id: string;
  title: string;
  link: string;
  type: string;
  tags: string[];
}

const SharePage = () => {
  const { shareId } = useParams();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState<Content[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/brain/${shareId}`
        );
        setUsername(res.data.username);
        setContent(res.data.content);
      } catch (err) {
        console.error(err);
        setError("Invalid or expired share link.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [shareId]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {username}'s Shared Brain 🧠
      </h1>
      {content.length === 0 ? (
        <p>No content shared.</p>
      ) : (
        <div className="space-y-4">
          {content.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-lg shadow bg-white"
            >
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p className="text-sm text-gray-500">Type: {item.type}</p>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {item.link}
              </a>
              <div className="flex flex-wrap gap-2 mt-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-200 px-2 py-1 text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharePage;
