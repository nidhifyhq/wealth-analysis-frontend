import React from 'react';
import styles from './RegisterConcentModal.module.css';

export default function RegisterConcentModal({ onClose, onConsent }) {
  return (
    <div className={styles.RegisterConcentModalOverlay} onClick={onClose}>
      <div className={styles.RegisterConcentModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.RegisterConcentModalHandle} />

        <h2 className={styles.RegisterConcentModalTitle}>
          Terms of Service & Data Consent
        </h2>

        <p className={styles.RegisterConcentModalText} style={{ marginBottom: 16 }}>
          By creating your account on Nidhify, you understand and agree to the following:
        </p>

        <div className={styles.RegisterConcentModalSection}>
          <h3 className={styles.RegisterConcentModalSectionTitle}>
            1. Data Accuracy Disclaimer
          </h3>
          <p className={styles.RegisterConcentModalText}>
            While we process your Mutual Fund data from your uploaded CAS PDF and display your manual FD entries, we cannot guarantee 100% accuracy or real-time updates.
          </p>
          <p className={styles.RegisterConcentModalText} style={{ marginTop: 8 }}>
            Systems can experience sync delays, data feed errors, or formatting mismatches.
          </p>
          <p className={styles.RegisterConcentModalText} style={{ marginTop: 8 }}>
            You agree that the data shown is an estimate for tracking purposes. Always cross-verify your portfolio details directly with your official fund houses or bank portals before making any financial decisions.
          </p>
        </div>

        <div className={styles.RegisterConcentModalSection}>
          <h3 className={styles.RegisterConcentModalSectionTitle}>
            2. No Financial Advice
          </h3>
          <p className={styles.RegisterConcentModalText}>
            Nidhify is strictly a portfolio tracking and informational platform. Nidhify does not provide professional investment, legal, or tax advice, and does not hold any financial advisory certifications or licenses. All tools and insights are automated and meant for tracking purposes only. You are fully responsible for your own financial decisions.
          </p>
        </div>

        <div className={styles.RegisterConcentModalSection}>
          <h3 className={styles.RegisterConcentModalSectionTitle}>
            3. Secure CAS PDF Processing
          </h3>
          <p className={styles.RegisterConcentModalText}>
            To track your mutual funds, you may choose to upload your password-protected CAS PDF.
          </p>
          <p className={styles.RegisterConcentModalText} style={{ marginTop: 8 }}>
            <strong>Privacy:</strong> Your password and file are used solely to decrypt and parse your statement into your dashboard. We do not share your personal financial transactions with third parties.
          </p>
          <p className={styles.RegisterConcentModalText} style={{ marginTop: 8 }}>
            <strong>Manual Control:</strong> You are always free to skip the PDF upload and track your FDs and other wealth products by entering the details manually.
          </p>
        </div>

        <div className={styles.RegisterConcentModalActions}>
          <button
            type="button"
            className={styles.RegisterConcentModalCancelBtn}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.RegisterConcentModalConsentBtn}
            onClick={onConsent}
          >
            I Consent
          </button>
        </div>
      </div>
    </div>
  );
}
