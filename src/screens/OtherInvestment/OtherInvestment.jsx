import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Eye,
  Calendar,
  Trash2,
  IndianRupee,
  Hash,
} from "lucide-react";
import { fetchOtherInvestments, deleteOtherInvestment } from "../../services/apis/portfolio.service";
import OtherInvestmentAddModal from "./OtherInvestmentAddModal/OtherInvestmentAddModal";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import styles from "./OtherInvestment.module.css";

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

export default function OtherInvestmentDashboard() {
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
    const res = await fetchOtherInvestments();
    if (res?.success) {
      setSummary(res.data.summary);
      setHoldings(res.data.items || []);
    }
    setIsLoading(false);
  };

  const s = summary;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteOtherInvestment(deleteTarget._id);
    setDeleteTarget(null);
    if (res?.success) loadData();
  };

  return (
    <div className={styles.OtherInvestmentDashboardContainer}>
      <header className={styles.OtherInvestmentDashboardHeaderBanner}>
        <div className={styles.OtherInvestmentDashboardTopActionRow}>
          <button
            className={styles.OtherInvestmentDashboardCircularBtn}
            aria-label="Go Back"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className={styles.OtherInvestmentDashboardCircularBtn}
            aria-label="Add Other Investment"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className={styles.OtherInvestmentDashboardBalanceHeader}>
          <span className={styles.OtherInvestmentDashboardBalanceTitle}>
            Other Investments
          </span>
          <button
            className={styles.OtherInvestmentDashboardToggleEye}
            onClick={() => setShowBalance(!showBalance)}
          >
            <Eye size={16} />
          </button>
        </div>

        <div className={styles.OtherInvestmentDashboardBalanceRowGroup}>
          <h2 className={styles.OtherInvestmentDashboardPrimaryAmount}>
            {isLoading
              ? "••••••"
              : showBalance
                ? formatCurrency(s?.totalInvested)
                : "••••••"}
          </h2>
        </div>

        {/* <div className={styles.OtherInvestmentDashboardMetricsRow}>
          <div className={styles.OtherInvestmentDashboardMetricItem}>
            <span className={styles.OtherInvestmentDashboardMetricLabel}>Invested</span>
            <span className={styles.OtherInvestmentDashboardMetricValue}>
              {isLoading
                ? "••••"
                : showBalance
                  ? formatCurrency(s?.totalInvested)
                  : "••••"}
            </span>
          </div>
          <div className={styles.OtherInvestmentDashboardMetricItem}>
            <span className={styles.OtherInvestmentDashboardMetricLabel}>
              Current Value
            </span>
            <span className={styles.OtherInvestmentDashboardMetricValue}>
              {isLoading
                ? "••••"
                : showBalance
                  ? formatCurrency(s?.totalCurrentValue)
                  : "••••"}
            </span>
          </div>
        </div> */}
      </header>

      <section className={styles.OtherInvestmentDashboardFundsSection}>
        <div className={styles.OtherInvestmentDashboardSectionHeadingRow}>
          <h3 className={styles.OtherInvestmentDashboardSectionHeading}>
            Other Investments ({holdings.length})
          </h3>
        </div>

        <div className={styles.OtherInvestmentDashboardFundsListStack}>
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
                className={styles.OtherInvestmentDashboardTrackBtn}
                onClick={() => setShowAddModal(true)}
              >
                + Track Other Investment
              </button>
            </div>
          ) : (
            holdings.map((g, idx) => (
              <div key={idx} className={styles.OtherInvestmentDashboardFundListItem}>
                <div className={styles.OtherInvestmentDashboardFundMainMeta}>
                  <div className={styles.OtherInvestmentDashboardFundTitleNameWrap}>
                    <h4 className={styles.OtherInvestmentDashboardFundTitleName}>
                      {g.investmentName}
                    </h4>
                    <div className={styles.OtherInvestmentDashboardFundChipRow}>
                      {g.pricePerUnit != null && (
                        <span className={styles.OtherInvestmentDashboardChip}>
                          <IndianRupee size={11} /> {formatCurrency(g.pricePerUnit)}/unit
                        </span>
                      )}
                      {g.numberOfUnits != null && (
                        <span className={styles.OtherInvestmentDashboardChip}>
                          <Hash size={11} /> {g.numberOfUnits} units
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.OtherInvestmentDashboardFundValueBlock}>
                    <span className={styles.OtherInvestmentDashboardCurrentPriceText}>
                      {g.investedAmount != null
                        ? formatCurrency(g.investedAmount)
                        : "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.OtherInvestmentDashboardFundSecondRow}>
                  <span className={styles.OtherInvestmentDashboardFundDateText}>
                    <Calendar size={11} /> Invested:{" "}
                    {formatDate(g.dateOfInvestment)}
                  </span>
                  <button
                    className={styles.OtherInvestmentDashboardDeleteBtn}
                    aria-label={`Delete ${g.investmentName}`}
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

      <p className={styles.OtherInvestmentDashboardDisclaimer}>
        Nidhify provides portfolio tracking and analytics for informational and
        educational purposes only. It does not constitute investment advice. All
        data and tracking insights are provided on an "as-is" basis and may be
        subject to parsing errors, third-party delays, or inaccuracies; users
        should independently verify all balances with official statements. Other
        investments are subject to market risks. Please consult a SEBI registered
        advisor before investing.
      </p>

      <OtherInvestmentAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadData}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.investmentName}
      />
    </div>
  );
}
