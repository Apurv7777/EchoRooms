import React, { useEffect, useRef, useState } from "react";
import { useWS } from "../context/WSContext";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { clearMessagesIfRoomEmpty, setPreferredLanguage, setAutoTranslate } from "../store/wsSlice";
import { LANGUAGES } from "../utils/languages";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Users, Globe, LogOut, Copy, Check, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const ChatRoom: React.FC = () => {
  const { disconnectRoom, sendMessage } = useWS();
  const dispatch = useAppDispatch();
  const {
    roomId,
    userName,
    messages,
    connectedUsers,
    currentUser,
    isConnected,
    preferredLanguage
  } = useAppSelector(state => state.ws);

  const [input, setInput] = useState("");
  const [isSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (roomId && connectedUsers.length === 0) {
      dispatch(clearMessagesIfRoomEmpty());
    }
  }, [connectedUsers, roomId, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && roomId && isConnected) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleLanguageChange = (code: string) => {
    dispatch(setPreferredLanguage(code));
    dispatch(setAutoTranslate(true));
  };

  const handleCopyId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!roomId) {
    return (
      <div className="flex h-[70vh] items-center justify-center px-4">
        <Card className="glass-card max-w-md w-full border-white/10 shadow-2xl">
          <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <LogOut size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-white">No Active Channel</h2>
              <p className="text-white/40 font-sans">
                You are currently not connected to any workspace. Return home to join or create one.
              </p>
            </div>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2 font-display">
                <Home size={16} /> Return Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-4 max-w-7xl mx-auto">
      {/* Sidebar - Desktop */}
      <motion.div
        className={cn(
          "hidden md:flex flex-col w-80",
          !isSidebarOpen && "md:w-0 overflow-hidden" // collapsible support if needed later
        )}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <Card className="h-full border-white/10 flex flex-col glass-card bg-black/40">
          <CardHeader className="border-b border-white/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs tracking-widest text-white/40 uppercase font-display font-bold">Channel ID</CardTitle>
              <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" : "bg-red-500"}`} />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="font-mono text-2xl font-bold text-white truncate flex-1 tracking-tight">#{roomId}</div>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                onClick={handleCopyId}
                title="Copy Channel ID"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden flex flex-col gap-6 p-4">
            {/* User List */}
            <div className="flex-1 flex flex-col min-h-0">
              <h3 className="text-xs font-bold text-white/30 uppercase mb-3 flex items-center gap-2 font-display tracking-wider">
                <Users size={12} /> Members ({connectedUsers.length})
              </h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {connectedUsers.map((user, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate text-white/90 group-hover:text-white transition-colors">{user}</div>
                      <div className="text-[10px] text-white/40 font-mono">{user === currentUser ? "You" : "Online"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Config */}
            <div className="shrink-0 bg-black/20 p-3 rounded-lg border border-white/5">
              <h3 className="text-xs font-bold text-white/30 uppercase mb-2 flex items-center gap-2 font-display tracking-wider">
                <Globe size={12} /> Translation
              </h3>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-md p-2 text-xs text-white/80 outline-none focus:border-white/20 font-sans transition-colors cursor-pointer hover:bg-white/10"
                value={preferredLanguage || ""}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="">Off (English)</option>
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </CardContent>
          <div className="p-4 border-t border-white/5 bg-white/5">
            <Button variant="ghost" onClick={disconnectRoom} className="w-full gap-2 text-xs h-9 justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10 font-medium">
              <LogOut size={14} /> Leave Channel
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Main Chat Area */}
      <motion.div
        className="flex-1 h-full min-w-0"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="h-full flex flex-col border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden p-4 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-md">
            <div className="font-mono font-bold text-white">#{roomId}</div>
            <Button size="sm" variant="ghost" onClick={disconnectRoom}>
              <LogOut size={16} />
            </Button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
            ref={chatBoxRef}
          >
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => {
                const isMe = msg.name === userName;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex w-full",
                      isMe ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] sm:max-w-[70%] flex gap-3",
                      isMe ? "flex-row-reverse" : "flex-row"
                    )}>
                      {/* Avatar for others */}
                      {!isMe && (
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/50 shrink-0 mt-1">
                          {msg.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className={cn(
                        "rounded-2xl p-3.5 shadow-sm relative group transition-all",
                        isMe
                          ? "bg-white text-black rounded-tr-sm"
                          : "bg-white/10 text-white border border-white/5 rounded-tl-sm backdrop-blur-md"
                      )}>

                        {!isMe && (
                          <div className="text-[10px] font-bold opacity-50 mb-1">{msg.name}</div>
                        )}

                        <div className="text-sm leading-relaxed break-words font-sans">
                          {msg.message}
                        </div>

                        {msg.isTranslated && (
                          <div className={cn(
                            "mt-1.5 pt-1.5 border-t text-[10px] flex items-center gap-1 opacity-60 font-medium",
                            isMe ? "border-black/5" : "border-white/10"
                          )}>
                            <Globe size={10} /> Translated
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Input Area */}
          <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-md">
            <form onSubmit={handleSendMessage} className="flex gap-3 items-end max-w-4xl mx-auto w-full">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="h-12 bg-white/5 border-white/10 focus:border-white/20 pl-4 pr-10 rounded-xl text-white placeholder:text-white/20 transition-colors"
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim()}
                className="h-12 w-12 rounded-xl bg-white text-black hover:bg-white/90 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChatRoom;
