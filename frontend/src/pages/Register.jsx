import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register } = useAuth();
    const { addToast } = useUI();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = true;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = true;
        if (!password || password.length < 6) newErrors.password = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            addToast('Please provide valid details.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await register(name, email, password);
            addToast('Account created successfully!', 'success');
            navigate('/dashboard');
        } catch (err) {
            addToast(err.response?.data?.message || 'Registration failed. Try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Left split - Illustration */}
            <div className="hidden lg:flex w-1/2 bg-secondary text-white p-12 flex-col justify-between">
                <div className="flex items-center gap-2">
                    <Activity className="w-8 h-8 text-accent" />
                    <span className="text-2xl font-bold">Pashu Pehchan</span>
                </div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">Join our Platform</h1>
                    <p className="text-orange-100 text-lg">
                        Create an account to start identifying cattle breeds with AI instantly. Support government records with highly accurate insights.
                    </p>
                </div>
                <div className="text-sm opacity-60">
                    Transforming standard identification workflows.
                </div>
            </div>

            {/* Right split - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-secondary mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Create an Account</h2>
                    <p className="text-slate-500 mb-8">Sign up to access AI identification tools.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({ ...errors, name: false });
                                }}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="Ramesh Kumar"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors({ ...errors, email: false });
                                }}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-slate-300'
                                    }`}
                                placeholder="ramesh@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
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

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-secondary hover:bg-[#a6561b] text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary font-bold hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
