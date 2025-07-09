import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full p-2 sm:p-4">
      <Router>
        <nav className="navbar">
          <NavLink to="/create" className="nav-link">Create</NavLink>
          <NavLink to="/join" className="nav-link">Join</NavLink>
          <NavLink to="/chat" className="nav-link">Chat</NavLink>
        </nav>
        <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
          <Routes>
            <Route path="/create" element={<CreateRoom />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/chat" element={<ChatRoom />} />
            <Route path="*" element={<CreateRoom />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
