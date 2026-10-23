import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Tag,
  Calendar,
  ShieldCheck,
  MessageSquare,
  MessageCircle,
  Edit,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Share2,
  Sparkles,
} from 'lucide-react';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, formatDate, formatRelativeTime } from '../utils/formatters';
import ProductCard from '../components/common/ProductCard';
import ContactModal from '../components/common/ContactModal';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await productService.getById(id);
        if (res?.data?.product) {
          setProduct(res.data.product);
          setRelatedProducts(res.data.relatedProducts || []);
          setSelectedImage(0);
        }
      } catch (err) {
        setError(err.message || 'Could not load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 1.25rem', minHeight: '60vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
          <div className="skeleton" style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="skeleton" style={{ width: '30%', height: '24px' }} />
            <div className="skeleton" style={{ width: '85%', height: '36px' }} />
            <div className="skeleton" style={{ width: '40%', height: '32px' }} />
            <div className="skeleton" style={{ width: '100%', height: '120px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div className="alert alert-error" style={{ maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          {error || 'Product listing not found.'}
        </div>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>
      </div>
    );
  }

  const isOwner =
    isAuthenticated &&
    user &&
    product.seller &&
    (product.seller._id || product.seller).toString() === user._id.toString();

  const isFavorited = isInWishlist(product._id);
  const isSold = product.status === 'sold';

  // Toggle active / sold status
  const handleToggleStatus = async () => {
    const newStatus = isSold ? 'active' : 'sold';
    try {
      setActionLoading(true);
      await productService.updateStatus(product._id, newStatus);
      setProduct((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Failed to update listing status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete product listing
  const handleDeleteProduct = async () => {
    try {
      setActionLoading(true);
      await productService.delete(product._id);
      navigate('/dashboard');
    } catch (err) {
      alert(err.message || 'Failed to delete listing');
      setActionLoading(false);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'];

  const sellerPhone = product.seller?.phone;
  const cleanedPhone = sellerPhone ? sellerPhone.replace(/[^0-9]/g, '') : null;
  const whatsappUrl = cleanedPhone
    ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(
        `Hi ${product.seller?.name || ''}, I am interested in your "${product.title}" listed on ReClaim for ${formatPrice(product.price)}.`
      )}`
    : null;

  return (
    <div className="container" style={{ padding: '2rem 1.25rem 4rem' }}>
      {/* Breadcrumb / Back Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} style={{ color: 'var(--text-muted)' }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 500, maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: product.title,
                text: `Check out ${product.title} on ReClaim Marketplace`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(window.location.href);
              alert('Listing URL copied to clipboard!');
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          <Share2 size={16} /> Share
        </button>
      </div>

      {/* Main Grid: Gallery on left, Info on right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 1fr)',
        gap: '3rem',
        marginBottom: '4rem',
      }} className="details-layout">
        {/* Left Column: Image Gallery */}
        <div>
          {/* Main Selected Image */}
          <div style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            backgroundColor: '#f1f5f9',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <img
              src={images[selectedImage]}
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';
              }}
            />

            {/* Condition Tag */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
              <span className={`badge ${product.condition === 'Like New' ? 'badge-like-new' : product.condition === 'Good' ? 'badge-good' : 'badge-fair'}`}
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
                {product.condition} Condition
              </span>
            </div>

            {/* Sold Tag */}
            {isSold && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.5rem',
                letterSpacing: '0.05em',
              }}>
                THIS ITEM IS SOLD
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images */}
          {images.length > 1 && (
            <div style={{
              display: 'flex',
              gap: '0.75rem',
              marginTop: '1rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  style={{
                    width: '80px',
                    height: '64px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '2px solid',
                    borderColor: selectedImage === idx ? 'var(--primary)' : 'var(--border)',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                    backgroundColor: '#ffffff',
                  }}
                >
                  <img src={img} alt={`thumbnail-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantee Box */}
          <div style={{
            marginTop: '2rem',
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
              <ShieldCheck size={20} color="var(--primary)" />
              <span>Safe Buying on ReClaim</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              <li>• Meet the seller in a safe, public campus area or busy market.</li>
              <li>• Inspect and test the item thoroughly before paying.</li>
              <li>• No advance wire transfers needed — pay upon physical inspection.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Listing Details & Seller Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Category & Date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: 'var(--primary)'
            }}>
              <Tag size={15} />
              {product.category}
            </span>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} />
              Posted {formatRelativeTime(product.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '1rem',
            color: 'var(--text-main)'
          }}>
            {product.title}
          </h1>

          {/* Location */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontSize: '0.95rem',
            marginBottom: '1.5rem',
          }}>
            <MapPin size={18} color="var(--primary)" />
            <span>{product.location}</span>
          </div>

          {/* Price Box */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Asking Price
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2.25rem',
                fontWeight: 800,
                color: 'var(--primary)'
              }}>
                {formatPrice(product.price)}
              </div>
            </div>

            {isSold ? (
              <span className="badge badge-sold" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Sold Out
              </span>
            ) : (
              <span className="badge badge-active" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                Available
              </span>
            )}
          </div>

          {/* Action Buttons: If Owner vs If Buyer */}
          <div style={{ marginBottom: '2.5rem' }}>
            {isOwner ? (
              /* Seller Controls */
              <div style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primary)' }}>
                  You are the owner of this listing
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <Link to={`/edit-product/${product._id}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                    <Edit size={16} /> Edit Listing
                  </Link>

                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={actionLoading}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <CheckCircle2 size={16} />
                    {isSold ? 'Mark as Active' : 'Mark as Sold'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmOpen(true)}
                    disabled={actionLoading}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              /* Buyer Actions */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    style={{ flex: 1 }}
                    onClick={() => setContactModalOpen(true)}
                    disabled={isSold}
                  >
                    <MessageSquare size={18} />
                    <span>Contact Seller</span>
                  </button>

                  <button
                    type="button"
                    className={`btn btn-secondary btn-lg ${isFavorited ? 'active' : ''}`}
                    onClick={async () => {
                      try {
                        await toggleWishlist(product);
                      } catch (err) {
                        alert(err.message || 'Please log in to save items to your wishlist');
                      }
                    }}
                    style={{
                      color: isFavorited ? '#ef4444' : 'inherit',
                      borderColor: isFavorited ? '#fca5a5' : 'var(--border)',
                    }}
                  >
                    <Heart size={20} fill={isFavorited ? 'currentColor' : 'none'} />
                    <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>

                {/* Instant WhatsApp Shortcut if seller phone exists */}
                {whatsappUrl && !isSold && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{
                      backgroundColor: '#25d366',
                      color: '#ffffff',
                      justifyContent: 'center',
                      fontWeight: 600,
                      gap: '0.5rem',
                      padding: '0.75rem',
                    }}
                  >
                    <MessageCircle size={18} /> Chat Directly on WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem', fontWeight: 700 }}>
              Description
            </h3>
            <p style={{
              fontSize: '0.975rem',
              lineHeight: 1.7,
              color: 'var(--text-body)',
              whiteSpace: 'pre-line',
            }}>
              {product.description}
            </p>
          </div>

          {/* Seller Profile Card */}
          <div style={{
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginTop: 'auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {product.seller?.profileImage ? (
                <img
                  src={product.seller.profileImage}
                  alt={product.seller.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}>
                  {product.seller?.name ? product.seller.name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {product.seller?.name || 'Verified Community Seller'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Member since {formatDate(product.seller?.createdAt)}
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ecfdf5',
              color: '#065f46',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.35rem 0.65rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <ShieldCheck size={14} /> Verified Seller
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ paddingTop: '2.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>Similar Items in {product.category}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Other pre-loved listings you might like</p>
            </div>
            <Link
              to={`/products?category=${encodeURIComponent(product.category)}`}
              style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.875rem' }}
            >
              Browse All
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {relatedProducts.map((rel) => (
              <ProductCard key={rel._id} product={rel} />
            ))}
          </div>
        </section>
      )}

      {/* Contact Seller Modal */}
      {contactModalOpen && (
        <ContactModal
          product={product}
          onClose={() => setContactModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
            <Trash2 size={40} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Delete this listing?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Are you sure you want to delete "{product.title}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProduct}
                disabled={actionLoading}
              >
                {actionLoading ? 'Deleting...' : 'Yes, Delete Listing'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 840px) {
          .details-layout {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
