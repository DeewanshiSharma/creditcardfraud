import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '2rem',
};

const models = [
  { name: 'Logistic Regression', accuracy: 0.998157, precision: 0.480000, recall: 0.857143, f1: 0.615385, roc_auc: 0.982230, status: 'Production' },
  { name: 'Decision Tree', accuracy: 0.999192, precision: 0.770833, recall: 0.755102, f1: 0.762887, roc_auc: 0.877358, status: 'Comparison' },
  { name: 'Random Forest', accuracy: 0.999614, precision: 0.975000, recall: 0.795918, f1: 0.876404, roc_auc: 0.962961, status: 'Comparison' },
  { name: 'KNN', accuracy: 0.999491, precision: 0.925926, recall: 0.765306, f1: 0.837989, roc_auc: 0.928440, status: 'Comparison' },
];

const chartData = models.map(m => ({
  name: m.name.split(' ')[0],
  Accuracy: parseFloat((m.accuracy * 100).toFixed(2)),
  'ROC-AUC': parseFloat((m.roc_auc * 100).toFixed(2)),
  Precision: parseFloat((m.precision * 100).toFixed(2)),
  Recall: parseFloat((m.recall * 100).toFixed(2)),
  'F1 Score': parseFloat((m.f1 * 100).toFixed(2)),
}));

const tt = { background: '#111b2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '0.82rem' };

export default function Compare() {
  return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '1080px' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.03em', fontFamily: 'Georgia, serif' }}>Compare Models</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Performance across four machine learning algorithms. Logistic Regression is deployed in production.</p>
        </div>

        {/* Table */}
        <div style={{ ...card, marginBottom: '1.5rem', overflowX: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.25rem' }}>Performance Metrics</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Model', 'Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC', ''].map(h => (
                  <th key={h} style={{ padding: '0.6rem 1rem', textAlign: h === 'Model' ? 'left' : 'center', color: 'rgba(255,255,255,0.28)', fontWeight: 500, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {models.map((m, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500, color: m.status === 'Production' ? '#fff' : 'rgba(255,255,255,0.65)' }}>{m.name}</td>
                  {[m.accuracy, m.precision, m.recall, m.f1, m.roc_auc].map((v, j) => (
                    <td key={j} style={{ padding: '1rem', textAlign: 'center', color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{v.toFixed(4)}</td>
                  ))}
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {m.status === 'Production' && (
                      <span style={{ fontSize: '0.7rem', background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '100px', padding: '3px 12px', fontWeight: 500, letterSpacing: '0.04em' }}>Production</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={card}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>Accuracy &amp; ROC-AUC</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barGap={3}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis domain={[90, 100]} stroke="none" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip contentStyle={tt} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }} />
                <Bar dataKey="Accuracy" fill="#4f8ef7" radius={[3,3,0,0]} maxBarSize={32} />
                <Bar dataKey="ROC-AUC" fill="#34d399" radius={[3,3,0,0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={card}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.5rem', letterSpacing: '-0.01em' }}>Precision, Recall &amp; F1</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} barGap={3}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="none" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="none" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                <Tooltip contentStyle={tt} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }} />
                <Bar dataKey="Precision" fill="#7c6ef7" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="Recall" fill="#f59e0b" radius={[3,3,0,0]} maxBarSize={28} />
                <Bar dataKey="F1 Score" fill="#f87171" radius={[3,3,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insight */}
        <div style={{ ...card, borderLeft: '2px solid rgba(79,142,247,0.25)' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Key Insight</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.85, fontSize: '0.9rem' }}>
            Logistic Regression is deployed in production due to its high ROC-AUC score (0.982) and strong recall — critical for minimising missed fraud cases. Random Forest achieves the best overall F1 and accuracy, but Logistic Regression is preferred for its speed and interpretability in real-time detection environments.
          </p>
        </div>

      </div>
    </div>
  );
}