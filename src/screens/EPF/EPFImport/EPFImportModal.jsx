import React, { useEffect } from "react";
import { ArrowUpRight, ShieldCheck, Download, FileText } from "lucide-react";
import styles from "./EPFImportModal.module.css";
import exportsIcon from "../../../assets/images/exportsIcon.gif";
import { COLORS } from "../../../designConfig/colors";

const EPFO_PASSBOOK_URL = "https://passbook.epfindia.gov.in/MemberPassBook/Login";

export default function EPFImportModal({ isOpen, onClose, onProceed }) {
  const handleProceed = () => {
    window.open(EPFO_PASSBOOK_URL, "_blank", "noopener,noreferrer");
    if (onProceed) onProceed();
  };

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

  const steps = [
    {
      icon: <ArrowUpRight size={20} color={COLORS.primaryButton || "#3B82F6"} strokeWidth={2.5} />,
      text: "Click Proceed to go to the official EPFO Member Passbook portal.",
    },
    {
      icon: <FileText size={20} color={COLORS.primaryButton || "#3B82F6"} strokeWidth={2.5} />,
      text: "Log in using your 12-digit UAN and Password.",
    },
    {
      icon: <Download size={20} color={COLORS.primaryButton || "#3B82F6"} strokeWidth={2.5} />,
      text: "Select your Member ID, download your Passbook PDF, and upload it here.",
    },
  ];

  return (
    <div className={styles.EPFimport_overlay} onClick={onClose}>
      <div className={styles.EPFimport_sheet} onClick={(e) => e.stopPropagation()}>
        <div
          className={styles.EPFimport_dragHandle}
          onClick={onClose}
          aria-label="Drag handle"
        />
        <img
          src={exportsIcon}
          alt="Import EPF Passbook"
          className={styles.EPFimport_illustration}
        />

        <h2 className={styles.EPFimport_headline}>
          Download the EPF Passbook via EPFO
        </h2>

        <p className={styles.EPFimport_subheadline}>
          Follow these simple steps to fetch your statement:
        </p>

        <div className={styles.EPFimport_featureList}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.EPFimport_featureItem}>
              <span className={styles.EPFimport_featureIcon}>{step.icon}</span>
              <p className={styles.EPFimport_featureText}>{step.text}</p>
            </div>
          ))}
        </div>

        {/* EPFO Official Website Disclaimer */}
        <div className={styles.EPFimport_disclaimer}>
          <ShieldCheck size={16} className={styles.EPFimport_disclaimerIcon} />
          <span className={styles.EPFimport_disclaimerText}>
            <strong>Security Notice:</strong> You will be redirected to the official EPFO website to download your passbook. Before entering your login credentials, please ensure you are on the genuine EPFO website.
          </span>
        </div>

        <div className={styles.EPFimport_actions}>
          <button
            type="button"
            className={styles.EPFimport_skipBtn}
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className={styles.EPFimport_proceedBtn}
            style={{
              backgroundColor: COLORS.primaryButton,
              color: COLORS.primaryButtonText,
            }}
            onClick={handleProceed}
          >
            Proceed to EPFO
          </button>
        </div>
      </div>
    </div>
  );
}
