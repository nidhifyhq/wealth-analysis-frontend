import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ShieldCheck, Download, FileText } from 'lucide-react';
import styles from './MFCasImportModal.module.css';
import exportsIcon from "../../../assets/images/exportsIcon.gif"

const CAMS_URL = 'https://www.camsonline.com/Investors/Statements/Consolidated-Account-Statement';

export default function MFCasImportModal({ isOpen, onSkip, onProceed, illustrationSrc, skipUrl }) {
  const navigate = useNavigate();

  const handleProceed = () => {
    window.open(CAMS_URL, '_blank', 'noopener,noreferrer');
    if (onProceed) onProceed();
  };

  const handleSkip = () => {
    if (skipUrl) {
      navigate(skipUrl);
    } else if (onSkip) {
      onSkip();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // Real, actionable steps for the user
  const steps = [
    { 
      icon: <ArrowUpRight size={20} color="#4F46E5" strokeWidth={2.5} />, 
      text: 'Click Proceed to go to the official CAMS portal.' 
    },
    { 
      icon: <FileText size={20} color="#4F46E5" strokeWidth={2.5} />, 
      text: 'Enter your registered Mutual Fund email.' 
    },
    { 
      icon: <Download size={20} color="#4F46E5" strokeWidth={2.5} />, 
      text: 'Set a PDF password and submit. Your statement will be emailed to you.' 
    },
  ];

  return (
    <div className={styles.MFCasImportModalOverlay} onClick={handleSkip}>
      <div className={styles.MFCasImportModalSheet} onClick={(e) => e.stopPropagation()}>
        <img
          src={exportsIcon}
          alt="Import Portfolio"
          className={styles.MFCasImportModalIllustration}
        />

        <h2 className={styles.MFCasImportModalHeadline}>
          Import Your Mutual Funds via CAMS
        </h2>
        
        <p className={styles.MFCasImportModalSubheadline}>
          Follow these simple steps to fetch your statement:
        </p>

        <div className={styles.MFCasImportModalFeatureList}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.MFCasImportModalFeatureItem}>
              <span className={styles.MFCasImportModalFeatureIcon}>
                {step.icon}
              </span>
              <p className={styles.MFCasImportModalFeatureText}>{step.text}</p>
            </div>
          ))}
        </div>

        {/* CAMS Official Website Disclaimer */}
        <div className={styles.MFCasImportModalDisclaimer}>
          <ShieldCheck size={16} className={styles.MFCasImportModalDisclaimerIcon} />
          <span className={styles.MFCasImportModalDisclaimertext}>
            <strong>Disclaimer:</strong> You will be redirected to the official CAMS website (camsonline.com) to securely generate your statement.
          </span>
        </div>

        <div className={styles.MFCasImportModalActions}>
          <button type="button" className={styles.MFCasImportModalSkipBtn} onClick={handleSkip}>
            {skipUrl ? 'Skip & Enter Manually' : 'Close'}
          </button>
          <button type="button" className={styles.MFCasImportModalProceedBtn} onClick={handleProceed}>
            Proceed to CAMS
          </button>
        </div>
      </div>
    </div>
  );
}