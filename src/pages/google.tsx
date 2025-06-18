import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { REACT_APP_API_URL } from '../config';

const GoogleSignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    console.log("credentialResponse");
    if (!token) {
      toast('Invalid Google credential');
      return;
    }

    try {
      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/google-signin`, {
        token,
      });
      console.log(token);
      localStorage.setItem('token', res.data.token);
      toast('Google Sign-In Successful');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast('Google Sign-In Failed');
    }
  };

  return (
    <div className=' justify-center text-center'>
      <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={() => toast('Google Sign-In Failed')}
      logo_alignment='center'
    />
    </div>
  );
};

export default GoogleSignIn;
