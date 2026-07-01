import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsUp,
  ChevronDown,
  ChevronsDown,
} from "lucide-react";
import {
  fetchMyFundSummary,
  fetchAllMyFundViews,
  deleteCasData,
} from "../../../services/apis/portfolio.service";
import MFCasUpload from "../MFCasUpload/MFCasUpload";
import DeLinkCas from "./DeLinkCas/DeLinkCas";
import styles from "./MFDashboard.module.css";

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0.00";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function MFDashboard() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [showReturns, setShowReturns] = useState(false);
  const [showCasUpload, setShowCasUpload] = useState(false);
  const [showDeLinkCas, setShowDeLinkCas] = useState(false);
  const [isDelinking, setIsDelinking] = useState(false);
  const [fundSummary, setFundSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const [summaryRes, holdingsRes] = await Promise.all([
      fetchMyFundSummary(),
      fetchAllMyFundViews(),
    ]);
    setFundSummary(summaryRes?.success ? summaryRes.data : null);
    setHoldings(holdingsRes?.success ? holdingsRes.data.holdings || [] : []);
    setIsLoading(false);
  };

  const handleDeLinkCas = async () => {
    setIsDelinking(true);
    const res = await deleteCasData();
    if (res?.success) {
      setShowDeLinkCas(false);
      loadData();
    }
    setIsDelinking(false);
  };

  const s = fundSummary?.summary;
  const r = fundSummary?.ratings;
  const asOnDate = fundSummary?.asOnDate;
  const statementDate = fundSummary?.statementDate;
  const importedAt = fundSummary?.importedAt;

  const priceColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.MFDashboardPriceNegativeColor
      : styles.MFDashboardPricePositiveColor;

  const returnColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.MFDashboardNegativeReturn
      : styles.MFDashboardMetricValue;

  const getRatingClass = (rating) => {
    if (!rating) return "";
    const map = {
      "In-Form": styles.MFDashboardRatingInForm,
      "On-Track": styles.MFDashboardRatingOnTrack,
      "Off-Track": styles.MFDashboardRatingOffTrack,
      "Out-of-Form": styles.MFDashboardRatingOutOfForm,
      "Not Rated": styles.MFDashboardRatingNotRated,
    };
    return map[rating] || "";
  };

  const ratingsConfig = [
    {
      key: "inform",
      label: "In-form",
      sub: "Performing great",
      icon: <ChevronsUp size={15} strokeWidth={2.5} />,
      bgClass: styles.MFDashboardInFormBg,
      circleClass: styles.MFDashboardGreenCircle,
    },
    {
      key: "onTrack",
      label: "On-track",
      sub: "Performing good",
      icon: <ChevronUp size={15} strokeWidth={2.5} />,
      bgClass: styles.MFDashboardOnTrackBg,
      circleClass: styles.MFDashboardLightGreenCircle,
    },
    {
      key: "offTrack",
      label: "Off-track",
      sub: "Don't invest further",
      icon: <ChevronDown size={15} strokeWidth={2.5} />,
      bgClass: "",
      circleClass: styles.MFDashboardGreyCircle,
    },
    {
      key: "outOfPerform",
      label: "Out-of-form",
      sub: "Exit now",
      icon: <ChevronsDown size={15} strokeWidth={2.5} />,
      bgClass: "",
      circleClass: styles.MFDashboardGreyCircle,
    },
  ];

  return (
    <div className={styles.MFDashboardContainer}>
      {/* SECTION 1: Top Hero Banner Block */}
      <header className={styles.MFDashboardHeaderBanner}>
        <div className={styles.MFDashboardTopActionRow}>
          <button
            className={styles.MFDashboardCircularBtn}
            aria-label="Go Back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className={styles.MFDashboardCircularBtn}
            aria-label="View Statement"
            onClick={() => setShowCasUpload(true)}
          >
            <FileText size={20} />
          </button>
        </div>

        <div className={styles.MFDashboardMainBalanceArea}>
          <div className={styles.MFDashboardBalanceHeader}>
            <span className={styles.MFDashboardBalanceTitle}>
              Portfolio Balance
            </span>
            <button
              className={styles.MFDashboardToggleEye}
              onClick={() => setShowBalance(!showBalance)}
            >
              <Eye size={16} />
            </button>
            <span className={styles.MFDashboardAsOnDate}>
              as on {formatDate(asOnDate)}
            </span>
          </div>

          <div className={styles.MFDashboardBalanceRowGroup}>
            <h2 className={styles.MFDashboardPrimaryAmount}>
              {isLoading
                ? "••••••"
                : showBalance
                  ? formatCurrency(s?.CurrValue)
                  : "••••••"}
            </h2>
          </div>

          {/* Invested, Current, and Returns Breakdown Metrics Row */}
          <div className={styles.MFDashboardMetricsRow}>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>Invested</span>
              <span className={styles.MFDashboardMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.InvestedValue)
                    : "••••"}
              </span>
            </div>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>Current</span>
              <span className={styles.MFDashboardMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.CurrValue)
                    : "••••"}
              </span>
            </div>
            <div className={styles.MFDashboardMetricItem}>
              <span className={styles.MFDashboardMetricLabel}>
                Total Returns
              </span>
              <span
                className={`${styles.MFDashboardMetricValue} ${returnColorClass(s?.currReturn)}`}
              >
                {isLoading
                  ? "••••"
                  : showBalance
                    ? `₹${Math.abs(s?.currReturn || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })} (${s?.AbsReturn != null ? s.AbsReturn.toFixed(2) : "0.00"}%)`
                    : "••••"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: Overlapping White Background Performance Block */}
      <section className={styles.MFDashboardPerformanceContainer}>
        {/* <div className={styles.MFDashboardPerformanceTitleRow}>
          <h3 className={styles.MFDashboardPerformanceHeading}>
            Performance <Info size={13} className={styles.MFDashboardInfoIcon} />
          </h3>
          <button className={styles.MFDashboardPerformanceLink}>Changes last month</button>
        </div> */}

        <div className={styles.MFDashboardPerformanceCardGroup}>
          {ratingsConfig.map((item) => (
            <div
              key={item.key}
              className={`${styles.MFDashboardPerfRowItem}${item.bgClass ? ` ${item.bgClass}` : ""}`}
            >
              <div className={styles.MFDashboardPerfLeading}>
                <div
                  className={`${styles.MFDashboardIconBadgeWrapper} ${item.circleClass}`}
                >
                  {item.icon}
                  {r?.[item.key] > 0 && (
                    <span className={styles.MFDashboardCounterBadge}>
                      {r[item.key]}
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    className={`${styles.MFDashboardPerfStatusText}${!item.bgClass ? ` ${styles.MFDashboardMutedText}` : ""}`}
                  >
                    {item.label}
                  </h4>
                  <p className={styles.MFDashboardPerfSubText}>{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={14} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Investment Holdings Area */}
      <section className={styles.MFDashboardFundsSection}>
        <div className={styles.MFDashboardSectionHeadingRow}>
          <h3 className={styles.MFDashboardSectionHeading}>
            Funds ({holdings.length})
          </h3>

          {holdings.length > 0 && (
            <button
              className={styles.MFDashboardViewToggle}
              onClick={() => setShowReturns(!showReturns)}
            >
              {showReturns ? (
                <>
                  <ChevronLeft size={14} strokeWidth={2.5} /> Returns (%)
                </>
              ) : (
                <>
                  Current (Invested){" "}
                  <ChevronRight size={14} strokeWidth={2.5} />
                </>
              )}
            </button>
          )}
        </div>

        <div className={styles.MFDashboardFundsListStack}>
          {isLoading ? (
            <p
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                textAlign: "center",
                padding: "20px 0",
              }}
            >
              Loading...
            </p>
          ) : holdings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              {/* <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 16px" }}>
                No funds found
              </p> */}
              <button
                className={styles.MFDashboardTrackBtn}
                onClick={() => setShowCasUpload(true)}
              >
                + Track External Funds
              </button>
            </div>
          ) : (
            holdings.map((fund, idx) => (
              <div key={idx} className={styles.MFDashboardFundListItem}>
                <div className={styles.MFDashboardFundMainMeta}>
                  <div>
                    <h4 className={styles.MFDashboardFundTitleName}>
                      {fund.schemeName}
                    </h4>
                    {fund.rating && (
                      <span
                        className={`${styles.MFDashboardRatingBadge} ${getRatingClass(fund.rating)}`}
                      >
                        {fund.rating}
                      </span>
                    )}
                    {fund.planType === "Regular" && (
                      <span
                        className={`${styles.MFDashboardPlanBadge} ${styles.MFDashboardPlanRegular}`}
                      >
                        Regular
                      </span>
                    )}
                  </div>
                  {showReturns ? (
                    <div className={styles.MFDashboardFundValueBlock}>
                      <span
                        className={`${styles.MFDashboardCurrentPriceText} ${fund.currReturn != null ? priceColorClass(fund.currReturn) : ""}`}
                      >
                        {fund.currReturn != null
                          ? formatCurrency(Math.abs(fund.currReturn))
                          : "—"}
                      </span>
                      <span className={styles.MFDashboardInvestedPriceSubText}>
                        {fund.AbsReturn != null
                          ? `${fund.AbsReturn.toFixed(2)}%`
                          : "—"}
                      </span>
                    </div>
                  ) : (
                    <div className={styles.MFDashboardFundValueBlock}>
                      <span
                        className={`${styles.MFDashboardCurrentPriceText} ${fund.currVal != null ? priceColorClass(fund.currReturn) : ""}`}
                      >
                        {fund.currVal != null
                          ? formatCurrency(fund.currVal)
                          : "—"}
                      </span>
                      <span className={styles.MFDashboardInvestedPriceSubText}>
                        {fund.InvestedVal != null
                          ? `(${formatCurrency(fund.InvestedVal)})`
                          : "—"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {fundSummary && (
          <>
            <div className={styles.MFDashboardDateRow}>
              <span className={styles.MFDashboardDateRowItem}>
                Statement: <strong>{formatDate(statementDate) || "—"}</strong>
              </span>
              <span className={styles.MFDashboardDateRowDivider}>|</span>
              <span className={styles.MFDashboardDateRowItem}>
                Imported: <strong>{formatDate(importedAt) || "—"}</strong>
              </span>
            </div>

            <button
              type="button"
              className={styles.MFDashboardDelinkBtn}
              onClick={() => setShowDeLinkCas(true)}
            >
              Delink CAS
            </button>
          </>
        )}
      </section>

      <p className={styles.MFDashboardDisclaimer}>
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

      <DeLinkCas
        isOpen={showDeLinkCas}
        onCancel={() => setShowDeLinkCas(false)}
        onConfirm={handleDeLinkCas}
        isDeleting={isDelinking}
      />
    </div>
  );
}
