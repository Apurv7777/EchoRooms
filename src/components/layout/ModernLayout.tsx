import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernLayoutProps {
    children: React.ReactNode;
}

const ModernLayout: React.FC<ModernLayoutProps> = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: "/", icon: LogIn, label: "Home" },
        { path: "/chat", icon: MessageSquare, label: "Chat" },
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-white/20">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-30%] left-[20%] w-[70vw] h-[80vw] bg-slate-900/40 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
                {/* Grain Overlay */}
                <div className="absolute inset-0 z-10 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* Floating Navbar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/20 backdrop-blur-2xl border border-white/10 shadow-2xl">
                    {navItems.map(({ path, icon: Icon, label }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Link
                                key={path}
                                to={path}
                                className={cn(
                                    "relative px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-300",
                                    isActive
                                        ? "text-white bg-white/10 shadow-lg"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <Icon size={16} />
                                <span>{label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 rounded-full bg-white/5 border border-white/10 -z-10"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 pt-28 px-4 pb-8 min-h-screen flex flex-col items-center">
                <motion.div
                    key={location.pathname}
                    className="w-full max-w-5xl"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default ModernLayout;
