import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";
import ModernLayout from "./components/layout/ModernLayout";

const App: React.FC = () => {
  return (
    <ModernLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatRoom />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ModernLayout>
  );
};

export default App;
