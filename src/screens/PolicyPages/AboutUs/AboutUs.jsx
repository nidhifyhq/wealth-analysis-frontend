import React from 'react';
import { X, ShieldCheck, Layers, Eye, Zap, Flame } from 'lucide-react';
import styles from './AboutUs.module.css';

export default function AboutUsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.AboutUsModalOverlay} onClick={onClose}>
      <div className={styles.AboutUsModalSheet} onClick={(e) => e.stopPropagation()}>
        {/* Fixed Header */}
        <header className={styles.AboutUsModalHeader}>
          <h2 className={styles.AboutUsModalTitle}>About Nidhify</h2>
          <button type="button" className={styles.AboutUsModalCloseIconBtn} onClick={onClose} aria-label="Close modal">
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className={styles.AboutUsModalScrollBody}>
          <p className={styles.AboutUsModalHeroText}>
            Welcome to Nidhify.com—a modern, independent wealth-tracking platform designed to cut through the noise and give you complete clarity over your personal finances.
          </p>

          <h3 className={styles.AboutUsModalSectionTitle}>The Problem We Are Solving</h3>
          <p className={styles.AboutUsModalText}>
            Managing money shouldn't feel like a chore. Today, our investments are scattered everywhere: mutual funds on one platform, Fixed Deposits (FDs) sitting in different banks, gold in locker systems, and insurance policies hidden in emails.
          </p>
          <p className={styles.AboutUsModalText}>
            Most tracking tools force you into an ecosystem where they constantly try to sell you loans, credit cards, or new investment schemes.
          </p>
          <blockquote className={styles.AboutUsModalQuoteBlock}>
            Nidhify was built to change that. We believe your tracking platform should be just that—a pure tracking tool. No hidden agendas, no aggressive cross-selling, and no financial jargon.
          </blockquote>

          <h3 className={styles.AboutUsModalSectionTitle}>What Nidhify Does</h3>
          <p className={styles.AboutUsModalText}>
            Nidhify is an automated, high-utility portfolio analytics dashboard. We don't manage your money, and we don't sell you products. Instead, we give you the tools to aggregate your entire net worth in one secure place:
          </p>

          <div className={styles.AboutUsModalFeaturesList}>
            <div className={styles.AboutUsModalFeatureCard}>
              <div className={styles.AboutUsModalIconBox}><Layers size={18} /></div>
              <div>
                <h4 className={styles.AboutUsModalFeatureTitle}>Automated Mutual Fund Tracking</h4>
                <p className={styles.AboutUsModalFeatureDesc}>Instantly visualize your portfolio allocation by securely processing your password-protected CAS PDF statements via our smart, one-time automation script.</p>
              </div>
            </div>

            <div className={styles.AboutUsModalFeatureCard}>
              <div className={styles.AboutUsModalIconBox}><Zap size={18} /></div>
              <div>
                <h4 className={styles.AboutUsModalFeatureTitle}>Multi-Asset Management</h4>
                <p className={styles.AboutUsModalFeatureDesc}>Manually track your Fixed Deposits (FDs), Stocks, Digital Gold, and Insurance plans alongside your mutual funds.</p>
              </div>
            </div>

            <div className={styles.AboutUsModalFeatureCard}>
              <div className={styles.AboutUsModalIconBox}><Eye size={18} /></div>
              <div>
                <h4 className={styles.AboutUsModalFeatureTitle}>Clear Analytics</h4>
                <p className={styles.AboutUsModalFeatureDesc}>Understand your true asset allocation with beautifully clean charts, stripped of unnecessary complexity.</p>
              </div>
            </div>
          </div>

          <h3 className={styles.AboutUsModalSectionTitle}>Our Core Principles</h3>
          <div className={styles.AboutUsModalPrincipleRow}>
            <div className={styles.AboutUsModalPrincipleHeader}>
              <span className={styles.AboutUsModalBulletDot} />
              <h4 className={styles.AboutUsModalPrincipleTitle}>Transparency First</h4>
            </div>
            <p className={styles.AboutUsModalPrincipleText}>Nidhify is built entirely from a technology and software utility perspective. We do not pretend to be financial gurus or certified advisors. We don’t give investment advice; we build smart interfaces that empower you to view your data clearly.</p>
          </div>

          <div className={styles.AboutUsModalPrincipleRow}>
            <div className={styles.AboutUsModalPrincipleHeader}>
              <span className={styles.AboutUsModalBulletDot} />
              <h4 className={styles.AboutUsModalPrincipleTitle}>Strict Privacy (Zero-Storage Policy)</h4>
            </div>
            <p className={styles.AboutUsModalPrincipleText}>Your trust is our ultimate asset. When you upload a CAS statement, our automated system reads the details in real-time and never stores your file password on our servers. Your financial data is yours alone—we will never sell or share it with third parties.</p>
          </div>

          <div className={styles.AboutUsModalPrincipleRow}>
            <div className={styles.AboutUsModalPrincipleHeader}>
              <span className={styles.AboutUsModalBulletDot} />
              <h4 className={styles.AboutUsModalPrincipleTitle}>Clean, Frictionless UI</h4>
            </div>
            <p className={styles.AboutUsModalPrincipleText}>We value your time. Nidhify is built to be incredibly fast, responsive, and completely intuitive, so you can check your net worth progress in less than a minute.</p>
          </div>

          <h3 className={styles.AboutUsModalSectionTitle}>The Journey Behind Nidhify</h3>
          <p className={styles.AboutUsModalText}>
            Nidhify started as a passion project born out of a simple need: the desire for a clean, private, and unified dashboard to track personal wealth without being constantly targeted by financial advertisements. Built with modern software practices and a focus on clean engineering, Nidhify has evolved into a dedicated platform helping users take control of their own financial tracking.
          </p>

          <footer className={styles.AboutUsModalClosingSection}>
            <div className={styles.AboutUsModalShieldFrame}><ShieldCheck size={24} /></div>
            <p className={styles.AboutUsModalFooterHeading}>Thank you for being a part of Nidhify.</p>
            <p className={styles.AboutUsModalFooterSubtext}>Here’s to tracking wealth smarter, cleaner, and with total peace of mind.</p>
          </footer>
        </div>

        {/* Sticky Bottom Action */}
        <footer className={styles.AboutUsModalFooter}>
          <button type="button" className={styles.AboutUsModalCloseActionBtn} onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}