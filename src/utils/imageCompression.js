/**
 * Image Compression Utility
 * Kompres & resize gambar sebelum encode ke base64
 */

const DEFAULT_OPTIONS = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.75,
  format: 'image/webp', // WebP ~30% lebih kecil dari JPEG
  fallbackFormat: 'image/jpeg',
  maxSizeKB: 200,
};

/**
 * Check apakah browser support WebP encoding
 */
const supportsWebP = (() => {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
})();

/**
 * Resize dan kompres gambar dari File/Blob ke base64
 * @param {File|Blob} file - File gambar input
 * @param {Object} options - Opsi kompresi
 * @returns {Promise<{base64: string, path: string, size: number, width: number, height: number}>}
 */
export async function compressImage(file, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const format = supportsWebP ? opts.format : opts.fallbackFormat;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const result = processImage(img, file.name, format, opts);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Kompres gambar dari URL/base64 string
 * @param {string} src - URL atau base64 string gambar
 * @param {Object} options - Opsi kompresi
 * @returns {Promise<{base64: string, size: number, width: number, height: number}>}
 */
export async function compressImageFromSrc(src, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const format = supportsWebP ? opts.format : opts.fallbackFormat;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const result = processImage(img, 'image', format, opts);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Gagal memuat gambar dari URL'));
    img.src = src;
  });
}

/**
 * Core processing: resize + compress via Canvas API
 */
function processImage(img, fileName, format, opts) {
  // Calculate new dimensions maintaining aspect ratio
  let { width, height } = img;
  
  if (width > opts.maxWidth || height > opts.maxHeight) {
    const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Draw to canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  // Enable image smoothing for better quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  // Progressive quality reduction if over max size
  let quality = opts.quality;
  let base64 = canvas.toDataURL(format, quality);
  let sizeKB = getBase64SizeKB(base64);

  // Reduce quality iteratively if still too large
  while (sizeKB > opts.maxSizeKB && quality > 0.3) {
    quality -= 0.05;
    base64 = canvas.toDataURL(format, quality);
    sizeKB = getBase64SizeKB(base64);
  }

  // Generate path
  const ext = format === 'image/webp' ? 'webp' : 'jpg';
  const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
  const path = `${cleanName}_${Date.now()}.${ext}`;

  return {
    base64,
    path,
    size: sizeKB,
    width,
    height,
    format,
    quality,
  };
}

/**
 * Hitung ukuran base64 string dalam KB
 */
function getBase64SizeKB(base64String) {
  // Remove data URI prefix
  const base64 = base64String.split(',')[1] || base64String;
  const bytes = (base64.length * 3) / 4;
  // Account for padding
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return (bytes - padding) / 1024;
}

/**
 * Validasi file sebelum kompresi
 * @param {File} file
 * @param {Object} limits
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file, limits = {}) {
  const maxSizeMB = limits.maxSizeMB || 10;
  const allowedTypes = limits.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Format tidak didukung. Gunakan: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}` };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Ukuran file maksimal ${maxSizeMB}MB` };
  }

  return { valid: true };
}
