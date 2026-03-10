import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Clock, Zap } from 'lucide-react';
import { useUI } from '../context/UIContext';
import api from '../api/axios';
import logo from '../assets/logo.png';

const Support = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const location = useLocation();
    const fromRegister = location.state?.from === '/register';
    const backLink = fromRegister ? '/register' : '/';
    const { addToast } = useUI();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'general',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('/support/contact', formData);
            if (response.data.success) {
                addToast(response.data.message, 'success');
                setFormData({
                    name: '',
                    email: '',
                    category: 'general',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.';
            addToast(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                        <span className="text-xl font-bold text-primary tracking-tight">Pashu Pehchan</span>
                    </Link>
                    <Link to={backLink} state={fromRegister ? { formData: location.state?.formData } : {}} className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to {fromRegister ? 'Registration' : 'Home'}
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-16">
                    <h1 className="text-4xl font-extrabold text-text-main mb-4">Support Center</h1>
                    <p className="text-text-muted text-lg">We're here to help. Get in touch with us for any questions or issues.</p>
                </div>

                {/* Support Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="card p-6 border-l-4 border-l-secondary">
                        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-secondary" />
                        </div>
                        <h3 className="font-bold text-lg text-text-main mb-2">Email Support</h3>
                        <p className="text-text-muted text-sm">Email us at support@pashupehchan.gov.in for detailed assistance.</p>
                    </div>

                    <div className="card p-6 border-l-4 border-l-accent">
                        <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                            <Clock className="w-6 h-6 text-accent" />
                        </div>
                        <h3 className="font-bold text-lg text-text-main mb-2">Response Time</h3>
                        <p className="text-text-muted text-sm">We respond to support requests within 24 hours on business days.</p>
                    </div>

                    <div className="card p-6 border-l-4 border-l-primary">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg text-text-main mb-2">FAQ</h3>
                        <p className="text-text-muted text-sm">Check our FAQ section for quick answers to common questions.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-text-main mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-text-main mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-text-main mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                    >
                                        <option value="general">General Inquiry</option>
                                        <option value="technical">Technical Issue</option>
                                        <option value="account">Account Issue</option>
                                        <option value="identification">Identification Problem</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                                        placeholder="What is this about?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-text-main mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows="6"
                                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white resize-none"
                                        placeholder="Please describe your issue in detail..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin inline-block h-4 w-4 border-2 border-white/30 border-t-white mr-2 rounded-full" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="lg:col-span-1">
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-text-main mb-6">Frequently Asked Questions</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-text-main mb-2">How long does identification take?</h3>
                                    <p className="text-text-muted text-sm">Most identifications are processed within 2-3 minutes.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-2">What image formats are supported?</h3>
                                    <p className="text-text-muted text-sm">We support JPG, JPEG, and PNG formats up to 5MB each.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-2">Can I download my identification history?</h3>
                                    <p className="text-text-muted text-sm">Yes, you can download your history as a PDF from your dashboard.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-2">How is my data protected?</h3>
                                    <p className="text-text-muted text-sm">All data is encrypted and stored securely with regular backups.</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main mb-2">What if the AI gets it wrong?</h3>
                                    <p className="text-text-muted text-sm">You can report inaccuracies, and our team will review them.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-primary py-12 px-6 mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
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

export default Support;
