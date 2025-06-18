import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import GoogleSignIn from './google';

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const [signedIn, setSignedIn] = useState(false);

  async function Signup() {
    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
      const email = emailRef.current?.value;

      if (!username || !password || !email) {
        toast('Username or password or email is missing');
        return;
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/signup`, {
        username,
        password,
        email,
      });

      const jwt = res.data.token;
      localStorage.setItem('token', jwt);
      toast('Signup successful');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 411) {
        toast("User Already Exist Try To SignIn");
        setSignedIn(true);
        return;
      }
      toast(`Signup failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-gray-600">Join us and start your journey</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Email Address</label>
              <Input 
                placeholder="Enter your email" 
                reference={emailRef}
                type="email"
                className="w-full"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Username</label>
              <Input 
                placeholder="Choose a username" 
                reference={usernameRef} 
                className="w-full"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <Input 
                placeholder="Create a password" 
                reference={passwordRef}
                type="password"
                className="w-full"
              />
            </div>

            <div className="flex items-start space-x-2 text-sm">
              <input type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-0.5" />
              <span className="text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Privacy Policy
                </a>
              </span>
            </div>

            <Button 
              onClick={Signup} 
              className="w-full  bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold  py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200" 
              title="Create Account" 
              variant="primary" 
              size="md" 
            />

            {signedIn && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-700 text-sm">
                    User already exists.{' '}
                    <button 
                      onClick={() => navigate('/signin')}
                      className="font-medium text-red-800 hover:text-red-900 underline"
                    >
                      Sign in instead
                    </button>
                  </span>
                </div>
              </div>
            )}
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
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/signin')}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Sign in here
            </button>
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

export default Signup;