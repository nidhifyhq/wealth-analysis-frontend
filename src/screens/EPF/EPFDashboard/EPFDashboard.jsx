import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleBalance } from "../../../store/auth/auth.slice";
import { selectShowBalance } from "../../../store/auth/auth.selectors";
import { selectEpfSummary } from "../../../store/epf/epf.selectors";
import { setEpfSummary, clearEpfData } from "../../../store/epf/epf.slice";
import {
  ArrowLeft,
  ArrowDownLeft,
  Eye,
  EyeOff,
  RotateCw,
  FileText,
  Building2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  User,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchEpfSummary } from "../../../services/apis/epf.service";
import { COLORS } from "../../../designConfig/colors";
import { TbCircleArrowDownLeft } from "react-icons/tb";
import EPFUploadModal from "../EPFUpload/EPFUploadModal";
import EPFHistoryBreakUp from "./EPFHistoryBreakUp/EPFHistoryBreakUp";
import EPFAccontDtls from "./EPFAccontDtls/EPFAccontDtls";
import RetireProjectionGraph from "./RetireProjectionGraph/RetireProjectionGraph";
import styles from "./EPFDashboard.module.css";

// ── Currency Formatter ──
const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0";
  return `₹${Math.round(Number(value)).toLocaleString("en-IN")}`;
};

// ── Ordinal Date Suffix Helper (1st, 2nd, 3rd, 15th) ──
const getOrdinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// ── "2026-09" -> "Contribution for Sep'26" ──
const formatContributionMonth = (monthStr) => {
  if (!monthStr) return "Monthly Contribution";
  const parts = String(monthStr).split("-");
  if (parts.length === 2) {
    const year = parts[0].slice(-2);
    const monthNum = parseInt(parts[1], 10);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    if (monthNum >= 1 && monthNum <= 12) {
      return `Contribution for ${months[monthNum - 1]}'${year}`;
    }
  }
  return `Contribution for ${monthStr}`;
};

// ── "15-10-2026" -> "15th Oct'26" ──
const formatTransDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = String(dateStr).split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const monthNum = parseInt(parts[1], 10);
    const year = parts[2].slice(-2);
    if (!isNaN(day) && monthNum >= 1 && monthNum <= 12) {
      return `${getOrdinal(day)} ${months[monthNum - 1]}'${year}`;
    }
  }
  return dateStr;
};

