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
import { useUserStats } from './services/userStats';
import { type UserStats } from './services/statsService';
import EmptyCharts from './EmptyChart';


const BarChartPerThem = () => {
    const { stats, state, error } = useUserStats();

    if (state === 'loading') return <div className="text-center p-4 text-white">Chargement des graphiques...</div>;

    if (state === 'error') {
        return (
            <EmptyCharts
                variant="error"
                message={error || undefined}
            />
        );
    }

    // Calculer la moyenne par matière (données réelles ou mockées)
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
        <div className="relative group">
            {/* Conteneur principal du graphique */}
            <div className={`transition-all duration-700 ${state === 'unauthenticated' ? 'blur-sm pointer-events-none opacity-50 contrast-[0.8]' : ''}`}
                style={{
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
                                    fill={index === 0 ? '#6366f1' : '#cbd5e1'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Overlay pour l'état non authentifié ou sans données */}
            {state === 'unauthenticated' && (
                <div className="absolute inset-0 z-10">
                    <EmptyCharts variant="unauthenticated" isOverlay={true} />
                </div>
            )}

            {state === 'ready' && stats.length === 0 && (
                <div className="absolute inset-0 z-10">
                    <EmptyCharts variant="no-data" />
                </div>
            )}
        </div>
    );
};


export default BarChartPerThem;
