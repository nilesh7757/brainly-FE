"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { REACT_APP_API_URL } from "../config"

const useContent = () => {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      console.log("Fetching from:", `${REACT_APP_API_URL}/api/v1/content`)

      const response = await axios.get(`${REACT_APP_API_URL}/api/v1/content`, {
        headers: {
          Authorization: token,
        },
      })

      console.log("Content fetched:", response.data)
      setContents(response.data.content || [])
    } catch (err: any) {
      console.error("Fetch error:", err)
      setError(err.response?.data?.message || err.message || "Failed to fetch content")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData() // Fetch immediately on mount

    // Set up periodic refresh (optional)
    const interval = setInterval(() => {
      fetchData()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return {
    content: contents,
    refetch: fetchData,
    loading,
    error,
  }
}

export default useContent
