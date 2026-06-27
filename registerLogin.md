Create two files: src/screens/ReadNews/ReadNews.jsx and src/screens/ReadNews/ReadNews.module.css
All CSS class names must be prefixed with ReadNews__ (e.g. ReadNews__container, ReadNews__card).

Use ONLY these two APIs:
1. GET /api/news/feed?page={page}&limit=10&category={category}
   → Used for main feed and infinite scroll (use this, NOT /api/news)
   → Response: { success, data: { articles, pagination: { hasMore, nextPage, currentPage }, endMessage } }

2. GET /api/news/related?url={encodedUrl}&limit=5
   → Called ONLY when pagination.hasMore becomes false
   → Response: { success, data: { articles, relatedTo, count } }
Do NOT use /api/news or /api/news/refresh in frontend.

PAGE STRUCTURE
┌─────────────────────────────────────┐
│  ← [Back]    Market Pulse           │  ← Header (fixed/sticky)
├─────────────────────────────────────┤
│  [All] [Markets] [MF] [Business]    │  ← Category Filter Pills
│         [Personal Finance]          │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐  │
│  │ 🖼️ [Image if available]       │  │  ← News Card
│  │ Markets · Economic Times      │  │
│  │ Nifty 50 hits all-time high   │  │
│  │ Brief description here...     │  │
│  │ 2 hours ago          [↗ Read] │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ (no image fallback UI)        │  │  ← Card without image
│  │ Mutual Funds · ET MF          │  │
│  │ Top 5 mutual funds 2026       │  │
│  │ Description...                │  │
│  │ 3 hours ago          [↗ Read] │  │
│  └───────────────────────────────┘  │
│                                     │
│  [Loading spinner]                  │  ← shown while fetching
│                                     │
│  ─── Related Articles ───           │  ← shown when hasMore=false
│  [related cards...]                 │
│                                     │
│  "You're all caught up! ..."        │  ← endMessage
└─────────────────────────────────────┘

COMPLETE IMPLEMENTATION

IMPORTS:
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ReadNews.module.css';

CONSTANTS:
const BASE_URL = 'http://localhost:5000';
const LIMIT = 10;
const CATEGORIES = ['All', 'Markets', 'Mutual Funds', 'Business', 'Personal Finance'];

