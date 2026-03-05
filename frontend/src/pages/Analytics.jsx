import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Target, Activity, Zap, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useUI } from '../context/UIContext';
import { useTranslation } from 'react-i18next';

const Analytics = () => {
    // ✅ SAFE INITIAL STATE (prevents map error)
    const [data, setData] = useState({
        total_scans: 0,
        top_breed: '',
        avg_confidence: 0,
        chart_data: []
    });

    const [loading, setLoading] = useState(true);
    const { addToast } = useUI();
    const { t } = useTranslation();

    const COLORS = ['#2D5A27', '#8B4513', '#D97706', '#047857', '#4B5563'];

    useEffect(() => {
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchAnalytics = async () => {
        try {
            const resp = await api.get('/analytics');

            // Debug (remove later if not needed)
            console.log('Analytics API response:', resp.data);

            // ✅ Ensure chart_data always exists
            setData({
                total_scans: resp.data.totalScans || 0,
                top_breed: resp.data.mostCommonBreed || '',
                avg_confidence: resp.data.avgConfidence || 0,
                chart_data: resp.data.breedDistribution || []
            });
        } catch (err) {
            addToast(t('analytics.alerts.loadError'), 'error');

            // ✅ Fallback dummy data
            setData({
                total_scans: 156,
                top_breed: 'Gir',
                avg_confidence: 94.2,
                chart_data: [
                    { name: 'Gir', value: 45 },
                    { name: 'Sahiwal', value: 30 },
                    { name: 'Red Sindhi', value: 15 },
                    { name: 'Tharparkar', value: 10 }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex bg-slate-50 min-h-screen">
                <Sidebar />
                <main className="flex-1 p-4 pt-16 md:p-8 flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </main>
            </div>
        );
    }

    const translatedChartData = (data.chart_data || []).map(item => ({
        ...item,
        name: t(`breeds.${item.name}`, { defaultValue: item.name })
    }));

    return (
        <div className="flex bg-slate-50 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 pt-16 md:p-8 overflow-y-auto">
                <header className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        {t('analytics.title')}
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">
                        {t('analytics.subtitle')}
                    </p>
                </header>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <Zap className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">{t('analytics.cards.totalScans')}</p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {data.total_scans}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="p-4 bg-secondary/10 rounded-full text-secondary">
                            <Target className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">
                                {t('analytics.cards.topBreed')}
                            </p>
                            <h3 className="text-2xl font-bold text-slate-800">
                                {t(`breeds.${data.top_breed}`, { defaultValue: data.top_breed })}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                        <div className="p-4 bg-green-100 rounded-full text-green-600">
                            <Activity className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-slate-500 font-medium">{t('analytics.cards.avgConfidence')}</p>
                            <h3 className="text-3xl font-bold text-slate-800">
                                {data.avg_confidence}%
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bar Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">
                            {t('analytics.charts.barTitle')}
                        </h3>
                        <div className="h-60 md:h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={translatedChartData}>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#64748b"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        fill="#2D5A27"
                                        radius={[6, 6, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">
                            {t('analytics.charts.pieTitle')}
                        </h3>
                        <div className="h-60 md:h-80 w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={translatedChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) =>
                                            `${name} ${(percent * 100).toFixed(0)}%`
                                        }
                                        labelLine={false}
                                    >
                                        {translatedChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;