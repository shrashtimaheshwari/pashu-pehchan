import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, RotateCcw, AlertTriangle } from 'lucide-react';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const result = location.state?.result;
    const preview = location.state?.preview;

    useEffect(() => {
        // Redirect back to dashboard if no data is present
        if (!result || !preview) {
            navigate('/dashboard');
        }
    }, [result, preview, navigate]);

    if (!result || !preview) return null;

    const getConfColor = (score) => {
        if (score > 90) return 'bg-green-500';
        if (score > 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-primary font-medium mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" /> Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-slate-800 mb-8">Scan Results</h1>

                {result.blurWarning && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
                        <AlertTriangle className="w-6 h-6 text-yellow-500" />
                        <p className="font-medium">Warning: Low image clarity detected. This may affect the accuracy of the identification.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left - Uploaded Image */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center h-[500px]">
                        <img
                            src={preview}
                            alt="Uploaded Cattle"
                            className="max-h-full max-w-full object-contain rounded-xl"
                        />
                    </div>

                    {/* Right - Results & Metadata */}
                    <div className="flex flex-col gap-6">

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Identified Breed</p>
                                    <h2 className="text-4xl font-black text-primary-dark">{result.breed}</h2>
                                </div>
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <CheckCircle className="w-8 h-8 text-primary" />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-semibold text-slate-700">Confidence Score</span>
                                    <span className="text-2xl font-bold">{result.confidence.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-1000 ${getConfColor(result.confidence)}`}
                                        style={{ width: `${result.confidence}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-secondary" /> Breed Information
                            </h3>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Origin</p>
                                    <p className="font-semibold">{result.info_card?.origin || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Average Milk Yield</p>
                                    <p className="font-semibold">{result.info_card?.milk_yield || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-sm text-slate-500 mb-1">Key Characteristics</p>
                                    <p className="font-medium text-slate-700">{result.info_card?.characteristics || 'No detail available.'}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-auto w-full py-4 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all flex items-center justify-center gap-2"
                        >
                            <RotateCcw className="w-5 h-5" /> Scan Another Animal
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PredictionResult;
