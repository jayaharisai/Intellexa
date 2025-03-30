import React from 'react'
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar'

function KnowledgeBase() {
  return (
    <div>
        <div>
          <MainNavBar />
        </div>
        <motion.div 
          className='knowledgebase'
          initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.2 }}
        >
          <div className='container'>
            <div className='title2 pt30'>Knowledge base</div>
            <div className='upload'>
              <div><i class="icon_ bi bi-file-earmark-arrow-up"></i></div>
              <div className='model_title mtop'>Click here to upload your file or drag</div>
              <div className='model_description_'>Support files PDF, Doc, Excel</div>
            </div>
            <div className='table'>
              <div className='title2'>Attached files</div>
              <div className='model_title'>Here you can explore your uploaded files</div>
              <div className='table-columns'>
                <ul>
                  <li className='col1 column-heading'>File name</li>
                  <li className='col2 column-heading'>Size</li>
                  <li className='col3 '></li>
                </ul>
                <ul>
                  <li className='col1 column-heading'><i class="pdf bi bi-filetype-pdf"></i> Machine learning Full course</li>
                  <li className='col2 column-heading'>350MB</li>
                  <li className='col3 '>Delete</li>
                </ul>
                <ul>
                  <li className='col1 column-heading'><i class="pdf bi bi-filetype-pdf"></i> Machine learning Full course</li>
                  <li className='col2 column-heading'>350MB</li>
                  <li className='col3 '>Delete</li>
                </ul>
                <ul>
                  <li className='col1 column-heading'><i class="pdf bi bi-filetype-pdf"></i> Machine learning Full course</li>
                  <li className='col2 column-heading'>350MB</li>
                  <li className='col3 '>Delete</li>
                </ul>
                <ul>
                  <li className='col1 column-heading'><i class="pdf bi bi-filetype-pdf"></i> Machine learning Full course</li>
                  <li className='col2 column-heading'>350MB</li>
                  <li className='col3 '>Delete</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
    </div>
  )
}

export default KnowledgeBase
