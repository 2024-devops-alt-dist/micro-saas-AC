import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useUserStats } from './services/userStats';
import EmptyCharts from './EmptyChart';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PieChartPerTheme = () => {
    const { stats, state, error } = useUserStats();

    if (state === 'loading') return <div className="text-center p-8 text-slate-500">Analyse de vos activités...</div>;

    if (state === 'error') {
        return (
            <EmptyCharts
                variant="error"
                message={error || undefined}
            />
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
        <div className="relative group">
            {/* Conteneur principal du graphique flouté si non co */}
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


export default PieChartPerTheme;
