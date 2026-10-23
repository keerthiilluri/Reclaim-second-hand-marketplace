import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  User,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  Mail,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { productService, contactService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatRelativeTime, formatDate } from '../utils/formatters';

export default function DashboardPage() {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'inquiries' | 'profile'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'sold'

  // Data states
  const [myListings, setMyListings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, sold: 0 });

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Fetch listings & inquiries
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [listingsRes, inquiriesRes] = await Promise.all([
        productService.getMyListings(),
        contactService.getMyInquiries(),
      ]);

      const prods = listingsRes?.products || [];
      setMyListings(prods);
      setStats({
        total: prods.length,
        active: listingsRes?.activeCount || prods.filter((p) => p.status === 'active').length,
        sold: listingsRes?.soldCount || prods.filter((p) => p.status === 'sold').length,
      });

      setInquiries(inquiriesRes?.inquiries || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Toggle listing status
  const handleToggleStatus = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 'sold' ? 'active' : 'sold';
    try {
      await productService.updateStatus(productId, nextStatus);
      setMyListings((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, status: nextStatus } : item
        )
      );
      setStats((prev) => ({
        ...prev,
        active: nextStatus === 'active' ? prev.active + 1 : prev.active - 1,
        sold: nextStatus === 'sold' ? prev.sold + 1 : prev.sold - 1,
      }));
    } catch (err) {
      alert(err.message || 'Failed to update listing status');
    }
  };

  // Delete listing
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await productService.delete(deleteId);
      setMyListings((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete product listing');
    } finally {
      setDeleting(false);
    }
  };

  // Update profile
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      setProfileSuccess('');
      const res = await authService.updateMe({
        name: profileName.trim(),
        phone: profilePhone.trim(),
      });
      if (res?.data?.user) {
        updateUser(res.data.user);
      }
      setProfileSuccess('Profile details updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Filter listings
  const filteredListings = myListings.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Top Welcome Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 800,
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', marginBottom: '0.2rem' }}>
              Hello, {user?.name || 'Seller'}!
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {user?.email} {user?.phone ? `• ${user.phone}` : ''}
            </p>
          </div>
        </div>

        <Link to="/sell" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <PlusCircle size={18} /> Sell New Item
        </Link>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Total Listings
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.25rem' }}>
            {stats.total}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active on Market
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '0.25rem' }}>
            {stats.active}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Sold Items
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#475569', marginTop: '0.25rem' }}>
            {stats.sold}
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '1.25rem 1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Inquiries Received
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {inquiries.length}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem',
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'listings' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'listings' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Package size={18} /> My Listings ({myListings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'inquiries' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'inquiries' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <MessageSquare size={18} /> Inquiries ({inquiries.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'profile' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <User size={18} /> Profile Settings
        </button>
      </div>

      {/* Tab 1: My Listings */}
      {activeTab === 'listings' && (
        <div>
          {/* Subfilter Pills (All / Active / Sold) */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {['all', 'active', 'sold'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterStatus(s)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: '1px solid',
                  borderColor: filterStatus === s ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: filterStatus === s ? 'var(--primary)' : '#ffffff',
                  color: filterStatus === s ? '#ffffff' : 'var(--text-body)',
                  cursor: 'pointer',
                }}
              >
                {s} ({s === 'all' ? myListings.length : s === 'active' ? stats.active : stats.sold})
              </button>
            ))}
          </div>

          {filteredListings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredListings.map((item) => {
                const img = item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80';
                return (
                  <div
                    key={item._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      padding: '1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1.25rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Item Thumbnail & Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', minWidth: '280px', flex: 1 }}>
                      <img
                        src={img}
                        alt={item.title}
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: 'var(--radius-md)',
                          objectFit: 'cover',
                          backgroundColor: '#f1f5f9',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className={`badge ${item.status === 'sold' ? 'badge-sold' : 'badge-active'}`}>
                            {item.status === 'sold' ? 'Sold' : 'Active'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.category}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                          {item.title}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                            {formatPrice(item.price)}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <MapPin size={12} /> {item.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                      <Link to={`/products/${item._id}`} className="btn btn-secondary btn-sm" title="View Public Listing">
                        <ExternalLink size={14} /> View
                      </Link>

                      <Link to={`/edit-product/${item._id}`} className="btn btn-secondary btn-sm" title="Edit Listing">
                        <Edit size={14} /> Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item._id, item.status)}
                        className="btn btn-secondary btn-sm"
                        style={{
                          color: item.status === 'sold' ? '#16a34a' : 'var(--text-muted)',
                        }}
                      >
                        <CheckCircle2 size={14} />
                        {item.status === 'sold' ? 'Re-activate' : 'Mark Sold'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteId(item._id)}
                        className="btn btn-danger btn-sm"
                        title="Delete Listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              <Inbox size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Listings Yet</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                You haven't listed any pre-loved items yet. Post your textbooks, gadgets, or room essentials in 60 seconds!
              </p>
              <Link to="/sell" className="btn btn-primary">
                <PlusCircle size={16} /> Post Your First Item
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Inquiries Received */}
      {activeTab === 'inquiries' && (
        <div>
          {inquiries.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {inquiries.map((inq) => {
                const prod = inq.product;
                const prodImg = prod?.images?.[0] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=200&q=80';
                return (
                  <div
                    key={inq._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border)',
                      padding: '1.5rem',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid var(--border)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={prodImg}
                          alt={prod?.title || 'Product'}
                          style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Inquiry for item:
                          </div>
                          <Link
                            to={`/products/${prod?._id}`}
                            style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}
                          >
                            {prod?.title || 'Listing'} ({formatPrice(prod?.price)})
                          </Link>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={13} /> {formatRelativeTime(inq.createdAt)}
                      </div>
                    </div>

                    {/* Buyer Message */}
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      color: 'var(--text-body)',
                      marginBottom: '1rem',
                    }}>
                      "{inq.message}"
                    </div>

                    {/* Buyer Contacts */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600 }}>From: {inq.name}</span>
                      <a href={`mailto:${inq.email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}>
                        <Mail size={14} /> {inq.email}
                      </a>
                      {inq.phone && (
                        <a href={`tel:${inq.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)' }}>
                          <Phone size={14} /> {inq.phone}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '0 auto',
            }}>
              <MessageSquare size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Inquiries Received</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                When buyers are interested in your listings and submit inquiries, their messages and contact details will appear here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Profile Settings */}
      {activeTab === 'profile' && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          padding: '2rem',
          maxWidth: '600px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.35rem' }}>Profile Information</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Update your public seller name and contact phone for buyer WhatsApp chats.
          </p>

          {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-muted)' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number (For Direct WhatsApp Contact)</label>
              <input
                type="tel"
                className="form-input"
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
              <div className="form-hint">Enables one-click WhatsApp chat for interested buyers</div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileSaving}
              style={{ marginTop: '0.5rem' }}
            >
              {profileSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete this listing?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete this listing? It will be permanently removed from MongoDB and all saved wishlists.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
