'use client';

import React, { useEffect, useState, useTransition } from 'react';
import Image from 'next/image';

export interface GalleryImage {
  id: number;
  url: string;
  caption: string | null;
}

interface Lightbox {
  image: GalleryImage;
  thumbSrc: string;
}

const SKELETON_COUNT = 9;

const IMG_STYLE: React.CSSProperties = {
  maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8, display: 'block',
};

function LightboxImage({ image, thumbSrc, onLoad }: { image: GalleryImage; thumbSrc: string; onLoad: () => void }) {
  const [loaded, setLoaded] = useState(false);
  function handleLoad() { setLoaded(true); onLoad(); }
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {thumbSrc && !loaded && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbSrc} alt="" aria-hidden="true" style={{ ...IMG_STYLE, filter: 'blur(10px)', transform: 'scale(1.04)', position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.url} alt={image.caption || 'Gallery image'} style={{ ...IMG_STYLE, opacity: loaded ? 1 : 0, transition: 'opacity .3s' }} onLoad={handleLoad} />
    </div>
  );
}
const PAGE_SIZE = 10;

export function Gallery({ initialImages, total = 0 }: { initialImages?: GalleryImage[]; total?: number }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages ?? []);
  const [loading, setLoading] = useState(!initialImages);
  const [totalCount, setTotalCount] = useState(total);
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialImages) return;
    fetch('/api/gallery')
      .then(r => r.json())
      .then(({ images: imgs, total: t }) => { setImages(imgs); setTotalCount(t); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initialImages]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === 'Escape') { setLightbox(null); return; }
      if (imgLoading) return;
      const idx = images.findIndex(i => i.id === lightbox.image.id);
      if (e.key === 'ArrowRight' && idx < images.length - 1) { setImgLoading(true); setLightbox({ image: images[idx + 1], thumbSrc: '' }); }
      if (e.key === 'ArrowLeft' && idx > 0) { setImgLoading(true); setLightbox({ image: images[idx - 1], thumbSrc: '' }); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, images, imgLoading]);

  function openLightbox(img: GalleryImage, btn: HTMLButtonElement) {
    const imgEl = btn.querySelector('img');
    setImgLoading(true);
    setLightbox({ image: img, thumbSrc: imgEl?.currentSrc ?? '' });
  }

  function navigate(e: React.MouseEvent, img: GalleryImage) {
    e.stopPropagation();
    setImgLoading(true);
    setLightbox({ image: img, thumbSrc: '' });
  }

  function loadMore() {
    startTransition(async () => {
      const res = await fetch(`/api/gallery?offset=${images.length}`).then(r => r.json()).catch(() => null);
      if (res) {
        setImages(prev => [...prev, ...res.images]);
        setTotalCount(res.total);
      }
    });
  }

  const hasMore = images.length < totalCount;

  if (!loading && images.length === 0) return null;

  const lbIdx = lightbox ? images.findIndex(i => i.id === lightbox.image.id) : -1;

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
            : images.map((img, idx) => (
                <button
                  key={img.id}
                  className="gallery-item"
                  onClick={e => openLightbox(img, e.currentTarget)}
                  aria-label={img.caption || 'View image'}
                >
                  <Image
                    src={img.url}
                    alt={img.caption || 'Gallery image'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
                    style={{ objectFit: 'cover' }}
                    priority={idx < 3}
                  />
                  {img.caption && <span className="gallery-caption">{img.caption}</span>}
                </button>
              ))
          }
          {isPending && Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={`skel-${i}`} className="gallery-item gallery-skeleton" aria-hidden="true" />
          ))}
        </div>

        {hasMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
            <button className="btn btn-ghost" onClick={loadMore} disabled={isPending}>
              {isPending ? 'Loading…' : `Load more (${totalCount - images.length} remaining)`}
            </button>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)} aria-label="Close">✕</button>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <div className="lightbox-inner">
              <LightboxImage image={lightbox.image} thumbSrc={lightbox.thumbSrc} onLoad={() => setImgLoading(false)} />
              {lightbox.image.caption && <p className="lightbox-caption">{lightbox.image.caption}</p>}
            </div>
            <div className="lightbox-nav">
              <button className="lightbox-prev" onClick={e => navigate(e, images[lbIdx - 1])} aria-label="Previous" disabled={lbIdx <= 0 || imgLoading} style={{ visibility: lbIdx > 0 ? 'visible' : 'hidden' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="lightbox-next" onClick={e => navigate(e, images[lbIdx + 1])} aria-label="Next" disabled={lbIdx >= images.length - 1 || imgLoading} style={{ visibility: lbIdx < images.length - 1 ? 'visible' : 'hidden' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
