"use client"

import { useEffect, useState } from "react"
import axios from "axios"

interface Content {
  _id: string;
  title: string;
  link: string;
  type: "YOUTUBE" | "TWITTER" | "DOCUMENT";
  tags: string[];
  createdAt: string;
}

const useContent = () => {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/content`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setContents(response.data.content || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      setError(error.response?.data?.message || 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent() // Fetch immediately on mount

    // Set up periodic refresh (optional)
    const interval = setInterval(() => {
      fetchContent()
    }, 300000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    content: contents,
    refetch: fetchContent,
    loading,
    error,
  }
}

export default useContent
