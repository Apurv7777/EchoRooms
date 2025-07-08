import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import ChatRoom from "./pages/ChatRoom";
import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <Router>
        <nav className="navbar">
          <NavLink to="/create" className="nav-link">Create Room</NavLink>
          <NavLink to="/join" className="nav-link">Join Room</NavLink>
          <NavLink to="/chat" className="nav-link">Chat Room</NavLink>
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
