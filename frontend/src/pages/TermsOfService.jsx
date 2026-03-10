import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';

const TermsOfService = () => {
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
                    <h1 className="text-4xl font-extrabold text-text-main mb-4">Terms of Service</h1>
                    <p className="text-text-muted text-lg">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div className="prose prose-lg max-w-none space-y-8 text-text-muted leading-relaxed">
                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing and using the Pashu Pehchan platform, you agree to abide by these Terms of Service. If you do not agree 
                            to any part of these terms, you are not permitted to use this platform. We reserve the right to modify these terms 
                            at any time, and your continued use constitutes acceptance of the modified terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">2. Eligibility</h2>
                        <p>
                            To use our platform, you must be at least 18 years of age or have parental consent. By registering, you represent and 
                            warrant that you have the legal capacity to enter into this agreement. If you are registering on behalf of an 
                            organization, you represent that you have the authority to bind that organization to these terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">3. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2 ml-4">
                            <li>Provide accurate and complete information during registration</li>
                            <li>Maintain the confidentiality of your account credentials</li>
                            <li>Be responsible for all activities under your account</li>
                            <li>Use the platform only for lawful purposes</li>
                            <li>Respect the intellectual property rights of others</li>
                            <li>Not engage in any form of harassment or abusive behavior</li>
                            <li>Not attempt to gain unauthorized access to the platform</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">4. Image Upload and Usage</h2>
                        <p>
                            When you upload images to our platform, you grant us a non-exclusive, worldwide license to use these images for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 ml-4">
                            <li>Processing and providing identification services</li>
                            <li>Improving and training our AI models</li>
                            <li>Research and development purposes</li>
                            <li>Generating anonymized statistical data and reports</li>
                        </ul>
                        <p className="mt-4">
                            You warrant that you have the right to upload these images and that they do not infringe upon any third-party rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">5. Limitations of Liability</h2>
                        <p>
                            Pashu Pehchan provides the platform "as-is" without any warranties, express or implied. To the maximum extent permitted 
                            by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from 
                            your use of the platform or inability to use it, even if we have been advised of the possibility of such damages.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">6. Intellectual Property</h2>
                        <p>
                            All content, features, and functionality of our platform, including software, text, graphics, logos, and images, are 
                            owned by Pashu Pehchan or its content suppliers and are protected by international copyright and intellectual property 
                            laws. You may not reproduce, distribute, or transmit any content without our prior written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">7. Account Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate your account at any time, with or without cause. Reasons for termination 
                            may include violation of these Terms of Service, illegal activity, or any conduct we deem harmful to our platform or users. 
                            Upon termination, your right to use the platform ceases immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">8. Prohibited Activities</h2>
                        <p>You may not:</p>
                        <ul className="list-disc pl-6 space-y-2 ml-4">
                            <li>Upload false or misleading images</li>
                            <li>Attempt to reverse-engineer or modify our AI models</li>
                            <li>Use automated tools or bots to access the platform</li>
                            <li>Engage in harassment, threats, or abusive language</li>
                            <li>Attempt to gain unauthorized access to the platform</li>
                            <li>Upload viruses, malware, or harmful code</li>
                            <li>Use the platform for commercial purposes without authorization</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">9. Governing Law</h2>
                        <p>
                            These Terms of Service are governed by the laws of India. Any disputes arising from these terms or your use of the 
                            platform shall be subject to the exclusive jurisdiction of the courts in India.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-text-main mb-4">10. Contact Information</h2>
                        <p>
                            For questions regarding these Terms of Service, please contact us at support@pashupehchan.gov.in or through our support page.
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

export default TermsOfService;
