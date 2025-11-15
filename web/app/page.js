'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/images');
      const result = await response.json();
      
      if (result.success) {
        setImages(result.data);
      } else {
        setError('Failed to load images');
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/images?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Remove image from state
        setImages(images.filter((img) => img.id !== id));
      } else {
        alert('Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('Failed to delete image');
    }
  };

  // Fetch images on mount
  useEffect(() => {
    fetchImages();
    
    // Poll for new images every 5 seconds (for testing)
    const interval = setInterval(fetchImages, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="container">
      {/* Header */}
      <div className="header">
        <h1>Cher That</h1>
      </div>

      {/* Subtitle */}
      <div className="subtitle">
        <p>Everything you&apos;ve Cher&apos;d.</p>
      </div>

      {/* Loading State */}
      {loading && images.length === 0 && (
        <div className="loading">Loading your moodboard...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="empty-state">
          <p>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && images.length === 0 && (
        <div className="empty-state">
          <h2>Your moodboard is empty</h2>
          <p>Start saving images from any website using the CherThat extension!</p>
        </div>
      )}

      {/* Image Grid */}
      {!loading && images.length > 0 && (
        <div className="image-grid">
          {images.map((image) => (
            <div key={image.id} className="image-item">
              <img
                src={image.image_url}
                alt={`Saved from ${image.source_url || 'unknown source'}`}
                onError={(e) => {
                  // Handle broken image URLs
                  e.target.style.display = 'none';
                }}
              />
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this image?')) {
                    handleDelete(image.id);
                  }
                }}
                aria-label="Delete image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

