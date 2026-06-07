'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface GalleryImage {
  id: number;
  key: string;
  url: string;
  caption: string;
  sortOrder: number;
}

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCaption, setEditingCaption] = useState('');
  const [saved, setSaved] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/gallery');
    if (res.status === 401) { router.push('/admin/login'); return; }
    if (res.ok) setImages(await res.json());
  }, [router]);

  useEffect(() => { load(); }, [load]);

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    const arr = Array.from(files).filter(f =>
      f.type.startsWith('image/') ||
      f.type === 'image/heic' ||
      f.type === 'image/heif' ||
      f.name.toLowerCase().endsWith('.heic') ||
      f.name.toLowerCase().endsWith('.heif')
    );
    for (const file of arr) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/admin/gallery/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error(await res.text());
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    setUploading(false);
    load();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/gallery/${deleteTarget.id}`, { method: 'DELETE' });
    setImages(prev => prev.filter(img => img.id !== deleteTarget.id));
    setDeleting(false);
    setDeleteTarget(null);
  }

  async function saveCaption(id: number) {
    await fetch(`/api/admin/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption: editingCaption }),
    });
    setImages(prev => prev.map(img => img.id === id ? { ...img, caption: editingCaption } : img));
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Gallery</h1>
          <p style={s.sub}>Upload and manage photos shown on the website.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
          {saved && <span style={s.savedBadge}>✓ Saved</span>}
          <button onClick={logout} style={s.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Admin nav */}
      <div style={s.nav}>
        <a href="/admin/pricing" style={s.navLink}>Pricing</a>
        <a href="/admin/gallery" style={{ ...s.navLink, ...s.navActive }}>Gallery</a>
      </div>

      <div style={s.body}>
        {/* Upload zone */}
        <div
          style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}) }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files) uploadFiles(e.target.files); e.target.value = ''; }}
          />
          {uploading ? (
            <p style={s.dropText}>Uploading…</p>
          ) : (
            <>
              <div style={s.uploadIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p style={s.dropText}><b>Click to upload</b> or drag & drop images here</p>
              <p style={s.dropSub}>PNG, JPG, WEBP, HEIC supported</p>
            </>
          )}
        </div>

        {/* Image grid */}
        {images.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 40 }}>No images yet. Upload some above.</p>
        ) : (
          <div style={s.grid}>
            {images.map(img => (
              <div key={img.id} style={s.card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption || 'Gallery image'} style={s.img} />
                <div style={s.cardBody}>
                  {editingId === img.id ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        autoFocus
                        value={editingCaption}
                        onChange={e => setEditingCaption(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveCaption(img.id); if (e.key === 'Escape') setEditingId(null); }}
                        style={s.captionInput}
                        placeholder="Add a caption…"
                      />
                      <button onClick={() => saveCaption(img.id)} style={s.saveBtn}>✓</button>
                    </div>
                  ) : (
                    <button
                      style={s.captionBtn}
                      onClick={() => { setEditingId(img.id); setEditingCaption(img.caption || ''); }}
                    >
                      {img.caption || <span style={{ color: '#9ca3af' }}>Add caption…</span>}
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(img)} style={s.deleteBtn} title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <div style={s.overlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5412f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 style={s.modalTitle}>Delete image?</h2>
            <p style={s.modalBody}>
              {deleteTarget.caption
                ? <><b>&ldquo;{deleteTarget.caption}&rdquo;</b> will be permanently removed.</>
                : 'This image will be permanently removed.'}
            </p>
            <div style={s.modalActions}>
              <button style={s.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button style={s.confirmBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f4f6f4' },
  header: {
    background: '#143258', padding: '20px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
  },
  h1: { margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' },
  sub: { margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  nav: {
    background: '#0e2342', display: 'flex', gap: 2, padding: '0 28px',
  },
  navLink: {
    display: 'inline-block', padding: '10px 16px', fontSize: 13, fontWeight: 600,
    color: 'rgba(255,255,255,0.55)', textDecoration: 'none', borderBottom: '2px solid transparent',
    transition: 'color .15s',
  },
  navActive: { color: '#fff', borderBottom: '2px solid #7fb539' },
  body: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  dropzone: {
    borderWidth: 2, borderStyle: 'dashed', borderColor: '#d1d5db',
    borderRadius: 12, padding: '40px 24px',
    textAlign: 'center', cursor: 'pointer', background: '#fff',
    transition: 'border-color .2s, background .2s', marginBottom: 28,
  },
  dropzoneActive: { borderColor: '#7fb539', background: '#f0f7e6' },
  uploadIcon: { color: '#9ca3af', marginBottom: 12, display: 'flex', justifyContent: 'center' },
  dropText: { margin: '0 0 4px', fontSize: 15, color: '#374151' },
  dropSub: { margin: 0, fontSize: 13, color: '#9ca3af' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
  },
  card: {
    background: '#fff', borderRadius: 10, overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
  },
  img: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
  cardBody: {
    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8,
  },
  captionBtn: {
    flex: 1, background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 13, color: '#374151', textAlign: 'left', padding: 0,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  captionInput: {
    flex: 1, border: '1.5px solid #7fb539', borderRadius: 6, padding: '4px 8px',
    fontSize: 13, outline: 'none',
  },
  saveBtn: {
    background: '#7fb539', color: '#fff', border: 'none', borderRadius: 6,
    padding: '4px 8px', cursor: 'pointer', fontSize: 13, fontWeight: 700,
  },
  deleteBtn: {
    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af',
    display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6,
    flexShrink: 0, transition: 'color .15s',
  },
  logoutBtn: {
    padding: '9px 16px', background: 'rgba(255,255,255,0.15)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)', borderRadius: 7,
    fontWeight: 500, fontSize: 14, cursor: 'pointer',
  },
  savedBadge: {
    fontSize: 13, fontWeight: 600, color: '#16a34a',
    background: '#dcfce7', padding: '6px 12px', borderRadius: 6,
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: 14, padding: '32px 28px', width: '100%', maxWidth: 380,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center',
  },
  modalIcon: {
    display: 'flex', justifyContent: 'center', marginBottom: 16,
    background: '#fef2f2', width: 56, height: 56, borderRadius: '50%',
    alignItems: 'center', margin: '0 auto 16px',
  },
  modalTitle: { margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#111827' },
  modalBody: { margin: '0 0 24px', fontSize: 14, color: '#6b7280', lineHeight: 1.5 },
  modalActions: { display: 'flex', gap: 10, justifyContent: 'center' },
  cancelBtn: {
    flex: 1, padding: '10px 0', borderRadius: 8, border: '1.5px solid #e5e7eb',
    background: '#fff', color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
    background: '#c5412f', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
};
