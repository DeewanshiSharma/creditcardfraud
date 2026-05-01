import React, { useEffect } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  // Handle OAuth callback when user returns from Google
  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (data.session) {
        console.log("Session found after OAuth callback");
        navigate('/', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,   // Better than hardcoding
      }
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060E1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        background: 'rgba(10,20,40,0.85)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(99,137,255,0.15)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          margin: '0 auto 24px'
        }}>🛡️</div>
       
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '8px' }}>
          FraudGuard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '32px' }}>
          Sign in to detect credit card fraud
        </p>

        <button 
          onClick={handleGoogleLogin} 
          style={{
            width: '100%',
            background: 'white',
            color: '#333',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <img src="https://www.google.com/favicon.ico" width="20" alt="Google" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
