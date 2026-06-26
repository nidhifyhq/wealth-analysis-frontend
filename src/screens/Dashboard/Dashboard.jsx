import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Bell, Eye, ArrowUp, ArrowDown, Plus, Download } from 'lucide-react';
import { fetchInvestmentShortDetails } from '../../services/apis/dashboard.service';
import LoadingDots from '../../components/LoadingDots/LoadingDots';
import { selectUserName } from '../../store/auth/auth.selectors';

import 'swiper/css';
import 'swiper/css/pagination';
import styles from './Dashboard.module.css';

const productConfig = {
  'Mutual Funds': { className: 'mobileDashboardProductMf', label: 'MFs' },
  'FD': { className: 'mobileDashboardProductFd', label: 'FDs' },
};

const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 55%, 45%)`;
};

const formatCurrency = (value) => {
  if (value == null) return '₹0.00';
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Dashboard() {
  const userName = useSelector(selectUserName);
  const [showBalance, setShowBalance] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const res = await fetchInvestmentShortDetails();
      if (res && res.summary) {
        setDashboardData(res);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const summary = dashboardData?.summary;
  const mutualFund = dashboardData?.MutualFund;
  const fixedDeposit = dashboardData?.FixedDeposit;

  const totalAssets = summary?.totalAssets;
  const investProduct = summary?.investProduct || [];

  const productTags = useMemo(() => {
    return investProduct.map((name) => {
      const known = productConfig[name];
      if (known) {
        return { label: known.label, className: styles[known.className] };
      }
      return {
        label: name,
        style: { backgroundColor: stringToColor(name), color: '#ffffff' },
      };
    });
  }, [investProduct]);

  return (
    <div className={styles.mobileDashboardContainer}>
      {/* Top Header Section */}
      <header className={styles.mobileDashboardHeader}>
        <div className={styles.mobileDashboardWelcome}>
          <h1 className={styles.mobileDashboardGreeting}>Hi, {(userName || 'User').split(' ')[0]} 👋</h1>
          <p className={styles.mobileDashboardSubGreeting}>Welcome back!</p>
        </div>
        <button className={styles.mobileDashboardNotificationBtn} aria-label="Notifications">
          <Bell size={20} />
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
                    <Eye size={18} />
                  </button>
                </div>
                <h2 className={styles.mobileDashboardAssetAmount}>
                  {isLoading ? <LoadingDots speed={300} /> : showBalance ? formatCurrency(totalAssets) : '••••••'}
                </h2>
                
                {/* Overlapping Badges with white border */}
                {!isLoading && productTags.length > 0 && (
                  <div className={styles.mobileDashboardHoldingAvatars}>
                    {productTags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`${styles.mobileDashboardTag}${tag.className ? ` ${tag.className}` : ''}`}
                        style={tag.style || {}}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
               <div className={styles.mobileDashboardDecorativeCircle}></div>
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
                  {isLoading ? <LoadingDots speed={300} /> : showBalance ? formatCurrency(mutualFund?.currentVal) : '••••••'}
                </h2>
                <div className={styles.mobileDashboardAssetTrend}>
                  <span className={styles.mobileDashboardTrendBadge} style={{ color: '#0d5257' }}>
                    {isLoading ? <LoadingDots speed={300} /> : (
                      <>
                        {mutualFund?.absoluteReturn != null && mutualFund.absoluteReturn >= 0 ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )}
                        {' '}{mutualFund?.absoluteReturn != null ? mutualFund.absoluteReturn.toFixed(2) : '0.00'}%
                      </>
                    )}
                  </span>
                  <span className={styles.mobileDashboardTrendPeriod}>All-time Returns</span>
                </div>
                <p className={styles.mobileDashboardCardFooterText}>{isLoading ? <LoadingDots speed={300} /> : `Active in ${mutualFund?.totalFunds || 0} Fund${mutualFund?.totalFunds !== 1 ? 's' : ''}`}</p>
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
                  {isLoading ? <LoadingDots speed={300} /> : showBalance ? formatCurrency(fixedDeposit?.currentVal) : '••••••'}
                </h2>
                <div className={styles.mobileDashboardAssetTrend}>
                  <span className={styles.mobileDashboardTrendBadge} style={{ color: '#4a1f05' }}>{isLoading ? <LoadingDots speed={300} /> : <>⚡ {fixedDeposit?.fDpct || '0.00'}%</>}</span>
                  <span className={styles.mobileDashboardTrendPeriod}>{isLoading ? <LoadingDots speed={300} /> : fixedDeposit?.interestTime || 'Annual'} Interest</span>
                </div>
                <p className={styles.mobileDashboardCardFooterText}>{isLoading ? <LoadingDots speed={300} /> : (fixedDeposit?.matureOn ? `Matures on: ${fixedDeposit.matureOn}` : 'No active FD')}</p>
              </div>
              <div className={styles.mobileDashboardDecorativeCircle}></div>
            </section>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Action Buttons */}
      <div className={styles.mobileDashboardActionGroup}>
        <button className={styles.mobileDashboardActionButton}>
          <Plus size={18} /> Deposit
        </button>
        <button className={styles.mobileDashboardActionButton}>
          <Download size={18} /> Withdraw
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