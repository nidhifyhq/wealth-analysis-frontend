import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, AlertTriangle, Newspaper, CheckCircle2, TrendingUp, Briefcase, Building2, Wallet } from 'lucide-react';
import styles from './ReadNews.module.css';

const BASE_URL = 'http://localhost:5000';
const LIMIT = 10;
const CATEGORIES = ['All', 'Markets', 'Mutual Funds', 'Business', 'Personal Finance'];

const getToken = () => localStorage.getItem('token');

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

const formatTimeAgo = (publishedAt) => {
  const diff = Date.now() - new Date(publishedAt).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
};

const getCategoryColor = (category) => {
  switch (category) {
    case 'Markets': return '#3B82F6';
    case 'Mutual Funds': return '#8B5CF6';
    case 'Business': return '#10B981';
    case 'Personal Finance': return '#F59E0B';
    default: return '#6B7280';
  }
};

const getSourceInitials = (source) => {
  if (!source) return 'NN';
  return source
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();
};

const ReadNews = () => {
  const navigate = useNavigate();

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

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);
  const isFetchingRef = useRef(false);

  const fetchRelatedArticles = useCallback(async (articleUrl) => {
    if (!articleUrl) return;
    setRelatedLoading(true);
    setShowRelated(false);

    try {
      const url = `${BASE_URL}/api/news/related?url=${encodeURIComponent(articleUrl)}&limit=5`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();
      if (data.success && data.data.articles.length > 0) {
        setRelatedArticles(data.data.articles);
        setShowRelated(true);
      }
    } finally {
      setRelatedLoading(false);
    }
  }, []);

  const fetchNews = useCallback(async (pageNum, category, reset) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (reset) setInitialLoading(true);
    else setLoading(true);
    setError(null);

    try {
      const categoryParam = category !== 'All'
        ? `&category=${encodeURIComponent(category)}`
        : '';
      const url = `${BASE_URL}/api/news/feed?page=${pageNum}&limit=${LIMIT}${categoryParam}`;
      const response = await fetch(url, { headers: getAuthHeaders() });
      const data = await response.json();

      if (data.success) {
        const { articles: newArticles, pagination, endMessage: msg } = data.data;

        if (reset) {
          setArticles(newArticles);
        } else {
          setArticles(prev => {
            const existingIds = new Set(prev.map(a => a.id));
            const unique = newArticles.filter(a => !existingIds.has(a.id));
            return [...prev, ...unique];
          });
        }

        setHasMore(pagination.hasMore);
        setPage(pagination.nextPage || pageNum);

        if (!pagination.hasMore) {
          setEndMessage(msg);
          fetchRelatedArticles(newArticles[newArticles.length - 1]?.url);
        }
      } else {
        setError('Failed to load news. Please try again.');
      }
    } catch {
      setError('Failed to load news. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchRelatedArticles]);

  const handleCategoryChange = useCallback((category) => {
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
  }, [selectedCategory, fetchNews]);

  const handleArticleClick = useCallback((url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    fetchNews(1, 'All', true);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isFetchingRef.current) {
          fetchNews(page, selectedCategory, false);
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [page, hasMore, loading, selectedCategory, fetchNews]);

  const renderCard = (article) => (
    <article
      key={article.id}
      className={styles.ReadNews__card}
      onClick={() => handleArticleClick(article.url)}
    >
      {article.imageUrl ? (
        <div className={styles.ReadNews__cardFull}>
          <div className={styles.ReadNews__cardImageWrapFull}>
            <img
              src={article.imageUrl}
              alt={article.title}
              className={styles.ReadNews__cardImageFull}
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
          <h3 className={styles.ReadNews__cardTitleFull}>{article.title}</h3>
          <p className={styles.ReadNews__cardDescFull}>{article.description}...</p>
          <div className={styles.ReadNews__cardFooter}>
            <div className={styles.ReadNews__sourceRow}>
              <div className={styles.ReadNews__sourceAvatar} style={{ backgroundColor: getCategoryColor(article.category) }}>
                {getSourceInitials(article.source)}
              </div>
              <span className={styles.ReadNews__sourceName}>{article.source}</span>
            </div>
            <div className={styles.ReadNews__cardRight}>
              <span className={styles.ReadNews__timeAgo}>{formatTimeAgo(article.publishedAt)}</span>
              <ExternalLink size={14} className={styles.ReadNews__readLink} />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.ReadNews__cardFull}>
          <div className={styles.ReadNews__cardMeta}>
            <span
              className={styles.ReadNews__categoryBadge}
              style={{ backgroundColor: getCategoryColor(article.category) + '20', color: getCategoryColor(article.category) }}
            >
              {article.category}
            </span>
            <div className={styles.ReadNews__noImageFallback} style={{ backgroundColor: getCategoryColor(article.category) + '15' }}>
              {article.category === 'Markets' ? <TrendingUp size={20} /> :
               article.category === 'Mutual Funds' ? <Briefcase size={20} /> :
               article.category === 'Business' ? <Building2 size={20} /> :
               article.category === 'Personal Finance' ? <Wallet size={20} /> : <Newspaper size={20} />}
            </div>
          </div>
          <h3 className={styles.ReadNews__cardTitle}>{article.title}</h3>
          <p className={styles.ReadNews__cardDesc}>{article.description}...</p>
          <div className={styles.ReadNews__cardFooter}>
            <div className={styles.ReadNews__sourceRow}>
              <div className={styles.ReadNews__sourceAvatar} style={{ backgroundColor: getCategoryColor(article.category) }}>
                {getSourceInitials(article.source)}
              </div>
              <span className={styles.ReadNews__sourceName}>{article.source}</span>
            </div>
            <div className={styles.ReadNews__cardRight}>
              <span className={styles.ReadNews__timeAgo}>{formatTimeAgo(article.publishedAt)}</span>
              <ExternalLink size={14} className={styles.ReadNews__readLink} />
            </div>
          </div>
        </div>
      )}
    </article>
  );

  return (
    <div className={styles.ReadNews__container}>
      <div className={styles.ReadNews__header}>
        <button className={styles.ReadNews__backBtn} onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.ReadNews__headerTitle}>
          <h1 className={styles.ReadNews__title}>Market Pulse</h1>
          <span className={styles.ReadNews__subtitle}>Stay informed, invest better</span>
        </div>
      </div>

      <div className={styles.ReadNews__categoryWrapper}>
        <div className={styles.ReadNews__categoryScroll}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`${styles.ReadNews__categoryPill} ${selectedCategory === cat ? styles.ReadNews__categoryPillActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.ReadNews__content}>
        {initialLoading && (
          <div className={styles.ReadNews__skeletonList}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={styles.ReadNews__skeletonCard}>
                <div className={styles.ReadNews__skeletonImage} />
                <div className={styles.ReadNews__skeletonBody}>
                  <div className={styles.ReadNews__skeletonLine} style={{ width: '40%', height: '12px' }} />
                  <div className={styles.ReadNews__skeletonLine} style={{ width: '90%', height: '16px' }} />
                  <div className={styles.ReadNews__skeletonLine} style={{ width: '75%', height: '16px' }} />
                  <div className={styles.ReadNews__skeletonLine} style={{ width: '60%', height: '12px' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !initialLoading && (
          <div className={styles.ReadNews__errorBox}>
            <AlertTriangle size={32} className={styles.ReadNews__errorIcon} />
            <p className={styles.ReadNews__errorText}>{error}</p>
            <button
              className={styles.ReadNews__retryBtn}
              onClick={() => fetchNews(1, selectedCategory, true)}
            >
              Try Again
            </button>
          </div>
        )}

        {!initialLoading && !error && articles.length === 0 && (
          <div className={styles.ReadNews__emptyBox}>
            <Newspaper size={48} className={styles.ReadNews__emptyIcon} />
            <p className={styles.ReadNews__emptyTitle}>No news found</p>
            <p className={styles.ReadNews__emptySubtitle}>
              No articles available for this category right now.
            </p>
          </div>
        )}

        {!initialLoading && articles.length > 0 && (
          <div className={styles.ReadNews__articleList}>
            {articles.map(article => renderCard(article))}
          </div>
        )}

        {loading && !initialLoading && (
          <div className={styles.ReadNews__loadingMore}>
            <div className={styles.ReadNews__spinner} />
            <span className={styles.ReadNews__loadingText}>Loading more news...</span>
          </div>
        )}

        <div ref={sentinelRef} className={styles.ReadNews__sentinel} />

        {showRelated && relatedArticles.length > 0 && (
          <div className={styles.ReadNews__relatedSection}>
            <div className={styles.ReadNews__relatedDivider}>
              <div className={styles.ReadNews__dividerLine} />
              <span className={styles.ReadNews__dividerText}>Related Articles</span>
              <div className={styles.ReadNews__dividerLine} />
            </div>
            <div className={styles.ReadNews__articleList}>
              {relatedArticles.map(article => renderCard(article))}
            </div>
          </div>
        )}

        {relatedLoading && (
          <div className={styles.ReadNews__loadingMore}>
            <div className={styles.ReadNews__spinner} />
            <span className={styles.ReadNews__loadingText}>Finding related articles...</span>
          </div>
        )}

        {endMessage && !relatedLoading && (
          <div className={styles.ReadNews__endMessage}>
            <CheckCircle2 size={28} className={styles.ReadNews__endIcon} />
            <p className={styles.ReadNews__endText}>{endMessage}</p>
            <p className={styles.ReadNews__endSubtext}>
              Pull down to refresh or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadNews;
