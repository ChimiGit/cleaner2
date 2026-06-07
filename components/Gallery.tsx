'use client';

import { useEffect, useState } from 'react';

interface GalleryImage {
  id: number;
  url: string;
  caption: string;
}

const SKELETON_COUNT = 9;

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setImages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') {
        const idx = images.findIndex(i => i.id === lightbox.id);
        if (idx < images.length - 1) setLightbox(images[idx + 1]);
      }
      if (e.key === 'ArrowLeft') {
        const idx = images.findIndex(i => i.id === lightbox.id);
        if (idx > 0) setLightbox(images[idx - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images]);

  if (!loading && images.length === 0) return null;

  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <div className="sec-head center">
          <span className="eyebrow"><span className="dot"></span>Our Work</span>
          <h2 className="h-section" style={{ marginTop: 16 }}>A clean you can see</h2>
          <p className="lead" style={{ marginTop: 14 }}>Real results from real Perth homes and businesses.</p>
        </div>

        <div className="gallery-grid">
          {loading
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <div key={i} className="gallery-item gallery-skeleton" aria-hidden="true" />
              ))
            : images.map((img) => (
                <button
                  key={img.id}
                  className="gallery-item"
                  onClick={() => setLightbox(img)}
                  aria-label={img.caption || 'View image'}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption || 'Gallery image'} />
                  {img.caption && <span className="gallery-caption">{img.caption}</span>}
                </button>
              ))
          }
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          {images.findIndex(i => i.id === lightbox.id) > 0 && (
            <button className="lightbox-prev" onClick={e => { e.stopPropagation(); const idx = images.findIndex(i => i.id === lightbox.id); setLightbox(images[idx - 1]); }} aria-label="Previous">‹</button>
          )}
          {images.findIndex(i => i.id === lightbox.id) < images.length - 1 && (
            <button className="lightbox-next" onClick={e => { e.stopPropagation(); const idx = images.findIndex(i => i.id === lightbox.id); setLightbox(images[idx + 1]); }} aria-label="Next">›</button>
          )}
          <div className="lightbox-inner" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox.url} alt={lightbox.caption || 'Gallery image'} />
            {lightbox.caption && <p className="lightbox-caption">{lightbox.caption}</p>}
          </div>
        </div>
      )}
    </section>
  );
}
