import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  Calendar,
} from "lucide-react";
import { fetchFDList } from "../../services/apis/portfolio.service";
import FDAddModal from "./FDAddModal/FDAddModal";
import FDDetails from "./FDDetails/FDDetails";
import styles from "./FixedDeposit.module.css";

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

export default function FixedDeposit() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fdSummary, setFdSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFdId, setSelectedFdId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await fetchFDList();
    if (res?.success) {
      setFdSummary({ summary: res.data.summary });
      setHoldings(res.data.items || []);
    }
    setIsLoading(false);
  };

  const s = fdSummary?.summary;

  const priceColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.FixedDepositPriceNegativeColor
      : styles.FixedDepositPricePositiveColor;

  const returnColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.FixedDepositNegativeReturn
      : styles.FixedDepositMetricValue;

  const planCounts = { Active: 0, Matured: 0, Upcoming: 0 };
  holdings.forEach((fd) => {
    const status =
      fd.planStatus ||
      (fd.startDate && new Date(fd.startDate) > new Date()
        ? "Upcoming"
        : fd.maturityDate && new Date(fd.maturityDate) < new Date()
          ? "Matured"
          : "Active");
    if (planCounts[status] != null) planCounts[status]++;
  });

  const ratingsConfig = [
    {
      key: "Active",
      label: "Active",
      sub: "Currently running",
      icon: <ChevronUp size={15} strokeWidth={2.5} />,
      bgClass: styles.FixedDepositActiveBg,
      circleClass: styles.FixedDepositGreenCircle,
    },
    {
      key: "Matured",
      label: "Matured",
      sub: "Completed deposits",
      icon: <ChevronDown size={15} strokeWidth={2.5} />,
      bgClass: "",
      circleClass: styles.FixedDepositGreyCircle,
    },
    {
      key: "Upcoming",
      label: "Upcoming",
      sub: "Starting soon",
      icon: <Calendar size={13} strokeWidth={2.5} />,
      bgClass: "",
      circleClass: styles.FixedDepositGreyCircle,
    },
  ];

  return (
    <div className={styles.FixedDepositContainer}>
      {/* SECTION 1: Top Hero Banner Block */}
      <header className={styles.FixedDepositHeaderBanner}>
        <div className={styles.FixedDepositTopActionRow}>
          <button
            className={styles.FixedDepositCircularBtn}
            aria-label="Go Back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className={styles.FixedDepositCircularBtn}
            aria-label="Add Fixed Deposit"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.FixedDepositMainBalanceArea}>
          <div className={styles.FixedDepositBalanceHeader}>
            <span className={styles.FixedDepositBalanceTitle}>
              Total FD Portfolio
            </span>
            <button
              className={styles.FixedDepositToggleEye}
              onClick={() => setShowBalance(!showBalance)}
            >
              <Eye size={16} />
            </button>
          </div>

          <div className={styles.FixedDepositBalanceRowGroup}>
            <h2 className={styles.FixedDepositPrimaryAmount}>
              {isLoading
                ? "••••••"
                : showBalance
                  ? formatCurrency(s?.totalCurrentValue)
                  : "••••••"}
            </h2>
          </div>

          <div className={styles.FixedDepositMetricsRow}>
            <div className={styles.FixedDepositMetricItem}>
              <span className={styles.FixedDepositMetricLabel}>Invested</span>
              <span className={styles.FixedDepositMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalPrincipal)
                    : "••••"}
              </span>
            </div>
            <div className={styles.FixedDepositMetricItem}>
              <span className={styles.FixedDepositMetricLabel}>
                Current Value
              </span>
              <span className={styles.FixedDepositMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalInterestEarned)
                    : "••••"}
              </span>
            </div>
            <div className={styles.FixedDepositMetricItem}>
              <span className={styles.FixedDepositMetricLabel}>Returns</span>
              <span
                className={`${styles.FixedDepositMetricValue} ${returnColorClass(s?.totalInterestEarned)}`}
              >
                {isLoading
                  ? "••••"
                  : showBalance
                    ? `${s?.totalReturnPercent != null ? s.totalReturnPercent.toFixed(2) : "0.00"}%`
                    : "••••"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION 2: Overlapping White Background Performance Block */}
      <section className={styles.FixedDepositPerformanceContainer}>
        {/* <div className={styles.FixedDepositPerformanceTitleRow}>
          <h3 className={styles.FixedDepositPerformanceHeading}>
            Deposit Overview{" "}
            <Info size={13} className={styles.FixedDepositInfoIcon} />
          </h3>
          <button className={styles.FixedDepositPerformanceLink}>
            View all deposits
          </button>
        </div> */}

        <div className={styles.FixedDepositPerformanceCardGroup}>
          {ratingsConfig.map((item) => (
            <div
              key={item.key}
              className={`${styles.FixedDepositPerfRowItem}${item.bgClass ? ` ${item.bgClass}` : ""}`}
            >
              <div className={styles.FixedDepositPerfLeading}>
                <div
                  className={`${styles.FixedDepositIconBadgeWrapper} ${item.circleClass}`}
                >
                  {item.icon}
                  {planCounts[item.key] > 0 && (
                    <span className={styles.FixedDepositCounterBadge}>
                      {planCounts[item.key]}
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    className={`${styles.FixedDepositPerfStatusText}${!item.bgClass ? ` ${styles.FixedDepositMutedText}` : ""}`}
                  >
                    {item.label}
                  </h4>
                  <p className={styles.FixedDepositPerfSubText}>{item.sub}</p>
                </div>
              </div>
              <ChevronRight size={14} />
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: FD Holdings Area */}
      <section className={styles.FixedDepositFundsSection}>
        <div className={styles.FixedDepositSectionHeadingRow}>
          <h3 className={styles.FixedDepositSectionHeading}>
            Fixed Deposits ({holdings.length})
          </h3>
        </div>

        <div className={styles.FixedDepositFundsListStack}>
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
                No fixed deposits found
              </p> */}
              <button
                className={styles.FixedDepositTrackBtn}
                onClick={() => setShowAddModal(true)}
              >
                + Track External FD
              </button>
            </div>
          ) : (
            holdings.map((fd, idx) => {
              const planStatus =
                fd.planStatus ||
                (fd.startDate && new Date(fd.startDate) > new Date()
                  ? "Upcoming"
                  : fd.maturityDate && new Date(fd.maturityDate) < new Date()
                    ? "Matured"
                    : "Active");
              return (
                <div
                  key={idx}
                  className={styles.FixedDepositFundListItem}

                  onClick={() => { setSelectedFdId(fd._id); setShowDetailsModal(true); }}
                >
                  <div className={styles.FixedDepositFundMainMeta}>
                    <div className={styles.FixedDepositFundTitleNameWrap}>
                      <h4 className={styles.FixedDepositFundTitleName}>
                        {fd.institutionName}
                      </h4>
                    </div>
                    <div className={styles.FixedDepositFundValueBlock}>
                      <span className={styles.FixedDepositCurrentPriceText}>
                        {fd.principal != null
                          ? formatCurrency(fd.principal)
                          : "—"}
                      </span>
                    </div>
                  </div>
                  <div className={styles.FixedDepositFundSecondRow}>
                    <span className={styles.FixedDepositFundDateText}>
                      <Calendar size={11} /> Maturity:{" "}
                      {formatDate(fd.maturityDate)}
                    </span>
                    <span
                      className={`${styles.FixedDepositStatusBadge} ${styles[`FixedDepositPlanStatus${planStatus}`]}`}
                    >
                      {planStatus}
                    </span>

                    <span
                      className={`${styles.FixedDepositCurrentPriceText} ${priceColorClass(fd.returnPercent)}`}
                    >
                      {fd.returnPercent != null
                        ? `${fd.returnPercent.toFixed(2)}%`
                        : "—"}
                      {fd.interestEarned != null && (
                        <span className={styles.FixedDepositGainSub}>
                          {" "}
                          ({formatCurrency(Math.abs(fd.interestEarned))})
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <p className={styles.FixedDepositDisclaimer}>
        Nidhify provides portfolio tracking and analytics for informational and
        educational purposes only. It does not constitute investment advice. All
        data and tracking insights are provided on an "as-is" basis and may be
        subject to parsing errors, third-party delays, or inaccuracies; users
        should independently verify all balances with official statements. Fixed
        deposit investments are subject to bank terms and conditions. Please
        consult a SEBI registered advisor before investing.
      </p>

      <FDAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
      />

      <FDDetails
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        fdId={selectedFdId}
        onDelete={loadData}
      />
    </div>
  );
}
