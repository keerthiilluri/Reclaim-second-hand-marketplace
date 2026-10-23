import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/common/ProductCard';

export default function WishlistPage() {
  const { wishlist, wishlistCount, loading, removeFromWishlist } = useWishlist();

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Saved Wishlist</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        <Link to="/products" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShoppingBag size={16} /> Continue Exploring
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
          Loading your saved wishlist...
        </div>
      ) : wishlist && wishlist.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}>
          {wishlist.map((item) => (
            <div key={item._id} style={{ display: 'flex', flexDirection: 'column' }}>
              <ProductCard product={item} />
              <button
                type="button"
                onClick={() => removeFromWishlist(item._id)}
                className="btn btn-secondary btn-sm"
                style={{
                  marginTop: '0.5rem',
                  color: 'var(--danger)',
                  borderColor: 'var(--border)',
                  fontSize: '0.8rem',
                }}
              >
                <Trash2 size={14} /> Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '2rem auto',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <Heart size={32} />
          </div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Your Wishlist is Empty</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Tap the heart icon on any listing to save items here and track prices or contact sellers later.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Explore Marketplace <ArrowRight size={18} />
          </Link>
        </div>
      )}
    </div>
  );
}
