import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleBalance } from "../../store/auth/auth.slice";
import {
  // Bell,
  Eye,
  EyeOff,
  RotateCw,
  Plus,
  ChevronRight,
  Upload,
  Landmark,
  Sparkles,
  Newspaper,
  Calculator,
} from "lucide-react";
import { fetchTotalAssets } from "../../services/apis/dashboard.service";
import LoadingDots from "../../components/LoadingDots/LoadingDots";
import {
  selectUserName,
  selectShowBalance,
  selectAuthToken,
  selectUserId,
} from "../../store/auth/auth.selectors";
// import PortfolioVsMarket from "./PortfolioVsMarket";
import MFCasUpload from "../MutualFund/MFCasUpload/MFCasUpload";
import ProductSection from "./ProductSection/ProductSection";
import OtherProducts from "./ProductSection/OtherProducts/OtherProducts";
import TrackInsuraceUi from "../Insurance/TrackInsuraceUi/TrackInsuraceUi";
import { registerFCM } from "../../services/fcm";
import PushNotificationModal from "../../components/PushNotificationModal/PushNotificationModal";

import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import MFCasImportModal from "../MutualFund/MFCasImport/MFCasImportModal";
import logoFull from "../../assets/images/nidhifylogofull.png";

const formatCurrency = (value) => {
  if (value == null) return "₹0.00";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export default function Dashboard() {
  const userName = useSelector(selectUserName);
  const userID = useSelector(selectUserId);
  const dispatch = useDispatch();
  const showBalance = useSelector(selectShowBalance);
  const [totalAssetsData, setTotalAssetsData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(Number(userID) !== 10);
  const [showCasUpload, setShowCasUpload] = useState(false);
  const [showCasModal, setShowCasModal] = useState(false);
  const [showOtherProducts, setShowOtherProducts] = useState(false);
  const navigate = useNavigate();

  const token = useSelector(selectAuthToken);

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const DISMISS_EXPIRY_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    const isSubscribed = localStorage.getItem("fcm_subscribed") === "true";
    if (isSubscribed) return;

    const dismissed = localStorage.getItem("notification_popup_dismissed");
    if (!dismissed) {
      setShowNotificationModal(true);
      return;
    }

    if (Date.now() - Number(dismissed) >= DISMISS_EXPIRY_MS) {
      localStorage.removeItem("notification_popup_dismissed");
      setShowNotificationModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("showCas") === "1") {
      sessionStorage.removeItem("showCas");
      setShowCasModal(true);
    }
  }, []);

  useEffect(() => {
    if (Number(userID) === 10) return;
    loadData();
  }, [userID]);

  const loadData = async () => {
    setIsLoading(true);
    const assetsRes = await fetchTotalAssets();
    if (assetsRes) {
      setTotalAssetsData(assetsRes);
    }
    setIsLoading(false);
  };

  const isCasImported = totalAssetsData?.isCasImported;
  const totalAssets = totalAssetsData?.totalAssets;

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      await registerFCM(token);
      setShowNotificationModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("notification_popup_dismissed", String(Date.now()));
    setShowNotificationModal(false);
  };

  return (
    <>
      <div className={styles.mobileDashboardContainer}>
        {/* Top Header Section */}
        <header className={styles.mobileDashboardHeader}>
          <div className={styles.mobileDashboardWelcome}>
            <h1 className={styles.mobileDashboardGreeting}>
              Hi, {(userName || "User").split(" ")[0]} 👋
            </h1>
            <p className={styles.mobileDashboardSubGreeting}>
              {(() => {
                const h = new Date().getHours();
                if (h < 12) return "Good Morning!";
                if (h < 17) return "Good Afternoon!";
                return "Good Evening!";
              })()}
            </p>
          </div>
          {/* <button
            className={styles.mobileDashboardNotificationBtn}
            aria-label="Notifications"
            onClick={() => navigate("/notifications")}
          >
            <Bell size={20} />
            <span className={styles.mobileDashboardNotificationDot} />
          </button> */}

          <button
            className={styles.mobileDashboardAssistantBtn}
            aria-label="Assistant"
            onClick={() => navigate("/assistant")}
          >
            <Sparkles size={20} />
            <span className={styles.mobileDashboardAssistantDot} />
          </button>
        </header>

        {/* Total Networth / Assets Value Section */}
        <section className={styles.mobileDashboardNetworthSection}>
          <div className={styles.mobileDashboardNetworthRow}>
            <div className={styles.mobileDashboardNetworthLabelGroup}>
              <span className={styles.mobileDashboardNetworthLabel}>
                Total Networth
              </span>
              {isLoading && (
                <RotateCw
                  size={13}
                  className={styles.mobileDashboardSpinIcon}
                />
              )}
            </div>
            <button
              className={styles.mobileDashboardToggleEye}
              onClick={() => dispatch(toggleBalance())}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <h2 className={styles.mobileDashboardNetworthAmount}>
            {totalAssets == null && isLoading ? (
              <LoadingDots speed={300} />
            ) : showBalance ? (
              formatCurrency(totalAssets)
            ) : (
              "₹••••••"
            )}
          </h2>

          {!isLoading && (totalAssets == null || totalAssets === 0) && (
            <button
              type="button"
              className={styles.mobileDashboardAddAssetsBtn}
              onClick={() => setShowOtherProducts(true)}
            >
              <div className={styles.mobileDashboardAddAssetsIcon}>
                <Plus size={16} color="#ffffff" />
              </div>
              <span className={styles.mobileDashboardAddAssetsText}>
                Add Assets to Track
              </span>
              <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
            </button>
          )}
        </section>

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

            <div
              className={styles.mobileDashboardRowCard}
              onClick={() => navigate("/ReadNews")}
            >
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

        {/*
        {!isLoading && isCasImported === true ? (
          <PortfolioVsMarket />
        ) :
         */}

        {!isLoading && isCasImported === false && (
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
        )}
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

      <OtherProducts
        isOpen={showOtherProducts}
        onClose={() => setShowOtherProducts(false)}
        onDataChange={loadData}
      />

      <MFCasUpload
        isOpen={showCasUpload}
        onClose={() => setShowCasUpload(false)}
        onUploadSuccess={loadData}
      />

      {showCasModal && (
        <MFCasImportModal
          isOpen={showCasModal}
          onSkip={() => setShowCasModal(false)}
          onProceed={() => setShowCasModal(false)}
          illustrationSrc={logoFull}
        />
      )}

      <PushNotificationModal
        open={showNotificationModal}
        onClose={handleClose}
        onSubscribe={handleSubscribe}
        loading={subscribing}
      />
    </>
  );
}
