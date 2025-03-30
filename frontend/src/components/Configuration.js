import React from 'react'
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar'
import "./styles.css"

function Configuration() {
  return (
    <div>
        <div>
          <MainNavBar />
        </div>
        <motion.div 
          className='configuration'
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.2 }}
        >
            <div className='container pt30'>
              <div>
                <div className='title2'>Configuration</div>
                <div className='subheading mb45 sbcolor'>Set up OpenAI keys, retrieval model and embeddings for seamless AI integration</div>
              </div>
              <div className='mb45'>
                <div className='label mb15'>Openai API Key</div>
                <div className='primary-input'>
                  <input></input>
                </div>
              </div>
              <div>
                <div className='label'>Select embedding model</div>
                <div className='embedding-list'>
                  <ul>
                    <li>
                      <div>
                        <img className='icon' alt='openai embedding ' src='https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png'></img>
                      </div>
                      <div>text-embedding-3-small</div>
                    </li>
                    <li>
                      <div>
                        <img className='icon' alt='openai embedding ' src='https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png'></img>
                      </div>
                      <div>text-embedding-3-large</div>
                    </li>
                    <li>
                      <div>
                        <img className='icon' alt='openai embedding ' src='https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png'></img>
                      </div>
                      <div>text-embedding-ada-002</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className='label'>Retrieval models</div>
                <div className='models-list'>
                  <ul>
                    <li>
                      <div className='icons'>GPT-4o</div>
                      <div>
                        <div className='model_title'>GPT-4o</div>
                        <div className='model_description'>Fast, intelligent, flexible GPT model</div>
                      </div>
                    </li>

                    <li>
                      <div className='icons'>GPT-4o</div>
                      <div>
                        <div className='model_title'>GPT-4o</div>
                        <div className='model_description'>Fast, intelligent, flexible GPT model</div>
                      </div>
                    </li>
                    <li>
                      <div className='icons'>GPT-4o</div>
                      <div>
                        <div className='model_title'>GPT-4o</div>
                        <div className='model_description'>Fast, intelligent, flexible GPT model</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className='prime-button conf-btn'>
                <button>Save</button>
              </div>
            </div>
        </motion.div>
    </div>
  )
}

export default Configuration
