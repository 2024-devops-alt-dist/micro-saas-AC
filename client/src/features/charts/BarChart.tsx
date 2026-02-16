import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { useEffect, useState } from 'react';
import { getUsersStats, type UserStats } from '../quiz/services/statsService';


const BarChartPerThem = () => {
    const [stats, setStats] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setError(null);
                const data = await getUsersStats();
                setStats(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des stats:", error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                setError(errorMessage);
                if (errorMessage.includes("Session expirée")) {
                    // Optionally redirect to login or show a specific message
                    // For now, the error message itself will trigger the "Se reconnecter" button
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-4 text-white">Chargement des graphiques...</div>;

    if (error) {
        return (
            <div style={{
                width: '100%',
                height: '500px',
                background: '#ffffff',
                padding: '24px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#ef4444',
                textAlign: 'center'
            }}>
                <p className='font-bold mb-2'>Erreur de chargement</p>
                <p className='text-sm text-gray-600 mb-4'>{error}</p>
                {error.includes("Session expirée") && (
                    <a href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                        Se reconnecter
                    </a>
                )}
            </div>
        );
    }

    // 1. Calculer la moyenne par matière à partir des données réelles
    const subjectsMap: { [key: string]: { total: number, count: number } } = {};

    stats.forEach((item: UserStats) => {
        const theme = item.category_name || "Inconnu";
        if (!subjectsMap[theme]) {
            subjectsMap[theme] = { total: 0, count: 0 };
        }
        subjectsMap[theme].total += item.score;
        subjectsMap[theme].count += 1;
    });

    const barData = Object.keys(subjectsMap).map(theme => ({
        matiere: theme,
        moyenne: parseFloat((subjectsMap[theme].total / subjectsMap[theme].count).toFixed(2))
    })).sort((a, b) => b.moyenne - a.moyenne);

    return (
        <div style={{
            width: '100%',
            height: '500px',
            background: '#ffffff',
            padding: '24px',
            borderRadius: '24px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                    Classement par Matière
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                    Moyenne générale calculée sur tous les scores
                </p>
            </div>

            <ResponsiveContainer width="100%" height="75%">
                <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#adadefff" />
                    <XAxis type="number" domain={[0, 10]} hide />
                    <YAxis
                        dataKey="matiere"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                        width={120}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: number | string | undefined) => [`${value ?? 0}/10`, 'Moyenne']}
                    />
                    <Bar
                        dataKey="moyenne"
                        radius={[0, 8, 8, 0]}
                        barSize={30}
                    >
                        {barData.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                // Coloration : Première barre (la meilleure) en indigo, les autres en gris bleuté
                                fill={index === 0 ? '#6366f1' : '#cbd5e1'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartPerThem;
