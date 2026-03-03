import React, { useState, useEffect } from 'react';
import { Search, ArrowUpDown, Download, Trash2, Loader2, Database } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useUI } from '../context/UIContext';

const History = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first

    const { addToast } = useUI();

    useEffect(() => {
        fetchHistory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const resp = await api.get('/predictions');
            setScans(resp.data);
        } catch (err) {
            addToast('Failed to load history data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this scan record?')) return;
        try {
            await api.delete(`/predictions/${id}`);
            setScans(prev => prev.filter(s => s.id !== id));
            addToast('Scan deleted.', 'success');
        } catch (err) {
            addToast('Could not delete scan.', 'error');
        }
    };

    const handleDownload = async (id) => {
        try {
            const resp = await api.get(`/predictions/${id}/report`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            addToast('Failed to generate report PDF.', 'error');
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const getConfBadge = (confidence) => {
        const color = confidence > 90 ? 'bg-green-100 text-green-700' :
            confidence > 70 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700';
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${color}`}>
                {confidence.toFixed(1)}%
            </span>
        );
    };

    const filteredScans = scans
        .filter(scan => scan.breed.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 pt-16 md:p-8 overflow-y-auto w-full">
                <header className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Scan History</h1>
                        <p className="text-slate-500 text-sm md:text-base">View and manage past identification records.</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-initial">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by breed..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <button
                            onClick={toggleSort}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors font-medium text-slate-700 shrink-0"
                        >
                            <ArrowUpDown className="w-4 h-4" /> Date
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                        <p>Loading records...</p>
                    </div>
                ) : filteredScans.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 flex flex-col items-center justify-center text-slate-500">
                        <Database className="w-12 h-12 mb-4 text-slate-300" />
                        <h3 className="text-xl font-bold text-slate-700">No predictions yet</h3>
                        <p>Your previous scan history will appear here.</p>
                    </div>
                ) : (
                    <>
                        {/* ===== MOBILE: Card Layout ===== */}
                        <div className="md:hidden flex flex-col gap-4">
                            {filteredScans.map((scan) => (
                                <div key={scan.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                    {/* Image banner */}
                                    <div className="h-40 bg-slate-100">
                                        <img
                                            src={scan.img_url}
                                            alt={scan.breed}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* 2×2 Info Grid */}
                                    <div className="p-4 grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Breed</p>
                                            <p className="font-bold text-slate-800 text-lg">{scan.breed}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Confidence</p>
                                            {getConfBadge(scan.confidence)}
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Date</p>
                                            <p className="text-sm font-medium text-slate-600">{new Date(scan.date).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex items-end justify-end gap-2">
                                            <button
                                                onClick={() => handleDownload(scan.id)}
                                                className="p-2.5 text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors"
                                                title="Download PDF"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(scan.id)}
                                                className="p-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ===== DESKTOP: Table Layout ===== */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                                        <th className="p-4 font-semibold">Image</th>
                                        <th className="p-4 font-semibold">Breed</th>
                                        <th className="p-4 font-semibold">Confidence</th>
                                        <th className="p-4 font-semibold">Date</th>
                                        <th className="p-4 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredScans.map((scan) => (
                                        <tr key={scan.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-4">
                                                <img
                                                    src={scan.img_url}
                                                    alt={scan.breed}
                                                    className="w-16 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200"
                                                />
                                            </td>
                                            <td className="p-4 font-bold text-slate-800">{scan.breed}</td>
                                            <td className="p-4">{getConfBadge(scan.confidence)}</td>
                                            <td className="p-4 text-slate-600">
                                                {new Date(scan.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(scan.id)}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                        title="Download PDF Report"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(scan.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default History;
