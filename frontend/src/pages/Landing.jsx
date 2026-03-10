import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, UploadCloud, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-14 h-14 object-contain" />
                        <span className="text-xl font-bold text-primary tracking-tight">Pashu Pehchan</span>
                    </div>
                    <div className="flex gap-4 items-center">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-bold text-primary hover:bg-accent rounded-xl transition-all whitespace-nowrap"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="bg-primary hover:bg-primary-light text-white px-6 py-2.5 rounded-xl shadow-lg shadow-primary/20 font-bold text-sm transition-all whitespace-nowrap"
                        >
                            Sign Up
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-32 px-6">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-primary text-xs font-bold mb-6 tracking-wider uppercase">
                                <Activity className="w-3.5 h-3.5" /> Empowering Indian Agriculture
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold text-text-main leading-[1.1] mb-8">
                                <span className="text-primary italic">AI-Based</span> Cattle Breed Identification
                            </h1>
                            <p className="text-lg md:text-xl text-text-muted mb-10 leading-relaxed max-w-lg">
                                Join our mission to identify and track native cattle breeds. Your contribution helps preserve India's biological heritage using advanced AI technology.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/register" className="btn-primary px-10 py-4 text-lg">
                                    Start Identifying <UploadCloud className="w-5 h-5" />
                                </Link>
                            </div>

                            <div className="mt-12 flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-secondary" />
                                    <span className="text-sm font-bold text-text-muted">Government Backed</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-secondary" />
                                    <span className="text-sm font-bold text-text-muted">Secure AI Portal</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -rotate-3 blur-3xl" />
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border border-white/20 aspect-[4/3]">
                                <img
                                    src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="Cattle Breed Identification"
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-accent/20 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-text-main mb-4">Precision Identification</h2>
                            <p className="text-text-muted font-medium">Built for accuracy and speed, helping farmers and authorities make data-driven decisions.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card p-8 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Instant Upload</h3>
                                <p className="text-text-muted leading-relaxed">Capture images in the field and sync them instantly to our cloud infrastructure for processing.</p>
                            </div>

                            <div className="card p-8 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                                    <Activity className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
                                <p className="text-text-muted leading-relaxed">Get detailed insights into breed distribution and cattle population across different regions.</p>
                            </div>

                            <div className="card p-8 group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                                    <ShieldCheck className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Heritage Preservation</h3>
                                <p className="text-text-muted leading-relaxed">Document and preserve India's native cattle breeds for future generations through comprehensive digital records.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-primary py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                        <span className="text-white font-bold text-xl">Pashu Pehchan</span>
                    </div>
                    <p className="text-white/60 text-sm font-medium">© {new Date().getFullYear()} Pashu Pehchan. Government of India Initiative.</p>
                    <div className="flex gap-6">
                        <Link to="/privacy-policy" className="text-white/60 hover:text-white transition-colors text-sm font-bold">Privacy Policy</Link>
                        <Link to="/terms-of-service" className="text-white/60 hover:text-white transition-colors text-sm font-bold">Terms of Service</Link>
                        <Link to="/support" className="text-white/60 hover:text-white transition-colors text-sm font-bold">Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
