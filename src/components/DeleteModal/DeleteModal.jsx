import React from "react";
import { X, AlertTriangle } from "lucide-react";
import styles from "./DeleteModal.module.css";

export default function DeleteModal({ isOpen, onClose, onConfirm, itemName }) {
  if (!isOpen) return null;

  return (
    <div className={styles.DeleteModalOverlay} onClick={onClose}>
      <div className={styles.DeleteModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.DeleteModalHeader}>
          <div className={styles.DeleteModalIconWrap}>
            <AlertTriangle size={24} />
          </div>
          <button className={styles.DeleteModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <h2 className={styles.DeleteModalTitle}>Remove{itemName ? ` ${itemName}` : ""}?</h2>
        <p className={styles.DeleteModalDesc}>
          This action cannot be undone. This will permanently delete this record.
        </p>

        <div className={styles.DeleteModalActions}>
          <button className={styles.DeleteModalCancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.DeleteModalConfirmBtn} onClick={onConfirm}>
            Yes, Remove
          </button>
        </div>
      </div>
    </div>
  );
}
