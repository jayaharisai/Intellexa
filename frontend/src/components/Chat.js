import React from 'react'
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar'

function Chat() {
  return (
    <div>
        <div>
          <MainNavBar />
        </div>
        <div className='chatting'>
          <motion.div 
            className='chat-input'
            initial={{ y: 50, scale: 1.2, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
              <input placeholder='Ask anything from your knowledge base'></input>
              <div className='enter'><i class="bi bi-send"></i></div>
          </motion.div>
        </div>
    </div>
  )
}

export default Chat
