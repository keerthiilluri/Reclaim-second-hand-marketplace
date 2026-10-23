import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Tag,
  MapPin,
  IndianRupee,
  FileText,
  Sparkles,
} from 'lucide-react';
import { productService } from '../services/api';

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

export default function SellPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState('Good');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle local file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + imageFiles.length + imageUrls.length > 5) {
      alert('You can upload a maximum of 5 images per product.');
      return;
    }

    const newFiles = [...imageFiles, ...selectedFiles];
    setImageFiles(newFiles);

    // Create local object URL previews
    const newPreviews = selectedFiles.map((f) => URL.createObjectURL(f));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Remove local uploaded file
  const removeFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add an image URL
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (imageUrls.length + imageFiles.length >= 5) {
      alert('You can upload a maximum of 5 images per product.');
      return;
    }
    setImageUrls((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
  };

  // Remove image URL
  const removeImageUrl = (index) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim() || title.length < 3) {
      setError('Title must be at least 3 characters long.');
      return;
    }

    if (!description.trim() || description.length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError('Please enter a valid price in INR.');
      return;
    }

    if (imageFiles.length === 0 && imageUrls.length === 0) {
      setError('Please upload at least one product photo or provide an image URL.');
      return;
    }

    try {
      setLoading(true);

      // If local files are chosen, we use FormData
      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('title', title.trim());
        formData.append('description', description.trim());
        formData.append('price', numPrice);
        formData.append('category', category);
        formData.append('condition', condition);
        formData.append('location', location.trim());
        formData.append('featured', featured);

        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        if (imageUrls.length > 0) {
          formData.append('images', JSON.stringify(imageUrls));
        }

        const res = await productService.create(formData, true);
        navigate(`/products/${res.data._id}`);
      } else {
        // Only URLs provided, send standard JSON
        const payload = {
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          category,
          condition,
          location: location.trim(),
          featured,
          images: imageUrls,
        };
        const res = await productService.create(payload, false);
        navigate(`/products/${res.data._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to list product. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 5rem', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Sell a Pre-Loved Item</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Provide clear photos and details to find buyers across university campuses and nearby neighborhoods.
        </p>
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
            placeholder="e.g. Higher Engineering Mathematics - B.S. Grewal 44th Edition"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
            required
          />
          <div className="form-hint">Be specific with edition, model name, and brand (3-120 characters)</div>
        </div>

        {/* Category & Price Row */}
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
                placeholder="450"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-hint">Set a fair, competitive second-hand price</div>
          </div>
        </div>

        {/* Condition Cards */}
        <div className="form-group">
          <label className="form-label">Item Condition *</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.75rem',
          }}>
            {CONDITIONS.map((cond) => {
              const selected = condition === cond.label;
              return (
                <div
                  key={cond.label}
                  onClick={() => setCondition(cond.label)}
                  style={{
                    border: '2px solid',
                    borderColor: selected ? 'var(--primary)' : 'var(--border)',
                    backgroundColor: selected ? 'var(--primary-light)' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: selected ? 'var(--primary)' : 'var(--text-main)' }}>
                      {cond.label}
                    </span>
                    {selected && <Check size={16} color="var(--primary)" />}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    {cond.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label">Location / Campus *</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="e.g. Koramangala, Bengaluru or IIT Bombay Campus"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="form-hint">Specify neighborhood, college name, or city for convenient buyer meetups</div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">Detailed Description *</label>
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="Describe the condition, usage duration, reason for selling, any included accessories or cables, and meet-up preferences..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="form-hint">Include details like scratches, battery health, or bill availability</div>
        </div>

        {/* Image Upload Section */}
        <div className="form-group">
          <label className="form-label">Product Photos * (Up to 5)</label>

          {/* Drag & Drop / File Input Box */}
          <div style={{
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-main)',
            cursor: 'pointer',
            transition: 'border-color 0.2s ease',
            position: 'relative',
            marginBottom: '1rem',
          }}>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%',
              }}
            />
            <UploadCloud size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              Click or drag photos here to upload
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Supports PNG, JPG, JPEG, and WebP (Max 5MB each)
            </div>
          </div>

          {/* Option to paste image URL */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="url"
              className="form-input"
              placeholder="Or paste an online image URL (e.g. Unsplash link)..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleAddImageUrl}
            >
              Add URL
            </button>
          </div>

          {/* Previews Grid */}
          {(filePreviews.length > 0 || imageUrls.length > 0) && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginTop: '0.5rem',
            }}>
              {/* Local File Previews */}
              {filePreviews.map((src, i) => (
                <div key={`file-${i}`} style={{
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <img src={src} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
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

              {/* URL Previews */}
              {imageUrls.map((url, i) => (
                <div key={`url-${i}`} style={{
                  position: 'relative',
                  width: '90px',
                  height: '90px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <img src={url} alt="url-preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImageUrl(i)}
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
        </div>

        {/* Featured Toggle Option */}
        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={16} color="var(--primary)" /> Feature on Homepage
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Highlight this item in the featured showcase section for faster sales
            </div>
          </div>
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? 'Publishing Listing...' : 'Publish Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
