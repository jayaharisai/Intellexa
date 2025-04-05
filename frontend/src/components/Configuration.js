import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";

function Configuration() {
  const [openaiKey, setOpenaiKey] = useState("");
  const [selectedEmbedding, setSelectedEmbedding] = useState("");
  const [selectedRetrieval, setSelectedRetrieval] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
      fetchConfiguration(storedToken);
    }
  }, []);

  const fetchConfiguration = async (storedToken) => {
    try {
      const response = await fetch(`http://localhost:8000/configuration?token=${storedToken}`);
      const result = await response.json();
      if (result.success && result.configuration) {
        setOpenaiKey(result.configuration.openai_key);
        setSelectedEmbedding(result.configuration.embedding_model);
        setSelectedRetrieval(result.configuration.retrival_model);
      }
    } catch (error) {
      console.error("Error fetching configuration:", error);
    }
  };

  const handleEmbeddingSelect = (model) => {
    setSelectedEmbedding(model);
  };

  const handleRetrievalSelect = (model) => {
    setSelectedRetrieval(model);
  };

  const handleSave = async () => {
    if (!token) {
      toast.error("Authentication token is missing!");
      return;
    }
  
    const apiUrl = `http://localhost:8000/configuration?token=${token}`;
  
    const payload = {
      openai_key: openaiKey,
      embedding_model: selectedEmbedding,
      retrival_model: selectedRetrieval,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
  
      if (result.success) {
        toast.success("Configuration saved successfully!"); // Show success toast
      } else {
        toast.error("Failed to save configuration."); // Handle error in case success is false
      }
      console.log("Response:", result);
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration.");
    }
  };

  return (
    <div>
      <MainNavBar />
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
            <div className='label mb15'>OpenAI API Key</div>
            <div className='primary-input'>
              <input 
                type='text' 
                value={openaiKey} 
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder='Enter OpenAI API Key'
              />
            </div>
          </div>
          <div>
            <div className='label'>Select Embedding Model</div>
            <div className='embedding-list'>
              <ul>
                {["text-embedding-3-small", "text-embedding-3-large", "text-embedding-ada-002"].map((model) => (
                  <li 
                    key={model} 
                    className={`selectable ${selectedEmbedding === model ? "selected highlighted bg-blue-500 text-white" : ""}`} 
                    onClick={() => handleEmbeddingSelect(model)}
                  >
                    <div>
                      <img className='icon' alt='OpenAI Embedding' src='https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png' />
                    </div>
                    <div>{model}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <div className='label'>Select Retrieval Model</div>
            <div className='models-list'>
              <ul>
                {["GPT-4o", "GPT-4", "GPT-3.5"].map((model) => (
                  <li 
                    key={model} 
                    className={`selectable ${selectedRetrieval === model ? "selected highlighted bg-blue-500 text-white" : ""}`} 
                    onClick={() => handleRetrievalSelect(model)}
                  >
                    <div className='icons'>{model}</div>
                    <div>
                      <div className='model_title'>{model}</div>
                      <div className='model_description'>Fast, intelligent, flexible GPT model</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='prime-button conf-btn'>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Configuration;
