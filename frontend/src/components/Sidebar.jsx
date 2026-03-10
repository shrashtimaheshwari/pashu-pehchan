import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UploadCloud, History as HistoryIcon, BarChart2, X, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import logo from '../assets/logo.png';

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
            <div className="px-6 mb-10 mt-2 flex items-center justify-between">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => handleNav('/')}
                >
                    <img src={logo} alt="Pashu Pehchan" className="w-14 h-14 object-contain" />
                    <span className="text-primary font-bold text-xl tracking-tight">Pashu Pehchan</span>
                </div>
                {/* Close button - mobile only */}
                <button
                    onClick={() => setOpen(false)}
                    className="md:hidden p-2 text-text-muted hover:text-primary transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = isActive(path);
                    return (
                        <div
                            key={path}
                            onClick={() => handleNav(path)}
                            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl cursor-pointer transition-all duration-300 group
                                ${active
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                                    : 'text-text-muted hover:bg-accent hover:text-primary'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${active ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                            <span className="font-semibold tracking-wide">{label}</span>
                        </div>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-border mt-auto">
                <div className="mb-6 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-text-muted font-medium uppercase tracking-wider">{t('nav.loggedInAs')}</p>
                        <p className="font-bold text-text-main truncate">{user?.name || 'User'}</p>
                        
                    </div>
                </div>

                <div className="space-y-3">
                    <LanguageSwitcher className="w-full justify-center bg-accent text-primary hover:bg-primary/10 border-none font-bold py-3 rounded-2xl" />

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all font-semibold"
                    >
                        <LogOut className="w-4 h-4" /> {t('nav.logout')}
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setOpen(true)}
                className="md:hidden fixed top-4 left-4 z-40 bg-white border border-border text-primary p-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-95"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile overlay backdrop */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 bg-primary/20 z-40 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Mobile sidebar (slide-in) */}
            <div
                className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white flex flex-col pt-8 z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
                    }`}
            >
                {sidebarContent}
            </div>

            {/* Desktop sidebar (always visible) */}
            <div className="hidden md:flex w-72 bg-white border-r border-border flex-col h-screen sticky top-0 pt-8 shrink-0">
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
