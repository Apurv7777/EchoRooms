import React, { useState } from "react";
import { useWS } from "../context/WSContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, LogIn, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Home: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"join" | "create">("join");
    const [joinId, setJoinId] = useState("");
    const [joinName, setJoinName] = useState("");
    const [createName, setCreateName] = useState("");

    const { joinRoom } = useWS();
    const navigate = useNavigate();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinId.trim() && joinName.trim()) {
            joinRoom(joinId.trim(), joinName);
            navigate("/chat");
        }
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (createName.trim()) {
            const newRoomId = uuidv4().substring(0, 8);
            joinRoom(newRoomId, createName);
            navigate("/chat");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-lg mx-auto px-4">
            {/* Tab Switcher */}
            <div className="flex p-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10 mb-8 w-64 relative">
                <div
                    className={cn(
                        "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white/10 shadow-lg transition-all duration-300 ease-out",
                        activeTab === "join" ? "left-1" : "left-[calc(50%+4px)]"
                    )}
                />
                <button
                    onClick={() => setActiveTab("join")}
                    className={cn(
                        "flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-full transition-colors",
                        activeTab === "join" ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                >
                    Join
                </button>
                <button
                    onClick={() => setActiveTab("create")}
                    className={cn(
                        "flex-1 relative z-10 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-full transition-colors",
                        activeTab === "create" ? "text-white" : "text-white/40 hover:text-white/60"
                    )}
                >
                    Create
                </button>
            </div>

            <div className="w-full relative">
                <AnimatePresence mode="wait">
                    {activeTab === "join" ? (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <Card className="glass-card border-white/10 shadow-2xl">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-200">
                                        <LogIn size={24} />
                                    </div>
                                    <CardTitle className="text-3xl font-display font-bold tracking-tight text-white">Join Channel</CardTitle>
                                    <CardDescription className="text-white/40 font-sans">
                                        Enter credentials to access an existing workspace.
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={handleJoin}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/50 ml-1 uppercase tracking-wider font-display">
                                                Channel ID
                                            </label>
                                            <Input
                                                placeholder="e.g. 8x29a1b"
                                                value={joinId}
                                                onChange={(e) => setJoinId(e.target.value)}
                                                className="glass-input h-12 font-mono"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/50 ml-1 uppercase tracking-wider font-display">
                                                Your Alias
                                            </label>
                                            <Input
                                                placeholder="Enter display name..."
                                                value={joinName}
                                                onChange={(e) => setJoinName(e.target.value)}
                                                className="glass-input h-12"
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-white hover:bg-white/90 text-black font-bold font-display tracking-wide transition-all"
                                            disabled={!joinId.trim() || !joinName.trim()}
                                        >
                                            Connect
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            <Card className="glass-card border-white/10 shadow-2xl">
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-200">
                                        <Plus size={24} />
                                    </div>
                                    <CardTitle className="text-3xl font-display font-bold tracking-tight text-white">New Channel</CardTitle>
                                    <CardDescription className="text-white/40 font-sans">
                                        Initialize a secured encrypted workspace.
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={handleCreate}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-white/50 ml-1 uppercase tracking-wider font-display">
                                                Your Alias
                                            </label>
                                            <Input
                                                placeholder="Enter display name..."
                                                value={createName}
                                                onChange={(e) => setCreateName(e.target.value)}
                                                className="glass-input h-12"
                                                autoFocus
                                            />
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60 leading-relaxed font-sans">
                                            <div className="flex items-center gap-2 mb-2 text-white/80 font-bold">
                                                <Radio size={14} className="text-emerald-400" /> Auto-Generated ID
                                            </div>
                                            A unique, secure channel ID will be generated automatically. Share this ID with others to let them join.
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-white hover:bg-white/90 text-black font-bold font-display tracking-wide transition-all"
                                            disabled={!createName.trim()}
                                        >
                                            Initialize
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Home;
