import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { REACT_APP_API_URL } from '../config';

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signUp() {
    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;

      if (!username || !password) {
        console.error('Username or password is missing');
        return;
      }

      console.log('API URL:', REACT_APP_API_URL);
      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/signup`, {
        username,
        password,
      });

      const jwt = res.data.token;
      localStorage.setItem('token', jwt);
      console.log('Signup successful, token stored');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  }

  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-md border flex flex-col gap-4 items-center p-3 w-[40%] h-[50%]">
        <div className="text-2xl font-medium text-purple-500">Sign up</div>
        <Input placeholder="Username" reference={usernameRef} />
        <Input placeholder="Password" reference={passwordRef} />
        <Button onClick={signUp} title="Sign Up" variant="primary" size="md" />
      </div>
    </div>
  );
};

export default Signup;
