import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Register from "./components/Register";
import KnowledgeBase from "./components/KnowledgeBase";
import Chat from "./components/Chat";
import Configuration from "./components/Configuration";
import Monitoring from "./components/Monitoring";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/knowledgebase" element={<KnowledgeBase/>}/>
        <Route path="/configuration" element={<Configuration/>}/>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/monitoring" element={<Monitoring/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
