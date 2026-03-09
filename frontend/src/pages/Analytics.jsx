import React, { useState, useEffect, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    CartesianGrid
} from 'recharts';
import { Target, Activity, Zap, Loader2, Download, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';

const Analytics = () => {

    const [summary, setSummary] = useState({
        totalScans: 0,
        mostCommonBreed: '',
        avgConfidence: 0,
        breedDistribution: []
    });

    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showWeeklyReport, setShowWeeklyReport] = useState(false);

    const { addToast } = useUI();
    const { t } = useTranslation();

    useEffect(() => {
        const fetchAllData = async () => {
            try {

                const [analyticsResp, predictionsResp] = await Promise.all([
                    api.get('/predictions'),
                    api.get('/predictions')
                ]);

                const analytics = await api.get('/predictions');

                const [aResp, sResp] = await Promise.all([
                    api.get('/predictions').catch(() => ({ data: {} })),
                    api.get('/predictions').catch(() => ({ data: [] }))
                ]);

                try {

                    const realAnalytics = await api.get('/analytics');

                    setSummary({
                        totalScans: realAnalytics.data.totalScans || 0,
                        mostCommonBreed: realAnalytics.data.mostCommonBreed || '',
                        avgConfidence: realAnalytics.data.avgConfidence || 0,
                        breedDistribution: realAnalytics.data.breedDistribution || []
                    });

                } catch (e) {
                    console.error('Analytics endpoint failed, using fallback');
                }

                setScans(sResp.data);

            } catch (err) {
                addToast(t('analytics.alerts.loadError'), 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const activityData = useMemo(() => {

        const dates = {};

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates[d.toLocaleDateString('en-US', { weekday: 'short' })] = 0;
        }

        scans.forEach(scan => {
            const date = new Date(scan.date || scan.createdAt)
                .toLocaleDateString('en-US', { weekday: 'short' });

            if (dates[date] !== undefined) {
                dates[date]++;
            }
        });

        return Object.entries(dates).map(([name, value]) => ({ name, value }));

    }, [scans]);

    const handleExport = () => {

        if (scans.length === 0) return;

        const headers = ['ID', 'Breed', 'Confidence', 'Date'];

        const csvRows = scans.map(s => [
            s.id || s._id,
            s.breed,
            `${(s.confidence * 100).toFixed(2)}%`,
            new Date(s.date || s.createdAt).toLocaleString()
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const url = URL.createObjectURL(blob);

        const link = document.body.appendChild(document.createElement('a'));

        link.href = url;
        link.download = `pashu_pehchan_analytics_${new Date().toISOString().split('T')[0]}.csv`;

        link.click();

        document.body.removeChild(link);

        addToast(t('analytics.alerts.exportSuccess'), 'success');
    };

    const VIBRANT_COLORS = [
        '#6366F1',
        '#EF4444',
        '#10B981',
        '#F59E0B',
        '#06B6D4',
        '#8B5CF6'
    ];

    const CustomTooltip = ({ active, payload, label }) => {

        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-xl border border-border">
                    <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
                        {label || payload[0].name}
                    </p>
                    <p className="text-lg font-black text-primary">
                        {payload[0].value}
                    </p>
                </div>
            );
        }

        return null;
    };

    // PIE LABEL FUNCTION
    const renderPieLabel = ({ percent, cx, cy, midAngle, innerRadius, outerRadius }) => {

        if (percent < 0.05) return null;

        const RADIAN = Math.PI / 180;

        const radius = innerRadius + (outerRadius - innerRadius) * 0.6;

        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontWeight: 700, fontSize: 12 }}
            >
                {(percent * 100).toFixed(0)}%
            </text>
        );
    };

    if (loading) {

        return (
            <div className="flex bg-[#F8FAFC] min-h-screen">
                <Sidebar />

                <main className="flex-1 p-10 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </main>
            </div>
        );
    }

    return (

        <div className="flex bg-[#F8FAFC] min-h-screen">

            <Sidebar />

            <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto w-full">

                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">

                    <div>
                        <h1 className="text-4xl font-black text-text-main mb-2 tracking-tight">
                            {t('analytics.headerTitle')}
                        </h1>

                        <p className="text-text-muted font-medium text-lg">
                            {t('analytics.headerSubtitle')}
                        </p>
                    </div>

                    <button
                        onClick={handleExport}
                        className="btn-primary px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20 group transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        {t('analytics.exportBtn')}
                    </button>

                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10">

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border">

                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                            <Activity className="w-7 h-7 text-primary" />
                        </div>

                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
                            {t('analytics.cards.totalScans')}
                        </p>

                        <h3 className="text-4xl font-black text-text-main">
                            {summary.totalScans}
                        </h3>

                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border">

                        <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6">
                            <Target className="w-7 h-7 text-secondary" />
                        </div>

                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
                            {t('analytics.cards.accuracyRate')}
                        </p>

                        <h3 className="text-4xl font-black text-text-main">
                            {summary.avgConfidence}%
                        </h3>

                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-border">

                        <div className="w-14 h-14 bg-accent/50 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-7 h-7 text-primary" />
                        </div>

                        <p className="text-xs font-black text-text-muted uppercase tracking-widest mb-1">
                            {t('analytics.cards.mostIdentified')}
                        </p>

                        <h3 className="text-4xl font-black text-text-main truncate">
                            {t(`breeds.${summary.mostCommonBreed}`, { defaultValue: summary.mostCommonBreed })}
                        </h3>

                    </div>

                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-border">

                    <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">

                        <div>
                            <h3 className="text-2xl font-black text-text-main mb-1">
                                {showWeeklyReport
                                    ? t('analytics.charts.activityTitle')
                                    : t('analytics.charts.distributionTitle')}
                            </h3>

                            <p className="text-sm font-bold text-text-muted uppercase tracking-wider italic">
                                {showWeeklyReport
                                    ? t('analytics.charts.activitySubtitle')
                                    : t('analytics.charts.distributionSubtitle')}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-border shadow-inner">

                            <button
                                onClick={() => setShowWeeklyReport(false)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    !showWeeklyReport
                                        ? 'bg-white shadow-md text-primary'
                                        : 'text-text-muted hover:text-text-main'
                                }`}
                            >
                                {t('analytics.charts.breedToggle')}
                            </button>

                            <button
                                onClick={() => setShowWeeklyReport(true)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    showWeeklyReport
                                        ? 'bg-white shadow-md text-primary'
                                        : 'text-text-muted hover:text-text-main'
                                }`}
                            >
                                {t('analytics.charts.weeklyToggle')}
                            </button>

                        </div>

                    </header>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-12 items-center">

                        <div className="w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">

                            <ResponsiveContainer width="100%" height="100%">

                                {showWeeklyReport ? (

                                    <LineChart data={activityData}>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />

                                        <YAxis axisLine={false} tickLine={false} />

                                        <Tooltip content={<CustomTooltip />} />

                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#6366F1"
                                            strokeWidth={4}
                                        />

                                    </LineChart>

                                ) : (

                                    <BarChart data={summary.breedDistribution}>

                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(value) =>
                                                t(`breeds.${value}`, { defaultValue: value }).substring(0, 6)
                                            }
                                        />

                                        <YAxis axisLine={false} tickLine={false} />

                                        <Tooltip content={<CustomTooltip />} />

                                        <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={40}>
                                            {summary.breedDistribution.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]}
                                                />
                                            ))}
                                        </Bar>

                                    </BarChart>

                                )}

                            </ResponsiveContainer>

                        </div>

                        {!showWeeklyReport ? (

                            <div className="w-full h-[260px] sm:h-[320px] md:h-[380px] lg:h-[420px]">

                                <ResponsiveContainer width="100%" height="100%">

                                    <PieChart>

                                        <Pie
                                            data={summary.breedDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="40%"
                                            outerRadius="70%"
                                            paddingAngle={6}
                                            dataKey="value"
                                            label={renderPieLabel}
                                            labelLine={false}
                                        >

                                            {summary.breedDistribution.map((entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={VIBRANT_COLORS[index % VIBRANT_COLORS.length]}
                                                />
                                            ))}

                                        </Pie>

                                        <Tooltip content={<CustomTooltip />} />

                                        <Legend
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                        />

                                    </PieChart>

                                </ResponsiveContainer>

                            </div>

                        ) : (

                            <div className="bg-slate-50 rounded-[2rem] p-10 border border-dashed border-border flex flex-col items-center justify-center text-center">

                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                                    <TrendingUp className="w-10 h-10 text-primary" />
                                </div>

                                <h4 className="text-xl font-black text-text-main mb-3">
                                    {t('analytics.charts.activityTitle')}
                                </h4>

                                <p className="text-text-muted font-medium max-w-sm">
                                    {t('analytics.charts.activitySubtitle')}
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </div>
    );
};

export default Analytics;