import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Check if the email is valid using the register_check_email endpoint
  const checkEmail = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register_check_email', { email });
      if (response.data.success) {
        setShowPassword(true); // Show password input if email is valid
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
        setShowPassword(false); // Do not show password input if email is invalid
      }
    } catch (error) {
      toast.error("Error checking email. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  // Handle registration with the email and password after email is validated
  const handleRegister = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/register', { email, password });
      if (response.data.success) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 5000,
        });
        navigate('/'); // Redirect to the login page after successful registration
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.", {
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
        <div className='title mb45'>Create your account</div>
        <div>
          <div className='primary-input mb15'>
            <input
              type='email'
              placeholder='Email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Show password input only after email is validated */}
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

          {/* Use the same button for checking email and registering */}
          <div className='prime-button mb15'>
            <button onClick={showPassword ? handleRegister : checkEmail}>
              {showPassword ? 'Register' : 'Continue'}
            </button>
          </div>
        </div>
        <div className='subheading'>
          Already have an account{' '}
          <Link className='Link' to='/'>
            <span className='special'>Login</span>
          </Link>
        </div>
      </motion.div>

      {/* Add ToastContainer here for toast notifications */}
      <ToastContainer />
    </div>
  );
}

export default Register;
