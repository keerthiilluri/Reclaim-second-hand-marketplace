import React, { useState } from 'react';
import { X, MessageSquare, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { contactService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatPrice } from '../../utils/formatters';

export default function ContactModal({ product, onClose }) {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState(
    `Hi ${product?.seller?.name || 'Seller'}, I am interested in purchasing your "${product?.title}". Is this still available?`
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const sellerPhone = product.seller?.phone;
  // Clean phone number for WhatsApp link
  const cleanedPhone = sellerPhone ? sellerPhone.replace(/[^0-9]/g, '') : null;
  const whatsappUrl = cleanedPhone
    ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
        `Hi, I found your listing "${product.title}" (${formatPrice(product.price)}) on ReClaim Marketplace and would like to buy it.`
      )}`
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please provide your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      await contactService.sendInquiry({
        productId: product._id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to deliver inquiry to the seller.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>Contact Seller</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Listing: {product.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* WhatsApp Direct Option */}
        {whatsappUrl && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#166534' }}>
                Instant WhatsApp Chat
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
                Seller phone: {sellerPhone}
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{
                backgroundColor: '#25d366',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <MessageCircle size={16} /> Open WhatsApp
            </a>
          </div>
        )}

        {/* Success Alert */}
        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={48} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Message Sent!</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Your inquiry has been delivered directly to {product.seller?.name || 'the seller'}. They can reply to your email or view it on their dashboard.
            </p>
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          /* Contact Form */
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label className="form-label">Your Name *</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Your Email *</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone (Optional)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765..."
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Message *</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message or question about price/pickup location..."
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <Send size={16} />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
