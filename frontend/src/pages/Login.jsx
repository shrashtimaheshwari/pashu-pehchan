import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const { addToast } = useUI();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const validate = () => {
        const newErrors = {};
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = true;
        if (!password || password.length < 6) newErrors.password = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            addToast('Please correct the highlighted errors.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await login(email, password, rememberMe);
            addToast('Successfully logged in!', 'success');
            navigate('/dashboard');
        } catch (err) {
            addToast(err.response?.data?.message || 'Login failed. Try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Absolute Language Switcher for mobile and desktop right side */}
            <div className="absolute top-4 right-4 z-10">
                <LanguageSwitcher className="bg-white/50 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white shadow-sm" />
            </div>

            {/* Left split - Illustration */}
            <div className="hidden lg:flex w-1/2 bg-primary-dark text-white p-12 flex-col justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-accent" />
                    <span className="text-2xl font-bold">Pashu Pehchan</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{t('auth.login.title')}</h1>
                    <p className="text-primary-100 text-lg">
                        {t('landing.subtitle')}
                    </p>
                </div>
                <div className="text-sm opacity-60">
                    Empowering digital agriculture.
                </div>
            </div>

            {/* Right split - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 pt-16 lg:pt-8">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('result.backBtn')}
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth.login.title')}</h2>
                    <p className="text-slate-500 mb-8">{t('auth.login.subtitle')}</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.login.email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: false });
                                }}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.login.password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: false });
                                    }}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.password ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-slate-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="mr-2 rounded border-slate-300 text-primary focus:ring-primary/50"
                                />
                                {t('auth.login.rememberMe')}
                            </label>
                            <Link to="/forgot-password" className="text-sm text-primary hover:underline">{t('auth.login.forgotPassword')}</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t('auth.login.signingIn') : t('auth.login.signInBtn')}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-600">
                        {t('auth.login.noAccount')} <Link to="/register" className="text-primary font-bold hover:underline">
                            {t('auth.login.signUpLink')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
