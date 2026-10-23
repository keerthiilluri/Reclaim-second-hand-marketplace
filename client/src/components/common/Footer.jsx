import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, RefreshCw, Heart, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#0f172a',
      color: '#cbd5e1',
      paddingTop: '3.5rem',
      paddingBottom: '2rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Sparkles size={20} />
              </div>
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em'
              }}>
                ReClaim
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '1.25rem' }}>
              India’s dedicated second-hand marketplace for students and professionals. Give pre-loved items a new life, save money, and foster sustainable reuse.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <MapPin size={15} color="var(--primary)" />
              <span>Covering Bengaluru, Pune, Mumbai, Delhi & Hyderabad</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.1rem', fontWeight: 600 }}>
              Top Categories
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/products?category=Textbooks+%26+Education" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Engineering & College Textbooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptops+%26+Computers" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Laptops & Computer Gear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartphones+%26+Audio" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Smartphones & Audio Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Bicycles+%26+Mobility" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Campus Bicycles & Mobility
                </Link>
              </li>
              <li>
                <Link to="/products?category=Furniture+%26+Home" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Study Desks & Chairs
                </Link>
              </li>
              <li>
                <Link to="/products?category=Hostel+Essentials" style={{ color: '#94a3b8', transition: 'color 0.15s' }}>
                  Hostel & PG Appliances
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.1rem', fontWeight: 600 }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Explore All Listings</Link></li>
              <li><Link to="/sell" style={{ color: '#94a3b8' }}>List an Item for Sale</Link></li>
              <li><Link to="/dashboard" style={{ color: '#94a3b8' }}>Seller Dashboard</Link></li>
              <li><Link to="/wishlist" style={{ color: '#94a3b8' }}>Saved Items</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Sign In to Account</Link></li>
            </ul>
          </div>

          {/* Trust & Reassurance */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.1rem', fontWeight: 600 }}>
              Trust & Community
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <ShieldCheck size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                  100% Peer-to-Peer direct dealing with verified contact options.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <RefreshCw size={18} color="#0d9488" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                  Zero listing fees. Keep 100% of your earnings when selling.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <Heart size={18} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.825rem', color: '#94a3b8' }}>
                  Empowering eco-friendly circular economy across Indian campuses.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div style={{
          paddingTop: '2rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            © {new Date().getFullYear()} ReClaim Marketplace. Full-Stack Production System. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Built with React, Node, Express & MongoDB</span>
            <span>Local & Atlas Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
