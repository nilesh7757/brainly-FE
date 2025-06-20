import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const GoogleSignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleCredentialResponse = async (credentialResponse: any) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/google-signin`, {
        token: credentialResponse.credential,
      });

      const token = response.data.token;
      localStorage.setItem('token', token);
      toast.success('Google sign-in successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Google sign-in failed:', error);
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-sm">
        <GoogleLogin
          onSuccess={handleCredentialResponse}
          onError={() => toast.error('Google Sign-In Failed')}
          logo_alignment="center"
          size="large"
        />
      </div>
    </div>
  );
};

export default GoogleSignIn;
