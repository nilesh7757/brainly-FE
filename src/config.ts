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
export const GOOGLE_CLIENT_ID: string = import.meta.env.VITE_GOOGLE_CLIENT_ID || "52074276999-hivborjh21pho32erp3jg6l7es1f3qc5.apps.googleusercontent.com"

// Debug logging
console.log("Environment:", import.meta.env.MODE)
console.log("API URL:", REACT_APP_API_URL)
console.log("Google Client ID:", GOOGLE_CLIENT_ID)
