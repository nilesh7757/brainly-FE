import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import axios from 'axios';
import { REACT_APP_API_URL } from '../config';
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

      const res = await axios.post(`${REACT_APP_API_URL}/api/v1/signup`, {
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
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <ToastContainer />
      <div className="bg-white  rounded-md border flex flex-col gap-y-4 items-center p-5  sm:w-[40%] max-h-[50%]">
        <div className="text-2xl font-medium  text-purple-500">Sign up</div>
        <Input  placeholder="email" reference={emailRef} />
        <Input placeholder="Username" reference={usernameRef} />
        <Input placeholder="Password" reference={passwordRef} />
        <Button onClick={Signup} className='w-full rounded-md flex py-2 justify-center' title="Signup" variant="primary" size="md" />

        {signedIn && (
          <div className="text-sm text-red-600 cursor-pointer" onClick={() => navigate('/signin')}>
            User already exists. Click here to sign in.
          </div>
        )}
        <div className='w-full'>
        <GoogleSignIn />
        </div>
      </div>
    </div>
  );
};

export default Signup;
