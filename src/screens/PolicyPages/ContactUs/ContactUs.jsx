import React from 'react';
import { X, Mail, ShieldCheck, HelpCircle, Clock, AlertTriangle } from 'lucide-react';
import styles from './ContactUs.module.css';

export default function ContactUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.ContactUsModalOverlay} onClick={onClose}>
      <div className={styles.ContactUsModalSheet} onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <header className={styles.ContactUsModalHeader}>
          <h2 className={styles.ContactUsModalTitle}>Contact Us</h2>
          <button type="button" className={styles.ContactUsModalCloseIconBtn} onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className={styles.ContactUsModalScrollBody}>
          <p className={styles.ContactUsModalHeroText}>
            Have a question about your portfolio dashboard, a feature suggestion, or need help with your CAS PDF import? We are here to help you out. At Nidhify, we prioritize your data privacy and security.
          </p>

          {/* Email Support Section */}
          <div className={styles.ContactUsModalCard}>
            <div className={styles.ContactUsModalCardHeader}>
              <div className={styles.ContactUsModalIconFrame}><Mail size={18} /></div>
              <h3 className={styles.ContactUsModalCardTitle}>Email Support</h3>
            </div>
            <p className={styles.ContactUsModalCardDesc}>For account support, technical issues, or general inquiries, drop us a line at our official helpdesk:</p>
            <div className={styles.ContactUsModalEmailHighlight}>
              <span className={styles.ContactUsModalEmailLabel}>Email:</span>
              <a href="mailto:nidhifyhq@gmail.com" className={styles.ContactUsModalEmailLink}>nidhifyhq@gmail.com</a>
            </div>
            <div className={styles.ContactUsModalResponseTime}>
              <Clock size={13} />
              <span><strong>Expected Response Time:</strong> We do our best to review all inquiries and respond within 24 to 48 hours (Monday to Friday).</span>
            </div>
          </div>

          {/* Security Notice Section */}
          <div className={`${styles.ContactUsModalCard} ${styles.ContactUsModalSecurityCard}`}>
            <div className={styles.ContactUsModalCardHeader}>
              <div className={`${styles.ContactUsModalIconFrame} ${styles.ContactUsModalSecurityIconFrame}`}><ShieldCheck size={18} /></div>
              <h3 className={`${styles.ContactUsModalCardTitle} ${styles.ContactUsModalSecurityTitle}`}>Important Security Notice</h3>
            </div>
            <p className={styles.ContactUsModalCardDesc}>To protect your personal wealth data, please keep the following security practices in mind when reaching out to support:</p>
            <ul className={styles.ContactUsModalBulletList}>
              <li className={styles.ContactUsModalListItem}>
                <AlertTriangle size={13} className={styles.ContactUsModalWarningIcon} />
                <span><strong>Never share your login passwords:</strong> Nidhify support team members will never ask you for your account password or your CAS PDF password.</span>
              </li>
              <li className={styles.ContactUsModalListItem}>
                <AlertTriangle size={13} className={styles.ContactUsModalWarningIcon} />
                <span><strong>Do not attach raw financial files:</strong> If you are experiencing a parsing bug with your CAS statement, please do not email us the raw, password-protected PDF. Instead, describe the error message or send a screenshot with your sensitive personal details blacked out.</span>
              </li>
            </ul>
          </div>

          {/* Troubleshooting Section */}
          <div className={styles.ContactUsModalCard}>
            <div className={styles.ContactUsModalCardHeader}>
              <div className={`${styles.ContactUsModalIconFrame} ${styles.ContactUsModalTroubleIconFrame}`}><HelpCircle size={18} /></div>
              <h3 className={styles.ContactUsModalCardTitle}>Quick Troubleshooting</h3>
            </div>
            <div className={styles.ContactUsModalTroubleItem}>
              <h4 className={styles.ContactUsModalTroubleHeading}>CAS Upload Errors:</h4>
              <p className={styles.ContactUsModalTroubleText}>Ensure you are entering the exact password you created on the CAMS portal when downloading the statement.</p>
            </div>
            <div className={styles.ContactUsModalTroubleItem}>
              <h4 className={styles.ContactUsModalTroubleHeading}>Data Lag:</h4>
              <p className={styles.ContactUsModalTroubleText}>Remember that third-party mutual fund data and bank updates can experience slight sync delays. Try refreshing after a short while.</p>
            </div>
          </div>
        </div>

        {/* Sticky Bottom Action */}
        <footer className={styles.ContactUsModalFooter}>
          <button type="button" className={styles.ContactUsModalCloseActionBtn} onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}