import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Tag } from 'lucide-react';
import { formatPrice, formatRelativeTime } from '../../utils/formatters';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isFavorited = isInWishlist(product._id);
  const isSold = product.status === 'sold';

  // Format condition badge class
  const getConditionBadge = (cond) => {
    switch (cond) {
      case 'Like New':
        return 'badge-like-new';
      case 'Good':
        return 'badge-good';
      case 'Fair':
        return 'badge-fair';
      default:
        return 'badge-good';
    }
  };

  const handleWishlistClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product);
    } catch (err) {
      alert(err.message || 'Please log in to save items to your wishlist.');
    }
  };

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Image Container */}
        <div className="product-card-img-wrapper">
          <img
            src={mainImage}
            alt={product.title}
            className="product-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80';
            }}
          />

          {/* Condition Tag */}
          <div className="product-card-badge">
            <span className={`badge ${getConditionBadge(product.condition)}`}>
              {product.condition}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`product-card-wishlist-btn ${isFavorited ? 'active' : ''}`}
            onClick={handleWishlistClick}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} />
          </button>

          {/* Sold Overlay */}
          {isSold && (
            <div className="product-card-sold-overlay">
              <span>SOLD OUT</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="product-card-body">
          <div className="product-card-meta">
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Tag size={12} color="var(--primary)" />
              {product.category}
            </span>
            <span>{formatRelativeTime(product.createdAt)}</span>
          </div>

          <h3 className="product-card-title" title={product.title}>
            {product.title}
          </h3>

          <div className="product-card-location">
            <MapPin size={13} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.location}
            </span>
          </div>

          <div className="product-card-footer">
            <div className="product-card-price">
              {formatPrice(product.price)}
            </div>
            {isSold ? (
              <span className="badge badge-sold">Sold</span>
            ) : (
              <span className="badge badge-active">Available</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
