import React from 'react';
import { Link } from 'react-router-dom';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '2rem',
};

export default function Home() {
  const stats = [
    { label: 'Model Accuracy', value: '99.8%' },
    { label: 'Input Features', value: '30' },
    { label: 'Algorithms', value: '4' },
  ];

  const actions = [
    { name: 'Predict Fraud', description: 'Run a transaction through the model and receive a real-time fraud probability score.', path: '/predict', accent: '#4f8ef7' },
    { name: 'Compare Models', description: 'Side-by-side performance metrics for Logistic Regression, Decision Tree, Random Forest and KNN.', path: '/compare', accent: '#7c6ef7' },
    { name: 'View Plots', description: 'Confusion matrix, fraud distribution, correlation heatmap and ROC curve visualizations.', path: '/plots', accent: '#a06ef7' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '1080px' }}>

        {/* Status pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', padding: '6px 20px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', fontWeight: 500 }}>Model Online &mdash; Logistic Regression</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', fontWeight: 300, color: '#fff', marginBottom: '1.25rem', letterSpacing: '-0.03em', lineHeight: 1.08, fontFamily: 'Georgia, serif' }}>
            Fraud Detection<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.55)' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '1rem', maxWidth: '520px', margin: '0 auto', lineHeight: 1.8, letterSpacing: '0.01em' }}>
            A machine learning platform for detecting fraudulent transactions, built with scikit-learn, FastAPI, and React.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1px', marginBottom: '3.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '2rem', background: '#07101f', textAlign: 'center' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', fontFamily: 'Georgia, serif', marginBottom: '0.4rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {actions.map((a, i) => (
            <Link key={i} to={a.path} style={{ flex: 1, minWidth: '260px', textDecoration: 'none' }}>
              <div style={{
                ...card, height: '100%', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer',
                borderTop: `2px solid ${a.accent}22`,
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = `${a.accent}44`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '32px', height: '2px', background: a.accent, borderRadius: '2px', marginBottom: '1.5rem', opacity: 0.7 }} />
                <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{a.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.875rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>{a.description}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: a.accent, fontSize: '0.8rem', fontWeight: 500, letterSpacing: '0.03em', opacity: 0.8 }}>
                  <span>Open</span>
                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>&#8594;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}