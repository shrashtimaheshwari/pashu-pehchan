import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UploadCloud, History as HistoryIcon, BarChart2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen pt-6 shrink-0">
            <div className="px-6 mb-8 text-white font-bold text-2xl flex items-center gap-2">
                <Home className="text-primary w-6 h-6" /> Pashu Pehchan
            </div>

            <nav className="flex-1 px-4 space-y-2">
                <div
                    onClick={() => navigate('/dashboard')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive('/dashboard') ? 'bg-primary text-white' : 'hover:bg-slate-800'}`}
                >
                    <UploadCloud className="w-5 h-5" /> New Scan
                </div>
                <div
                    onClick={() => navigate('/history')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive('/history') ? 'bg-primary text-white' : 'hover:bg-slate-800'}`}
                >
                    <HistoryIcon className="w-5 h-5" /> History
                </div>
                <div
                    onClick={() => navigate('/analytics')}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive('/analytics') ? 'bg-primary text-white' : 'hover:bg-slate-800'}`}
                >
                    <BarChart2 className="w-5 h-5" /> Analytics
                </div>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="mb-4 px-2">
                    <p className="text-sm opacity-60">Logged in as</p>
                    <p className="font-semibold text-white truncate">{user?.name || 'User'}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
