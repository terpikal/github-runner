import React, { useState, useRef, useEffect, memo } from 'react';

// In-memory cache for decoded base64 images
const imageCache = new Map();
const MAX_CACHE_SIZE = 50;

function addToCache(key, value) {
  if (imageCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest entry
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
  imageCache.set(key, value);
}

/**
 * LazyImage - Komponen gambar dengan lazy loading, placeholder, dan caching
 * 
 * @param {string} src - URL atau base64 string gambar
 * @param {string} alt - Alt text
 * @param {string} className - CSS classes
 * @param {string} placeholderColor - Warna background placeholder (default: slate-200)
 * @param {boolean} blur - Tampilkan efek blur saat loading
 * @param {number} threshold - Intersection Observer threshold (0-1)
 * @param {string} rootMargin - Margin untuk pre-load sebelum terlihat
 */
const LazyImage = memo(({
  src,
  alt = '',
  className = '',
  placeholderColor = 'bg-slate-100',
  blur = true,
  threshold = 0.1,
  rootMargin = '200px',
  style = {},
  onClick,
  draggable = true,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Check cache first
  useEffect(() => {
    if (!src) return;

    const cacheKey = src.length > 100 ? src.substring(0, 100) : src;
    
    if (imageCache.has(cacheKey)) {
      setImageSrc(imageCache.get(cacheKey));
      setIsLoaded(true);
      setIsInView(true);
      return;
    }
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (isLoaded || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, isLoaded]);

  // Load image when in view
  useEffect(() => {
    if (!isInView || !src || imageSrc) return;

    const cacheKey = src.length > 100 ? src.substring(0, 100) : src;

    // For base64, use directly
    if (src.startsWith('data:')) {
      addToCache(cacheKey, src);
      setImageSrc(src);
      return;
    }

    // For URLs, preload
    const img = new Image();
    img.onload = () => {
      addToCache(cacheKey, src);
      setImageSrc(src);
    };
    img.onerror = () => {
      setImageSrc(null);
      setIsLoaded(true); // Stop loading state even on error
    };
    img.src = src;
  }, [isInView, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${placeholderColor} ${className}`}
      style={style}
      onClick={onClick}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%]" />
      )}

      {/* Actual image */}
      {imageSrc && (
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt}
          draggable={draggable}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded
              ? 'opacity-100 scale-100'
              : blur
              ? 'opacity-0 scale-105 blur-sm'
              : 'opacity-0'
          }`}
          {...rest}
        />
      )}

      {/* Error state */}
      {isLoaded && !imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
          Gagal memuat
        </div>
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;

/**
 * Clear image cache (useful saat logout atau memory cleanup)
 */
export function clearImageCache() {
  imageCache.clear();
}
