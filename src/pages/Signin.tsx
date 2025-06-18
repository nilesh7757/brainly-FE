import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { REACT_APP_API_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import GoogleSignIn from './google';

const SignIn = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  async function SignIn() {
    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
      if (!username || !password) {
        toast('Username or password is missing');
        return;
      }

      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/signin`, {
        username,
        password,
      });

      const jwt = res.data.token;
      localStorage.setItem('token', jwt);
      toast('SignIn successful');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast(`SignIn failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Username</label>
              <Input 
                placeholder="Enter your username" 
                reference={usernameRef} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <Input 
                placeholder="Enter your password" 
                reference={passwordRef}
                type="password"
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="/forgot-password" className="text-purple-600 hover:text-purple-700 font-medium">
                Forgot password?
              </a>
            </div>

            <Button 
              onClick={SignIn} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 justify-center text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
              title="Sign In" 
              variant="primary" 
              size="md" 
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="w-full">
            <GoogleSignIn />
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up here
            </a>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;