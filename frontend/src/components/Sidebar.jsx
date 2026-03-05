import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, UploadCloud, History as HistoryIcon, BarChart2, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    const isActive = (path) => location.pathname === path;

    const handleNav = (path) => {
        navigate(path);
        setOpen(false); // auto-close on mobile
    };

    const navItems = [
        { path: '/dashboard', icon: UploadCloud, label: t('nav.newScan') },
        { path: '/history', icon: HistoryIcon, label: t('nav.history') },
        { path: '/analytics', icon: BarChart2, label: t('nav.analytics') },
    ];

    const sidebarContent = (
        <>
            <div className="px-6 mb-8 text-white font-bold text-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Home className="text-primary w-6 h-6" /> Pashu Pehchan
                </div>
                {/* Close button - mobile only */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden p-1 text-slate-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <div
                        key={path}
                        onClick={() => handleNav(path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-colors ${isActive(path) ? 'bg-primary text-white' : 'hover:bg-slate-800'}`}
                    >
                        <Icon className="w-5 h-5" /> {label}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800 space-y-3">
                <div className="px-2">
                    <p className="text-sm opacity-60">{t('nav.loggedInAs')}</p>
                    <p className="font-semibold text-white truncate">{user?.name || 'User'}</p>
                </div>

                <LanguageSwitcher className="w-full justify-center bg-slate-800 text-slate-300 hover:bg-slate-700" />

                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-colors"
                >
                    <LogOut className="w-4 h-4" /> {t('nav.logout')}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 bg-slate-900 text-white p-2 rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile overlay backdrop */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile sidebar (slide-in) */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col pt-6 z-50 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {sidebarContent}
            </div>

            {/* Desktop sidebar (always visible) */}
            <div className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col min-h-screen pt-6 shrink-0">
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
