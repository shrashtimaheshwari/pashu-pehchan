import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UploadCloud, Activity } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white text-slate-900">
            {/* Navbar */}
            <header className="px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-primary-dark">Pashu Pehchan</span>
                </div>
                <nav className="flex gap-4 items-center">
                    <Link to="/login" className="text-slate-600 hover:text-primary font-medium transition-colors">Login</Link>
                    <Link to="/register" className="bg-primary hover:bg-primary-light text-white px-5 py-2 rounded-xl shadow-md transition-all duration-300">
                        Get Started
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <main className="flex-grow">
                <section className="bg-accent/30 py-20 px-6 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-primary-dark tracking-tight mb-6">
                            AI-Based Cattle Breed Identification
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
                            Empowering field workers and authorities with instant, accurate breed identification for cattle and buffaloes using advanced artificial intelligence.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link to="/register" className="bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-xl shadow-md font-bold text-lg transition-all duration-300 transform hover:-translate-y-1">
                                Start Identifying Now
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 bg-primary text-white">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-extrabold mb-2">98.5%</p>
                            <p className="text-primary-100 font-medium opacity-90">Identification Accuracy</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold mb-2">50+</p>
                            <p className="text-primary-100 font-medium opacity-90">Supported Breeds</p>
                        </div>
                        <div>
                            <p className="text-4xl font-extrabold mb-2">&lt; 2s</p>
                            <p className="text-primary-100 font-medium opacity-90">Processing Time</p>
                        </div>
                    </div>
                </section>

                {/* How it Works Section */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-primary-dark mb-16">How It Works</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <UploadCloud className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">1. Upload Image</h3>
                                <p className="text-slate-600">Take a clear photo of the cattle or buffalo and upload it to our secure platform.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <Activity className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">2. AI Analysis</h3>
                                <p className="text-slate-600">Our advanced ML models instantly process the visual features of the animal.</p>
                            </div>

                            <div className="flex flex-col items-center text-center group">
                                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                    <ShieldCheck className="w-10 h-10 text-secondary" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800">3. Get Results</h3>
                                <p className="text-slate-600">Receive accurate breed information, confidence scores, and detailed characteristics.</p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 border-t border-slate-800 py-8 px-6 text-center text-slate-400">
                <p>© {new Date().getFullYear()} Pashu Pehchan. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Landing;
