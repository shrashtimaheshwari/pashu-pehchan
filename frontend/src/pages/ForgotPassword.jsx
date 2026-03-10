import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../api/axios';
import logo from '../assets/logo.png';

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

    const passwordCriteria = [
        { id: 'length', text: 'At least 8 characters', regex: /.{8,}/ },
        { id: 'uppercase', text: 'One uppercase letter', regex: /[A-Z]/ },
        { id: 'lowercase', text: 'One lowercase letter', regex: /[a-z]/ },
        { id: 'number', text: 'One number (0-9)', regex: /[0-9]/ }
    ];

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        const isPasswordValid = passwordCriteria.every(criterion => criterion.regex.test(password));
        if (!password || !isPasswordValid) {
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
        <div className="flex min-h-screen bg-white">
            {/* Left split - Brand & Illustration */}
            <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    alt="Background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent" />

                <div className="relative z-10 w-full p-16 flex flex-col justify-between h-full">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
                        <span className="text-2xl font-bold text-white tracking-tight">Pashu Pehchan</span>
                    </div>

                    <div>
                        <h1 className="text-5xl font-black text-white leading-tight mb-6">
                            Security First <br />
                            Agriculture <br />
                            <span className="text-secondary italic">Data Management</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium leading-relaxed max-w-md">
                            Recover your account securely. We use multi-factor authentication to ensure your field data remains protected.
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-white/60" />
                            <span className="text-sm font-bold text-white/60 uppercase tracking-widest italic">Government Backed</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right split - Content */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                {/* Language Switcher */}
                <div className="absolute top-8 right-8 z-20">
                    <LanguageSwitcher className="bg-accent text-primary border-none font-bold px-4 py-2 rounded-xl" />
                </div>

                {/* Back Button */}
                <div className="absolute top-8 left-8 z-20">
                    <Link to="/login" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> {t('auth.forgot.backToLogin')}
                    </Link>
                </div>

                <div className="max-w-md w-full animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="mb-10 text-center lg:text-left">

                        {step === 1 && (
                            <>
                                <h2 className="text-4xl font-black text-text-main mb-3">{t('auth.forgot.step1Title')}</h2>
                                <p className="text-text-muted font-medium">{t('auth.forgot.desc1')}</p>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h2 className="text-4xl font-black text-text-main mb-3">{t('auth.forgot.step2Title')}</h2>
                                <p className="text-text-muted font-medium">{t('auth.forgot.desc2')} <strong>{email}</strong>.</p>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h2 className="text-4xl font-black text-text-main mb-3">{t('auth.forgot.step3Title')}</h2>
                                <p className="text-text-muted font-medium">{t('auth.forgot.desc3')}</p>
                            </>
                        )}
                    </div>

                    <div className="mt-8">
                        {step === 1 && (
                            <form onSubmit={handleSendCode} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2 tracking-wide uppercase">{t('auth.forgot.email')}</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-lg"
                                        placeholder={t('auth.forgot.emailPlaceholder')}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/10"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            {t('auth.forgot.sending')}
                                        </>
                                    ) : (
                                        <>
                                            {t('auth.forgot.sendCodeBtn')} <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handleVerifyCode} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2 tracking-wide uppercase">{t('auth.forgot.code')}</label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.5em] text-center font-black text-2xl text-primary"
                                        placeholder="••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/10"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            {t('auth.forgot.verifying')}
                                        </>
                                    ) : (
                                        <>
                                            {t('auth.forgot.verifyCodeBtn')} <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-sm font-bold text-text-muted hover:text-primary transition-colors"
                                >
                                    Didn't get the code? Try again
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <form onSubmit={handleResetPassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2 tracking-wide uppercase">{t('auth.forgot.newPassword')}</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl border border-border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-lg"
                                            placeholder={t('auth.forgot.newPasswordPlaceholder')}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    
                                    {/* Interactive Password Checklist */}
                                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 p-4 bg-slate-50 rounded-xl border border-border">
                                        {passwordCriteria.map(criterion => {
                                            const isMet = criterion.regex.test(password);
                                            return (
                                                <div key={criterion.id} className="flex items-center gap-2">
                                                    {isMet ? (
                                                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-text-muted shrink-0" />
                                                    )}
                                                    <span className={`text-xs font-bold transition-colors ${isMet ? 'text-green-600' : 'text-text-muted'}`}>
                                                        {criterion.text}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                                        {t('auth.forgot.passwordHelper')}
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/10"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            {t('auth.forgot.resetting')}
                                        </>
                                    ) : (
                                        <>
                                            {t('auth.forgot.resetBtn')} <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
