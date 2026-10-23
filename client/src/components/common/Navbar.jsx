import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Heart,
  PlusCircle,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px',
        gap: '1.25rem'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              ReClaim
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Pre-Loved Market
            </div>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: '480px',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
          className="desktop-search"
        >
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '14px',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search textbooks, laptops, phones, bicycles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 1rem 0.625rem 2.5rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-muted)',
              fontSize: '0.9rem',
              outline: 'none',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(15, 118, 110, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'var(--bg-muted)';
              e.target.style.borderColor = 'var(--border)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </form>

        {/* Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* Explore Products Link */}
          <Link
            to="/products"
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ShoppingBag size={16} />
            <span className="hide-on-mobile">Explore</span>
          </Link>

          {/* Sell Button CTA */}
          <Link
            to="/sell"
            className="btn btn-primary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <PlusCircle size={16} />
            <span>Sell Item</span>
          </Link>

          {/* Wishlist Link with Badge */}
          <Link
            to="/wishlist"
            style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-body)',
              border: '1px solid var(--border)',
              backgroundColor: '#ffffff',
              transition: 'all 0.2s ease'
            }}
            title="My Saved Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Dropdown */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.65rem 0.35rem 0.35rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  backgroundColor: '#ffffff',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  maxWidth: '100px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }} className="hide-on-mobile">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '220px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  padding: '0.5rem 0',
                  zIndex: 200,
                  animation: 'fadeIn 0.15s ease-out'
                }}>
                  <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      {user?.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email}
                    </div>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.625rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-body)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LayoutDashboard size={16} color="var(--primary)" />
                    <span>My Dashboard & Listings</span>
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setUserDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.625rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--text-body)',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Heart size={16} color="var(--primary)" />
                    <span>Saved Wishlist ({wishlistCount})</span>
                  </Link>

                  <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.35rem 0' }} />

                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.625rem 1rem',
                      fontSize: '0.875rem',
                      color: 'var(--danger)',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--danger-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm hide-on-mobile">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.25rem',
              color: 'var(--text-main)',
              cursor: 'pointer',
              display: 'none',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#ffffff',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search marketplace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              <Search size={16} />
            </button>
          </form>

          <Link to="/products" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <ShoppingBag size={18} /> Browse Marketplace
          </Link>
          <Link to="/sell" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
            <PlusCircle size={18} /> Sell an Item
          </Link>
          <Link to="/wishlist" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
            <Heart size={18} /> My Wishlist ({wishlistCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                <LayoutDashboard size={18} /> Dashboard & Listings
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ justifyContent: 'flex-start' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ flex: 1 }}>Sign In</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1 }}>Register</Link>
            </div>
          )}
        </div>
      )}

      {/* Embedded CSS for responsive visibility */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-search { display: none !important; }
          .hide-on-mobile { display: none !important; }
          .mobile-menu-toggle { display: block !important; }
        }
      `}</style>
    </header>
  );
}
