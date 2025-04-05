import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import 'react-toastify/dist/ReactToastify.css';

function KnowledgeBase() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [openAIConfigured, setOpenAIConfigured] = useState(true); // Track if OpenAI key is set
  const [showModal, setShowModal] = useState(false); // Track if modal should be shown
  const token = localStorage.getItem('authToken'); // Fetch auth token
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    fetchUploadedFiles();
    checkOpenAIKey(); // Check OpenAI key when component mounts
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/get_uploaded_files?token=${token}`);
      if (response.data.success) {
        setFiles(response.data.files);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching files.");
    }
  };

  // Check if OpenAI key is configured
  const checkOpenAIKey = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/configuration?token=${token}`);
      if (!response.data.success || !response.data.configuration.openai_key) {
        setOpenAIConfigured(false); // OpenAI key is not configured
        setShowModal(true); // Show modal to configure the key
      }
    } catch (error) {
      toast.error("Error fetching OpenAI configuration.");
    }
  };

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/uploadfile?token=${token}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setUploadProgress(0);
        fetchUploadedFiles(); // Refresh file list
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error uploading file.");
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    if (openAIConfigured) {
      setDragging(true);
    }
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    if (openAIConfigured) {
      setDragging(false);
      const droppedFile = event.dataTransfer.files[0];
      handleFileUpload(droppedFile);
    }
  };

  // Handle OpenAI key configuration (triggered after OpenAI key is set)
  const handleOpenAIKeyConfigured = () => {
    setOpenAIConfigured(true);
    setShowModal(false); // Close modal once OpenAI key is configured
    navigate('/configuration'); // Redirect to the Configuration page
  };

  return (
    <div>
      <MainNavBar />
      <motion.div
        className={`knowledgebase ${openAIConfigured ? '' : 'blurred'}`} // Apply blur effect if OpenAI key is not configured
        initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.2 }}
      >
        <div className='container'>
          <div className='title2 pt30'>Knowledge base</div>

          {/* File Upload Section with Drag & Drop */}
          <div
            className={`upload ${dragging ? 'dragging' : ''} ${openAIConfigured ? '' : 'disabled'}`} // Disable upload if OpenAI key is missing
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <label>
              <input
                type='file'
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
                disabled={!openAIConfigured} // Disable the file input if OpenAI key is missing
              />
              <div><i className="icon_ bi bi-file-earmark-arrow-up"></i></div>
              <div className='model_title mtop'>Click here or drag a file to upload</div>
              <div className='model_description_'>Supports PDF, Doc, Excel</div>
            </label>
          </div>

          {uploadProgress > 0 && (
            <div className='upload-status'>
              <p>Uploading... {uploadProgress}%</p>
              <progress value={uploadProgress} max="100"></progress>
            </div>
          )}

          {/* File List Section */}
          <div className='table'>
            <div className='title2'>Attached files</div>
            <div className='model_title'>Here you can explore your uploaded files</div>
            <div className='table-columns'>
              <ul>
                <li className='col1 column-heading'>File name</li>
                <li className='col2 column-heading'>Size</li>
                <li className='col3 '></li>
              </ul>

              {files.length > 0 ? (
                files.map((file) => (
                  <ul key={file.uuid}>
                    <li className='col1 column-heading'>
                      <i className="pdf bi bi-filetype-pdf"></i> {file.filename}
                    </li>
                    <li className='col2 column-heading'>{(file.size / 1024 / 1024).toFixed(2)} MB</li>
                    <li className='col3 '>Delete</li>
                  </ul>
                ))
              ) : (
                <p>No files uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Prompt to Configure OpenAI Key */}
      {showModal && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h3>Configure OpenAI Key</h3>
            <p>To start using the knowledge base, please configure your OpenAI API key.</p>
            <button onClick={handleOpenAIKeyConfigured}>Not at configured, Now configure</button>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default KnowledgeBase;
