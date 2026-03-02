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
            // Assume array of { id, img_url, breed, confidence, date }
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
            <main className="flex-1 p-8 overflow-y-auto w-full">
                <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Scan History</h1>
                        <p className="text-slate-500">View and manage past identification records.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by breed..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                        <button
                            onClick={toggleSort}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors font-medium text-slate-700"
                        >
                            <ArrowUpDown className="w-4 h-4" /> Date
                        </button>
                    </div>
                </header>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="p-16 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                            <p>Loading records...</p>
                        </div>
                    ) : filteredScans.length === 0 ? (
                        <div className="p-16 flex flex-col items-center justify-center text-slate-500">
                            <Database className="w-12 h-12 mb-4 text-slate-300" />
                            <h3 className="text-xl font-bold text-slate-700">No predictions yet</h3>
                            <p>Your previous scan history will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
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
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${scan.confidence > 90 ? 'bg-green-100 text-green-700' :
                                                        scan.confidence > 70 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                    }`}>
                                                    {scan.confidence.toFixed(1)}%
                                                </span>
                                            </td>
                                            <td className="p-4 text-slate-600">
                                                {new Date(scan.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDownload(scan.id)}
                                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors tooltip-btn"
                                                        title="Download PDF Report"
                                                    >
                                                        <Download className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(scan.id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip-btn"
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
                    )}
                </div>
            </main>
        </div>
    );
};

export default History;