// ── "2026-10-28T12:56:24.000Z" -> "28 Oct 2026" ──
const formatStatementDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function EPFDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showBalance = useSelector(selectShowBalance);

  const reduxSummary = useSelector(selectEpfSummary);
  const [isLoading, setIsLoading] = useState(!reduxSummary);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // If data is already in Redux, DO NOT call summary API
    if (!reduxSummary) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [reduxSummary]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetchEpfSummary();
      if (res?.success && res?.data) {
        dispatch(setEpfSummary(res.data));
      } else {
        dispatch(clearEpfData());
        navigate("/epf", { replace: true });
      }
    } catch (_) {
      if (!reduxSummary) {
        navigate("/epf", { replace: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      const res = await fetchEpfSummary();
      if (res?.success && res?.data) {
        dispatch(setEpfSummary(res.data));
        toast.success("EPF data updated");
      } else {
        toast.error(res?.message || "Failed to update EPF data");
      }
    } catch (_) {
      toast.error("Network error while updating");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleUploadSuccess = async () => {
    setIsLoading(true);
    try {
      const res = await fetchEpfSummary();
      if (res?.success && res?.data) {
        dispatch(setEpfSummary(res.data));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSuccess = () => {
    dispatch(clearEpfData());
    setShowAccountDetailsModal(false);
    navigate("/epf", { replace: true });
  };

  const summaryData = reduxSummary;
  const balance = summaryData?.balance;
  const history = summaryData?.history || [];
  const accounts = summaryData?.accounts || [];
  const currentAccount = accounts[0] || null;
  const statementDate = summaryData?.statementDate;

  const displayedTransactions = showAllTransactions
    ? history
    : history.slice(0, 5);

  return (
    <div className={styles.EPFdash_container}>
      {/* ══════════════════════════════════════════════
          SECTION 1: Header Banner (Deep Sapphire)
         ══════════════════════════════════════════════ */}
      <header
        className={styles.EPFdash_headerBanner}
        style={{ backgroundColor: COLORS.headerBackground || "#132b50" }}
      >
        <div className={styles.EPFdash_topActionRow}>
          <div className={styles.EPFdash_topActionLeft}>
            <button
              type="button"
              className={styles.EPFdash_circularBtn}
              aria-label="Go Back"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.EPFdash_screenTitle}>EPF</h1>
          </div>
          <button
            type="button"
            className={styles.EPFdash_circularBtn}
            aria-label="Upload New Statement"
            onClick={() => setShowUploadModal(true)}
          >
            <FileText size={19} />
          </button>
        </div>

        {/* Balance Display Block */}
        <div>
          <div className={styles.EPFdash_balanceHeader}>
            <span className={styles.EPFdash_balanceTitle}>Current Balance</span>
            <button
              type="button"
              className={styles.EPFdash_toggleEye}
              onClick={() => dispatch(toggleBalance())}
              aria-label={showBalance ? "Hide balance" : "Show balance"}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>

            <button
              type="button"
              className={`${styles.EPFdash_toggleEye} ${
                isRefreshing ? styles.EPFdash_spinning : ""
              }`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh EPF data"
              title="Refresh latest data"
            >
              <RotateCw size={14} />
            </button>

            {statementDate && !isLoading && (
              <span className={styles.EPFdash_statementDate}>
                as on {formatStatementDate(statementDate)}
              </span>
            )}
          </div>

          <div className={styles.EPFdash_balanceRowGroup}>
            {isLoading ? (
              <div
                className={styles.EPFdash_skeletonShimmerDark}
                style={{ width: "160px", height: "30px", margin: "4px 0" }}
              />
            ) : (
              <h1 className={styles.EPFdash_primaryAmount}>
                {showBalance
                  ? formatCurrency(balance?.currentBalance)
                  : "••••••••"}
              </h1>
            )}
          </div>

          {/* 3-Share Breakdown Metrics */}
          <div className={styles.EPFdash_metricsRow}>
            <div className={styles.EPFdash_metricItem}>
              <span className={styles.EPFdash_metricLabel}>Employee share</span>
              {isLoading ? (
                <div
                  className={styles.EPFdash_skeletonShimmerDark}
                  style={{ width: "70px", height: "16px", marginTop: "4px" }}
                />
              ) : (
                <span className={styles.EPFdash_metricValue}>
                  {showBalance
                    ? formatCurrency(balance?.employeeShare)
                    : "••••"}
                </span>
              )}
            </div>

            <div className={styles.EPFdash_metricItem}>
              <span className={styles.EPFdash_metricLabel}>Employer share</span>
              {isLoading ? (
                <div
                  className={styles.EPFdash_skeletonShimmerDark}
                  style={{ width: "70px", height: "16px", marginTop: "4px" }}
                />
              ) : (
                <span className={styles.EPFdash_metricValue}>
                  {showBalance
                    ? formatCurrency(balance?.employerShare)
                    : "••••"}
                </span>
              )}
            </div>

            <div className={styles.EPFdash_metricItem}>
              <span className={styles.EPFdash_metricLabel}>Pension share</span>
              {isLoading ? (
                <div
                  className={styles.EPFdash_skeletonShimmerDark}
                  style={{ width: "70px", height: "16px", marginTop: "4px" }}
                />
              ) : (
                <span className={styles.EPFdash_metricValue}>
                  {showBalance
                    ? formatCurrency(balance?.pensionShare)
                    : "••••"}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════
          SECTION 2: Overlapping Main Content Area
         ══════════════════════════════════════════════ */}
      <main className={styles.EPFdash_contentArea}>
        {/* ── Employer Details Card ── */}
        {isLoading ? (
          <div className={styles.EPFdash_employerCard}>
            <div className={styles.EPFdash_employerCardTop}>
              <div
                className={styles.EPFdash_skeletonShimmer}
                style={{ width: "38px", height: "38px", borderRadius: "10px" }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
                <div
                  className={styles.EPFdash_skeletonShimmer}
                  style={{ width: "90px", height: "10px" }}
                />
                <div
                  className={styles.EPFdash_skeletonShimmer}
                  style={{ width: "80%", height: "14px" }}
                />
              </div>
            </div>
            <div
              className={styles.EPFdash_skeletonShimmer}
              style={{ width: "60%", height: "12px", marginTop: "4px" }}
            />
          </div>
        ) : currentAccount ? (
          <div className={styles.EPFdash_employerCard}>
            <div className={styles.EPFdash_employerCardTop}>
              <div className={styles.EPFdash_employerIconWrapper}>
                <Building2 size={20} strokeWidth={2.2} />
              </div>
              <div className={styles.EPFdash_employerMeta}>
                <p className={styles.EPFdash_employerLabel}>Current Employer</p>
                <h3 className={styles.EPFdash_employerName}>
                  {currentAccount.employerName || "Employer Name Unavailable"}
                </h3>
              </div>
            </div>

            <div
              className={styles.EPFdash_employerCardBottom}
              onClick={() => setShowAccountDetailsModal(true)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.EPFdash_accountDetailsText}>
                Account Details
              </span>
              <ChevronRight
                size={14}
                className={styles.EPFdash_accountDetailsChevron}
              />
            </div>
          </div>
        ) : null}

        {/* ── Recent Transactions Section (Exact Match to Design Screenshot) ── */}
        <section className={styles.EPFdash_transactionsSection}>
          <div className={styles.EPFdash_sectionHeadingRow}>
            <h2 className={styles.EPFdash_sectionHeading}>Recent transactions</h2>
          </div>

          <div className={styles.EPFdash_sectionDivider} />

          <div className={styles.EPFdash_transactionsList}>
            {isLoading ? (
              /* Exact Screenshot Skeleton Rows */
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className={styles.EPFdash_transactionRow}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    <div
                      className={styles.EPFdash_skeletonShimmer}
                      style={{ width: "55%", height: "15px" }}
                    />
                    <div
                      className={styles.EPFdash_skeletonShimmer}
                      style={{ width: "28%", height: "12px" }}
                    />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      className={styles.EPFdash_skeletonShimmer}
                      style={{ width: "60px", height: "16px" }}
                    />
                    <div
                      className={styles.EPFdash_skeletonShimmer}
                      style={{ width: "22px", height: "22px", borderRadius: "50%" }}
                    />
                  </div>
                </div>
              ))
            ) : history.length === 0 ? (
              <div className={styles.EPFdash_emptyState}>
                <p className={styles.EPFdash_emptyStateText}>
                  No recent transactions found.
                </p>
              </div>
            ) : (
              displayedTransactions.map((tx, idx) => (
                <div
                  key={idx}
                  className={styles.EPFdash_transactionRow}
                  onClick={() => setSelectedTransaction(tx)}
                  role="button"
                  tabIndex={0}
                >
                  <div className={styles.EPFdash_transLeft}>
                    <h4 className={styles.EPFdash_transTitle}>
                      {formatContributionMonth(tx.month)}
                    </h4>
                    <p className={styles.EPFdash_transDate}>
                      {formatTransDate(tx.transDate)}
                    </p>
                  </div>

                  <div className={styles.EPFdash_transRight}>
                    <span className={styles.EPFdash_transAmount}>
                      {formatCurrency(tx.amount)}
                    </span>
                    <TbCircleArrowDownLeft
                      size={18}
                      className={styles.EPFdash_transCircleIcon}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {!isLoading && history.length > 5 && (
            <div className={styles.EPFdash_showMoreContainer}>
              <button
                type="button"
                className={styles.EPFdash_showMoreBtn}
                onClick={() => setShowAllTransactions(!showAllTransactions)}
              >
                <span>{showAllTransactions ? "Show less" : "Show more"}</span>
                {showAllTransactions ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </button>
            </div>
          )}
        </section>

        {/* ── Retirement Projection Graph Section (Only if currAge is available) ── */}
        {summaryData?.currAge ? (
          <RetireProjectionGraph
            currentBalance={balance?.currentBalance}
            currAge={summaryData?.currAge}
            monthlyContribution={
              history?.[0]
                ? (history[0].ee || 0) + (history[0].er || 0) ||
                  (history[0].amount - (history[0].eps || 0))
                : 2862
            }
          />
        ) : null}

        {/* ── Footer Disclaimer: Automated PDF Parsing ── */}
        <footer className={styles.EPFdash_footerDisclaimer}>
          <div className={styles.EPFdash_disclaimerBadge}>
            <ShieldCheck size={14} className={styles.EPFdash_disclaimerIcon} />
            <span>Automated Parsing Notice</span>
          </div>
          <p className={styles.EPFdash_disclaimerText}>
            Nidhify analyzes and extracts data directly from your uploaded EPFO passbook PDF. While we employ automated parsing to provide comprehensive insights, occasional extraction discrepancies may occur. All records are provided for tracking and informational purposes—please cross-verify important figures with your official EPFO portal.
          </p>
        </footer>
      </main>

      {/* ══════════════════════════════════════════════
          SECTION 3: Sub-breakdown Bottom Sheet Modal
         ══════════════════════════════════════════════ */}
      <EPFHistoryBreakUp
        transaction={selectedTransaction}
        employerName={currentAccount?.employerName}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* ══════════════════════════════════════════════
          Re-upload Statement Modal
         ══════════════════════════════════════════════ */}
      <EPFUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* ══════════════════════════════════════════════
          EPF Account Details Modal
         ══════════════════════════════════════════════ */}
      <EPFAccontDtls
        isOpen={showAccountDetailsModal}
        onClose={() => setShowAccountDetailsModal(false)}
        memberName={summaryData?.memberName}
        uan={summaryData?.uan}
        memberId={currentAccount?.memberId}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  );
}
