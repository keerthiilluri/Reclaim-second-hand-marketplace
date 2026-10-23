import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  Check,
  AlertCircle,
  IndianRupee,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { productService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Textbooks & Education',
  'Laptops & Computers',
  'Smartphones & Audio',
  'Bicycles & Mobility',
  'Furniture & Home',
  'Hostel Essentials',
  'Fashion & Accessories',
  'Other',
];

const CONDITIONS = [
  { label: 'Like New', desc: 'Flawless or barely used condition with original accessories' },
  { label: 'Good', desc: 'Fully functional with minor signs of cosmetic wear' },
  { label: 'Fair', desc: 'Noticeable wear and tear, but operates properly' },
];

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('active');
  const [featured, setFeatured] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        setLoading(true);
        const res = await productService.getById(id);
        const prod = res?.data?.product;
        if (!prod) {
          setError('Product not found.');
          return;
        }

        // Ownership check
        if (prod.seller?._id && prod.seller._id.toString() !== user?._id?.toString()) {
          setError('Unauthorized: You can only edit your own listings.');
          return;
        }

        setTitle(prod.title || '');
        setDescription(prod.description || '');
        setPrice(prod.price || '');
        setCategory(prod.category || CATEGORIES[0]);
        setCondition(prod.condition || 'Good');
        setLocation(prod.location || '');
        setStatus(prod.status || 'active');
        setFeatured(prod.featured || false);
        setExistingImages(prod.images || []);
      } catch (err) {
        setError(err.message || 'Failed to load listing for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchExisting();
  }, [id, user]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setNewImageFiles((prev) => [...prev, ...selectedFiles]);
    const previews = selectedFiles.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const removeNewFile = (idx) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddUrl = () => {
    if (!newImageUrl.trim()) return;
    setExistingImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please provide a valid price in INR.');
      return;
    }

    if (existingImages.length === 0 && newImageFiles.length === 0) {
      setError('A product listing must have at least one image.');
      return;
    }

    try {
      setSaving(true);
      if (newImageFiles.length > 0) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('price', numPrice);
        formData.append('category', category);
        formData.append('condition', condition);
        formData.append('location', location.trim());
        formData.append('status', status);
        formData.append('featured', featured);

        newImageFiles.forEach((f) => formData.append('images', f));
        if (existingImages.length > 0) {
          formData.append('images', JSON.stringify(existingImages));
        }

        await productService.update(id, formData, true);
      } else {
        const payload = {
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          category,
          condition,
          location: location.trim(),
          status,
          featured,
          images: existingImages,
        };
        await productService.update(id, payload, false);
      }

      navigate(`/products/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading listing data...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem', maxWidth: '800px' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Edit Listing</h1>
        <p style={{ color: 'var(--text-muted)' }}>Update price, photos, or mark status as sold.</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label">Listing Title *</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category & Price */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Price in INR (₹) *</label>
            <div style={{ position: 'relative' }}>
              <IndianRupee size={17} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="number"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Condition & Status */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Condition *</label>
            <select
              className="form-select"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
            >
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Listing Status *</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active (Available for purchase)</option>
              <option value="sold">Sold (Marked as sold out)</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">Location / City *</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image Management */}
        <div className="form-group">
          <label className="form-label">Manage Photos</label>

          {/* Current Images */}
          {existingImages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {existingImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={img} alt={`existing-${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(i)}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add more URL */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="url"
              className="form-input"
              placeholder="Add another image URL..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
            />
            <button type="button" className="btn btn-secondary" onClick={handleAddUrl}>
              Add
            </button>
          </div>

          {/* Upload additional files */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
