import React from 'react';
import { X } from 'lucide-react';
import styles from './Terms.module.css';

export default function Terms({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.TermsPageModalOverlay} onClick={onClose}>
      <div 
        className={styles.TermsPageModalSheet} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header Section */}
        <header className={styles.TermsPageModalHeader}>
          <h2 className={styles.TermsPageModalTitle}>Terms of Service</h2>
          <button 
            type="button" 
            className={styles.TermsPageCloseIconBtn} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Document Content Box */}
        <div className={styles.TermsPageModalScrollBody}>
          <p className={styles.TermsPageMetaDate}>Last Updated: June 2026</p>
          
          <p className={styles.TermsPageParagraph}>
            Welcome to Nidhify.com (the "Website" or "Platform"). By accessing, browsing, or using this Platform, creating an account, or uploading any data, you agree to comply with and be bound by the following Terms of Service. If you do not agree to these terms, please discontinue use of the platform immediately.
          </p>

          <h3 className={styles.TermsPageSectionHeading}>1. Scope of Service & Nature of Platform</h3>
          <p className={styles.TermsPageParagraph}>
            Nidhify is strictly an automated portfolio tracking, aggregation, and analytics platform.
          </p>
          <ul className={styles.TermsPageBulletList}>
            <li className={styles.TermsPageListItem}>
              <strong>Tracking Utility Only:</strong> The platform allows users to aggregate their investments by uploading password-protected Consolidated Account Statements (CAS) PDFs or by manually entering tracking details for Fixed Deposits (FDs), Stocks, Digital Gold, Insurance, and other wealth assets.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>No Transacting Capabilities:</strong> Nidhify is purely an informational interface. You cannot buy, sell, trade, or execute financial transactions through Nidhify.
            </li>
          </ul>

          <h3 className={styles.TermsPageSectionHeading}>2. Absolute Data Accuracy Disclaimer (No Liability for System Errors)</h3>
          <p className={styles.TermsPageParagraph}>
            Nidhify processes financial statements and manual user entries using automated algorithms to display dashboard metrics.
          </p>
          <ul className={styles.TermsPageBulletList}>
            <li className={styles.TermsPageListItem}>
              <strong>Data May Contain Errors:</strong> You explicitly acknowledge and agree that the data, valuations, current NAVs, calculations, and analytics shown on Nidhify can be wrong, delayed, incomplete, or corrupted. System sync delays, third-party data feed errors, API lags, or PDF parsing formatting mismatches can cause discrepancies.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>Independent Verification Required:</strong> All data displayed on Nidhify is provided on an "As-Is" and "As-Available" basis for approximate tracking purposes only. You must cross-verify all balances, units, values, and maturity amounts directly with your Asset Management Companies (AMCs), banks, insurance providers, or official portals.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>No Financial Liability:</strong> Nidhify, its owner(s), and affiliates assume absolute zero legal or financial liability (Nidhify jimedaar nahi hai) for any actions taken or decisions made based on the analytics or data shown on this website.
            </li>
          </ul>

          <h3 className={styles.TermsPageSectionHeading}>3. Absolute No Financial Advice Disclaimer</h3>
          <ul className={styles.TermsPageBulletList}>
            <li className={styles.TermsPageListItem}>
              <strong>Non-Certified Entity:</strong> Nidhify does not hold any financial degrees, advisory certifications, licenses, or SEBI (Securities and Exchange Board of India) registrations.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>Not Investment Advice:</strong> No chart, analytical report, blog post, text, or tool on Nidhify constitutes professional investment, legal, financial, tax, or medical insurance advice.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>User Responsibility:</strong> All investment strategies, asset selections, and asset allocations are entirely your own risk and responsibility. We strongly recommend consulting a SEBI-registered financial advisor before making any financial commitments.
            </li>
          </ul>

          <h3 className={styles.TermsPageSectionHeading}>4. CAS Statement PDF & Password Processing</h3>
          <p className={styles.TermsPageParagraph}>
            To use the automated Mutual Fund tracking feature, you may choose to upload your official CAS PDF statement and enter its corresponding password.
          </p>
          <ul className={styles.TermsPageBulletList}>
            <li className={styles.TermsPageListItem}>
              <strong>Decryption Authorization:</strong> By uploading your statement and entering the password, you grant Nidhify explicit automated permission to decrypt, scan, and parse the file to populate your dashboard.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>Password Policy:</strong> Nidhify uses an automated script to read the file one time. We do not store your raw file or your CAS password on our servers.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>Voluntary Feature:</strong> Uploading your CAS PDF is completely voluntary. If you do not wish to use this automated feature, you may opt to input your investments manually.
            </li>
          </ul>

          <h3 className={styles.TermsPageSectionHeading}>5. Third-Party Portals and External Links</h3>
          <p className={styles.TermsPageParagraph}>
            The tracking setup may point you toward third-party official platforms (such as CAMS Online) to generate and download your statements.
          </p>
          <p className={styles.TermsPageParagraph}>
            Nidhify has no control over, does not endorse, and assumes no responsibility for the functionality, privacy policies, data collection, or security protocols of third-party platforms. You access external links entirely at your own risk.
          </p>

          <h3 className={styles.TermsPageSectionHeading}>6. Limitation of Liability</h3>
          <p className={styles.TermsPageParagraph}>
            To the maximum extent permitted by applicable law, Nidhify, its creator, or associates shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages, including but not limited to financial losses, loss of capital, loss of profits, data errors, system downtime, or security breaches arising from your use of or inability to use the platform.
          </p>

          <h3 className={styles.TermsPageSectionHeading}>7. Account Termination & Data Erasure</h3>
          <ul className={styles.TermsPageBulletList}>
            <li className={styles.TermsPageListItem}>
              <strong>By User:</strong> You have the right to delete your account or delink your CAS data at any time through your dashboard settings. Delinking or deleting will permanently wipe your processed tracking data from our databases.
            </li>
            <li className={styles.TermsPageListItem}>
              <strong>By Platform:</strong> Nidhify reserves the absolute right to suspend, terminate, or restrict your access to the platform at any time, without prior notice or liability, for any reason whatsoever.
            </li>
          </ul>

          <h3 className={styles.TermsPageSectionHeading}>8. Amendments to Terms</h3>
          <p className={styles.TermsPageParagraph}>
            We reserve the right to modify or replace these Terms of Service at any time. Any changes will be posted on this page with an updated "Last Updated" date. Continued use of Nidhify.com after changes are posted constitutes full acceptance of the revised terms.
          </p>
        </div>

        {/* Fixed Bottom Control Action Box */}
        <footer className={styles.TermsPageModalFooter}>
          <button 
            type="button" 
            className={styles.TermsPageCloseActionBtn} 
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}