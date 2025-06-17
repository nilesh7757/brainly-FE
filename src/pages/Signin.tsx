import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { REACT_APP_API_URL } from '../config';
import { toast, ToastContainer } from 'react-toastify';

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
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white rounded-md border flex flex-col gap-4 items-center p-3 w-[40%] h-[50%]">
        <div className="text-2xl font-medium text-purple-500">SignIn</div>
        <Input placeholder="Username" reference={usernameRef} />
        <Input placeholder="Password" reference={passwordRef} />
        <Button onClick={SignIn} title="Signin" variant="primary" size="md" />
      </div>
    </div>
  );
};

export default SignIn;