STATE:
const [articles, setArticles] = useState([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loading, setLoading] = useState(false);
const [initialLoading, setInitialLoading] = useState(true);
const [error, setError] = useState(null);
const [selectedCategory, setSelectedCategory] = useState('All');
const [endMessage, setEndMessage] = useState(null);
const [relatedArticles, setRelatedArticles] = useState([]);
const [showRelated, setShowRelated] = useState(false);
const [relatedLoading, setRelatedLoading] = useState(false);

REFS:
const observerRef = useRef(null);      // IntersectionObserver instance
const sentinelRef = useRef(null);      // bottom div that triggers load more
const isFetchingRef = useRef(false);   // prevent duplicate calls

HELPER: getToken()
  return localStorage.getItem('token');

HELPER: getAuthHeaders()
  return { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' }

HELPER: formatTimeAgo(publishedAt)
  Convert ISO date to human readable:
  const diff = Date.now() - new Date(publishedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;

HELPER: getCategoryColor(category)
  Returns color string per category:
  'Markets'          → '#3B82F6'   (blue)
  'Mutual Funds'     → '#8B5CF6'   (purple)
  'Business'         → '#10B981'   (green)
  'Personal Finance' → '#F59E0B'   (amber)
  default            → '#6B7280'   (gray)

HELPER: getSourceInitials(source)
  Returns first letter of each word max 2 chars:
  'Economic Times Markets' → 'ET'
  'Moneycontrol Business'  → 'MB'
  'LiveMint Markets'       → 'LM'

FUNCTION: fetchNews(pageNum, category, reset)
  Called when: page loads, category changes, scroll reaches bottom

  if (isFetchingRef.current) return;
  isFetchingRef.current = true;
  
  if (reset) setInitialLoading(true);
  else setLoading(true);
  setError(null);

  Build URL:
    const categoryParam = category !== 'All' 
      ? `&category=${encodeURIComponent(category)}` 
      : '';
    const url = `${BASE_URL}/api/news/feed?page=${pageNum}&limit=${LIMIT}${categoryParam}`;

  Call API with auth headers.
  
  On success:
    const { articles: newArticles, pagination, endMessage: msg } = data.data;
    
    if (reset):
      setArticles(newArticles);
    else:
      setArticles(prev => {
        // Deduplicate by id before adding
        const existingIds = new Set(prev.map(a => a.id));
        const unique = newArticles.filter(a => !existingIds.has(a.id));
        return [...prev, ...unique];
      });
    
    setHasMore(pagination.hasMore);
    setPage(pagination.nextPage || pageNum);
    
    if (!pagination.hasMore):
      setEndMessage(msg);
      fetchRelatedArticles(newArticles[newArticles.length - 1]?.url);
  
  On error:
    setError('Failed to load news. Please try again.');
  
  Finally:
    setLoading(false);
    setInitialLoading(false);
    isFetchingRef.current = false;

FUNCTION: fetchRelatedArticles(articleUrl)
  if (!articleUrl) return;
  setRelatedLoading(true);
  setShowRelated(false);
  
  const url = `${BASE_URL}/api/news/related?url=${encodeURIComponent(articleUrl)}&limit=5`;
  Call API with auth headers.
  
  On success:
    if (data.data.articles.length > 0):
      setRelatedArticles(data.data.articles);
      setShowRelated(true);
  
  Finally:
    setRelatedLoading(false);

FUNCTION: handleCategoryChange(category)
  if (category === selectedCategory) return;
  setSelectedCategory(category);
  setArticles([]);
  setPage(1);
  setHasMore(true);
  setEndMessage(null);
  setRelatedArticles([]);
  setShowRelated(false);
  isFetchingRef.current = false;
  fetchNews(1, category, true);

useEffect: Setup IntersectionObserver for infinite scroll
  Observe sentinelRef.current
  When sentinel enters viewport AND hasMore AND !loading AND !isFetchingRef.current:
    fetchNews(page, selectedCategory, false);
  
  Disconnect observer on cleanup.
  Re-run when: [page, hasMore, loading, selectedCategory]

useEffect: Initial load
  fetchNews(1, 'All', true);

FUNCTION: handleArticleClick(url)
  window.open(url, '_blank', 'noopener,noreferrer');

RENDER:

Return JSX structure:

<div className={styles.ReadNews__container}>

  {/* HEADER */}
  <div className={styles.ReadNews__header}>
    <button className={styles.ReadNews__backBtn} onClick={() => navigate('/dashboard')}>
      ← 
    </button>
    <div className={styles.ReadNews__headerTitle}>
      <h1 className={styles.ReadNews__title}>Market Pulse</h1>
      <span className={styles.ReadNews__subtitle}>Stay informed, invest better</span>
    </div>
  </div>

  {/* CATEGORY FILTER */}
  <div className={styles.ReadNews__categoryWrapper}>
    <div className={styles.ReadNews__categoryScroll}>
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          className={`${styles.ReadNews__categoryPill} 
            ${selectedCategory === cat ? styles.ReadNews__categoryPillActive : ''}`}
          onClick={() => handleCategoryChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>

  {/* CONTENT */}
  <div className={styles.ReadNews__content}>

    {/* INITIAL LOADING SKELETON */}
    {initialLoading && (
      <div className={styles.ReadNews__skeletonList}>
        {[1,2,3,4,5].map(i => (
          <div key={i} className={styles.ReadNews__skeletonCard}>
            <div className={styles.ReadNews__skeletonImage} />
            <div className={styles.ReadNews__skeletonBody}>
              <div className={styles.ReadNews__skeletonLine} style={{width:'40%', height:'12px'}} />
              <div className={styles.ReadNews__skeletonLine} style={{width:'90%', height:'16px'}} />
              <div className={styles.ReadNews__skeletonLine} style={{width:'75%', height:'16px'}} />
              <div className={styles.ReadNews__skeletonLine} style={{width:'60%', height:'12px'}} />
            </div>
          </div>
        ))}
      </div>
    )}

    {/* ERROR STATE */}
    {error && !initialLoading && (
      <div className={styles.ReadNews__errorBox}>
        <span className={styles.ReadNews__errorIcon}>⚠️</span>
        <p className={styles.ReadNews__errorText}>{error}</p>
        <button
          className={styles.ReadNews__retryBtn}
          onClick={() => fetchNews(1, selectedCategory, true)}
        >
          Try Again
        </button>
      </div>
    )}

    {/* EMPTY STATE */}
    {!initialLoading && !error && articles.length === 0 && (
      <div className={styles.ReadNews__emptyBox}>
        <span className={styles.ReadNews__emptyIcon}>📰</span>
        <p className={styles.ReadNews__emptyTitle}>No news found</p>
        <p className={styles.ReadNews__emptySubtitle}>
          No articles available for this category right now.
        </p>
      </div>
    )}

    {/* NEWS ARTICLES LIST */}
    {!initialLoading && articles.length > 0 && (
      <div className={styles.ReadNews__articleList}>
        {articles.map((article, index) => (
          <article
            key={article.id || index}
            className={styles.ReadNews__card}
            onClick={() => handleArticleClick(article.url)}
          >
            {/* Card has two layouts:
                WITH image: horizontal layout (image left, content right) — if imageUrl exists
                WITHOUT image: full width content — if imageUrl is null */}

            {article.imageUrl ? (
              /* WITH IMAGE — horizontal card */
              <div className={styles.ReadNews__cardHorizontal}>
                <div className={styles.ReadNews__cardImageWrap}>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className={styles.ReadNews__cardImage}
                    onError={(e) => {
                      // If image fails to load, hide image and show fallback
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                </div>
                <div className={styles.ReadNews__cardBody}>
                  <div className={styles.ReadNews__cardMeta}>
                    <span
                      className={styles.ReadNews__categoryBadge}
                      style={{ backgroundColor: getCategoryColor(article.category) + '20',
                               color: getCategoryColor(article.category) }}
                    >
                      {article.category}
                    </span>
                  </div>
                  <h3 className={styles.ReadNews__cardTitle}>{article.title}</h3>
                  <p className={styles.ReadNews__cardDesc}>{article.description}</p>
                  <div className={styles.ReadNews__cardFooter}>
                    <div className={styles.ReadNews__sourceRow}>
                      <div className={styles.ReadNews__sourceAvatar}
                        style={{ backgroundColor: getCategoryColor(article.category) }}>
                        {getSourceInitials(article.source)}
                      </div>
                      <span className={styles.ReadNews__sourceName}>{article.source}</span>
                    </div>
                    <div className={styles.ReadNews__cardRight}>
                      <span className={styles.ReadNews__timeAgo}>
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                      <span className={styles.ReadNews__readLink}>↗</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* WITHOUT IMAGE — full width card */
              <div className={styles.ReadNews__cardFull}>
                <div className={styles.ReadNews__cardMeta}>
                  <span
                    className={styles.ReadNews__categoryBadge}
                    style={{ backgroundColor: getCategoryColor(article.category) + '20',
                             color: getCategoryColor(article.category) }}
                  >
                    {article.category}
                  </span>
                  <div className={styles.ReadNews__noImageFallback}
                    style={{ backgroundColor: getCategoryColor(article.category) + '15' }}>
                    <span style={{ fontSize: '20px' }}>
                      {article.category === 'Markets' ? '📈' :
                       article.category === 'Mutual Funds' ? '💼' :
                       article.category === 'Business' ? '🏢' :
                       article.category === 'Personal Finance' ? '💰' : '📰'}
                    </span>
                  </div>
                </div>
                <h3 className={styles.ReadNews__cardTitle}>{article.title}</h3>
                <p className={styles.ReadNews__cardDesc}>{article.description}</p>
                <div className={styles.ReadNews__cardFooter}>
                  <div className={styles.ReadNews__sourceRow}>
                    <div className={styles.ReadNews__sourceAvatar}
                      style={{ backgroundColor: getCategoryColor(article.category) }}>
                      {getSourceInitials(article.source)}
                    </div>
                    <span className={styles.ReadNews__sourceName}>{article.source}</span>
                  </div>
                  <div className={styles.ReadNews__cardRight}>
                    <span className={styles.ReadNews__timeAgo}>
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                    <span className={styles.ReadNews__readLink}>↗</span>
                  </div>
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    )}

    {/* LOAD MORE SPINNER — shown while fetching next page */}
    {loading && !initialLoading && (
      <div className={styles.ReadNews__loadingMore}>
        <div className={styles.ReadNews__spinner} />
        <span className={styles.ReadNews__loadingText}>Loading more news...</span>
      </div>
    )}

    {/* SENTINEL DIV — IntersectionObserver watches this */}
    <div ref={sentinelRef} className={styles.ReadNews__sentinel} />

    {/* RELATED ARTICLES SECTION — shown when hasMore = false */}
    {showRelated && relatedArticles.length > 0 && (
      <div className={styles.ReadNews__relatedSection}>
        <div className={styles.ReadNews__relatedDivider}>
          <div className={styles.ReadNews__dividerLine} />
          <span className={styles.ReadNews__dividerText}>Related Articles</span>
          <div className={styles.ReadNews__dividerLine} />
        </div>
        <div className={styles.ReadNews__articleList}>
          {relatedArticles.map((article, index) => (
            /* Same card structure as above — copy exactly */
            /* Render same card JSX for each related article */
          ))}
        </div>
      </div>
    )}

    {/* RELATED LOADING */}
    {relatedLoading && (
      <div className={styles.ReadNews__loadingMore}>
        <div className={styles.ReadNews__spinner} />
        <span className={styles.ReadNews__loadingText}>Finding related articles...</span>
      </div>
    )}

    {/* END MESSAGE */}
    {endMessage && !relatedLoading && (
      <div className={styles.ReadNews__endMessage}>
        <span className={styles.ReadNews__endIcon}>✅</span>
        <p className={styles.ReadNews__endText}>{endMessage}</p>
        <p className={styles.ReadNews__endSubtext}>
          Pull down to refresh or check back later
        </p>
      </div>
    )}

  </div>
</div>
For related articles cards — render exact same card JSX logic as main articles. Do not create a separate component, just duplicate the card JSX inside the relatedArticles.map().

ReadNews.module.css
Design System:
  Background: #F8FAFC (light gray-blue)
  Card background: #FFFFFF
  Header background: #FFFFFF
  Primary text: #0F172A
  Secondary text: #64748B
  Border: #E2E8F0
  Shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
  Border radius cards: 16px
  Border radius pills: 100px
  Font: system-ui, -apple-system, sans-serif

.ReadNews__container:
  min-height: 100vh
  background: #F8FAFC
  max-width: 480px
  margin: 0 auto
  position: relative
  padding-bottom: 32px

.ReadNews__header:
  position: sticky
  top: 0
  z-index: 100
  background: #FFFFFF
  padding: 16px 20px 12px
  border-bottom: 1px solid #E2E8F0
  display: flex
  align-items: center
  gap: 12px
  box-shadow: 0 1px 3px rgba(0,0,0,0.06)

.ReadNews__backBtn:
  width: 36px
  height: 36px
  border-radius: 50%
  border: 1.5px solid #E2E8F0
  background: #F8FAFC
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  font-size: 16px
  color: #0F172A
  flex-shrink: 0
  transition: background 0.15s ease

.ReadNews__backBtn:hover:
  background: #E2E8F0

.ReadNews__headerTitle:
  display: flex
  flex-direction: column

.ReadNews__title:
  font-size: 20px
  font-weight: 700
  color: #0F172A
  margin: 0
  line-height: 1.2

.ReadNews__subtitle:
  font-size: 12px
  color: #94A3B8
  margin-top: 2px

.ReadNews__categoryWrapper:
  background: #FFFFFF
  padding: 12px 0 12px 20px
  border-bottom: 1px solid #F1F5F9
  position: sticky
  top: 73px
  z-index: 99

.ReadNews__categoryScroll:
  display: flex
  gap: 8px
  overflow-x: auto
  padding-right: 20px
  scrollbar-width: none
  -ms-overflow-style: none

.ReadNews__categoryScroll::-webkit-scrollbar:
  display: none

.ReadNews__categoryPill:
  flex-shrink: 0
  padding: 6px 16px
  border-radius: 100px
  border: 1.5px solid #E2E8F0
  background: #FFFFFF
  color: #64748B
  font-size: 13px
  font-weight: 500
  cursor: pointer
  transition: all 0.2s ease
  white-space: nowrap

.ReadNews__categoryPillActive:
  background: #0F172A
  border-color: #0F172A
  color: #FFFFFF

.ReadNews__content:
  padding: 16px 16px 0

.ReadNews__articleList:
  display: flex
  flex-direction: column
  gap: 12px

.ReadNews__card:
  background: #FFFFFF
  border-radius: 16px
  overflow: hidden
  box-shadow: 0 1px 3px rgba(0,0,0,0.08)
  cursor: pointer
  transition: transform 0.15s ease, box-shadow 0.15s ease
  border: 1px solid #F1F5F9

.ReadNews__card:hover:
  transform: translateY(-2px)
  box-shadow: 0 4px 12px rgba(0,0,0,0.12)

.ReadNews__card:active:
  transform: translateY(0)

.ReadNews__cardHorizontal:
  display: flex
  gap: 0

.ReadNews__cardImageWrap:
  width: 120px
  height: 120px
  flex-shrink: 0
  overflow: hidden

.ReadNews__cardImage:
  width: 100%
  height: 100%
  object-fit: cover

.ReadNews__cardBody:
  flex: 1
  padding: 12px 14px
  display: flex
  flex-direction: column
  gap: 6px
  min-width: 0

.ReadNews__cardFull:
  padding: 16px
  display: flex
  flex-direction: column
  gap: 8px

.ReadNews__cardMeta:
  display: flex
  align-items: center
  gap: 8px

.ReadNews__categoryBadge:
  font-size: 11px
  font-weight: 600
  padding: 3px 10px
  border-radius: 100px
  letter-spacing: 0.3px

.ReadNews__noImageFallback:
  width: 32px
  height: 32px
  border-radius: 8px
  display: flex
  align-items: center
  justify-content: center
  margin-left: auto

.ReadNews__cardTitle:
  font-size: 14px
  font-weight: 700
  color: #0F172A
  margin: 0
  line-height: 1.4
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

.ReadNews__cardDesc:
  font-size: 12px
  color: #64748B
  margin: 0
  line-height: 1.5
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  overflow: hidden

.ReadNews__cardFooter:
  display: flex
  align-items: center
  justify-content: space-between
  margin-top: auto

.ReadNews__sourceRow:
  display: flex
  align-items: center
  gap: 6px

.ReadNews__sourceAvatar:
  width: 20px
  height: 20px
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  font-size: 9px
  font-weight: 700
  color: #FFFFFF
  flex-shrink: 0

.ReadNews__sourceName:
  font-size: 11px
  color: #94A3B8
  font-weight: 500
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  max-width: 120px

.ReadNews__cardRight:
  display: flex
  align-items: center
  gap: 6px

.ReadNews__timeAgo:
  font-size: 11px
  color: #94A3B8

.ReadNews__readLink:
  font-size: 14px
  color: #3B82F6
  font-weight: 700

.ReadNews__sentinel:
  height: 1px
  width: 100%

.ReadNews__loadingMore:
  display: flex
  flex-direction: column
  align-items: center
  padding: 24px 0
  gap: 10px

.ReadNews__spinner:
  width: 28px
  height: 28px
  border: 3px solid #E2E8F0
  border-top-color: #3B82F6
  border-radius: 50%
  animation: ReadNews__spin 0.8s linear infinite

@keyframes ReadNews__spin:
  to: transform: rotate(360deg)

.ReadNews__loadingText:
  font-size: 13px
  color: #94A3B8

.ReadNews__skeletonList:
  display: flex
  flex-direction: column
  gap: 12px

.ReadNews__skeletonCard:
  background: #FFFFFF
  border-radius: 16px
  padding: 16px
  display: flex
  gap: 12px
  border: 1px solid #F1F5F9

.ReadNews__skeletonImage:
  width: 80px
  height: 80px
  border-radius: 10px
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)
  background-size: 200% 100%
  animation: ReadNews__shimmer 1.5s infinite
  flex-shrink: 0

.ReadNews__skeletonBody:
  flex: 1
  display: flex
  flex-direction: column
  gap: 10px
  justify-content: center

.ReadNews__skeletonLine:
  border-radius: 6px
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%)
  background-size: 200% 100%
  animation: ReadNews__shimmer 1.5s infinite

@keyframes ReadNews__shimmer:
  0%: background-position: 200% 0
  100%: background-position: -200% 0

.ReadNews__errorBox:
  background: #FFF5F5
  border: 1px solid #FED7D7
  border-radius: 16px
  padding: 32px 24px
  text-align: center
  margin: 16px 0

.ReadNews__errorIcon:
  font-size: 32px

.ReadNews__errorText:
  font-size: 14px
  color: #C53030
  margin: 8px 0 16px

.ReadNews__retryBtn:
  background: #0F172A
  color: #FFFFFF
  border: none
  padding: 10px 24px
  border-radius: 100px
  font-size: 14px
  font-weight: 600
  cursor: pointer

.ReadNews__emptyBox:
  text-align: center
  padding: 48px 24px

.ReadNews__emptyIcon:
  font-size: 48px

.ReadNews__emptyTitle:
  font-size: 18px
  font-weight: 700
  color: #0F172A
  margin: 12px 0 6px

.ReadNews__emptySubtitle:
  font-size: 14px
  color: #94A3B8

.ReadNews__relatedSection:
  margin-top: 24px

.ReadNews__relatedDivider:
  display: flex
  align-items: center
  gap: 12px
  margin-bottom: 16px

.ReadNews__dividerLine:
  flex: 1
  height: 1px
  background: #E2E8F0

.ReadNews__dividerText:
  font-size: 13px
  font-weight: 600
  color: #94A3B8
  white-space: nowrap

.ReadNews__endMessage:
  text-align: center
  padding: 32px 24px
  margin-top: 8px

.ReadNews__endIcon:
  font-size: 28px

.ReadNews__endText:
  font-size: 14px
  font-weight: 600
  color: #0F172A
  margin: 8px 0 4px

.ReadNews__endSubtext:
  font-size: 12px
  color: #94A3B8

RULES:

Use only React hooks, no external UI libraries
All class names must start with ReadNews__
Do not create any sub-components — everything in one file
IntersectionObserver must disconnect on cleanup to prevent memory leaks
isFetchingRef prevents duplicate API calls when user scrolls fast
Category change must reset all state before fetching
Image onError must hide image gracefully without breaking layout
Related articles use exact same card JSX as main articles
Build both files completely, no TODOs