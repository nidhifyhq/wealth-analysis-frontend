import React from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./NotificationCenter.module.css";

export default function NotificationCenter() {
  const navigate = useNavigate();

  return (
    <div className={styles.NotificationCenteContainer}>
      <header className={styles.NotificationCenteHeader}>
        <button
          className={styles.NotificationCenteBackBtn}
          onClick={() => navigate("/dashboard")}
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.NotificationCenteTitle}>Notifications</h1>
      </header>

      <div className={styles.NotificationCenteBody}>
        <div className={styles.NotificationCenteEmptyState}>
          <div className={styles.NotificationCenteIconWrap}>
            <Bell size={40} />
          </div>
          <h2 className={styles.NotificationCenteEmptyTitle}>
            No Notifications Yet
          </h2>
          <p className={styles.NotificationCenteEmptyDesc}>
            You're all caught up! We'll notify you here when something needs
            your attention.
          </p>
        </div>
      </div>
    </div>
  );
}
