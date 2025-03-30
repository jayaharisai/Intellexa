import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import Navbar from './Navbar';

function Register() {
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
          <div className='title mb45'>Create your account</div>
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
          <div className='subheading'>Already have an account <Link className='Link' to="/"><span className='special'>Login</span></Link></div>
        </motion.div>
      </div>
    );
  }

export default Register