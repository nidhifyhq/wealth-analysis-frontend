import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  Calendar,
  Trash2,
  Building2,
  Percent,
  CalendarDays,
} from "lucide-react";
import { fetchRDList, deleteRD } from "../../services/apis/portfolio.service";
import RDAddModal from "./RDAddModal/RDAddModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import styles from "./RecurringDeposit.module.css";

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0.00";
  return `₹${Number(value).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

export default function RecurringDeposit() {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await fetchRDList();
    if (res?.success) {
      setSummary(res.data.summary);
      setHoldings(res.data.items || []);
    }
    setIsLoading(false);
  };

  const s = summary;

  const returnColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.RecurringDepositNegativeReturn
      : styles.RecurringDepositMetricValue;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteRD(deleteTarget._id);
    setDeleteTarget(null);
    if (res?.success) loadData();
  };

  return (
    <div className={styles.RecurringDepositContainer}>
      <header className={styles.RecurringDepositHeaderBanner}>
        <div className={styles.RecurringDepositTopActionRow}>
          <button
            className={styles.RecurringDepositCircularBtn}
            aria-label="Go Back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className={styles.RecurringDepositCircularBtn}
            aria-label="Add RD"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.RecurringDepositMainBalanceArea}>
          <div className={styles.RecurringDepositBalanceHeader}>
            <span className={styles.RecurringDepositBalanceTitle}>
              Recurring Deposits
            </span>
            <button
              className={styles.RecurringDepositToggleEye}
              onClick={() => setShowBalance(!showBalance)}
            >
              <Eye size={16} />
            </button>
          </div>

          <div className={styles.RecurringDepositBalanceRowGroup}>
            <h2 className={styles.RecurringDepositPrimaryAmount}>
              {isLoading
                ? "••••••"
                : showBalance
                  ? formatCurrency(s?.totalCurrentValue)
                  : "••••••"}
            </h2>
          </div>

          <div className={styles.RecurringDepositMetricsRow}>
            <div className={styles.RecurringDepositMetricItem}>
              <span className={styles.RecurringDepositMetricLabel}>Deposited</span>
              <span className={styles.RecurringDepositMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalDeposited)
                    : "••••"}
              </span>
            </div>
            <div className={styles.RecurringDepositMetricItem}>
              <span className={styles.RecurringDepositMetricLabel}>Current Value</span>
              <span className={styles.RecurringDepositMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalCurrentValue)
                    : "••••"}
              </span>
            </div>
            <div className={styles.RecurringDepositMetricItem}>
              <span className={styles.RecurringDepositMetricLabel}>Returns</span>
              <span
                className={`${styles.RecurringDepositMetricValue} ${returnColorClass(s?.totalReturnPercent)}`}
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

      <div
  style={{
    height: '10px',
    backgroundColor: '#fff',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    marginTop: '-10px'
  }}
/>

      <section className={styles.RecurringDepositFundsSection}>
        <div className={styles.RecurringDepositSectionHeadingRow}>
          <h3 className={styles.RecurringDepositSectionHeading}>
            RD Accounts ({holdings.length})
          </h3>
        </div>

        <div className={styles.RecurringDepositFundsListStack}>
          {isLoading ? (
            <p className={styles.RecurringDepositLoadingText}>Loading...</p>
          ) : holdings.length === 0 ? (
            <div className={styles.RecurringDepositEmptyState}>
              <button
                className={styles.RecurringDepositTrackBtn}
                onClick={() => setShowAddModal(true)}
              >
                + Track RD Investment
              </button>
            </div>
          ) : (
            holdings.map((rd, idx) => (
              <div key={idx} className={styles.RecurringDepositFundListItem}>
                <div className={styles.RecurringDepositFundMainMeta}>
                  <div className={styles.RecurringDepositFundTitleNameWrap}>
                    <h4 className={styles.RecurringDepositFundTitleName}>
                      {rd.institutionName}
                    </h4>
                    <div className={styles.RecurringDepositFundChipRow}>
                      <span className={styles.RecurringDepositChip}>
                        <Building2 size={11} /> ₹{rd.monthlyDeposit?.toLocaleString("en-IN")}/mo
                      </span>
                      <span className={styles.RecurringDepositChip}>
                        <Percent size={11} /> {rd.interestRate}%
                      </span>
                      <span className={styles.RecurringDepositChip}>
                        <CalendarDays size={11} /> Day {rd.depositDayOfMonth}
                      </span>
                    </div>
                  </div>
                  <div className={styles.RecurringDepositFundValueBlock}>
                    <span className={styles.RecurringDepositCurrentPriceText}>
                      {rd.currentValue != null
                        ? formatCurrency(rd.currentValue)
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.RecurringDepositFundSecondRow}>
                  <span className={styles.RecurringDepositFundDateText}>
                    <Calendar size={11} /> {formatDate(rd.startDate)} – {formatDate(rd.maturityDate)}
                  </span>
                  <button
                    className={styles.RecurringDepositDeleteBtn}
                    aria-label={`Delete ${rd.institutionName}`}
                    onClick={() => setDeleteTarget(rd)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <p className={styles.RecurringDepositDisclaimer}>
        Nidhify provides portfolio tracking and analytics for informational and
        educational purposes only. It does not constitute investment advice. All
        data and tracking insights are provided on an "as-is" basis and may be
        subject to parsing errors, third-party delays, or inaccuracies; users
        should independently verify all balances with official statements.
        Recurring deposits are subject to market risks. Please consult a SEBI
        registered advisor before investing.
      </p>

      <RDAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.institutionName}
      />
    </div>
  );
}
