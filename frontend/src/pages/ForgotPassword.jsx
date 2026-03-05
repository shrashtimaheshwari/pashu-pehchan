import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useUI } from '../context/UIContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addToast } = useUI();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            addToast(t('auth.forgot.alerts.emailInvalid'), 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/auth/forgot-password', { email });
            addToast(t('auth.forgot.alerts.codeSent'), 'success');
            setStep(2);
        } catch (err) {
            addToast(t('auth.forgot.alerts.sendError'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!code || code.length !== 6) {
            addToast(t('auth.forgot.alerts.codeInvalid'), 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/auth/verify-reset-code', { email, code });
            addToast(t('auth.forgot.alerts.codeVerified'), 'success');
            setStep(3);
        } catch (err) {
            addToast(err.response?.data?.message || t('auth.forgot.alerts.codeError'), 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            addToast(t('auth.forgot.alerts.passShort'), 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/auth/reset-password', { email, code, password });
            addToast(t('auth.forgot.alerts.resetSuccess'), 'success');
            navigate('/login');
        } catch (err) {
            addToast(err.response?.data?.message || t('auth.forgot.alerts.resetError'), 'error');
            setStep(1); // Reset flow
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left split - Illustration */}
            <div className="hidden lg:flex w-1/2 bg-primary-dark text-white p-12 flex-col justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-accent" />
                    <span className="text-2xl font-bold">Pashu Pehchan</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">{t('auth.forgot.sidebarTitle')}</h1>
                    <p className="text-primary-100 text-lg">
                        {t('auth.forgot.sidebarSubtitle')}
                    </p>
                </div>
                <div className="text-sm opacity-60">
                    {t('auth.forgot.sidebarFooter')}
                </div>
            </div>

            {/* Right split - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="absolute top-8 right-8">
                    <LanguageSwitcher />
                </div>
                <div className="max-w-md w-full">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> {t('auth.forgot.backToLogin')}
                    </Link>

                    {step === 1 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth.forgot.step1Title')}</h2>
                            <p className="text-slate-500 mb-8">{t('auth.forgot.desc1')}</p>

                            <form onSubmit={handleSendCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.forgot.email')}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                        placeholder={t('auth.forgot.emailPlaceholder')}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.forgot.sending')}</> : t('auth.forgot.sendCodeBtn')}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth.forgot.step2Title')}</h2>
                            <p className="text-slate-500 mb-8">{t('auth.forgot.desc2')} <strong>{email}</strong>.</p>

                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.forgot.code')}</label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors tracking-[0.5em] text-center font-bold text-xl"
                                        placeholder={t('auth.forgot.codePlaceholder')}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.forgot.verifying')}</> : t('auth.forgot.verifyCodeBtn')}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('auth.forgot.step3Title')}</h2>
                            <p className="text-slate-500 mb-8">{t('auth.forgot.desc3')}</p>

                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('auth.forgot.newPassword')}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                            placeholder={t('auth.forgot.newPasswordPlaceholder')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        {t('auth.forgot.passwordHelper')}
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondary hover:bg-[#a6561b] text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> {t('auth.forgot.resetting')}</> : t('auth.forgot.resetBtn')}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
