import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  Calendar,
  Trash2,
  Weight,
  Gem,
} from "lucide-react";
import { fetchGoldList, deleteGold } from "../../../services/apis/portfolio.service";
import GoldAddModal from "../GoldAddModal/GoldAddModal";
import DeleteModal from "../../../components/DeleteModal/DeleteModal";
import styles from "./GoldDashboard.module.css";

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

export default function GoldDashboard() {
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
    const res = await fetchGoldList();
    if (res?.success) {
      setSummary(res.data.summary);
      setHoldings(res.data.items || []);
    }
    setIsLoading(false);
  };

  const s = summary;

  const returnColorClass = (returnVal) =>
    returnVal != null && returnVal < 0
      ? styles.GoldDashboardNegativeReturn
      : styles.GoldDashboardMetricValue;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteGold(deleteTarget._id);
    setDeleteTarget(null);
    if (res?.success) loadData();
  };

  return (
    <div className={styles.GoldDashboardContainer}>
      <header className={styles.GoldDashboardHeaderBanner}>
        <div className={styles.GoldDashboardTopActionRow}>
          <button
            className={styles.GoldDashboardCircularBtn}
            aria-label="Go Back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className={styles.GoldDashboardCircularBtn}
            aria-label="Add Gold Investment"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.GoldDashboardMainBalanceArea}>
          <div className={styles.GoldDashboardBalanceHeader}>
            <span className={styles.GoldDashboardBalanceTitle}>
              Gold Portfolio
            </span>
            <button
              className={styles.GoldDashboardToggleEye}
              onClick={() => setShowBalance(!showBalance)}
            >
              <Eye size={16} />
            </button>
          </div>

          <div className={styles.GoldDashboardBalanceRowGroup}>
            <h2 className={styles.GoldDashboardPrimaryAmount}>
              {isLoading
                ? "••••••"
                : showBalance
                  ? formatCurrency(s?.totalCurrentValue)
                  : "••••••"}
            </h2>
          </div>

          <div className={styles.GoldDashboardMetricsRow}>
            <div className={styles.GoldDashboardMetricItem}>
              <span className={styles.GoldDashboardMetricLabel}>Invested</span>
              <span className={styles.GoldDashboardMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalInvested)
                    : "••••"}
              </span>
            </div>
            <div className={styles.GoldDashboardMetricItem}>
              <span className={styles.GoldDashboardMetricLabel}>
                Current Value
              </span>
              <span className={styles.GoldDashboardMetricValue}>
                {isLoading
                  ? "••••"
                  : showBalance
                    ? formatCurrency(s?.totalCurrentValue)
                    : "••••"}
              </span>
            </div>
            <div className={styles.GoldDashboardMetricItem}>
              <span className={styles.GoldDashboardMetricLabel}>Returns</span>
              <span
                className={`${styles.GoldDashboardMetricValue} ${returnColorClass(s?.totalReturnPercent)}`}
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

      <section className={styles.GoldDashboardFundsSection}>
        <div className={styles.GoldDashboardSectionHeadingRow}>
          <h3 className={styles.GoldDashboardSectionHeading}>
            Gold Holdings ({holdings.length})
          </h3>
        </div>

        <div className={styles.GoldDashboardFundsListStack}>
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
              <button
                className={styles.GoldDashboardTrackBtn}
                onClick={() => setShowAddModal(true)}
              >
                + Track Gold Investment
              </button>
            </div>
          ) : (
            holdings.map((g, idx) => (
              <div key={idx} className={styles.GoldDashboardFundListItem}>
                <div className={styles.GoldDashboardFundMainMeta}>
                  <div className={styles.GoldDashboardFundTitleNameWrap}>
                    <h4 className={styles.GoldDashboardFundTitleName}>
                      {g.assetName}
                    </h4>
                    <div className={styles.GoldDashboardFundChipRow}>
                      {g.weightGrams != null && (
                        <span className={styles.GoldDashboardChip}>
                          <Weight size={11} /> {g.weightGrams.toFixed(1)} g
                        </span>
                      )}
                      {g.carat && (
                        <span className={styles.GoldDashboardChip}>
                          <Gem size={11} /> {g.carat}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.GoldDashboardFundValueBlock}>
                    <span className={styles.GoldDashboardCurrentPriceText}>
                      {g.investedAmount != null
                        ? formatCurrency(g.investedAmount)
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.GoldDashboardFundSecondRow}>
                  <span className={styles.GoldDashboardFundDateText}>
                    <Calendar size={11} /> Invested:{" "}
                    {formatDate(g.dateOfInvestment)}
                  </span>
                  <button
                    className={styles.GoldDashboardDeleteBtn}
                    aria-label={`Delete ${g.assetName}`}
                    onClick={() => setDeleteTarget(g)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <p className={styles.GoldDashboardDisclaimer}>
        Nidhify provides portfolio tracking and analytics for informational and
        educational purposes only. It does not constitute investment advice. All
        data and tracking insights are provided on an "as-is" basis and may be
        subject to parsing errors, third-party delays, or inaccuracies; users
        should independently verify all balances with official statements. Gold
        investments are subject to market risks. Please consult a SEBI registered
        advisor before investing.
      </p>

      <GoldAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.assetName}
      />
    </div>
  );
}
