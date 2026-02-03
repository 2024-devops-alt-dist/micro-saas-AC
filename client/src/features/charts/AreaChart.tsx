import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
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

// Regroupement des données par date
const processData = (rawData: any[]) => {
  const chartDataMap: { [key: string]: any } = {};
  rawData.forEach(item => {
    if (!chartDataMap[item.date]) {
      chartDataMap[item.date] = { date: item.date };
    }
    chartDataMap[item.date][item.matiere] = item.score;
  });
  return Object.values(chartDataMap).sort((a: any, b: any) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};

const processedData = processData(data);
const uniqueMatieres = Array.from(new Set(data.map(d => d.matiere)));

const FilterableMatiereChart = () => {
  const [selectedSubject, setSelectedSubject] = useState(uniqueMatieres[0]);

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

export default FilterableMatiereChart;
