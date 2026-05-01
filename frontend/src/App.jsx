import React, { useState, useEffect } from 'react';

const BASE_URL = 'https://creditcardfraud-tyza.onrender.com';

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('register');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);
  const [wakingSeconds, setWakingSeconds] = useState(0);

  // Wake-up countdown timer
  useEffect(() => {
    let interval;
    if (serverWaking) {
      setWakingSeconds(0);
      interval = setInterval(() => setWakingSeconds(s => s + 1), 1000);
    } else {
      setWakingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [serverWaking]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setServerWaking(false);

    // Show wake-up notice after 4 seconds of waiting
    const wakeTimer = setTimeout(() => {
      setServerWaking(true);
    }, 4000);

    try {
      let response;

      if (tab === 'register') {
        response = await fetch(`${BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
      } else {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        response = await fetch(`${BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
      }

      clearTimeout(wakeTimer);
      setServerWaking(false);

      const data = await response.json();

      if (response.ok) {
        if (tab === 'register') {
          setError('✅ Account created! Please login now.');
          setTab('login');
          setPassword('');
          setEmail('');
        } else {
          localStorage.setItem('token', data.access_token);
          onLogin();
        }
      } else {
        const msg = data.detail || 'Something went wrong. Please try again.';
        setError(Array.isArray(msg) ? msg[0]?.msg || 'Validation error' : msg);
        triggerShake();
      }
    } catch (err) {
      clearTimeout(wakeTimer);
      setServerWaking(false);
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        setError('⏳ Server is waking up (Render free tier). Wait ~30s and try again.');
      } else {
        setError('Unable to connect. Please check your internet connection.');
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',   // ← FIX: prevents overflow
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.82rem',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: '8px',
    fontWeight: 500,
    letterSpacing: '0.03em',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #1a2a6c 0%, #060E1E 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
    }}>
      {/* Glow orb */}
      <div style={{
        position: 'fixed', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        backdropFilter: 'blur(20px)',
        animation: shake ? 'shake 0.4s ease' : 'none',
        boxSizing: 'border-box',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', marginBottom: '1.5rem',
            boxShadow: '0 0 40px rgba(99,102,241,0.3)',
          }}>🛡️</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', margin: '0 0 0.5rem' }}>
            FraudGuard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.9rem', margin: 0 }}>
            {tab === 'register' ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '2rem',
        }}>
          {['register', 'login'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: '10px',
                background: tab === t ? '#6366f1' : 'transparent',
                color: tab === t ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
              }}
            >
              {t === 'register' ? 'Register' : 'Login'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Choose a username"
              required
              minLength={3}
              style={inputStyle}
            />
          </div>

          {/* Email — Register only */}
          {tab === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email"
                required
                style={inputStyle}
              />
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={labelStyle}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                required
                minLength={6}
                style={{ ...inputStyle, paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                style={{
                  position: 'absolute', right: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                  fontSize: '1.1rem', padding: 0,
                }}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error / Success message */}
          {error && (
            <div style={{
              background: error.includes('✅') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
              border: `1px solid ${error.includes('✅') ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '1rem',
              color: error.includes('✅') ? '#4ade80' : '#f87171',
              fontSize: '0.88rem',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          {/* Server waking notice */}
          {serverWaking && (
            <div style={{
              background: 'rgba(251,191,36,0.1)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '1rem',
              color: '#fbbf24',
              fontSize: '0.85rem',
              textAlign: 'center',
            }}>
              ⏳ Waking up server... ({wakingSeconds}s) — Render free tier takes ~30s on first request
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#374151' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading && (
              <span style={{
                width: '16px', height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }} />
            )}
            {loading
              ? (serverWaking ? 'Waiting for server...' : 'Processing...')
              : tab === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder { color: rgba(255,255,255,0.25); }
        input:focus { border-color: rgba(99,102,241,0.6) !important; }
      `}</style>
    </div>
  );
}
