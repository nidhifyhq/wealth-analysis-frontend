import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Copy, Check, Trash2, AlertTriangle } from "lucide-react";
import { FcRules } from "react-icons/fc";
import toast from "react-hot-toast";
import { deleteAllEpfData } from "../../../../services/apis/epf.service";
import { COLORS } from "../../../../designConfig/colors";
import styles from "./EPFAccontDtls.module.css";

export default function EPFAccontDtls({
  isOpen,
  onClose,
  memberName,
  uan,
  memberId,
  onDeleteSuccess,
}) {
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedField(fieldName);
          setTimeout(() => {
            setCopiedField((curr) => (curr === fieldName ? null : curr));
          }, 2000);
        })
        .catch(() => fallbackCopy(text, fieldName));
    } else {
      fallbackCopy(text, fieldName);
    }
  };

  const fallbackCopy = (text, fieldName) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField((curr) => (curr === fieldName ? null : curr));
      }, 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteAllEpfData();
      if (res?.success) {
        toast.success(res.message || "All EPF accounts deleted successfully");
        setShowConfirm(false);
        if (onClose) onClose();
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          navigate("/epf", { replace: true });
        }
      } else {
        toast.error(res?.message || "Failed to delete EPF data");
      }
    } catch (err) {
      toast.error("Failed to delete EPF data");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.EPFAccontDtls_modalOverlay} onClick={onClose}>
      <div
        className={styles.EPFAccontDtls_modalSheet}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Center Drag Handle */}
        <div
          className={styles.EPFAccontDtls_dragHandle}
          onClick={onClose}
          aria-label="Drag handle"
        />

        {/* Modal Header */}
        <div className={styles.EPFAccontDtls_header}>
          <div className={styles.EPFAccontDtls_titleGroup}>
            <div className={styles.EPFAccontDtls_iconCircle}>
              <FcRules size={18} />
            </div>
            <h3 className={styles.EPFAccontDtls_title}>EPF Account Details</h3>
          </div>
          <button
            type="button"
            className={styles.EPFAccontDtls_closeCircleBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Single Unified Gray Box with all 3 items */}
        <div className={styles.EPFAccontDtls_detailsCard}>
          {/* 1. Account Holder's Name */}
          <div className={styles.EPFAccontDtls_itemSection}>
            <div className={styles.EPFAccontDtls_itemHeader}>
              <span className={styles.EPFAccontDtls_itemLabel}>
                Account holder's name
              </span>
            </div>
            <p className={styles.EPFAccontDtls_itemValue}>
              {memberName || "Not Available"}
            </p>
          </div>

          <div className={styles.EPFAccontDtls_itemDivider} />

          {/* 2. UAN with Copy Icon */}
          <div className={styles.EPFAccontDtls_itemSection}>
            <div className={styles.EPFAccontDtls_itemHeader}>
              <span className={styles.EPFAccontDtls_itemLabel}>UAN</span>
              {uan && (
                <button
                  type="button"
                  className={styles.EPFAccontDtls_copyBtn}
                  onClick={() => handleCopy(uan, "uan")}
                  aria-label="Copy UAN"
                >
                  {copiedField === "uan" ? (
                    <span className={styles.EPFAccontDtls_copiedText}>
                      <Check size={13} strokeWidth={2.5} className={styles.EPFAccontDtls_checkIcon} />
                      Copied
                    </span>
                  ) : (
                    <Copy size={14} strokeWidth={2} />
                  )}
                </button>
              )}
            </div>
            <p className={styles.EPFAccontDtls_itemValue}>
              {uan || "Not Available"}
            </p>
          </div>

          <div className={styles.EPFAccontDtls_itemDivider} />

          {/* 3. Member ID with Copy Icon */}
          <div className={styles.EPFAccontDtls_itemSection}>
            <div className={styles.EPFAccontDtls_itemHeader}>
              <span className={styles.EPFAccontDtls_itemLabel}>Member ID</span>
              {memberId && (
                <button
                  type="button"
                  className={styles.EPFAccontDtls_copyBtn}
                  onClick={() => handleCopy(memberId, "memberId")}
                  aria-label="Copy Member ID"
                >
                  {copiedField === "memberId" ? (
                    <span className={styles.EPFAccontDtls_copiedText}>
                      <Check size={13} strokeWidth={2.5} className={styles.EPFAccontDtls_checkIcon} />
                      Copied
                    </span>
                  ) : (
                    <Copy size={14} strokeWidth={2} />
                  )}
                </button>
              )}
            </div>
            <p className={styles.EPFAccontDtls_itemValue}>
              {memberId || "Not Available"}
            </p>
          </div>
        </div>

        {/* New Card: Stop Tracking and delete data */}
        {showConfirm ? (
          <div className={styles.EPFAccontDtls_deleteConfirmCard}>
            <div className={styles.EPFAccontDtls_deleteConfirmHeader}>
              <AlertTriangle size={18} className={styles.EPFAccontDtls_warningIcon} />
              <p className={styles.EPFAccontDtls_deleteConfirmTitle}>
                Stop tracking EPF?
              </p>
            </div>
            <p className={styles.EPFAccontDtls_deleteConfirmSubtitle}>
              All EPF accounts and data will be permanently deleted.
            </p>
            <div className={styles.EPFAccontDtls_deleteConfirmActions}>
              <button
                type="button"
                className={styles.EPFAccontDtls_cancelDeleteBtn}
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.EPFAccontDtls_confirmDeleteBtn}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </div>
        ) : (
          <div
            className={styles.EPFAccontDtls_deleteCard}
            onClick={() => setShowConfirm(true)}
            role="button"
            tabIndex={0}
          >
            <Trash2 size={17} className={styles.EPFAccontDtls_deleteIcon} />
            <span className={styles.EPFAccontDtls_deleteText}>
              Stop Tracking and delete data
            </span>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          className={styles.EPFAccontDtls_closeBtn}
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
