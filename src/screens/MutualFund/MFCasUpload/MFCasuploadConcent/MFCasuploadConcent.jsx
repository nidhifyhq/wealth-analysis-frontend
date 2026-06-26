import React from 'react';
import styles from './MFCasuploadConcent.module.css';

export default function MFCasuploadConcent({ onClose, onConsent }) {
  return (
    <div className={styles.MFCasuploadConcentOverlay} onClick={onClose}>
      <div className={styles.MFCasuploadConcentSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.MFCasuploadConcentHandle} />

        <h2 className={styles.MFCasuploadConcentTitle}>
          Security & Data Processing Consent
        </h2>

        <p className={styles.MFCasuploadConcentText} style={{ marginBottom: 16 }}>
          Before uploading your statement, please read and confirm how Nidhify handles your sensitive data:
        </p>

        <div className={styles.MFCasuploadConcentSection}>
          <h3 className={styles.MFCasuploadConcentSectionTitle}>
            1. Zero-Storage Password Policy
          </h3>
          <p className={styles.MFCasuploadConcentText}>
            Your CAS PDF password is encrypted and used one time only by our automated parser to decrypt and read your investment details. Nidhify never stores your password on our servers, and we cannot access it after processing.
          </p>
        </div>

        <div className={styles.MFCasuploadConcentSection}>
          <h3 className={styles.MFCasuploadConcentSectionTitle}>
            2. Privacy & Data Integrity
          </h3>
          <p className={styles.MFCasuploadConcentText}>
            Your transaction data belongs entirely to you. All parsed information is stored securely to build your dashboard analytics. We do not sell, share, or expose your personal financial data to any third-party marketing or lending services.
          </p>
        </div>

        <div className={styles.MFCasuploadConcentSection}>
          <h3 className={styles.MFCasuploadConcentSectionTitle}>
            3. Tracking Estimate & Independent Verification
          </h3>
          <p className={styles.MFCasuploadConcentText}>
            Because mutual fund data formats change and sync delays can occur, the data parsed from your CAS PDF is provided on an "as-is" basis for informational and tracking purposes. It does not constitute official financial advice or records. Always cross-verify critical valuation numbers with your official fund houses before making investment decisions.
          </p>
        </div>

         <p className={styles.MFCasuploadConcentText}>
            I authorize Nidhify to process this statement and understand the data shown is for tracking purposes only.
          </p>

        <div className={styles.MFCasuploadConcentActions}>
          <button
            type="button"
            className={styles.MFCasuploadConcentCancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.MFCasuploadConcentConsentBtn}
            onClick={onConsent}
          >
            I Consent
          </button>
        </div>
      </div>
    </div>
  );
}
