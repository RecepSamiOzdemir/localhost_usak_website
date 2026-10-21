import React, { useCallback } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { fetchInstagramPosts, InstagramPost } from '../../services/api';
import { useCmsCollection } from '../../hooks/useCmsCollection';
import './InstagramFeed.css';

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days} gün önce`;
  if (hours > 0) return `${hours} saat önce`;
  if (mins > 0) return `${mins} dakika önce`;
  return 'Az önce';
}

function truncateCaption(caption?: string, maxLen = 110): string {
  if (!caption) return '';
  if (caption.length <= maxLen) return caption;
  return caption.slice(0, maxLen).trimEnd() + '…';
}

// Özel Instagram gradient ikonu (SVG — renk marka uyumlu)
const IgGradientIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5.5" ry="5.5" stroke="url(#ig-grad)" strokeWidth="1.8" fill="none"/>
    <circle cx="12" cy="12" r="4.2" stroke="url(#ig-grad)" strokeWidth="1.8" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.1" fill="url(#ig-grad)"/>
  </svg>
);

const PostCard: React.FC<{ post: InstagramPost; index: number }> = ({ post, index }) => {
  const imgSrc = post.media_type === 'VIDEO' ? post.thumbnail_url ?? post.media_url : post.media_url;

  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="ig-card"
      style={{ animationDelay: `${index * 0.12}s` }}
      aria-label={`Instagram gönderisi: ${truncateCaption(post.caption, 60) || 'Görseli görüntüle'}`}
    >
      {/* Görsel */}
      <div className="ig-card__media">
        <img
          src={imgSrc}
          alt={truncateCaption(post.caption, 80) || 'Instagram post'}
          loading="lazy"
          decoding="async"
        />

        {/* Medya tipi rozeti */}
        {post.media_type === 'VIDEO' && (
          <span className="ig-card__badge ig-card__badge--video" aria-hidden="true">
            ▶ Video
          </span>
        )}
        {post.media_type === 'CAROUSEL_ALBUM' && (
          <span className="ig-card__badge ig-card__badge--carousel" aria-hidden="true">
            ⊞ Albüm
          </span>
        )}

        {/* Hover overlay */}
        <div className="ig-card__overlay">
          <div className="ig-card__overlay-inner">
            <ExternalLink size={22} />
            <span>Gönderiyi Gör</span>
          </div>
        </div>
      </div>

      {/* İçerik */}
      <div className="ig-card__body">
        {post.caption && (
          <p className="ig-card__caption">{truncateCaption(post.caption)}</p>
        )}
        <div className="ig-card__meta">
          <span className="ig-card__handle">
            <IgGradientIcon size={13} />
            localhostusak
          </span>
          <span className="ig-card__date">
            <Clock size={12} />
            {formatRelativeDate(post.timestamp)}
          </span>
        </div>
      </div>
    </a>
  );
};

export const InstagramFeed: React.FC = () => {
  const loader = useCallback(() => fetchInstagramPosts(), []);
  const { items: posts, isLoading, error } = useCmsCollection<InstagramPost>(loader);

  if (!isLoading && (error || posts.length === 0)) {
    return null;
  }

  return (
    <section className="section ig-feed-section" id="instagram" aria-label="Instagram Gönderileri">
      <div className="container">

        {/* ── Başlık ── */}
        <div className="ig-feed__header">
          <div className="ig-feed__header-left">
            <span className="section-tag">SOSYAL MEDYA</span>
            <h2 className="section-title ig-feed__title">
              Son
              <span className="ig-feed__title-gradient"> Paylaşımlarımız</span>
            </h2>
            <p className="section-desc">
              Topluluğun nabzını tut — Instagram'da neler paylaştığımıza göz at.
            </p>
          </div>

          {/* Instagram hesap kartı */}
          <a
            href="https://www.instagram.com/localhostusak"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-feed__profile-card"
            aria-label="localhostusak Instagram sayfasına git"
          >
            <div className="ig-feed__profile-avatar">
              <IgGradientIcon size={28} />
            </div>
            <div className="ig-feed__profile-info">
              <span className="ig-feed__profile-name">localhostusak</span>
              <span className="ig-feed__profile-sub">Instagram'da takip et →</span>
            </div>
          </a>
        </div>

        {/* ── İçerik ── */}
        {isLoading ? (
          <div className="ig-feed__skeleton-grid" aria-busy="true" aria-label="Yükleniyor">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ig-feed__skeleton">
                <div className="ig-feed__skeleton-img" />
                <div className="ig-feed__skeleton-body">
                  <div className="ig-feed__skeleton-line" style={{ width: '85%' }} />
                  <div className="ig-feed__skeleton-line" style={{ width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="ig-feed__grid">
            {posts.slice(0, 3).map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
