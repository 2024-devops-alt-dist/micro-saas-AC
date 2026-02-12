import { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { getUsersStats, type UserStats } from '../quiz/services/statsService';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PieChartPerTheme = () => {
    const [stats, setStats] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await getUsersStats();
                setStats(data);
            } catch (err) {
                console.error("Erreur stats PieChart:", err);
                setError(err instanceof Error ? err.message : "Erreur de chargement");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-center p-8 text-slate-500">Analyse de vos activités...</div>;

    if (error || stats.length === 0) {
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
                color: error ? '#ef4444' : '#64748b',
                textAlign: 'center',
                border: '1px solid #f1f5f9'
            }}>
                <p className='font-bold mb-2'>{error ? "Erreur" : "Pas de données"}</p>
                <p className='text-sm text-gray-500'>{error || "Prenez part à votre premier quiz !"}</p>
            </div>
        );
    }

    // Calcul de la répartition : nombre d'évaluations par matière
    const distributionMap: { [key: string]: number } = {};

    stats.forEach(item => {
        const theme = item.category_name || "Inconnu";
        distributionMap[theme] = (distributionMap[theme] || 0) + 1;
    });

    const chartData = Object.keys(distributionMap).map(subject => ({
        name: subject,
        value: distributionMap[subject]
    }));

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
            <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                    Répartition des Activités
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                    Volume d'évaluations par matière
                </p>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    // label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                    >
                        {chartData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PieChartPerTheme;
