import React from 'react';
import { X } from 'lucide-react';
import styles from './Privacy.module.css';

export default function Privacy({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className={styles.PrivacyPageModalOverlay} onClick={onClose}>
      <div 
        className={styles.PrivacyPageModalSheet} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header Section */}
        <header className={styles.PrivacyPageModalHeader}>
          <h2 className={styles.PrivacyPageModalTitle}>Privacy Policy</h2>
          <button 
            type="button" 
            className={styles.PrivacyPageCloseIconBtn} 
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </header>

        {/* Scrollable Document Content Box */}
        <div className={styles.PrivacyPageModalScrollBody}>
          <p className={styles.PrivacyPageMetaDate}>Last Updated: June 2026</p>
          
          <p className={styles.PrivacyPageParagraph}>
            At Nidhify.com ("Nidhify," "we," "us," or "the Platform"), we respect your privacy and are committed to protecting your personal and financial information. This Privacy Policy explains how we collect, use, process, and secure your data when you use our wealth investment tracking platform.
          </p>
          <p className={styles.PrivacyPageParagraph}>
            By creating an account or using Nidhify.com, you explicitly consent to the data practices described in this policy.
          </p>

          <h3 className={styles.PrivacyPageSectionHeading}>1. Information We Collect</h3>
          <p className={styles.PrivacyPageParagraph}>
            To provide portfolio tracking and analytics, we collect information that you voluntarily provide to us:
          </p>
          <ul className={styles.PrivacyPageBulletList}>
            <li className={styles.PrivacyPageListItem}>
              <strong>Account Information:</strong> Your name, email address, and authentication credentials when you sign up.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>Manual Entry Data:</strong> Information you manually type into the platform to track your assets, including Fixed Deposits (FDs), Stocks, Digital Gold, Insurance policies, or other investments.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>Uploaded Statement Data:</strong> When you use our automated mutual fund tracking feature, you voluntarily upload your password-protected Consolidated Account Statement (CAS) PDF and provide its decryption password.
            </li>
          </ul>

          <h3 className={styles.PrivacyPageSectionHeading}>2. How We Process Your CAS PDF & Passwords (Strict Zero-Storage Policy)</h3>
          <p className={styles.PrivacyPageParagraph}>
            We understand that your financial statements are highly sensitive. We handle them with strict technical boundaries:
          </p>
          <ul className={styles.PrivacyPageBulletList}>
            <li className={styles.PrivacyPageListItem}>
              <strong>One-Time Parsing:</strong> Your CAS password is used by our automated script solely to decrypt and parse the document in real time.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>No Password Retention:</strong> Nidhify does not save or store your CAS password on our servers. Once the script finishes reading the file to extract your mutual fund units and balances, the password is completely wiped from memory.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>No Raw File Storage:</strong> We do not keep your raw uploaded PDF file. Once the necessary tracking text is parsed to populate your dashboard analytics, the file is discarded.
            </li>
          </ul>

          <h3 className={styles.PrivacyPageSectionHeading}>3. How We Use Your Information</h3>
          <p className={styles.PrivacyPageParagraph}>
            Nidhify uses the collected data exclusively to run the platform's core utilities:
          </p>
          <ul className={styles.PrivacyPageBulletList}>
            <li className={styles.PrivacyPageListItem}>
              To populate and calculate your personalized asset allocation dashboard.
            </li>
            <li className={styles.PrivacyPageListItem}>
              To provide automated portfolio analytics and tracking insights.
            </li>
            <li className={styles.PrivacyPageListItem}>
              To send account-related alerts, security updates, or support messages.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>No Third-Party Sharing:</strong> We do not sell, rent, trade, or share your personal transaction history or financial data with third-party marketing companies, lenders, or insurance brokers.
            </li>
          </ul>

          <h3 className={styles.PrivacyPageSectionHeading}>4. Data Security</h3>
          <p className={styles.PrivacyPageParagraph}>
            We implement standard industry safety practices to secure your dashboard data against unauthorized access, alteration, or disclosure. However, please remember that no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, you acknowledge that you provide your financial information at your own risk.
          </p>

          <h3 className={styles.PrivacyPageSectionHeading}>5. User Control: Modification and Deletion of Data</h3>
          <p className={styles.PrivacyPageParagraph}>
            You retain complete ownership and control over your data. Nidhify provides clear options inside your account settings to remove your information at any time:
          </p>
          <ul className={styles.PrivacyPageBulletList}>
            <li className={styles.PrivacyPageListItem}>
              <strong>Delinking CAS Data:</strong> You can choose to disconnect your mutual fund tracking data. Doing so will completely wipe all extracted mutual fund records from our active database, while keeping your manual entries (like FDs) intact.
            </li>
            <li className={styles.PrivacyPageListItem}>
              <strong>Account Deletion:</strong> You can choose to delete your Nidhify account permanently. Upon execution, all your data (account credentials, manual inputs, and historical tracking metrics) will be permanently erased from our databases and cannot be recovered.
            </li>
          </ul>

          <h3 className={styles.PrivacyPageSectionHeading}>6. Third-Party Websites and Links</h3>
          <p className={styles.PrivacyPageParagraph}>
            Our platform features instructions and links directing you to official third-party portals (such as CAMS Online) to download your financial statements. This Privacy Policy applies solely to Nidhify.com. We have no control over, and assume no responsibility for, the privacy practices or content of external websites. We encourage you to read the privacy statements of any third-party portal you visit.
          </p>

          <h3 className={styles.PrivacyPageSectionHeading}>7. Changes to This Privacy Policy</h3>
          <p className={styles.PrivacyPageParagraph}>
            We may update our Privacy Policy from time to time to reflect changes in our technical processing or legal requirements. We will notify you of any changes by updating the "Last Updated" date at the top of this page. Your continued use of Nidhify.com after modifications are posted constitutes your acceptance of the updated policy.
          </p>

          <h3 className={styles.PrivacyPageSectionHeading}>8. Contact Us</h3>
          <p className={styles.PrivacyPageParagraph}>
            If you have any questions or concerns regarding this Privacy Policy or how your data is handled, you can reach out to us through the contact channels provided on Nidhify.com.
          </p>
        </div>

        {/* Fixed Bottom Control Action Box */}
        <footer className={styles.PrivacyPageModalFooter}>
          <button 
            type="button" 
            className={styles.PrivacyPageCloseActionBtn} 
            onClick={onClose}
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}