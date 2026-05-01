import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, Outlet } from 'react-router-dom';
import { supabase } from './supabase';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Compare from './pages/Compare';
import Plots from './pages/Plots';
import Login from './pages/Login';

function Layout({ handleLogout }) {
  return (
    <div style={{ minHeight: '100vh', background: '#060E1E', color: 'white' }}>
      <nav style={{
        background: 'rgba(10,20,40,0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(99,137,255,0.15)',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '180px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px'
          }}>🛡️</div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>FraudGuard</span>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '4px' }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/predict', label: 'Predict' },
            { to: '/compare', label: 'Compare' },
            { to: '/plots', label: 'Plots' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} style={({ isActive }) => ({
              color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
              padding: '6px 18px',
              borderRadius: '8px',
              background: isActive ? 'rgba(99,102,241,0.25)' : 'transparent',
              border: isActive ? '1px solid rgba(99,102,241,0.5)' : '1px solid transparent',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            })}>
              {label}
            </NavLink>
          ))}
        </div>

        <div style={{ minWidth: '180px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleLogout} style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
            padding: '6px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}>Logout</button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#060E1E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/" replace /> : <Login />}
        />
        <Route element={session ? <Layout handleLogout={handleLogout} /> : <Navigate to="/login" replace />}>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/plots" element={<Plots />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
