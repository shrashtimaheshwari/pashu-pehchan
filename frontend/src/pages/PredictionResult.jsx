import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, RotateCcw, AlertTriangle, Download, Activity, ShieldCheck, Database, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { useUI } from '../context/UIContext';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { addToast } = useUI();

    const result = location.state?.result;
    const preview = location.state?.preview;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!result || !preview) {
            navigate('/dashboard');
        }
    }, [result, preview, navigate]);

    if (!result || !preview) return null;

    const handleDownload = async () => {
        const id = result.id || result._id;
        if (!id) return;

        setIsDownloading(true);
        try {
            const resp = await api.get(`/predictions/${id}/report`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            addToast('Report downloaded successfully', 'success');
        } catch (err) {
            addToast('Download failed', 'error');
        } finally {
            setIsDownloading(false);
        }
    };

    const getConfColor = (score) => {
        if (score > 90) return 'text-primary';
        if (score > 70) return 'text-secondary';
        return 'text-red-500';
    };

    const getBgColor = (score) => {
        if (score > 90) return 'bg-primary/5';
        if (score > 70) return 'bg-secondary/5';
        return 'bg-red-50';
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Minimal Header */}
            <div className="bg-white border-b border-border/50 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-3 text-text-muted hover:text-primary font-bold transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="hidden sm:inline">Back to Dashboard</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isDownloading ? <Activity className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {t('common.download')} Report
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Visual Section */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-32">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative bg-white p-4 rounded-[2.5rem] border border-border shadow-2xl overflow-hidden aspect-[4/5]">
                                    <img
                                        src={preview}
                                        alt="Uploaded Cattle"
                                        className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {result.blurWarning && (
                                        <div className="absolute bottom-10 left-10 right-10 bg-red-600/90 backdrop-blur-md text-white p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <AlertTriangle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black italic uppercase tracking-widest text-[10px]">Quality Warning</p>
                                                <p className="font-bold text-sm">Low Image Clarity Detected</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 flex gap-6">
                                <div className="flex-1 bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Scan Date</p>
                                        <p className="font-bold text-text-main">{new Date().toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                                        <Database className="w-6 h-6 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Status</p>
                                        <p className="font-bold text-text-main">Verified Scan</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="lg:w-1/2 space-y-10">
                        <header>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest italic mb-6">
                                <CheckCircle className="w-4 h-4" /> Primary Match Identified
                            </div>
                            <h1 className="text-6xl font-black text-text-main mb-6 leading-none">
                                {t(`breeds.${result.breed}`, { defaultValue: result.breed })}
                            </h1>
                        </header>

                        {/* Confidence Card */}
                        <div className={`p-10 rounded-[3rem] border-2 border-primary/10 relative overflow-hidden ${getBgColor(result.confidence)}`}>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-text-main mb-2">Identification Confidence</h3>
                                    <p className="text-text-muted font-medium max-w-[200px]">Based on our high-precision deep learning algorithm.</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-6xl font-black italic tracking-tighter ${getConfColor(result.confidence)}`}>
                                        {Math.round(result.confidence)}%
                                    </span>
                                </div>
                            </div>
                            <div className="mt-8 w-full bg-white/50 h-4 rounded-full overflow-hidden border border-primary/5">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 delay-300 shadow-[0_0_20px_rgba(45,90,39,0.3)]"
                                    style={{ width: `${result.confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Probabilities */}
                        <div className="bg-white p-10 rounded-[3rem] border border-border shadow-sm">
                            <h3 className="text-xl font-black text-text-main mb-8 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-secondary" /> Other Potential Matches
                            </h3>
                            <div className="space-y-6">
                                {(result.probabilities || []).map((p, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                                            <span className="text-text-main">{t(`breeds.${p.breed}`, { defaultValue: p.breed })}</span>
                                            <span className="text-text-muted italic">{Math.round(p.score * 100)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-slate-200 rounded-full"
                                                style={{ width: `${p.score * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {(!result.probabilities || result.probabilities.length === 0) && (
                                    <div className="p-8 bg-slate-50 rounded-2xl text-center">
                                        <Info className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                        <p className="text-text-muted font-bold italic">No secondary matches detected.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-6 px-10 rounded-[2rem] font-black text-primary bg-primary/10 hover:bg-primary/20 transition-all flex items-center justify-center gap-4 group"
                            >
                                <RotateCcw className="w-6 h-6 transition-transform group-hover:rotate-180 duration-500" />
                                Scan Another
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                className="flex-1 py-6 px-10 rounded-[2rem] font-black text-text-main bg-slate-50 border border-border hover:bg-slate-100 transition-all flex items-center justify-center gap-4"
                            >
                                <Database className="w-6 h-6" />
                                View Scan History
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PredictionResult;
