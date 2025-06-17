// Get the API URL from environment variables
const getApiUrl = (): string => {
  // In production, use the environment variable
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || "https://second-brain-backend-woad.vercel.app"
  }

  // In development, use local or environment variable
  return import.meta.env.VITE_API_URL || "http://localhost:3000"
}

export const REACT_APP_API_URL: string = getApiUrl()

// Debug logging
console.log("Environment:", import.meta.env.MODE)
console.log("API URL:", REACT_APP_API_URL)
