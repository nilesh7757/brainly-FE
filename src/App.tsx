import type React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/Signin"
import GoogleSignIn from "./pages/google"
import SharePage from "./pages/SharePage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Debug: Log the API URL on app load
console.log("App loaded with API URL:", import.meta.env.VITE_API_URL)
console.log("Environment variables:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  NODE_ENV: import.meta.env.NODE_ENV,
  MODE: import.meta.env.MODE,
})

// Test CORS connection
const testCORS = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cors-test`)
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
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
      <Route path="/share/:shareId" element={<SharePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<SignIn/>} />
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
