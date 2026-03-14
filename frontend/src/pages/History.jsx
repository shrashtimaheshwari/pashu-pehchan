import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, Trash2, Loader2, Database, Activity, Calendar, MoreVertical, FileText, ChevronRight, TrendingUp, ShieldCheck, ChevronDown, ArrowUpDown, Globe } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(null);
    const [downloadLangId, setDownloadLangId] = useState(null);

    const { addToast } = useUI();
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/predictions');
            // Backend returns list via GET /predict (mapped in Dashboard as well)
            // Let's assume the standard keys from Backend's formattedPredictions: id, breed, confidence, img_url, date
            setScans(resp.data);
        } catch (err) {
            addToast(t('history.alerts.loadError'), 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm(t('history.alerts.confirmDelete'))) return;

        setIsDeleting(id);
        try {
            await api.delete(`/predictions/${id}`);
            setScans(prev => prev.filter(s => (s.id || s._id) !== id));
            addToast(t('history.alerts.deleted'), 'success');
        } catch (err) {
            addToast(t('history.alerts.deleteError'), 'error');
        } finally {
            setIsDeleting(null);
        }
    };

    const handleDownload = async (e, id, lang = 'en') => {
        e?.stopPropagation();
        setDownloadLangId(null);
        try {
            const resp = await api.get(`/predictions/${id}/report?lang=${lang}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}-${lang}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            addToast(t('history.alerts.downloadError'), 'error');
        }
    };

    const stats = useMemo(() => {
        const total = scans.length;
        const highConf = scans.filter(s => s.confidence >= 85).length;
        const recent = scans.filter(s => {
            const date = new Date(s.date || s.createdAt);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return date > sevenDaysAgo;
        }).length;

        return { total, highConf, recent };
    }, [scans]);

    const processedScans = useMemo(() => {
        let result = scans.filter(scan =>
            scan.breed.toLowerCase().includes(searchQuery.toLowerCase())
        );

        result.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt);
            const dateB = new Date(b.date || b.createdAt);
            return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    }, [scans, searchQuery, sortBy]);

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

            <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto w-full">
                <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-text-main mb-2 tracking-tight">{t('history.title')}</h1>
                        <p className="text-text-muted font-medium text-lg">{t('history.subtitle')}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full lg:w-80 group">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
                            <input
                                type="text"
                                placeholder={t('history.searchPlaceholder')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm font-bold shadow-sm"
                            />
                        </div>

                        <div className="relative min-w-[200px]">
                            <button
                                onClick={() => setIsSortOpen(!isSortOpen)}
                                className="flex items-center justify-between gap-4 w-full bg-white border border-border px-6 py-4 rounded-2xl shadow-sm hover:border-primary/30 transition-all active:scale-95"
                            >
                                <div className="flex items-center gap-3">
                                    <ArrowUpDown className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-bold text-text-main">
                                        {sortBy === 'newest' ? t('history.sort.newest') : t('history.sort.oldest')}
                                    </span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isSortOpen && (
                                <div className="absolute top-full right-0 mt-3 w-full bg-white rounded-2xl border border-border shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button
                                        onClick={() => { setSortBy('newest'); setIsSortOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${sortBy === 'newest' ? 'bg-primary text-white' : 'text-text-main hover:bg-primary/5'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${sortBy === 'newest' ? 'bg-white' : 'bg-primary'}`} />
                                        {t('history.sort.newest')}
                                    </button>
                                    <button
                                        onClick={() => { setSortBy('oldest'); setIsSortOpen(false); }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${sortBy === 'oldest' ? 'bg-primary text-white' : 'text-text-main hover:bg-primary/5'}`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${sortBy === 'oldest' ? 'bg-white' : 'bg-primary'}`} />
                                        {t('history.sort.oldest')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Database className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('analytics.cards.totalScans')}</p>
                            <p className="text-3xl font-black text-text-main">{stats.total}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-7 h-7 text-secondary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('history.stats.highAccuracy')}</p>
                            <p className="text-3xl font-black text-text-main">{stats.highConf}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('history.stats.recentActivity')}</p>
                            <p className="text-3xl font-black text-text-main">{stats.recent}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-text-muted">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                        <p className="font-bold uppercase tracking-widest text-sm">{t('common.loading')}</p>
                    </div>
                ) : processedScans.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-border p-20 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6">
                            <Database className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-text-main mb-2">{t('history.empty.title')}</h3>
                        <p className="text-text-muted font-medium max-w-xs">{t('history.empty.desc')}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="mt-8 btn-primary px-8 py-3 rounded-xl"
                        >
                            {t('history.actions.startScan')}
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {processedScans.map((scan) => {
                            const scanId = scan.id || scan._id;
                            const scanDate = scan.date || scan.createdAt;
                            const scanImage = scan.img_url || scan.imageUrl;

                            return (
                                <div
                                    key={scanId}
                                    onClick={() => navigate('/result', { state: { result: scan, preview: scanImage } })}
                                    className="group bg-white rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden cursor-pointer"
                                >
                                    {/* Card Image */}
                                    <div className="relative h-56 overflow-hidden bg-slate-50 flex items-center justify-center">
                                        <img
                                            src={scanImage}
                                            alt={scan.breed}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                                                <Activity className={`w-4 h-4 ${scan.confidence >= 85 ? 'text-green-500' : 'text-secondary'}`} />
                                                <span className="text-sm font-black text-text-main">
                                                    {(scan.confidence).toFixed(2)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-xl font-black text-text-main group-hover:text-primary transition-colors mb-1">
                                                    {t(`breeds.${scan.breed}`, { defaultValue: scan.breed })}
                                                </h3>
                                                <div className="flex items-center gap-2 text-text-muted">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-bold uppercase tracking-wider">{formatDate(scanDate)}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setDownloadLangId(scanId); }}
                                                    className="p-2.5 text-text-muted hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                                    title={t('common.download')}
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, scanId)}
                                                    disabled={isDeleting === scanId}
                                                    className="p-2.5 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                                                    title={t('common.delete')}
                                                >
                                                    {isDeleting === scanId ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <span className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest italic opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x--4 group-hover:translate-x-0">
                                                {t('history.actions.viewReport')} <ChevronRight className="w-4 h-4" />
                                            </span>
                                            <div className="bg-accent/30 text-[10px] font-black text-primary px-3 py-1 rounded-lg uppercase tracking-wider italic">
                                                {t('history.tags.cattle')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Language Selection Modal */}
                {downloadLangId && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDownloadLangId(null)}>
                        <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-black text-text-main">{t('report.chooseLanguage')}</h3>
                            </div>
                            <div className="space-y-3">
                                <button
                                    onClick={(e) => handleDownload(e, downloadLangId, 'en')}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                >
                                    <span className="text-2xl">🇬🇧</span>
                                    <span className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{t('report.english')}</span>
                                </button>
                                <button
                                    onClick={(e) => handleDownload(e, downloadLangId, 'hi')}
                                    className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                                >
                                    <span className="text-2xl">🇮🇳</span>
                                    <span className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{t('report.hindi')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default History;
