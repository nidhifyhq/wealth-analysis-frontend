import React from 'react';
import { X } from 'lucide-react';
import styles from './Disclaimer.module.css';

export default function Disclaimer({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.DisclaimerPageModalOverlay} onClick={onClose}>
      <div 
        className={styles.DisclaimerPageModalSheet} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header Section */}
        <header className={styles.DisclaimerPageModalHeader}>
          <h2 className={styles.DisclaimerPageModalTitle}>Disclaimer</h2>
          <button 
            type="button" 
            className={styles.DisclaimerPageCloseIconBtn} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Document Content Box */}
        <div className={styles.DisclaimerPageModalScrollBody}>
          <p className={styles.DisclaimerPageMetaDate}>Last Updated: June 2026</p>
          
          <p className={styles.DisclaimerPageParagraph}>
            The information, analytics, and tracking tools provided on Nidhify.com (the "Platform" or "Website") are for informational and educational purposes only. By using this Platform, you acknowledge and agree to the terms of this Disclaimer in full.
          </p>

          <h3 className={styles.DisclaimerPageSectionHeading}>1. No Financial, Investment, or Tax Advice</h3>
          <ul className={styles.DisclaimerPageBulletList}>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Non-Licensed Platform:</strong> Nidhify is a software utility tool. The platform, its owner(s), and its operators do not hold any financial degrees, certifications, or regulatory licenses. Nidhify is not registered with the Securities and Exchange Board of India (SEBI), the Association of Mutual Funds in India (AMFI), or any other financial regulatory authority.
            </li>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Not an Advisory Service:</strong> Nothing displayed on this Website—including portfolio metrics, charts, automated analytics, or blog content—constitutes professional investment, legal, tax, or financial advice.
            </li>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Consult a Professional:</strong> All financial decisions involve risk. You should consult a SEBI-registered investment advisor or a qualified financial professional before making any investment or purchasing insurance products. You are entirely responsible for your own financial actions.
            </li>
          </ul>

          <h3 className={styles.DisclaimerPageSectionHeading}>2. "As-Is" Data & Accuracy Warning (System Errors Disclaimer)</h3>
          <p className={styles.DisclaimerPageParagraph}>
            Nidhify uses automated parsing scripts to read uploaded password-protected CAS PDFs and displays asset details based on manual user entries for Fixed Deposits (FDs), Stocks, Gold, and Insurance.
          </p>
          <ul className={styles.DisclaimerPageBulletList}>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Data Can Be Wrong:</strong> Nidhify does not guarantee the 100% accuracy, completeness, or real-time correctness of any data shown on the dashboard.
            </li>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Potential Discrepancies:</strong> System calculations may contain errors due to third-party data feed lags, parsing bugs, sync delays, or unexpected formatting changes in uploaded statement PDFs.
            </li>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Mandatory Verification:</strong> All portfolio tracking metrics are approximate estimates. Users must independently cross-verify all investment values, NAVs, units, maturity amounts, and balances directly with their official banks, Asset Management Companies (AMCs), or official investment portals before taking any financial action.
            </li>
          </ul>

          <h3 className={styles.DisclaimerPageSectionHeading}>3. Absolute Limitation of Liability (Nidhify Jimedaar Nahi Hai)</h3>
          <p className={styles.DisclaimerPageParagraph}>
            Under no circumstances shall Nidhify, its creator, or its affiliates be held liable for any direct, indirect, incidental, or consequential financial losses, lost profits, capital depreciation, or data inaccuracies arising out of your use of this platform.
          </p>
          <p className={styles.DisclaimerPageParagraph}>
            If you rely on any metrics shown on Nidhify to buy, sell, redeem, or switch investments, you do so entirely at your own risk. Nidhify assumes zero responsibility for your investment outcomes.
          </p>

          <h3 className={styles.DisclaimerPageSectionHeading}>4. Third-Party Portals and Market Risks</h3>
          <ul className={styles.DisclaimerPageBulletList}>
            <li className={styles.DisclaimerPageListItem}>
              <strong>No Endorsement:</strong> Links or references to third-party official sites (such as CAMS Online) are provided purely for user convenience to download statement files. Nidhify does not manage, secure, or endorse these third-party platforms.
            </li>
            <li className={styles.DisclaimerPageListItem}>
              <strong>Market Risk:</strong> Mutual fund and equity investments are subject to market risks. Please read all scheme-related documents carefully before investing.
            </li>
          </ul>
        </div>

        {/* Fixed Bottom Control Action Box */}
        <footer className={styles.DisclaimerPageModalFooter}>
          <button 
            type="button" 
            className={styles.DisclaimerPageCloseActionBtn} 
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}