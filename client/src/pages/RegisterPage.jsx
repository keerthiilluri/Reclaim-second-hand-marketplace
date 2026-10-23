import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '500px',
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
            <UserPlus size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.35rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join ReClaim to buy, sell, and connect with trusted peers
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="e.g. Keerthi Rao"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="email"
                name="email"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="name@college.edu or email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number (Optional for WhatsApp)</label>
            <div style={{ position: 'relative' }}>
              <Phone size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="tel"
                name="phone"
                className="form-input"
                style={{ paddingLeft: '2.4rem' }}
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Min 6 chars"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  style={{ paddingLeft: '2.4rem' }}
                  placeholder="Re-type password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
