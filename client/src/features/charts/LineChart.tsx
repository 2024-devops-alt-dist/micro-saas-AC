import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getUsersStats, type UserStats } from '../quiz/services/statsService';

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

const LineChart = () => {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getUsersStats();
        setStats(data);

        // Extraire les matières uniques pour le select
        const subjects = Array.from(new Set(data.map(d => d.category_name || "Inconnu")));
        if (subjects.length > 0) {
          setSelectedSubject(subjects[0]);
        }
      } catch (err) {
        console.error("Erreur stats:", err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Regroupement des données par date
  const processData = (rawData: UserStats[]): ChartDataPoint[] => {
    const chartDataMap: { [key: string]: ChartDataPoint } = {};
    rawData.forEach(item => {
      // On formate la date pour regrouper par jour (YYYY-MM-DD)
      const dateKey = new Date(item.date).toISOString().split('T')[0];
      const subject = item.category_name || "Inconnu";

      if (!chartDataMap[dateKey]) {
        chartDataMap[dateKey] = { date: dateKey };
      }
      // On prend le score le plus récent ou on pourrait faire une moyenne journalière
      chartDataMap[dateKey][subject] = item.score;
    });

    return Object.values(chartDataMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  if (loading) return <div className="text-center p-8 text-slate-500">Chargement de votre progression...</div>;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-3xl border border-slate-100 p-6 text-center">
        <p className="text-red-500 font-medium mb-2">Oups ! Une erreur est survenue</p>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        {error.includes("Session expirée") && (
          <a href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Se reconnecter
          </a>
        )}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] bg-white rounded-3xl border border-slate-100 p-6 text-center">
        <p className="text-slate-500 font-medium">Aucune donnée disponible</p>
        <p className="text-slate-400 text-sm">Réalisez quelques quiz pour voir votre progression !</p>
      </div>
    );
  }

  const processedData = processData(stats);
  const uniqueMatieres = Array.from(new Set(stats.map(d => d.category_name || "Inconnu")));

  return (
    <div style={{
      width: '100%',
      height: '500px',
      background: '#ffffff',
      padding: '24px',
      borderRadius: '24px',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1)',
      border: '1px solid #f1f5f9',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px'
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
            Suivi Individuel
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
            Visualisez votre progression par matière
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="subject-select" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
            Choisir une matière
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#334155',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              minWidth: '200px',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}
          >
            {uniqueMatieres.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="70%">
        <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="selectedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(str) => new Date(str).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            dy={10}
          />
          <YAxis
            domain={[0, 10]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '16px',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}
          />

          <Area
            type="monotone"
            dataKey={selectedSubject}
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#selectedGrad)"
            connectNulls
            dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
            activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
