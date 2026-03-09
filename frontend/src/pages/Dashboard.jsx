import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Image as ImageIcon, X, Loader2, History, ChevronRight, Activity, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import logo from '../assets/logo.png';

const Dashboard = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [recentScans, setRecentScans] = useState([]);
    const [isLoadingScans, setIsLoadingScans] = useState(true);

    const fileInputRef = useRef(null);
    const { user } = useAuth();
    const {
        addToast,
        selectedFile: file, setSelectedFile: setFile,
        previewUrl: preview, setPreviewUrl: setPreview
    } = useUI();
    const navigate = useNavigate();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchRecentScans = async () => {
            try {
                const response = await api.get('/predictions');
                // Get only last 4 for the dashboard
                setRecentScans(response.data.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch scans:', error);
            } finally {
                setIsLoadingScans(false);
            }
        };
        fetchRecentScans();
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const processFile = (selectedFile) => {
        if (!selectedFile) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
            addToast(t('dashboard.errors.invalidType'), 'error');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            addToast(t('dashboard.errors.tooLarge'), 'error');
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        processFile(droppedFile);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        processFile(selectedFile);
    };

    const removeFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/predict', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const { blurWarning } = response.data;
            if (blurWarning) {
                addToast(t('result.blurWarning'), 'info');
            }

            navigate('/result', { state: { result: response.data, preview } });
        } catch (error) {
            addToast(error.response?.data?.message || t('dashboard.errors.apiFailed'), 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
                {/* Header Section */}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Left Column: Upload Section */}
                    <div className="xl:col-span-2 space-y-8">
                        <section className="bg-white rounded-[2.5rem] shadow-sm border border-border p-8 md:p-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <UploadCloud className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-text-main">{t('dashboard.scanSectionTitle')}</h2>
                            </div>

                            {!preview ? (
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative group border-2 border-dashed rounded-[2rem] p-12 md:p-20 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-500
                                        ${isDragging
                                            ? 'border-primary bg-primary/[0.02] scale-[0.99] shadow-inner'
                                            : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50'}`}
                                >
                                    <div className="w-24 h-24 bg-accent/50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-sm">
                                        <ImageIcon className="w-10 h-10 text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-black text-text-main mb-3">{t('dashboard.uploadTitle')}</h3>
                                    <p className="text-text-muted font-medium mb-8 max-w-xs">{t('dashboard.uploadDesc')}</p>

                                    <div className="flex flex-wrap justify-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-primary/70 bg-primary/5 px-3 py-1.5 rounded-full uppercase tracking-wider">{t('dashboard.supports')}</span>
                                        <span className="text-xs font-bold text-primary/70 bg-primary/5 px-3 py-1.5 rounded-full uppercase tracking-wider">{t('dashboard.maxSize')}</span>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg, image/png"
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="animate-in fade-in zoom-in duration-500">
                                    <div className="relative rounded-[2rem] overflow-hidden shadow-xl shadow-primary/5 border border-border bg-slate-50 flex justify-center h-[28rem] mb-8 group">
                                        <img src={preview} alt="Preview" className="h-full object-contain" />
                                        {!isUploading && (
                                            <button
                                                onClick={removeFile}
                                                className="absolute top-6 right-6 bg-white/90 hover:bg-red-50 text-text-main hover:text-red-500 p-3 rounded-2xl shadow-lg transition-all active:scale-90"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="bg-white p-6 rounded-[2rem] shadow-2xl flex flex-col items-center gap-4 animate-bounce">
                                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                                    <span className="font-black text-primary uppercase tracking-widest text-sm">{t('dashboard.analyzing')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-4 bg-accent/30 px-6 py-4 rounded-2xl border border-primary/5">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm italic font-black text-primary">IMG</div>
                                            <div>
                                                <p className="font-bold text-text-main truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 w-full sm:w-auto">
                                            <button
                                                onClick={removeFile}
                                                disabled={isUploading}
                                                className="flex-1 sm:flex-none px-8 py-4 rounded-2xl font-bold text-text-muted hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
                                            >
                                                {t('common.cancel')}
                                            </button>
                                            <button
                                                onClick={handleAnalyze}
                                                disabled={isUploading}
                                                className="flex-1 sm:flex-none px-10 py-4 rounded-2xl font-black text-white bg-primary hover:bg-primary-light shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-3 transition-all active:scale-95"
                                            >
                                                {t('dashboard.analyzeBtn')} <Activity className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Recent Scans */}
                    <div className="space-y-6">
                        <section className="bg-white rounded-[2.5rem] shadow-sm border border-border p-8 h-full">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                        <History className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h2 className="text-xl font-bold text-text-main">{t('dashboard.recentScans')}</h2>
                                </div>
                                <button
                                    onClick={() => navigate('/history')}
                                    className="text-primary font-bold text-sm hover:underline underline-offset-4"
                                >
                                    {t('dashboard.viewAll')}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {isLoadingScans ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse flex gap-4 p-4 rounded-2xl border border-border/50">
                                            <div className="w-20 h-20 bg-slate-100 rounded-xl" />
                                            <div className="flex-1 space-y-3 py-1">
                                                <div className="h-4 bg-slate-100 rounded w-3/4" />
                                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                                                <div className="h-3 bg-slate-100 rounded w-1/4" />
                                            </div>
                                        </div>
                                    ))
                                ) : recentScans.length > 0 ? (
                                    recentScans.map((scan) => (
                                        <div
                                            key={scan.id || scan._id}
                                            onClick={() => navigate('/result', { state: { result: scan, preview: scan.img_url || scan.imageUrl } })}
                                            className="group flex gap-4 p-4 rounded-[1.5rem] border border-border/50 hover:border-primary/30 hover:bg-primary/[0.01] transition-all cursor-pointer"
                                        >
                                            <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-border/30 shrink-0">
                                                <img src={scan.img_url || scan.imageUrl} alt={scan.breed} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <h4 className="font-bold text-text-main truncate group-hover:text-primary transition-colors">
                                                    {t(`breeds.${scan.breed}`)}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-secondary">
                                                        <Activity className="w-3 h-3" /> {(scan.confidence * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                                        <Calendar className="w-3 h-3" /> {formatDate(scan.date || scan.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-border/50 rounded-[2rem]">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ImageIcon className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-text-muted font-bold text-sm">{t('dashboard.empty.title')}</p>
                                        <p className="text-xs text-text-muted/60 mt-1">{t('dashboard.empty.desc')}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
