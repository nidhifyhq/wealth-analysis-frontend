import { Bell, X, Calendar, Landmark, BarChart3, Sparkles } from "lucide-react";
import styles from "./PushNotificationModal.module.css";

const PushNotificationModal = ({
  open,
  onClose,
  onSubscribe,
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className={styles.PushNotificationModal_backdrop} onClick={onClose}>
      <div
        className={styles.PushNotificationModal_sheet}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.PushNotificationModal_header}>
          <div className={styles.PushNotificationModal_bellWrap}>
            <Bell size={28} />
          </div>
          <button
            className={styles.PushNotificationModal_closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <h2 className={styles.PushNotificationModal_title}>
          Never Miss a Tracking Metric
        </h2>

        <p className={styles.PushNotificationModal_permissionLabel}>
          Stay on top of your manually tracked portfolio
        </p>

        <p className={styles.PushNotificationModal_description}>
          Enable alerts to receive daily NAV updates, upcoming manual logging
          reminders, and structural platform improvements. No spam, ever.
        </p>

        <div className={styles.PushNotificationModal_features}>
          <div className={styles.PushNotificationModal_feature}>
            <BarChart3 size={18} />
            <span>Daily NAV & Return Updates</span>
          </div>
          <div className={styles.PushNotificationModal_feature}>
            <Calendar size={18} />
            <span>Manual Log Reminders</span>
          </div>
          <div className={styles.PushNotificationModal_feature}>
            <Landmark size={18} />
            <span>FD/RD Maturity Milestones</span>
          </div>
          <div className={styles.PushNotificationModal_feature}>
            <Sparkles size={18} />
            <span>New Features Updates</span>
          </div>
        </div>

        <div className={styles.PushNotificationModal_actions}>
          <button
            className={styles.PushNotificationModal_laterBtn}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className={styles.PushNotificationModal_allowBtn}
            onClick={onSubscribe}
            disabled={loading}
          >
            {loading ? "Activating..." : "Notify Me"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PushNotificationModal;
