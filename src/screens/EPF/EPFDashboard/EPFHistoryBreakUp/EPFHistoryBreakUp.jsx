import React, { useEffect } from "react";
import { Building2, X, BadgeCheck } from "lucide-react";
import { COLORS } from "../../../../designConfig/colors";
import styles from "./EPFHistoryBreakUp.module.css";

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
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

export default function EPFHistoryBreakUp({
  transaction,
  employerName,
  onClose,
}) {
  // Lock background scroll when open
  useEffect(() => {
    if (transaction) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const top = parseFloat(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    }
    return () => {
      const top = parseFloat(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    };
  }, [transaction]);

  if (!transaction) return null;

  return (
    <div className={styles.EPFHistoryBreakUp_modalOverlay} onClick={onClose}>
      <div
        className={styles.EPFHistoryBreakUp_modalSheet}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Center Drag Handle */}
        <div
          className={styles.EPFHistoryBreakUp_dragHandle}
          onClick={onClose}
          aria-label="Drag handle"
        />

        {/* Top Row: Building Icon Circle & Close Button */}
        <div className={styles.EPFHistoryBreakUp_topRow}>
          <div className={styles.EPFHistoryBreakUp_buildingCircle}>
            <Building2 size={32} strokeWidth={2} />
          </div>
          <button
            type="button"
            className={styles.EPFHistoryBreakUp_closeCircleBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Header Meta: Title, Big Green Amount with Check, Date & Company Subtitle */}
        <div className={styles.EPFHistoryBreakUp_headerMeta}>
          <p className={styles.EPFHistoryBreakUp_monthTitle}>
            {formatContributionMonth(transaction.month)}
          </p>
          <div className={styles.EPFHistoryBreakUp_amountRow}>
            <h2 className={styles.EPFHistoryBreakUp_bigAmount}>
              {formatCurrency(transaction.amount)}
            </h2>
            <BadgeCheck
              size={18}
              strokeWidth={2.5}
              className={styles.EPFHistoryBreakUp_checkIcon}
            />
          </div>
          <p className={styles.EPFHistoryBreakUp_subtitle}>
            {formatTransDate(transaction.transDate)}
            {employerName && ` | ${employerName}`}
          </p>
        </div>

        {/* Single Breakdown Card with 3 Details */}
        <div className={styles.EPFHistoryBreakUp_breakdownCard}>
          <div className={styles.EPFHistoryBreakUp_breakdownRow}>
            <span className={styles.EPFHistoryBreakUp_breakdownLabel}>
              Employee Share
            </span>
            <span className={styles.EPFHistoryBreakUp_breakdownValue}>
              {formatCurrency(transaction.ee)}
            </span>
          </div>

          <div className={styles.EPFHistoryBreakUp_breakdownRow}>
            <span className={styles.EPFHistoryBreakUp_breakdownLabel}>
              Employer Share
            </span>
            <span className={styles.EPFHistoryBreakUp_breakdownValue}>
              {formatCurrency(transaction.er)}
            </span>
          </div>

          <div className={styles.EPFHistoryBreakUp_breakdownRow}>
            <span className={styles.EPFHistoryBreakUp_breakdownLabel}>
              Pension Share
            </span>
            <span className={styles.EPFHistoryBreakUp_breakdownValue}>
              {formatCurrency(transaction.eps)}
            </span>
          </div>
        </div>

        {/* Action CTA: Close Button in Primary Color */}
        <button
          type="button"
          className={styles.EPFHistoryBreakUp_closeBtn}
          style={{
            backgroundColor: COLORS.primaryButton,
            color: COLORS.primaryButtonText,
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
