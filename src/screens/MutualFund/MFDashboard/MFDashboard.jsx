import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  Eye, 
  Search, 
  ChevronRight, 
  ChevronUp, 
  ChevronsUp, 
  ChevronDown, 
  ChevronsDown, 
  Info 
} from 'lucide-react';
import styles from './MFDashboard.module.css';

export default function MFDashboard() {
  const [showBalance, setShowBalance] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className={styles.MFDashboardContainer}>
      
      {/* SECTION 1: Top Hero Banner Block */}
      <header className={styles.MFDashboardHeaderBanner}>
        <div className={styles.MFDashboardTopActionRow}>
          <button className={styles.MFDashboardCircularBtn} aria-label="Go Back">
            <ArrowLeft size={20} />
          </button>
          <button className={styles.MFDashboardCircularBtn} aria-label="View Statement">
            <FileText size={20} />
          </button>
        </div>

        <div className={styles.MFDashboardMainBalanceArea}>
          <div className={styles.MFDashboardBalanceHeader}>
            <span className={styles.MFDashboardBalanceTitle}>Portfolio Balance</span>
            <button 
              className={styles.MFDashboardToggleEye} 
              onClick={() => setShowBalance(!showBalance)}
            >
              <Eye size={16} />
            </button>
          </div>
          
          <div className={styles.MFDashboardBalanceRowGroup}>
            <h2 className={styles.MFDashboardPrimaryAmount}>
              {showBalance ? '₹37,603.00' : '••••••'}
            </h2>
            <div className={styles.MFDashboardMonthDropdown}>
              <span>November</span>
              <span className={styles.MFDashboardDropdownArrow}>▼</span>
            </div>
          </div>

          {/* Invested, Current, and Returns Breakdown Metrics Row */}
          <div className={styles.MFDashboardMetricsRow}>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>Invested Value</span>
              <span className={styles.MFDashboardMetricValue}>
                {showBalance ? '₹38,031' : '••••'}
              </span>
            </div>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>Current Value</span>
              <span className={styles.MFDashboardMetricValue}>
                {showBalance ? '₹37,603' : '••••'}
              </span>
            </div>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>Total Returns</span>
              <span className={`${styles.MFDashboardMetricValue} ${styles.MFDashboardNegativeReturn}`}>
                {showBalance ? '-₹428 (-1.12%)' : '••••'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: Overlapping White Background Performance Block */}
      <section className={styles.MFDashboardPerformanceContainer}>
        <div className={styles.MFDashboardPerformanceTitleRow}>
          <h3 className={styles.MFDashboardPerformanceHeading}>
            Performance <Info size={13} className={styles.MFDashboardInfoIcon} />
          </h3>
          <button className={styles.MFDashboardPerformanceLink}>Changes last month</button>
        </div>

        <div className={styles.MFDashboardPerformanceCardGroup}>
          {/* Card Item 1: In-form */}
          <div className={`${styles.MFDashboardPerfRowItem} ${styles.MFDashboardInFormBg}`}>
            <div className={styles.MFDashboardPerfLeading}>
              <div className={`${styles.MFDashboardIconBadgeWrapper} ${styles.MFDashboardGreenCircle}`}>
                <ChevronsUp size={15} strokeWidth={2.5} />
                <span className={styles.MFDashboardCounterBadge}>7</span>
              </div>
              <div>
                <h4 className={styles.MFDashboardPerfStatusText}>In-form</h4>
                <p className={styles.MFDashboardPerfSubText}>Performing great</p>
              </div>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Card Item 2: On-track */}
          <div className={`${styles.MFDashboardPerfRowItem} ${styles.MFDashboardOnTrackBg}`}>
            <div className={styles.MFDashboardPerfLeading}>
              <div className={`${styles.MFDashboardIconBadgeWrapper} ${styles.MFDashboardLightGreenCircle}`}>
                <ChevronUp size={15} strokeWidth={2.5} />
                <span className={styles.MFDashboardCounterBadge}>1</span>
              </div>
              <div>
                <h4 className={styles.MFDashboardPerfStatusText}>On-track</h4>
                <p className={styles.MFDashboardPerfSubText}>Performing good</p>
              </div>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Card Item 3: Off-track */}
          <div className={styles.MFDashboardPerfRowItem}>
            <div className={styles.MFDashboardPerfLeading}>
              <div className={`${styles.MFDashboardIconBadgeWrapper} ${styles.MFDashboardGreyCircle}`}>
                <ChevronDown size={15} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className={`${styles.MFDashboardPerfStatusText} ${styles.MFDashboardMutedText}`}>Off-track</h4>
                <p className={styles.MFDashboardPerfSubText}>Don't invest further</p>
              </div>
            </div>
            <ChevronRight size={14} />
          </div>

          {/* Card Item 4: Out-of-form */}
          <div className={styles.MFDashboardPerfRowItem}>
            <div className={styles.MFDashboardPerfLeading}>
              <div className={`${styles.MFDashboardIconBadgeWrapper} ${styles.MFDashboardGreyCircle}`}>
                <ChevronsDown size={15} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className={`${styles.MFDashboardPerfStatusText} ${styles.MFDashboardMutedText}`}>Out-of-form</h4>
                <p className={styles.MFDashboardPerfSubText}>Exit now</p>
              </div>
            </div>
            <ChevronRight size={14} />
          </div>
        </div>
      </section>

      {/* SECTION 3: Investment Holdings Area */}
      <section className={styles.MFDashboardFundsSection}>
        <h3 className={styles.MFDashboardSectionHeading}>Funds</h3>

        {/* Mutual Fund Asset Cards Stack */}
        <div className={styles.MFDashboardFundsListStack}>
          
          {/* Fund 1: HDFC Flexi Cap */}
          <div className={styles.MFDashboardFundListItem}>
            <div className={styles.MFDashboardFundMainMeta}>
              <h4 className={styles.MFDashboardFundTitleName}>HDFC Flexi Cap Direct Plan Growth</h4>
              <div className={styles.MFDashboardFundValueBlock}>
                <span className={`${styles.MFDashboardCurrentPriceText} ${styles.MFDashboardPriceNegativeColor}`}>
                  ₹20,568
                </span>
                <span className={styles.MFDashboardInvestedPriceSubText}>(₹21,032)</span>
              </div>
            </div>
          </div>

          {/* Fund 2: HDFC Mid Cap */}
          <div className={styles.MFDashboardFundListItem}>
            <div className={styles.MFDashboardFundMainMeta}>
              <h4 className={styles.MFDashboardFundTitleName}>HDFC Mid Cap Fund Direct Growth</h4>
              <div className={styles.MFDashboardFundValueBlock}>
                <span className={`${styles.MFDashboardCurrentPriceText} ${styles.MFDashboardPricePositiveColor}`}>
                  ₹13,304
                </span>
                <span className={styles.MFDashboardInvestedPriceSubText}>(₹12,999)</span>
              </div>
            </div>
          </div>

          {/* Fund 3: UTI Nifty 50 */}
          <div className={styles.MFDashboardFundListItem}>
            <div className={styles.MFDashboardFundMainMeta}>
              <h4 className={styles.MFDashboardFundTitleName}>UTI Nifty 50 Index Fund Direct Growth</h4>
              <div className={styles.MFDashboardFundValueBlock}>
                <span className={`${styles.MFDashboardCurrentPriceText} ${styles.MFDashboardPriceNegativeColor}`}>
                  ₹3,731
                </span>
                <span className={styles.MFDashboardInvestedPriceSubText}>(₹4,000)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}