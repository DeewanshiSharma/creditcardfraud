import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Label, ResponsiveContainer } from 'recharts';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '2rem',
};

const classData = [{ class: 'Legitimate (0)', count: 284315 }, { class: 'Fraud (1)', count: 492 }];
const rocData = [
  {fpr:0.00,tpr:0.00},{fpr:0.00,tpr:0.86},{fpr:0.01,tpr:0.86},{fpr:0.01,tpr:0.90},
  {fpr:0.02,tpr:0.90},{fpr:0.02,tpr:0.92},{fpr:0.05,tpr:0.92},{fpr:0.05,tpr:0.93},
  {fpr:0.09,tpr:0.93},{fpr:0.09,tpr:0.95},{fpr:0.13,tpr:0.95},{fpr:0.13,tpr:0.96},
  {fpr:0.23,tpr:0.96},{fpr:0.23,tpr:0.97},{fpr:0.28,tpr:0.97},{fpr:0.28,tpr:0.98},
  {fpr:0.32,tpr:0.98},{fpr:0.32,tpr:0.99},{fpr:0.45,tpr:0.99},{fpr:0.45,tpr:1.00},{fpr:1.00,tpr:1.00},
];

const heatmapLabels = ['Time','V2','V4','V6','V8','V10','V12','V14','V16','V18','V20','V22','V24','V26','V28','Class'];
const correlations = [
  [1.0,-0.1,-0.2,0.1,-0.1,0.0,0.1,-0.1,0.0,0.1,0.0,0.1,0.0,-0.2,0.0,-0.1],
  [-0.1,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.2],
  [-0.2,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.2],
  [0.1,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.1],
  [-0.1,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.1],
  [0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.2],
  [0.1,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.3],
  [-0.1,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.4],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,0.0,-0.2],
  [0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.0,-0.1],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,0.0,0.2],
  [0.1,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0,-0.1],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0,0.0],
  [-0.2,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0,0.0],
  [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,1.0,0.0],
  [-0.1,-0.2,0.2,-0.1,0.1,-0.2,-0.3,-0.4,-0.2,-0.1,0.2,-0.1,0.0,0.0,0.0,1.0],
];

const getColor = v => {
  if (Math.abs(v) < 0.02) return 'rgba(255,255,255,0.04)';
  if (v > 0) return `rgba(79,142,247,${Math.min(v * 1.4, 0.85)})`;
  return `rgba(248,113,113,${Math.min(Math.abs(v) * 1.4, 0.85)})`;
};

const tt = { background: '#111b2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#fff', fontSize: '0.82rem' };
const axis = { fill: 'rgba(255,255,255,0.3)', fontSize: 11 };

export default function Plots() {
  return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '1080px' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.03em', fontFamily: 'Georgia, serif' }}>Model Visualizations</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem' }}>Charts and matrices generated from the fraud detection training pipeline.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={card}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '1.5rem' }}>Class Distribution</p>
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={classData} margin={{ top: 8, right: 12, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="class" tick={axis} axisLine={false} tickLine={false}>
                  <Label value="Class" offset={-12} position="insideBottom" fill="rgba(255,255,255,0.25)" fontSize={11} />
                </XAxis>
                <YAxis tick={axis} axisLine={false} tickLine={false}>
                  <Label value="Count" angle={-90} position="insideLeft" fill="rgba(255,255,255,0.25)" fontSize={11} style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip contentStyle={tt} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" fill="#4f8ef7" radius={[4,4,0,0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={card}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>ROC Curve</p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>AUC = 0.982</p>
            <ResponsiveContainer width="100%" height={270}>
              <LineChart data={rocData} margin={{ top: 8, right: 12, left: 4, bottom: 20 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="fpr" type="number" domain={[0,1]} tick={axis} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)}>
                  <Label value="False Positive Rate" offset={-12} position="insideBottom" fill="rgba(255,255,255,0.25)" fontSize={11} />
                </XAxis>
                <YAxis type="number" domain={[0,1]} tick={axis} axisLine={false} tickLine={false} tickFormatter={v => v.toFixed(1)}>
                  <Label value="True Positive Rate" angle={-90} position="insideLeft" fill="rgba(255,255,255,0.25)" fontSize={11} style={{ textAnchor: 'middle' }} />
                </YAxis>
                <Tooltip contentStyle={tt} formatter={v => v.toFixed(3)} />
                <Line type="linear" dataKey="tpr" stroke="#7c6ef7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div style={{ ...card, overflowX: 'auto' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Correlation Matrix</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', marginBottom: '1.5rem' }}>Blue = positive, red = negative correlation</p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', minWidth: '480px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '1px' }}>
              {heatmapLabels.map((l, i) => (
                <div key={i} style={{ height: '27px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: '10px', color: 'rgba(255,255,255,0.3)', paddingRight: '8px', minWidth: '32px', fontFamily: 'monospace' }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 27px)', gap: '2px' }}>
                {correlations.map((row, i) => row.map((val, j) => (
                  <div key={`${i}-${j}`} title={`${heatmapLabels[i]} × ${heatmapLabels[j]}: ${val.toFixed(2)}`}
                    style={{ width: '27px', height: '27px', borderRadius: '3px', background: getColor(val) }} />
                )))}
              </div>
              <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                {heatmapLabels.map((l, i) => (
                  <div key={i} style={{ width: '27px', display: 'flex', justifyContent: 'center' }}>
                    <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: '32px', fontFamily: 'monospace' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginLeft: '12px', paddingTop: '2px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>+1</span>
              <div style={{ width: '12px', flex: 1, borderRadius: '3px', background: 'linear-gradient(to bottom, rgba(79,142,247,0.85), rgba(255,255,255,0.04), rgba(248,113,113,0.85))' }} />
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>−1</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}