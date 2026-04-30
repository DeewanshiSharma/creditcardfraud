import React, { useState } from 'react';
import { fraudApi } from '../services/api';

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: '16px',
  padding: '2rem',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '9px 13px',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

export default function Predict() {
  const [inputs, setInputs] = useState(Array(30).fill(0));
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSample, setActiveSample] = useState(null);

  const samples = [
    { name: 'Morning grocery', risk: 'low', values: [1200,32.5,1.2,-0.5,0.8,-1.1,0.4,0.9,-0.3,0.6,0.2,-0.1,0.7,0.3,-0.4,1.0,-0.2,0.5,0.1,-0.6,0.8,-0.3,0.4,0.2,-0.1,0.9,0.3,-0.2,0.6,0.1] },
    { name: 'Online shopping', risk: 'normal', values: [8500,89.99,-0.8,0.3,-0.4,1.2,-0.7,0.5,1.1,-0.9,0.6,-0.2,0.8,-0.5,1.0,-0.3,0.7,-0.4,1.2,-0.6,0.9,-0.1,0.5,0.3,-0.8,1.1,-0.7,0.4,0.2,-0.5] },
    { name: 'Large amount', risk: 'high', values: [24500,1899.00,-4.2,2.8,-5.1,3.4,-2.9,4.1,-3.7,2.5,-4.0,3.2,-2.8,4.5,-3.1,2.9,-4.2,3.6,-2.7,4.0,-3.5,2.8,-4.1,3.3,-2.9,4.2,-3.8,2.6,-4.3,3.1] },
    { name: 'Night transaction', risk: 'high', values: [79200,1250.00,-5.8,3.9,-6.2,4.5,-4.1,5.3,-3.2,3.1,-5.5,4.2,-4.8,5.1,-3.9,4.7,-5.2,4.0,-4.6,5.4,-3.7,4.3,-5.0,4.8,-4.2,5.6,-3.8,4.1,-5.1,4.5] },
    { name: 'Small safe tx', risk: 'low', values: [3400,8.75,2.1,-0.8,1.5,-1.3,0.9,-0.4,1.2,0.3,1.8,-0.6,1.4,-1.1,0.7,-0.2,1.0,-0.5,1.3,-0.9,1.6,-0.7,1.1,-0.3,1.9,-0.4,1.2,-0.8,1.4,-0.1] },
  ];

  const riskColor = { low: '#34d399', normal: '#60a5fa', high: '#f87171' };

  const loadSample = (sample, index) => {
    setInputs([...sample.values]);
    setActiveSample(index);
    setResult(null);
    setError('');
  };

  const handleChange = (index, value) => {
    const newInputs = [...inputs];
    newInputs[index] = parseFloat(value) || 0;
    setInputs(newInputs);
  };

  const predict = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fraudApi.predict(inputs);
      let data = res.data;
      if (data.fraud_probability !== undefined) {
        data.fraud_probability = Math.max(1, Math.min(99, Math.round(data.fraud_probability)));
      }
      setResult(data);
    } catch {
      setError('Cannot connect to backend. Ensure FastAPI is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#07101f', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '1080px' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.03em', fontFamily: 'Georgia, serif' }}>Predict a Transaction</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', letterSpacing: '0.01em' }}>Select a sample or enter feature values and run the model.</p>
        </div>

        {/* Samples */}
        <div style={{ ...card, marginBottom: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Quick Samples</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {samples.map((s, i) => (
              <button key={i} onClick={() => loadSample(s, i)} style={{
                padding: '7px 16px', borderRadius: '100px', fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                background: activeSample === i ? 'rgba(79,142,247,0.12)' : 'transparent',
                border: activeSample === i ? '1px solid rgba(79,142,247,0.35)' : '1px solid rgba(255,255,255,0.08)',
                color: activeSample === i ? '#93b8fa' : 'rgba(255,255,255,0.45)',
              }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: riskColor[s.risk], marginRight: '7px', verticalAlign: 'middle', position: 'relative', top: '-1px' }} />
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

          {/* Features */}
          <div style={{ ...card, maxHeight: '68vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '1.25rem', letterSpacing: '-0.01em' }}>Transaction Features <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(30 values)</span></p>
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {inputs.map((val, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', fontWeight: 500, letterSpacing: '0.04em' }}>
                      {i === 0 ? 'Time' : i === 1 ? 'Amount' : `V${i}`}
                    </label>
                    <input type="number" step="any" value={val} onChange={e => handleChange(i, e.target.value)} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button onClick={predict} disabled={loading} style={{
                flex: 1, background: loading ? 'rgba(79,142,247,0.15)' : 'rgba(79,142,247,0.18)', border: '1px solid rgba(79,142,247,0.3)', borderRadius: '10px',
                padding: '13px', color: '#93b8fa', fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em', transition: 'all 0.15s',
              }}>
                {loading ? 'Analyzing...' : 'Run Prediction'}
              </button>
              <button onClick={() => { setInputs(Array(30).fill(0)); setResult(null); setError(''); setActiveSample(null); }} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                padding: '13px 22px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem',
              }}>Reset</button>
            </div>
          </div>

          {/* Result */}
          <div style={{ ...card, minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Result</p>

            {error && <div style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '10px', padding: '1rem', color: '#f87171', fontSize: '0.85rem', lineHeight: 1.6 }}>{error}</div>}

            {!result && !error && (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'rgba(255,255,255,0.18)', fontSize: '0.875rem', padding: '2rem', lineHeight: 1.8 }}>
                Select a sample or enter values,<br />then run the prediction.
              </div>
            )}

            {result && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: result.is_fraud ? '#f87171' : '#34d399', marginBottom: '1.25rem', opacity: 0.8 }}>
                  {result.is_fraud ? 'Fraud Detected' : 'Safe Transaction'}
                </div>
                <div style={{ fontSize: '4.5rem', fontWeight: 300, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'Georgia, serif', marginBottom: '0.25rem' }}>
                  {result.fraud_probability}<span style={{ fontSize: '2rem', color: 'rgba(255,255,255,0.4)' }}>%</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', letterSpacing: '0.05em', marginBottom: '2rem', textTransform: 'uppercase', fontWeight: 500 }}>Fraud Probability</p>
                <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.07)', borderRadius: '100px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${result.fraud_probability}%`, background: result.is_fraud ? '#f87171' : '#34d399', borderRadius: '100px', transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}