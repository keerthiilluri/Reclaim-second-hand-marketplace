import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  ChevronLeft,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import SkeletonCard from '../components/common/SkeletonCard';

const CATEGORIES = [
  'All',
  'Textbooks & Education',
  'Laptops & Computers',
  'Smartphones & Audio',
  'Bicycles & Mobility',
  'Furniture & Home',
  'Hostel Essentials',
  'Fashion & Accessories',
  'Other',
];

const CONDITIONS = ['All', 'Like New', 'Good', 'Fair'];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States initialized from URL
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  // Data states
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL query params change (e.g. from navbar or categories)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || 'All');
    setCondition(searchParams.get('condition') || 'All');
    setLocation(searchParams.get('location') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page'), 10) || 1);
  }, [searchParams]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category && category !== 'All') params.category = category;
      if (condition && condition !== 'All') params.condition = condition;
      if (location.trim()) params.location = location.trim();
      if (minPrice !== '') params.minPrice = minPrice;
      if (maxPrice !== '') params.maxPrice = maxPrice;

      const data = await productService.getAll(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Error fetching marketplace products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, category, condition, sort, searchParams]);

  // Update URL params when filters are applied
  const applyFilters = (e) => {
    if (e) e.preventDefault();
    const newParams = {};
    if (search.trim()) newParams.search = search.trim();
    if (category && category !== 'All') newParams.category = category;
    if (condition && condition !== 'All') newParams.condition = condition;
    if (location.trim()) newParams.location = location.trim();
    if (minPrice) newParams.minPrice = minPrice;
    if (maxPrice) newParams.maxPrice = maxPrice;
    if (sort) newParams.sort = sort;
    newParams.page = 1;

    setSearchParams(newParams);
    setMobileFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setCondition('All');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Marketplace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {loading ? 'Searching active listings...' : `Showing ${products.length} of ${totalCount} pre-loved items`}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm mobile-filter-btn"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            style={{ display: 'none' }}
          >
            <SlidersHorizontal size={16} /> Filters
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const p = Object.fromEntries(searchParams.entries());
                p.sort = e.target.value;
                p.page = 1;
                setSearchParams(p);
              }}
              className="form-select"
              style={{ padding: '0.45rem 2rem 0.45rem 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="newest">Newest Listed</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="oldest">Oldest Listed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: '2rem' }} className="products-layout">
        {/* Filter Sidebar */}
        <aside
          className={`filter-sidebar ${mobileFilterOpen ? 'open' : ''}`}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            height: 'fit-content',
            position: 'sticky',
            top: '90px',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
              <Filter size={18} color="var(--primary)" />
              <span>Filters</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          <form onSubmit={applyFilters}>
            {/* Search Keyword */}
            <div className="form-group">
              <label className="form-label">Search Keywords</label>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '2rem' }}
                  placeholder="e.g. Dell, Textbook..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition Filter */}
            <div className="form-group">
              <label className="form-label">Condition</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {CONDITIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCondition(c)}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid',
                      borderColor: condition === c ? 'var(--primary)' : 'var(--border)',
                      backgroundColor: condition === c ? 'var(--primary-light)' : '#ffffff',
                      color: condition === c ? 'var(--primary)' : 'var(--text-body)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="form-group">
              <label className="form-label">Price Range (INR ₹)</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min ₹"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max ₹"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="form-group">
              <label className="form-label">City / Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bengaluru, Pune..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Apply Filters
            </button>
          </form>
        </aside>

        {/* Products Grid Content */}
        <div>
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
          ) : products.length > 0 ? (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1.5rem',
              }}>
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border)'
                }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page <= 1}
                    onClick={() => {
                      const p = Object.fromEntries(searchParams.entries());
                      p.page = page - 1;
                      setSearchParams(p);
                    }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        const p = Object.fromEntries(searchParams.entries());
                        p.page = num;
                        setSearchParams(p);
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid',
                        borderColor: page === num ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: page === num ? 'var(--primary)' : '#ffffff',
                        color: page === num ? '#ffffff' : 'var(--text-main)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    disabled={page >= totalPages}
                    onClick={() => {
                      const p = Object.fromEntries(searchParams.entries());
                      p.page = page + 1;
                      setSearchParams(p);
                    }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '520px',
              margin: '2rem auto',
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-muted)',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
              }}>
                <PackageOpen size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>No Listings Found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We couldn't find any pre-loved items matching your current filters. Try searching for a different keyword or resetting your filter criteria.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleResetFilters}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .products-layout {
            grid-template-columns: 1fr !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
          .filter-sidebar {
            display: none;
          }
          .filter-sidebar.open {
            display: block;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
