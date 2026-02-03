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

const BestPerformanceChart = () => {
    // 1. Calculer la moyenne par matière
    const subjectsMap: { [key: string]: { total: number, count: number } } = {};

    data.forEach(item => {
        if (!subjectsMap[item.matiere]) {
            subjectsMap[item.matiere] = { total: 0, count: 0 };
        }
        subjectsMap[item.matiere].total += item.score;
        subjectsMap[item.matiere].count += 1;
    });

    const barData = Object.keys(subjectsMap).map(subject => ({
        subject,
        average: parseFloat((subjectsMap[subject].total / subjectsMap[subject].count).toFixed(2))
    })).sort((a, b) => b.average - a.average); // Trier du meilleur au moins bon

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
                    layout="vertical" // Format horizontal pour mieux lire les noms longs (ex: SVT)
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                    <XAxis type="number" domain={[0, 10]} hide />
                    <YAxis
                        dataKey="subject"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
                        width={120}
                    />
                    <Tooltip
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(value: any) => [`${value ?? 0}/10`, 'Moyenne']}
                    />
                    <Bar
                        dataKey="average"
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

export default BestPerformanceChart;
