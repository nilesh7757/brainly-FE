import type React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import SignIn from "./pages/Signin"
import GoogleSignIn from "./pages/google"
import SharePage from "./pages/SharePage"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Test CORS connection
const testCORS = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cors-test`)
    const data = await response.json()
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

// Toast Container with theme support
const ThemedToastContainer = () => {
  const { theme } = useTheme();
  
  return (
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
      theme={theme}
    />
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemedToastContainer />
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
    </ThemeProvider>
  )
}

export default App
