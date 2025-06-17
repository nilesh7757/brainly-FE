import type React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import { REACT_APP_API_URL } from "./config"

// Debug: Log the API URL on app load
console.log("App loaded with API URL:", REACT_APP_API_URL)
console.log("Environment variables:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
})

// Test CORS connection
const testCORS = async () => {
  try {
    const response = await fetch(`${REACT_APP_API_URL}/api/cors-test`)
    const data = await response.json()
    console.log("CORS test successful:", data)
  } catch (error) {
    console.error("CORS test failed:", error)
  }
}

// Run CORS test on app load
testCORS()

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token")
  return token ? <>{children}</> : <Navigate to="/signup" replace />
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
