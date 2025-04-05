import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MainNavBar from './MainNavBar';
import axios from 'axios';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = localStorage.getItem("authToken");
  const [loadingMessage, setLoadingMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (loadingMessage) {
      const steps = ["Checking...", "Validating...", "Almost there..."];
      let stepIndex = 0;
      const interval = setInterval(() => {
        setLoadingMessage(steps[stepIndex]);
        stepIndex++;
        if (stepIndex === steps.length) clearInterval(interval);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loadingMessage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessage]);

  // Utility to split into bold and normal tokens
  const parseFormattedText = (text) => {
    const regex = /\*\*(.+?)\*\*/g;
    let result = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'normal', text: text.slice(lastIndex, match.index) });
      }
      result.push({ type: 'bold', text: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push({ type: 'normal', text: text.slice(lastIndex) });
    }

    return result;
  };

  const streamResponse = async (text) => {
    const segments = parseFormattedText(text);
    let streamed = [];

    for (let segment of segments) {
      const words = segment.text.split(" ");
      for (let word of words) {
        await new Promise((resolve) => setTimeout(resolve, 40));
        streamed.push({ type: segment.type, text: word });
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { type: 'ai', tokens: [...streamed] };
          return newMessages;
        });
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoadingMessage("Checking...");

    try {
      const response = await axios.post(
        `http://localhost:8000/answers?token=${token}`,
        { user_query: input },
        { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
      );

      setLoadingMessage("");
      if (response.data.success) {
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', tokens: [] }]);
        streamResponse(response.data.recommend);
      } else {
        setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: 'Error fetching response.' }]);
      }
    } catch (error) {
      setLoadingMessage("");
      setMessages((prevMessages) => [...prevMessages, { type: 'ai', text: 'Server error. Please try again.' }]);
    }
  };

  return (
    <div>
      <MainNavBar />
      <div className='chats'>
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className={msg.type === 'user' ? 'user-message' : 'ai-message'}>
              {msg.tokens ? (
                msg.tokens.map((token, i) =>
                  token.type === 'bold' ? (
                    <strong key={i}>{token.text}&nbsp;</strong>
                  ) : (
                    <span key={i}>{token.text}&nbsp;</span>
                  )
                )
              ) : (
                msg.text
              )}
            </li>
          ))}
          {loadingMessage && <li className='ai-message'>{loadingMessage}</li>}
          <div ref={chatEndRef} />
        </ul>
      </div>
      <div className='chatting'>
        <motion.div 
          className='chat-input'
          initial={{ y: 50, scale: 1.2, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <input 
            placeholder='Ask anything from your knowledge base'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <div className='enter' onClick={handleSendMessage}>
            <i className='bi bi-send'></i>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Chat;
