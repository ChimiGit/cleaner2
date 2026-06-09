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
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>Gallery</h1>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Upload and manage photos shown on the website.</p>
        </div>
        <div className="admin-actions">
          {saved && <span className="admin-saved-badge">✓ Saved</span>}
          <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
      </div>

      <nav className="admin-nav">
        <a href="/admin/pricing">Pricing</a>
        <a href="/admin/gallery" className="active">Gallery</a>
      </nav>

      <div className="admin-body">
        <div
          className={`admin-dropzone${dragOver ? ' admin-dropzone--active' : ''}`}
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
            <p className="admin-dropzone-text">Uploading…</p>
          ) : (
            <>
              <div className="admin-dropzone-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="admin-dropzone-text"><b>Click to upload</b> or drag & drop images here</p>
              <p className="admin-dropzone-sub">PNG, JPG, WEBP, HEIC supported</p>
            </>
          )}
        </div>

        {images.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: 14, textAlign: 'center', marginTop: 40 }}>No images yet. Upload some above.</p>
        ) : (
          <div className="admin-img-grid">
            {images.map(img => (
              <div key={img.id} className="admin-img-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.caption || 'Gallery image'} />
                <div className="admin-img-body">
                  {editingId === img.id ? (
                    <div style={{ display: 'flex', gap: 6, flex: 1, minWidth: 0 }}>
                      <input
                        autoFocus
                        value={editingCaption}
                        onChange={e => setEditingCaption(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') saveCaption(img.id); if (e.key === 'Escape') setEditingId(null); }}
                        className="admin-caption-input"
                        placeholder="Add a caption…"
                      />
                      <button onClick={() => saveCaption(img.id)} className="admin-caption-save">✓</button>
                    </div>
                  ) : (
                    <button
                      className="admin-caption-btn"
                      onClick={() => { setEditingId(img.id); setEditingCaption(img.caption || ''); }}
                    >
                      {img.caption || <span style={{ color: '#9ca3af' }}>Add caption…</span>}
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(img)} className="admin-delete-btn" title="Delete">
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

      {deleteTarget && (
        <div className="admin-modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c5412f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
              </svg>
            </div>
            <h2 className="admin-modal-title">Delete image?</h2>
            <p className="admin-modal-body">
              {deleteTarget.caption
                ? <><b>&ldquo;{deleteTarget.caption}&rdquo;</b> will be permanently removed.</>
                : 'This image will be permanently removed.'}
            </p>
            <div className="admin-modal-actions">
              <button className="admin-modal-cancel" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
              <button className="admin-modal-confirm-delete" onClick={confirmDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
