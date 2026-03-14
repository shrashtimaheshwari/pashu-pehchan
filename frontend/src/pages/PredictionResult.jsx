import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, RotateCcw, AlertTriangle, Download, Activity, ShieldCheck, Database, Calendar, X, Droplets, Cloud, Heart, Clock, Leaf, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import api from '../api/axios';
import { useUI } from '../context/UIContext';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n: i18nObj } = useTranslation();
    const { addToast } = useUI();

    const result = location.state?.result;
    const preview = location.state?.preview;
    const [isDownloading, setIsDownloading] = useState(false);
    const [showBreedInfo, setShowBreedInfo] = useState(false);
    const [breedDetails, setBreedDetails] = useState(null);
    const [showLangPicker, setShowLangPicker] = useState(false);

    // Get breed details from translations with language nesting
    const getBreedDetails = () => {
        const currentLang = i18n.language;
        // Access the translation resources for current language
        const resource = i18n.getResourceBundle(currentLang, 'translation');
        if (resource && resource.breedDetails && result?.breed) {
            const breedKey = result.breed;
            const details = resource.breedDetails[breedKey];
            if (details && details[currentLang]) {
                return details[currentLang];
            }
        }
        return null;
    };

    useEffect(() => {
        if (!result || !preview) {
            navigate('/dashboard');
        }
        if (result) {
            const details = getBreedDetails();
            setBreedDetails(details);
            console.log('Result breed:', result.breed);
            console.log('Current language:', i18n.language);
            console.log('Breed details loaded:', !!details);
        }
    }, [result, preview, navigate, i18nObj.language]);

    if (!result || !preview) return null;

    const handleDownload = async (lang = 'en') => {
        const id = result.id || result._id;
        if (!id) return;

        setShowLangPicker(false);
        setIsDownloading(true);
        try {
            const resp = await api.get(`/predictions/${id}/report?lang=${lang}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}-${lang}.pdf`);
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
        if (score >= 85) return 'text-primary';
        if (score > 70) return 'text-secondary';
        return 'text-red-500';
    };

    const getBgColor = (score) => {
        if (score >= 85) return 'bg-primary/5';
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
                        <span className="hidden sm:inline">{t('result.backBtn')}</span>
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowLangPicker(true)}
                            disabled={isDownloading}
                            className="btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isDownloading ? <Activity className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {t('result.downloadReport')}
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-6 lg:py-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Visual Section */}
                    <div className="lg:w-1/2">
                        <div className="sticky top-28">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="relative bg-white p-4 rounded-[2rem] border border-border shadow-xl overflow-hidden aspect-[4/3] flex items-center justify-center bg-slate-50">
                                    <img
                                        src={preview}
                                        alt="Uploaded Cattle"
                                        className="w-full h-full object-contain rounded-[2rem] transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {result.blurWarning && (
                                        <div className="absolute bottom-10 left-10 right-10 bg-red-600/90 backdrop-blur-md text-white p-6 rounded-[2rem] flex items-center gap-4 shadow-2xl">
                                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                <AlertTriangle className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="font-black italic uppercase tracking-widest text-[10px]">{t('result.qualityWarning')}</p>
                                                <p className="font-bold text-sm">{t('result.lowImageClarity')}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 flex gap-4">
                                <div className="flex-1 bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('result.scanDate')}</p>
                                        <p className="font-bold text-sm text-text-main">
                                            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 bg-white p-4 rounded-2xl border border-border shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                        <Database className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('result.status')}</p>
                                        <p className="font-bold text-sm text-text-main">{t('result.verifiedScan')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Section */}
                    <div className="lg:w-1/2 space-y-6">
                        <header>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest italic mb-3">
                                <CheckCircle className="w-3 h-3" /> {t('result.primaryMatch')}
                            </div>
                            <h1 className="text-4xl font-black text-text-main mb-2 leading-none">
                                {t(`breeds.${result.breed}`, { defaultValue: result.breed })}
                            </h1>
                        </header>

                        {/* Confidence Card */}
                        <div className={`p-6 rounded-[2rem] border-2 border-primary/10 relative overflow-hidden ${getBgColor(result.confidence)}`}>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-black text-text-main mb-1">{t('result.confidenceScore')}</h3>
                                    <p className="text-sm text-text-muted font-medium max-w-[200px]">Based on our high-precision deep learning algorithm.</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-4xl font-black italic tracking-tighter ${getConfColor(result.confidence)}`}>
                                        {Math.round(result.confidence)}%
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 w-full bg-white/50 h-2.5 rounded-full overflow-hidden border border-primary/5">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-1000 delay-300 shadow-[0_0_20px_rgba(45,90,39,0.3)]"
                                    style={{ width: `${result.confidence}%` }}
                                />
                            </div>
                        </div>

                        {/* Probabilities */}
                        <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                            <h3 className="text-lg font-black text-text-main mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-secondary" /> {t('result.probabilitiesTitle')}
                            </h3>
                            <div className="space-y-4">
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
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-4 px-4 rounded-2xl font-black text-primary bg-primary/10 hover:bg-primary/20 transition-all flex items-center justify-center gap-2 group text-sm"
                            >
                                <RotateCcw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                                {t('result.scanAnother')}
                            </button>
                            <button
                                onClick={() => setShowBreedInfo(true)}
                                className="flex-1 py-4 px-4 rounded-2xl font-black text-secondary bg-secondary/10 hover:bg-secondary/20 transition-all flex items-center justify-center gap-2 group text-sm"
                            >
                                <Info className="w-4 h-4" />
                                {t('result.viewMoreInfo')}
                            </button>
                            <button
                                onClick={() => navigate('/history')}
                                className="flex-1 py-4 px-4 rounded-2xl font-black text-text-main bg-slate-50 border border-border hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <Database className="w-4 h-4" />
                                {t('result.viewHistory')}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Breed Info Modal */}
            {showBreedInfo && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full my-8 relative">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-primary/10 via-white to-secondary/10 border-b border-border p-8 flex items-center justify-between rounded-t-[2.5rem]">
                            <div>
                                <h2 className="text-4xl font-black text-text-main">{t(`breeds.${result.breed}`, { defaultValue: result.breed })}</h2>
                                <p className="text-text-muted font-bold mt-1 uppercase tracking-wider text-xs">{t('result.breedProfile')}</p>
                            </div>
                            <button
                                onClick={() => setShowBreedInfo(false)}
                                className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center hover:bg-slate-50 transition-all shrink-0"
                            >
                                <X className="w-6 h-6 text-text-muted" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
                            {breedDetails ? (
                                <>
                                    {/* Milk Yield */}
                                    <div className="rounded-2xl p-6 border border-primary/20 bg-gradient-to-br from-primary/8 to-transparent">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                <Droplets className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-2">{t('result.breedInfo.milkYield')}</h3>
                                                <p className="text-lg font-bold text-text-main">{breedDetails.milkYield}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Favourable Conditions */}
                                    <div className="rounded-2xl p-6 border border-secondary/20 bg-gradient-to-br from-secondary/8 to-transparent">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                <Cloud className="w-6 h-6 text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-2">{t('result.breedInfo.favourableConditions')}</h3>
                                                <p className="text-sm font-medium text-text-main leading-relaxed">{breedDetails.favourableConditions}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Prone to Diseases */}
                                    <div className="rounded-2xl p-6 border border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                <Heart className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div className="flex-1">
                                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-2">{t('result.breedInfo.diseases')}</h3>
                                                <p className="text-sm font-medium text-text-main leading-relaxed">{breedDetails.diseases}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Average Lifespan */}
                                    <div className="rounded-2xl p-6 border border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                <Clock className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-2">{t('result.breedInfo.avgLifespan')}</h3>
                                                <p className="text-lg font-bold text-text-main">{breedDetails.avgLifespan}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fodder Info */}
                                    <div className="rounded-2xl p-6 border border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                                                <Leaf className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest mb-2">{t('result.breedInfo.fodderInfo')}</h3>
                                                <p className="text-sm font-medium text-text-main leading-relaxed">{breedDetails.fodderInfo}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
                                    <p className="text-text-muted font-bold">Breed: {result?.breed}</p>
                                    <p className="text-text-muted font-bold text-xs mt-2">{t('result.noInfoAvailable')}</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-border p-8 flex gap-4 justify-end rounded-b-[2.5rem] bg-slate-50">
                            <button
                                onClick={() => setShowBreedInfo(false)}
                                className="px-8 py-3 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all"
                            >
                                {t('common.cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Language Selection Modal */}
            {showLangPicker && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowLangPicker(false)}>
                    <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Globe className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-text-main">{t('report.chooseLanguage')}</h3>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleDownload('en')}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                            >
                                <span className="text-L">US</span>
                                <span className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{t('report.english')}</span>
                            </button>
                            <button
                                onClick={() => handleDownload('hi')}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                            >
                                <span className="text-l">IN</span>
                                <span className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{t('report.hindi')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionResult;
