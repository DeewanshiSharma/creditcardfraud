import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // This forces Supabase to process the OAuth callback from URL
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Callback error:", error);
        }

        if (data?.session) {
          console.log("✅ Login successful - Redirecting to Home");
          navigate('/', { replace: true });
        } else {
          console.log("No session found after callback");
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error("Callback failed:", err);
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060E1E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Completing login...
    </div>
  );
}
