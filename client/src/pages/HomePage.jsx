import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  BookOpen,
  Laptop,
  Smartphone,
  Bike,
  Armchair,
  Coffee,
  Shirt,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Leaf,
  PlusCircle,
} from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';

const CATEGORIES = [
  { name: 'Textbooks & Education', icon: BookOpen, color: '#0f766e', count: '100+ Books' },
  { name: 'Laptops & Computers', icon: Laptop, color: '#2563eb', count: '50+ Devices' },
  { name: 'Smartphones & Audio', icon: Smartphone, color: '#7c3aed', count: '80+ Gadgets' },
  { name: 'Bicycles & Mobility', icon: Bike, color: '#059669', count: '30+ Cycles' },
  { name: 'Furniture & Home', icon: Armchair, color: '#d97706', count: '45+ Items' },
  { name: 'Hostel Essentials', icon: Coffee, color: '#dc2626', count: '60+ Essentials' },
  { name: 'Fashion & Accessories', icon: Shirt, color: '#db2777', count: '40+ Items' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, recentRes] = await Promise.all([
          productService.getAll({ featured: true, limit: 4 }),
          productService.getAll({ limit: 8, sort: 'newest' }),
        ]);
        setFeaturedProducts(featuredRes?.products || []);
        setRecentProducts(recentRes?.products || []);
      } catch (err) {
        console.error('Error loading homepage listings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3.5rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 50%, #f8fafc 100%)',
        padding: '4.5rem 0 3.5rem',
        borderBottom: '1px solid #ccfbf1',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          {/* Eyebrow Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.95rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--primary-border)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary)',
            marginBottom: '1.5rem',
          }}>
            <Sparkles size={16} />
            <span>Smart, Sustainable Second-Hand Trading</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: '#0f172a',
          }}>
            Give Pre-Loved Items <br />
            <span style={{ color: 'var(--primary)' }}>A New Life</span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-body)',
            lineHeight: 1.6,
            marginBottom: '2.25rem',
            maxWidth: '680px',
            marginInline: 'auto',
          }}>
            The premier marketplace for university students & young professionals in India. Buy and sell textbooks, electronics, cycles, and hostel gear directly from verified peers.
          </p>

          {/* Hero Search Box */}
          <form
            onSubmit={handleHeroSearch}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-full)',
              padding: '0.5rem 0.6rem 0.5rem 1.4rem',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border)',
              maxWidth: '620px',
              margin: '0 auto 2rem',
              gap: '0.5rem',
            }}
          >
            <Search size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="What are you looking to buy today?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '1rem',
                backgroundColor: 'transparent',
                color: 'var(--text-main)',
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)', padding: '0.75rem 1.75rem' }}
            >
              Search
            </button>
          </form>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-primary btn-lg">
              Explore Products
            </Link>
            <Link to="/sell" className="btn btn-secondary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={20} color="var(--primary)" />
              Sell an Item
            </Link>
          </div>

          {/* Trust Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(15, 118, 110, 0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
              <ShieldCheck size={22} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>100% Peer-to-Peer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified community members</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
              <TrendingUp size={22} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Up to 70% Off</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Genuine campus savings</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.625rem' }}>
              <Leaf size={22} color="var(--primary)" />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Zero Waste</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Give pre-loved goods new life</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Browse by Category</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Find exactly what you need for study, commute, and hostel life</p>
          </div>
          <Link
            to="/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IconComponent size={24} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {cat.count}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="container">
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                <Sparkles size={16} /> Handpicked Deals
              </div>
              <h2 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>Featured Listings</h2>
            </div>
            <Link
              to="/products"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              View More <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Listed Products Section */}
      <section className="container">
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '1.75rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Recently Listed</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Freshly uploaded items from students and peers across cities</p>
          </div>
          <Link
            to="/products"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: 'var(--primary)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : recentProducts.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {recentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
          }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No listings found yet.</p>
            <Link to="/sell" className="btn btn-primary">
              Post the First Listing
            </Link>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How ReClaim Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
            A fast, safe, and transparent 3-step marketplace engineered for peer-to-peer exchanges.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem',
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Snap & List in 60s</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Upload photos, set your fair price in INR, choose condition, and post your listing with zero seller fees.
              </p>
            </div>

            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem',
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Direct Chat & Deal</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Buyers connect with you via instant inquiry messages or direct WhatsApp. Discuss details without middlemen.
              </p>
            </div>

            <div style={{
              padding: '2rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                marginBottom: '1.25rem',
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Handover & Save Big</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Inspect items in person on campus or in your neighborhood, complete the handover, and mark as sold!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="container">
        <div style={{
          backgroundColor: 'var(--primary)',
          color: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '2.2rem', marginBottom: '1rem' }}>
            Ready to Clear Out Space and Earn Cash?
          </h2>
          <p style={{ color: '#ccfbf1', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Join thousands of university students and local sellers. Post your textbooks, gadgets, and unused items in minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/sell"
              className="btn btn-lg"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 700 }}
            >
              Sell Your Item Now
            </Link>
            <Link
              to="/products"
              className="btn btn-lg"
              style={{ backgroundColor: 'transparent', border: '2px solid #ffffff', color: '#ffffff' }}
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
