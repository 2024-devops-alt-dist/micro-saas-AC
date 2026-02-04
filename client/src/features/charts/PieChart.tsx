import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface RawDataItem {
    date: string;
    matiere: string;
    score: number;
}

const data: RawDataItem[] = [
    { "date": "2025-01-12", "matiere": "Histoire", "score": 5 },
    { "date": "2025-01-15", "matiere": "Maths", "score": 2 },
    { "date": "2025-01-15", "matiere": "Sciences de la vie et de la terre", "score": 8 },
    { "date": "2025-01-17", "matiere": "Histoire", "score": 6 },
    { "date": "2025-01-18", "matiere": "Maths", "score": 5 },
    { "date": "2025-01-19", "matiere": "Maths", "score": 4 },
    { "date": "2025-01-23", "matiere": "Histoire", "score": 4 },
    { "date": "2025-01-25", "matiere": "Maths", "score": 6 },
    { "date": "2025-01-28", "matiere": "Histoire", "score": 8 },
    { "date": "2025-02-01", "matiere": "Maths", "score": 9 },
    { "date": "2025-02-02", "matiere": "Histoire", "score": 9 },
    { "date": "2025-02-02", "matiere": "Sciences de la vie et de la terre", "score": 5 },
    { "date": "2025-02-05", "matiere": "Histoire", "score": 8 },
    { "date": "2025-02-06", "matiere": "Sciences de la vie et de la terre", "score": 7 },
    { "date": "2025-02-25", "matiere": "Sciences de la vie et de la terre", "score": 10 },
    { "date": "2025-03-01", "matiere": "Sciences de la vie et de la terre", "score": 10 }
];

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const PieChartPerTheme = () => {
    // Calcul de la répartition : nombre d'évaluations par matière
    const distributionMap: { [key: string]: number } = {};

    data.forEach(item => {
        distributionMap[item.matiere] = (distributionMap[item.matiere] || 0) + 1;
    });

    const chartData = Object.keys(distributionMap).map(subject => ({
        name: subject,
        value: distributionMap[subject]
    }));

    return (
        <div style={{
            width: '100%',
            height: '400px',
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
                        label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
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
