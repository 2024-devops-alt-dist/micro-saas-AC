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
import { useUserStats } from './services/userStats';
import { type UserStats } from './services/statsService';
import EmptyCharts from './EmptyChart';

interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

const LineChart = () => {
  const { stats, state, error } = useUserStats();
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  useEffect(() => {
    // On initialise le sujet par défaut (réel ou mocké)
    if ((state === 'ready' || state === 'unauthenticated') && stats.length > 0) {
      const subjects = Array.from(new Set(stats.map(d => d.category_name || "Inconnu")));
      if (subjects.length > 0 && !selectedSubject) {
        setSelectedSubject(subjects[0]);
      }
    }
  }, [state, stats, selectedSubject]);

  // Regroupement des données par date
  const processData = (rawData: UserStats[]): ChartDataPoint[] => {
    const chartDataMap: { [key: string]: ChartDataPoint } = {};
    rawData.forEach(item => {
      const dateKey = new Date(item.date).toISOString().split('T')[0];
      const subject = item.category_name || "Inconnu";

      if (!chartDataMap[dateKey]) {
        chartDataMap[dateKey] = { date: dateKey };
      }
      chartDataMap[dateKey][subject] = item.score;
    });

    return Object.values(chartDataMap).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  if (state === 'loading') return <div className="text-center p-8 text-slate-500">Chargement de votre progression...</div>;

  if (state === 'error') {
    return (
      <EmptyCharts
        variant="error"
        message={error || undefined}
      />
    );
  }

  const processedData = processData(stats);
  const uniqueMatieres = Array.from(new Set(stats.map(d => d.category_name || "Inconnu")));

  return (
    <div className="relative group">
      {/* Chart flouté si non connecté */}
      <div className={`transition-all duration-700 ${state === 'unauthenticated' ? 'blur-sm pointer-events-none opacity-50 contrast-[0.8]' : ''}`}
        style={{
          width: '100%',
          minHeight: '420px',
          background: '#ffffff',
          padding: '16px',
          borderRadius: '24px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.1)',
          border: '1px solid #f1f5f9',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px'
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
                width: '100%',
                maxWidth: '220px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              {uniqueMatieres.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={processedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="selectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#adadefff" />
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

      {/* Overlay */}
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


export default LineChart;
