import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Dashboard.module.css';

// SVG Icon Components
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path></svg>
);
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const ArrowUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
);
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="12" y2="12"></line></svg>
);
const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

export default function Dashboard() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className={styles.mobileDashboardContainer}>
      {/* Top Header Section */}
      <header className={styles.mobileDashboardHeader}>
        <div className={styles.mobileDashboardWelcome}>
          <h1 className={styles.mobileDashboardGreeting}>Hi, Andreas 👋</h1>
          <p className={styles.mobileDashboardSubGreeting}>Welcome back to Stock!</p>
        </div>
        <button className={styles.mobileDashboardNotificationBtn} aria-label="Notifications">
          <BellIcon />
          <span className={styles.mobileDashboardNotificationDot} />
        </button>
      </header>

      {/* Swiper Wrapper for Asset Cards */}
      <div className={styles.mobileDashboardSliderWrapper}>
        <Swiper
          modules={[Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          pagination={{ clickable: true }}
          className="mySwiper"
        >
          {/* CARD 1: Total Asset Value */}
          <SwiperSlide>
            <section className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardTotalAssetBg}`}>
              <div className={styles.mobileDashboardAssetMain}>
                <div className={styles.mobileDashboardAssetHeader}>
                  <span className={styles.mobileDashboardAssetLabel}>Total asset value</span>
                  <button className={styles.mobileDashboardToggleEye} onClick={() => setShowBalance(!showBalance)}>
                    <EyeIcon />
                  </button>
                </div>
                <h2 className={styles.mobileDashboardAssetAmount}>
                  {showBalance ? '$18,908.00' : '••••••'}
                </h2>
                <div className={styles.mobileDashboardAssetTrend}>
                  <span className={styles.mobileDashboardTrendBadge}><ArrowUpIcon /> 4.78%</span>
                  <span className={styles.mobileDashboardTrendPeriod}>(+0.20%) vs Last week</span>
                </div>
                
                {/* Overlapping Badges with white border */}
                <div className={styles.mobileDashboardHoldingAvatars}>
                  <span className={`${styles.mobileDashboardTag} ${styles.mobileDashboardProductStocks}`}>Stocks</span>
                  <span className={`${styles.mobileDashboardTag} ${styles.mobileDashboardProductMf}`}>MFs</span>
                  <span className={`${styles.mobileDashboardTag} ${styles.mobileDashboardProductFd}`}>FDs</span>
                  <span className={`${styles.mobileDashboardTag} ${styles.mobileDashboardProductGold}`}>Gold</span>
                </div>
              </div>
            </section>
          </SwiperSlide>

          {/* CARD 2: Mutual Funds */}
          <SwiperSlide>
            <section className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardMutualFundsBg}`}>
              <div className={styles.mobileDashboardAssetMain}>
                <div className={styles.mobileDashboardAssetHeader}>
                  <span className={styles.mobileDashboardAssetLabel}>Mutual Funds Investment</span>
                </div>
                <h2 className={styles.mobileDashboardAssetAmount}>
                  {showBalance ? '$6,420.50' : '••••••'}
                </h2>
                <div className={styles.mobileDashboardAssetTrend}>
                  <span className={styles.mobileDashboardTrendBadge} style={{ color: '#0d5257' }}><ArrowUpIcon /> 8.12%</span>
                  <span className={styles.mobileDashboardTrendPeriod}>All-time Returns</span>
                </div>
                <p className={styles.mobileDashboardCardFooterText}>Active in 3 Top-tier Funds</p>
              </div>
              <div className={styles.mobileDashboardDecorativeCircle}></div>
            </section>
          </SwiperSlide>

          {/* CARD 3: Fixed Deposits */}
          <SwiperSlide>
            <section className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardFdBg}`}>
              <div className={styles.mobileDashboardAssetMain}>
                <div className={styles.mobileDashboardAssetHeader}>
                  <span className={styles.mobileDashboardAssetLabel}>Fixed Deposits (FD)</span>
                </div>
                <h2 className={styles.mobileDashboardAssetAmount}>
                  {showBalance ? '$5,000.00' : '••••••'}
                </h2>
                <div className={styles.mobileDashboardAssetTrend}>
                  <span className={styles.mobileDashboardTrendBadge} style={{ color: '#4a1f05' }}>⚡ 7.10%</span>
                  <span className={styles.mobileDashboardTrendPeriod}>Assured Annual Interest</span>
                </div>
                <p className={styles.mobileDashboardCardFooterText}>Matures on: 12 Dec 2027</p>
              </div>
              <div className={styles.mobileDashboardDecorativeCircle}></div>
            </section>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className={styles.mobileDashboardActionGroup}>
        <button className={styles.mobileDashboardActionButton}>
          <PlusIcon /> Deposit
        </button>
        <button className={styles.mobileDashboardActionButton}>
          <DownloadIcon /> Withdraw
        </button>
      </div>

      {/* Main Content White Area */}
      <div className={styles.mobileDashboardContentSheet}>
        <div className={styles.mobileDashboardSectionHeader}>
          <h3 className={styles.mobileDashboardSectionTitle}>Your Watchlist</h3>
          <button className={styles.mobileDashboardSectionLink}>Edit Watchlist</button>
        </div>

        <div className={styles.mobileDashboardListContainer}>
          <div className={styles.mobileDashboardRowCard}>
            <div className={styles.mobileDashboardRowLeading}>
              <div className={`${styles.mobileDashboardBrandIcon} ${styles.mobileDashboardNflxIconBg}`}>N</div>
              <div>
                <h4 className={styles.mobileDashboardStockTicker}>NFLX</h4>
                <p className={styles.mobileDashboardStockName}>Netflix, Inc.</p>
              </div>
            </div>
            <div className={styles.mobileDashboardRowTrailing}>
              <span className={styles.mobileDashboardStockPrice}>$303.89</span>
              <span className={`${styles.mobileDashboardStockChange} ${styles.mobileDashboardNegative}`}>▼ 1.78%</span>
            </div>
          </div>

          <div className={styles.mobileDashboardRowCard}>
            <div className={styles.mobileDashboardRowLeading}>
              <div className={`${styles.mobileDashboardBrandIcon} ${styles.mobileDashboardAmznIconBg}`}>a</div>
              <div>
                <h4 className={styles.mobileDashboardStockTicker}>AMZN</h4>
                <p className={styles.mobileDashboardStockName}>Amazon, Inc.</p>
              </div>
            </div>
            <div className={styles.mobileDashboardRowTrailing}>
              <span className={styles.mobileDashboardStockPrice}>$100.78</span>
              <span className={`${styles.mobileDashboardStockChange} ${styles.mobileDashboardPositive}`}>▲ 1.78%</span>
            </div>
          </div>
        </div>

        <div className={styles.mobileDashboardSectionHeader} style={{ marginTop: '24px' }}>
          <h3 className={styles.mobileDashboardSectionTitle}>Trending Stocks</h3>
        </div>
      </div>
    </div>
  );
}