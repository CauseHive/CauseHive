
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectPage = ({ to = '/', message = 'Redirecting...' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(to);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, to]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.4)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '2rem 2.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        minWidth: '320px',
        textAlign: 'center',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>{message}</h2>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default RedirectPage;
