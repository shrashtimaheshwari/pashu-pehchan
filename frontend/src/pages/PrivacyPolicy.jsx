import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const location = useLocation();
    const fromRegister = location.state?.from === '/register';
    const backLink = fromRegister ? '/register' : '/';
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
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-extrabold text-text-main mb-4">Privacy Policy</h1>
                    <p className="text-text-muted text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="prose prose-lg max-w-none space-y-8 text-text-muted leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">1. Information We Collect</h2>
                        <p>
                            Our platform collects personal information including name and email address when you register. 
                            We also collect image data that you upload for cattle breed identification purposes. This information is essential for 
                            providing our services and improving our AI models.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">2. How We Use Your Information</h2>
                        <p>We use the information collected to:</p>
                        <ul className="list-disc pl-6 space-y-2 ml-4">
                            <li>Provide and improve our cattle breed identification services</li>
                            <li>Maintain and enhance our AI models for better accuracy</li>
                            <li>Generate analytics and reports on breed distribution</li>
                            <li>Send important updates and service notifications</li>
                            <li>Comply with government agricultural initiatives</li>
                            <li>Ensure platform security and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">3. Data Security</h2>
                        <p>
                            We implement industry-standard security measures to protect your personal information. All data is encrypted in transit 
                            and at rest. Your images and identifying information are stored securely and accessed only by authorized personnel and 
                            our AI systems. Despite our efforts, no security system is impenetrable, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">4. Data Sharing</h2>
                        <p>
                            We do not sell your personal information to third parties. However, we may share:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 ml-4">
                            <li>Aggregated and anonymized data for research and policy purposes</li>
                            <li>Information with government agencies as required by law</li>
                            <li>Data with our trusted technology partners who assist in service delivery</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">5. Your Rights</h2>
                        <p>
                            You have the right to access, correct, or delete your personal data. You can request a copy of your data or ask for 
                            its deletion by contacting our support team. Please note that deleting data may limit your ability to use certain 
                            features of our platform.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">6. Session Management with JWT Tokens</h2>
                        <p>
                            We use JSON Web Tokens (JWT) to securely manage user sessions and authenticate your requests. These tokens are generated 
                            upon login and stored securely on your device. JWT tokens contain encrypted information about your session and are used 
                            to verify your identity without storing session data on our servers. Tokens expire after a set period and require 
                            re-authentication. This approach ensures better security and privacy compared to traditional session management.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">7. Children's Privacy</h2>
                        <p>
                            Our platform is not intended for individuals under 18 years of age. We do not knowingly collect information from anyone 
                            under 18. If we become aware that someone under 18 has provided us with personal information, we will take steps to 
                            delete such information promptly.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">8. Policy Changes</h2>
                        <p>
                            We reserve the right to update this privacy policy at any time. Changes will be effective immediately upon posting to 
                            our website. Your continued use of our platform constitutes your acceptance of the updated privacy policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">9. Contact Us</h2>
                        <p>
                            If you have any questions or concerns about this privacy policy or our privacy practices, please contact us at support@pashupehchan.gov.in 
                            or through our support page.
                        </p>
                    </section>
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

export default PrivacyPolicy;
