import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "./EPFSkeletonLoader.module.css";

export default function EPFSkeletonLoader() {
  const navigate = useNavigate();

  return (
    <div className={styles.EPFskeleton_container}>
      {/* ── Top Header Banner Shimmer (Deep Sapphire) ── */}
      <header className={styles.EPFskeleton_header}>
        <div className={styles.EPFskeleton_topRow}>
          <div className={styles.EPFskeleton_topActionLeft}>
            <button
              type="button"
              className={styles.EPFskeleton_backBtn}
              onClick={() => navigate("/dashboard")}
              aria-label="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className={styles.EPFskeleton_headerTitle}>EPF</h1>
          </div>
          <div className={styles.EPFskeleton_actionBtn} />
        </div>

        {/* Balance Shimmers */}
        <div
          className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_labelShimmer}`}
        />
        <div
          className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_balanceShimmer}`}
        />

        {/* 3-Share Breakdown Row */}
        <div className={styles.EPFskeleton_metricsRow}>
          <div className={styles.EPFskeleton_metricItem}>
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricLabel}`}
            />
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricValue}`}
            />
          </div>
          <div className={styles.EPFskeleton_metricItem}>
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricLabel}`}
            />
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricValue}`}
            />
          </div>
          <div className={styles.EPFskeleton_metricItem}>
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricLabel}`}
            />
            <div
              className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_metricValue}`}
            />
          </div>
        </div>

        {/* Member Details Placeholder */}
        <div
          className={`${styles.EPFskeleton_darkShimmer} ${styles.EPFskeleton_memberCard}`}
        />
      </header>

      {/* ── Body Content Shimmer (Recent Transactions List) ── */}
      <main className={styles.EPFskeleton_body}>
        <div className={styles.EPFskeleton_sectionHeader}>
          <div
            className={`${styles.EPFskeleton_lightShimmer} ${styles.EPFskeleton_sectionTitle}`}
          />
        </div>

        {/* 3 Placeholder Transaction Cards */}
        {[1, 2, 3].map((item) => (
          <div key={item} className={styles.EPFskeleton_transactionCard}>
            <div className={styles.EPFskeleton_transLeft}>
              <div
                className={`${styles.EPFskeleton_lightShimmer} ${styles.EPFskeleton_transIcon}`}
              />
              <div className={styles.EPFskeleton_transText}>
                <div
                  className={`${styles.EPFskeleton_lightShimmer} ${styles.EPFskeleton_transTitle}`}
                />
                <div
                  className={`${styles.EPFskeleton_lightShimmer} ${styles.EPFskeleton_transDate}`}
                />
              </div>
            </div>
            <div
              className={`${styles.EPFskeleton_lightShimmer} ${styles.EPFskeleton_transAmount}`}
            />
          </div>
        ))}
      </main>
    </div>
  );
}
