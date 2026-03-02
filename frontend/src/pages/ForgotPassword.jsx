import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useUI } from '../context/UIContext';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addToast } = useUI();
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            addToast('Please enter a valid email address.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/auth/forgot-password', { email });
            addToast('If an account exists, a code was sent to your email.', 'success');
            setStep(2);
        } catch (err) {
            addToast('Failed to send code. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!code || code.length !== 6) {
            addToast('Please enter the 6-digit code.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post('/auth/verify-reset-code', { email, code });
            addToast('Code verified! Please choose a new password.', 'success');
            setStep(3);
        } catch (err) {
            addToast(err.response?.data?.message || 'Invalid or expired code.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!password || password.length < 6) {
            addToast('Password must be at least 6 characters.', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put('/auth/reset-password', { email, code, password });
            addToast('Password reset successfully! You can now login.', 'success');
            navigate('/login');
        } catch (err) {
            addToast(err.response?.data?.message || 'Failed to reset password.', 'error');
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
                    <h1 className="text-4xl font-bold mb-4">Reset Your Password</h1>
                    <p className="text-primary-100 text-lg">
                        Securely regain access to your cattle identification platform.
                    </p>
                </div>
                <div className="text-sm opacity-60">
                    Empowering digital agriculture.
                </div>
            </div>

            {/* Right split - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-primary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>

                    {step === 1 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Forgot Password</h2>
                            <p className="text-slate-500 mb-8">Enter your registered email address and we'll send you a 6-digit recovery code.</p>

                            <form onSubmit={handleSendCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Recovery Code'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Enter Recovery Code</h2>
                            <p className="text-slate-500 mb-8">We sent a 6-digit code to <strong>{email}</strong>.</p>

                            <form onSubmit={handleVerifyCode} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">6-Digit Code</label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors tracking-[0.5em] text-center font-bold text-xl"
                                        placeholder="••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : 'Verify Code'}
                                </button>
                            </form>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create New Password</h2>
                            <p className="text-slate-500 mb-8">Your code was verified. Please enter your new password below.</p>

                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
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
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Password must be at least 6 characters long.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-secondary hover:bg-[#a6561b] text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Resetting...</> : 'Reset Password'}
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
