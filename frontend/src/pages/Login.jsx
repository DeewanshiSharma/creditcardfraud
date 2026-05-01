import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [tab, setTab] = useState('register'); // 'register' or 'login'

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isRegister = tab === 'register';
    const baseURL = 'https://creditcardfraud-tyza.onrender.com';

    try {
      let response;

      if (isRegister) {
        // Register
        response = await fetch(`${baseURL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username, 
            email, 
            password 
          }),
        });
      } else {
        // Login
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        response = await fetch(`${baseURL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          setError('✅ Account created successfully! Please login now.');
          setTab('login');
          setPassword('');
        } else {
          // Successful Login
          localStorage.setItem('token', data.access_token);
          onLogin();
        }
      } else {
        setError(data.detail || 'Something went wrong. Please try again.');
        triggerShake();
      }
    } catch (err) {
      setError('Unable to connect to server. Please check your internet.');
      triggerShake();
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, #1a2a6c 0%, #060E1E 60%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
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
          marginBottom: '2rem' 
        }}>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: tab === 'register' ? '#6366f1' : 'transparent',
              color: tab === 'register' ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
          <button
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              background: tab === 'login' ? '#6366f1' : 'transparent',
              color: tab === 'login' ? '#fff' : 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              placeholder="Choose a username"
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Email - Only show in Register tab */}
          {tab === 'register' && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="Enter your email"
                required
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.07)',
                  border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
          )}

          {/* Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              required
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: error ? '1px solid rgba(239,68,68,0.6)' : '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <p style={{ 
              color: error.includes('✅') ? '#4ade80' : '#f87171', 
              textAlign: 'center', 
              marginBottom: '1rem',
              fontSize: '0.9rem'
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#4b5563' : 'linear-gradient(135deg, #3b82f6, #6366f1)',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              color: '#fff',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
            }}
          >
            {loading 
              ? 'Processing...' 
              : tab === 'register' 
                ? 'Create Account' 
                : 'Sign In'}
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
      `}</style>
    </div>
  );
}
