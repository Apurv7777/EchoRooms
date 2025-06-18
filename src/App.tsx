import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="container">
      <Router>
        <nav className="navbar">
          <Link to="/create" className="nav-link">Create Room</Link>
          <Link to="/join" className="nav-link">Join Room</Link>
          <Link to="/chat" className="nav-link">Chat Room</Link>
        </nav>
        <Routes>
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="*" element={<CreateRoom />} />
        </Routes>
      </Router>
      </div>
  );
};

export default App;
