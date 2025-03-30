import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Register from "./components/Register";
import KnowledgeBase from "./components/KnowledgeBase";
import Chat from "./components/Chat";
import Configuration from "./components/Configuration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/knowledgebase" element={<KnowledgeBase/>}/>
        <Route path="/configuration" element={<Configuration/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
