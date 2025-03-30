import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import Navbar from './Navbar';

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      
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
              />
            </motion.div>
          )}
          <div className='prime-button mb15'>
            <button onClick={() => setShowPassword(true)}>
              Continue
            </button>
          </div>
        </div>
        <div className='subheading'>New to this platform? <Link className='Link' to="/register"><span className='special'>Create account</span></Link></div>
      </motion.div>
    </div>
  );
}

export default Login;