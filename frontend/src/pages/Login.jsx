// src/pages/Auth.jsx
import React, { useState } from 'react';

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('register'); // 'register' or 'login'

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isRegister = tab === 'register';
    const url = isRegister 
      ? 'https://creditcardfraud-tyza.onrender.com/register' 
      : 'https://creditcardfraud-tyza.onrender.com/login';

    try {
      let response;

      if (isRegister) {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
      } else {
        // Login
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });
      }

      const data = await response.json();

      if (response.ok) {
        if (isRegister) {
          alert('Account created successfully! Please login now.');
          setTab('login');        // Switch to login tab
          setPassword('');        // Clear password field
        } else {
          // Successful Login
          localStorage.setItem('token', data.access_token);
          onLogin();
        }
      } else {
        setError(data.detail || 'Operation failed. Please try again.');
      }
    } catch (err) {
      setError('Unable to connect to server. Please try again.');
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
      <div style={{
        width: '100%', maxWidth: '440px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        backdropFilter: 'blur(20px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🛡️</div>
          <h1 style={{ color: '#fff', margin: '0 0 0.5rem' }}>FraudGuard</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            {tab === 'register' ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', marginBottom: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px' }}>
          <button 
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'register' ? '#6366f1' : 'transparent',
              color: tab === 'register' ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Register
          </button>
          <button 
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: tab === 'login' ? '#6366f1' : 'transparent',
              color: tab === 'login' ? 'white' : 'rgba(255,255,255,0.6)',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
          />

          {tab === 'register' && (
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '14px', marginBottom: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '14px', marginBottom: '20px', borderRadius: '12px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
          />

          {error && <p style={{ color: '#f87171', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : tab === 'register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
