import React, { useState } from "react";
import { RefreshCw, Check, X } from "lucide-react";
import styles from "./ExternalFundsSyncedSuccess.module.css";

const ExternalFundsSyncedSuccess = ({
  portfolioValue = 0,
  mutualFundsCount = 0,
  onViewAnalytics,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (value) => {
    if (!value || isNaN(value)) return "0";
    return `${Math.round(parseFloat(value)).toLocaleString("en-IN")}`;
  };

  const handleViewAnalytics = async () => {
 onClose();
  };

  return (
    <div className={styles.ExternalFundsSyncedSuccess_container}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className={styles.ExternalFundsSyncedSuccess_illustration}>
          <div className={styles.ExternalFundsSyncedSuccess_syncIconCircle}>
            <RefreshCw size={36} color="#1976D2" strokeWidth={2.5} />
          </div>
          <div className={styles.ExternalFundsSyncedSuccess_syncBadge}>
            <Check size={16} color="white" strokeWidth={3} />
          </div>
        </div>

        <button
          className={styles.ExternalFundsSyncedSuccess_closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} color="#64748b" />
        </button>
      </div>

      <p className={styles.ExternalFundsSyncedSuccess_statusLabel}>
        YOUR CAS FUNDS ARE SYNCED
      </p>

      <h2 className={styles.ExternalFundsSyncedSuccess_title}>
        Successfully Tracked!
      </h2>

      <div className={styles.ExternalFundsSyncedSuccess_statList}>
        <div className={styles.ExternalFundsSyncedSuccess_statRow}>
          <div className={styles.ExternalFundsSyncedSuccess_statIcon}>
            <Check size={10} color="white" strokeWidth={3} />
          </div>
          <span className={styles.ExternalFundsSyncedSuccess_statText}>
            Portfolio Value{" "}
            <span className={styles.ExternalFundsSyncedSuccess_statValue}>
              ₹{formatCurrency(portfolioValue)}
            </span>
          </span>
        </div>

        <div className={styles.ExternalFundsSyncedSuccess_statRow}>
          <div className={styles.ExternalFundsSyncedSuccess_statIcon}>
            <Check size={10} color="white" strokeWidth={3} />
          </div>
          <span className={styles.ExternalFundsSyncedSuccess_statText}>
            <span className={styles.ExternalFundsSyncedSuccess_statValue}>
              {mutualFundsCount}
            </span>{" "}
            Mutual Funds
          </span>
        </div>
      </div>

      <button
        className={styles.ExternalFundsSyncedSuccess_ctaButton}
        onClick={handleViewAnalytics}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className={styles.ExternalFundsSyncedSuccess_spinner} />
        ) : (
          "Close"
        )}
      </button>
    </div>
  );
};

export default ExternalFundsSyncedSuccess;
