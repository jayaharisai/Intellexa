import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const checkEmail = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/check_email', { email });
      if (response.data.success) {
        setShowPassword(true);
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Error checking email. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', { email, password });
      if (response.data.success) {
        // Store the token in localStorage
        const token = response.data.token;
        if (token) {
          localStorage.setItem('authToken', token); // Save token to localStorage
        }
        
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate('/knowledgebase'); // Redirect to the knowledgebase page after successful login
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <div>
      <Navbar />
      <motion.div 
        className='login-container' 
        initial={{ opacity: 0, background: 'blue' }}
        animate={{ opacity: 1, background: 'transparent' }}
        transition={{ duration: 0.5 }}
      >
        <div className='title mb45'>Welcome back</div>
        <div>
          <div className='primary-input mb15'>
            <input 
              type='email' 
              placeholder='Email address' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {showPassword && (
            <motion.div 
              className='primary-input mb15'
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <input 
                type='password' 
                placeholder='Password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>
          )}
          <div className='prime-button mb15'>
            {showPassword ? (
              <button onClick={handleLogin}>Login</button>
            ) : (
              <button onClick={checkEmail}>Continue</button>
            )}
          </div>
        </div>
        <div className='subheading'>New to this platform? <Link className='Link' to="/register"><span className='special'>Create account</span></Link></div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}

export default Login;
