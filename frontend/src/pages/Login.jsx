import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import { GoogleLogin } from '@react-oauth/google';
import LanguageSwitcher from '../components/LanguageSwitcher';
import logo from '../assets/logo.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, loginWithGoogle } = useAuth();
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
                            Empowering Indian <br />
                            Agriculture through <br />
                            <span className="text-secondary italic">Artificial Intelligence</span>
                        </h1>
                        <p className="text-white/80 text-lg font-medium leading-relaxed max-w-md">
                            Join our mission to identify and track native cattle breeds. Your contribution helps preserve India's biological heritage.
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
                    <Link to="/" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-primary transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> {t('result.backBtn')}
                    </Link>
                </div>

                <div className="max-w-md w-full animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-black text-text-main mb-3">{t('auth.login.title')}</h2>
                        <p className="text-text-muted font-medium">{t('auth.login.subtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-text-main mb-2 tracking-wide uppercase">{t('auth.login.email')}</label>
                            <input
                                type="email"
                                value={email}
                                autoComplete="username"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: false });
                                }}
                                className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all
                                    ${errors.email ? 'border-red-500 bg-red-50' : 'border-border'}`}
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-main mb-2 tracking-wide uppercase">{t('auth.login.password')}</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    autoComplete="current-password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors({ ...errors, password: false });
                                    }}
                                    className={`w-full px-5 py-4 rounded-2xl border bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all
                                        ${errors.password ? 'border-red-500 bg-red-50' : 'border-border'}`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm font-bold text-text-muted cursor-pointer select-none group">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 mr-3"
                                />
                                <span className="group-hover:text-primary transition-colors">{t('auth.login.rememberMe')}</span>
                            </label>
                            <Link to="/forgot-password" size="sm" className="text-sm font-bold text-primary hover:underline underline-offset-4 Decoration-2">
                                {t('auth.login.forgotPassword')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary py-4 text-lg shadow-xl shadow-primary/10"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-2" />
                                    {t('auth.login.signingIn')}
                                </>
                            ) : (
                                <>
                                    {t('auth.login.signInBtn')} <ArrowLeft className="w-5 h-5 rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-center space-x-4">
                        <div className="h-px bg-border flex-1"></div>
                        <span className="text-text-muted font-bold text-sm uppercase tracking-wider">{t('auth.login.orContinueWith', 'Or')}</span>
                        <div className="h-px bg-border flex-1"></div>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                setIsSubmitting(true);
                                try {
                                    await loginWithGoogle(credentialResponse.credential);
                                    addToast('Successfully logged in with Google!', 'success');
                                    navigate('/dashboard');
                                } catch (err) {
                                    addToast(err.response?.data?.message || 'Google Login failed. Try again.', 'error');
                                } finally {
                                    setIsSubmitting(false);
                                }
                            }}
                            onError={() => {
                                addToast('Google Login Failed', 'error');
                            }}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="continue_with"
                            width="100%"
                        />
                    </div>

                    <div className="mt-12 text-center border-t border-border pt-8">
                        <p className="text-text-muted font-medium">
                            {t('auth.login.noAccount')}{' '}
                            <Link to="/register" className="text-primary font-black hover:underline underline-offset-4 decoration-2">
                                {t('auth.login.signUpLink')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
