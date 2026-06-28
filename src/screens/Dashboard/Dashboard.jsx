import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import {
  Bell,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Upload,
  Landmark,
} from "lucide-react";
import {
  fetchInvestmentShortDetails,
  fetchTotalAssets,
} from "../../services/apis/dashboard.service";
import LoadingDots from "../../components/LoadingDots/LoadingDots";
import { selectUserName } from "../../store/auth/auth.selectors";
import PortfolioVsMarket from "./PortfolioVsMarket";
import MFCasUpload from "../MutualFund/MFCasUpload/MFCasUpload";
import ProductSection from "./ProductSection/ProductSection";
import TrackInsuraceUi from "../Insurance/TrackInsuraceUi/TrackInsuraceUi";

import { Newspaper, Calculator } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";

const productConfig = {
  "Mutual Funds": { className: "mobileDashboardProductMf", label: "MFs" },
  FD: { className: "mobileDashboardProductFd", label: "FDs" },
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
  if (value == null) return "₹0.00";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Dashboard() {
  const userName = useSelector(selectUserName);
  const [showBalance, setShowBalance] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [totalAssetsData, setTotalAssetsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCasUpload, setShowCasUpload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [detailsRes, assetsRes] = await Promise.all([
      fetchInvestmentShortDetails(),
      fetchTotalAssets(),
    ]);
    if (detailsRes && (detailsRes.MutualFund || detailsRes.FixedDeposit)) {
      setDashboardData(detailsRes);
    }
    if (assetsRes) {
      setTotalAssetsData(assetsRes);
    }
    setIsLoading(false);
  };

  const mutualFund = dashboardData?.MutualFund;
  const fixedDeposit = dashboardData?.FixedDeposit;
  const isCasImported = mutualFund?.isCasImported;

  const totalAssets = totalAssetsData?.totalAssets;

  const productTags = useMemo(() => {
    const investProduct = totalAssetsData?.investProduct || [];
    return investProduct.map((name) => {
      const known = productConfig[name];
      if (known) {
        return { label: known.label, className: styles[known.className] };
      }
      return {
        label: name,
        style: { backgroundColor: stringToColor(name), color: "#ffffff" },
      };
    });
  }, [totalAssetsData?.investProduct]);

  return (
    <>
      <div className={styles.mobileDashboardContainer}>
        {/* Top Header Section */}
        <header className={styles.mobileDashboardHeader}>
          <div className={styles.mobileDashboardWelcome}>
            <h1 className={styles.mobileDashboardGreeting}>
              Hi, {(userName || "User").split(" ")[0]} 👋
            </h1>
            <p className={styles.mobileDashboardSubGreeting}>Welcome back!</p>
          </div>
          <button
            className={styles.mobileDashboardNotificationBtn}
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
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
              <section
                className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardTotalAssetBg}`}
              >
                <div className={styles.mobileDashboardAssetMain}>
                  <div className={styles.mobileDashboardAssetHeader}>
                    <span className={styles.mobileDashboardAssetLabel}>
                      Total asset value
                    </span>
                    <button
                      className={styles.mobileDashboardToggleEye}
                      onClick={() => setShowBalance(!showBalance)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <h2 className={styles.mobileDashboardAssetAmount}>
                    {isLoading ? (
                      <LoadingDots speed={300} />
                    ) : showBalance ? (
                      formatCurrency(totalAssets)
                    ) : (
                      "••••••"
                    )}
                  </h2>

                  {/* Overlapping Badges with white border */}
                  {!isLoading && productTags.length > 0 && (
                    <div className={styles.mobileDashboardHoldingAvatars}>
                      {productTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`${styles.mobileDashboardTag}${tag.className ? ` ${tag.className}` : ""}`}
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
              <section
                className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardMutualFundsBg}`}
              >
                <div className={styles.mobileDashboardAssetMain}>
                  <div className={styles.mobileDashboardAssetHeader}>
                    <span className={styles.mobileDashboardAssetLabel}>
                      Mutual Funds Investment
                    </span>
                  </div>
                  <h2 className={styles.mobileDashboardAssetAmount}>
                    {isLoading ? (
                      <LoadingDots speed={300} />
                    ) : showBalance ? (
                      formatCurrency(mutualFund?.currentVal)
                    ) : (
                      "••••••"
                    )}
                  </h2>
                  <div className={styles.mobileDashboardAssetTrend}>
                    <span
                      className={styles.mobileDashboardTrendBadge}
                      style={{ color: "#0d5257" }}
                    >
                      {isLoading ? (
                        <LoadingDots speed={300} />
                      ) : (
                        <>
                          {mutualFund?.absoluteReturn != null &&
                          mutualFund.absoluteReturn >= 0 ? (
                            <ArrowUp size={12} />
                          ) : (
                            <ArrowDown size={12} />
                          )}{" "}
                          {mutualFund?.absoluteReturn != null
                            ? mutualFund.absoluteReturn.toFixed(2)
                            : "0.00"}
                          %
                        </>
                      )}
                    </span>
                    <span className={styles.mobileDashboardTrendPeriod}>
                      All-time Returns
                    </span>
                  </div>
                  <p className={styles.mobileDashboardCardFooterText}>
                    {isLoading ? (
                      <LoadingDots speed={300} />
                    ) : (
                      `Active in ${mutualFund?.totalFunds || 0} Fund${mutualFund?.totalFunds !== 1 ? "s" : ""}`
                    )}
                  </p>
                </div>
                <div className={styles.mobileDashboardDecorativeCircle}></div>
              </section>
            </SwiperSlide>

            {/* CARD 3: Fixed Deposits */}
            <SwiperSlide>
              <section
                className={`${styles.mobileDashboardAssetCard} ${styles.mobileDashboardFdBg}`}
              >
                <div className={styles.mobileDashboardAssetMain}>
                  <div className={styles.mobileDashboardAssetHeader}>
                    <span className={styles.mobileDashboardAssetLabel}>
                      Fixed Deposits (FD)
                    </span>
                  </div>
                  <h2 className={styles.mobileDashboardAssetAmount}>
                    {isLoading ? (
                      <LoadingDots speed={300} />
                    ) : showBalance ? (
                      formatCurrency(fixedDeposit?.currentValue)
                    ) : (
                      "••••••"
                    )}
                  </h2>
                  <div className={styles.mobileDashboardAssetTrend}>
                    <span
                      className={styles.mobileDashboardTrendBadge}
                      style={{ color: "#4a1f05" }}
                    >
                      {isLoading ? (
                        <LoadingDots speed={300} />
                      ) : (
                        <>⚡ {fixedDeposit?.absReturn || "0.00"}%</>
                      )}
                    </span>
                    <span className={styles.mobileDashboardTrendPeriod}>
                      All-time Returns
                    </span>
                  </div>
                  <p className={styles.mobileDashboardCardFooterText}>
                    {isLoading ? (
                      <LoadingDots speed={300} />
                    ) : fixedDeposit?.totalFD ? (
                      `Active FDs ${fixedDeposit.totalFD}`
                    ) : (
                      "No active FD"
                    )}
                  </p>
                </div>
                <div className={styles.mobileDashboardDecorativeCircle}></div>
              </section>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* Action Buttons */}
        {/* <div className={styles.mobileDashboardActionGroup}>
          <button className={styles.mobileDashboardActionButton}>
            <Plus size={18} /> Deposit
          </button>
          <button className={styles.mobileDashboardActionButton}>
            <Download size={18} /> Withdraw
          </button>
        </div> */}

        {/* Main Content White Area */}
        <div className={styles.mobileDashboardContentSheet}>
          <ProductSection onRefresh={loadData} />
          <TrackInsuraceUi />

          <div className={styles.mobileDashboardSectionHeader}>
            <h3 className={styles.mobileDashboardSectionTitle}>Explore</h3>
            {/* <button className={styles.mobileDashboardSectionLink}>Edit Watchlist</button> */}
          </div>

          <div className={styles.mobileDashboardListContainer}>
            <div
              className={styles.mobileDashboardRowCard}
              onClick={() => navigate("/FDCalculator")}
            >
              <div className={styles.mobileDashboardRowLeading}>
                <div
                  className={`${styles.mobileDashboardBrandIcon} ${styles.mobileDashboardNflxIconBg}`}
                >
                  <Landmark size={15} />
                </div>
                <div>
                  <h4 className={styles.mobileDashboardStockTicker}>
                    Fixed & Recurring Deposit Calculator
                  </h4>
                  <p className={styles.mobileDashboardStockName}>
                    Compare FD and RD returns in seconds
                  </p>
                </div>
              </div>
              <div className={styles.mobileDashboardRowTrailing}>
                <ChevronRight size={20} />
              </div>
            </div>

            <div
              className={styles.mobileDashboardRowCard}
              onClick={() => navigate("/SIPCalculator")}
            >
              <div className={styles.mobileDashboardRowLeading}>
                <div
                  className={`${styles.mobileDashboardBrandIcon} ${styles.mobileDashboardAmznIconBg}`}
                >
                  <Calculator size={15} />
                </div>
                <div>
                  <h4 className={styles.mobileDashboardStockTicker}>
                    SIP & Lumpsum Calculator
                  </h4>
                  <p className={styles.mobileDashboardStockName}>
                    Estimate your investment growth
                  </p>
                </div>
              </div>
              <div className={styles.mobileDashboardRowTrailing}>
                <ChevronRight size={20} />
              </div>
            </div>

            <div className={styles.mobileDashboardRowCard} onClick={() => navigate("/ReadNews")}>
              <div className={styles.mobileDashboardRowLeading}>
                <div
                  className={`${styles.mobileDashboardBrandIcon} ${styles.mobileDashboardNewsLetterIconBg}`}
                >
                  <Newspaper size={15} />
                </div>
                <div>
                  <h4 className={styles.mobileDashboardStockTicker}>
                    Newsletter
                  </h4>
                  <p className={styles.mobileDashboardStockName}>
                    Stay updated with market insights
                  </p>
                </div>
              </div>
              <div className={styles.mobileDashboardRowTrailing}>
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        </div>

        {!isLoading && isCasImported === true ? (
          <PortfolioVsMarket />
        ) : !isLoading && isCasImported === false ? (
          <div className={styles.MobileDashboardImportSection}>
            <div
              className={styles.MobileDashboardImportCard}
              onClick={() => setShowCasUpload(true)}
            >
              <div className={styles.MobileDashboardImportIconPanel}>
                <Upload size={22} color="#6B7280" />
              </div>

              <div className={styles.MobileDashboardImportTextArea}>
                <p className={styles.MobileDashboardImportTitle}>
                  Import your CAS
                </p>
                <p className={styles.MobileDashboardImportSubtitle}>
                  Upload statement to track mutual funds
                </p>
              </div>

              <div className={styles.MobileDashboardImportChevron}>
                <ChevronRight size={20} color="#D1D5DB" />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <p className={styles.MobileDashboardDisclaimer}>
        Nidhify provides portfolio tracking and analytics for informational and
        educational purposes only. It does not constitute investment advice. All
        data and tracking insights are provided on an "as-is" basis and may be
        subject to parsing errors, third-party delays, or inaccuracies; users
        should independently verify all balances with official statements.
        Mutual fund investments are subject to market risks. Please consult a
        SEBI registered advisor before investing.
      </p>

      <MFCasUpload
        isOpen={showCasUpload}
        onClose={() => setShowCasUpload(false)}
        onUploadSuccess={loadData}
      />
    </>
  );
}
