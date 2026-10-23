import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Where to redirect after login (e.g. was trying to access /sell)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login helper
  const handleQuickLogin = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="container" style={{
      padding: '3rem 1.25rem 5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '75vh',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-xl)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}>
            <LogIn size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to manage your listings and contact sellers
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Panel */}
        <div style={{
          marginTop: '1.75rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          fontSize: '0.825rem',
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--primary)" /> Demo Accounts (1-Click Fill):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('rohit@demo.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Rohit (Seller)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('priya@demo.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Priya (Buyer/Seller)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('arjun@demo.com')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
            >
              Arjun
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
