import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container" style={{
      padding: '5rem 1.25rem',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
      }}>
        <Compass size={36} />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', marginBottom: '2rem', lineHeight: 1.6 }}>
        The marketplace page or listing you are looking for does not exist or may have been removed.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <ArrowLeft size={18} /> Return to Homepage
      </Link>
    </div>
  );
}
