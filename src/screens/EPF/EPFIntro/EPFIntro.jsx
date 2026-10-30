import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ArrowLeft, Check } from "lucide-react";
import styles from "./EPFIntro.module.css";
import epfoIntroImg from "../../../assets/images/epf/epfo_intro.png";
import { COLORS } from "../../../designConfig/colors";
import EPFUploadModal from "../EPFUpload/EPFUploadModal";
import { fetchEpfSummary } from "../../../services/apis/epf.service";
import { setEpfSummary } from "../../../store/epf/epf.slice";

const EPFIntro = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleTrackNow = () => {
    setShowUploadModal(true);
  };

  const featurePoints = [
    "View your total EPF savings in one place",
    "Track employer and employee contributions",
    "Monitor your retirement savings growth",
  ];

  return (
    <div className={styles.EPFintro_pageWrapper}>
      <div className={styles.EPFintro_container}>
        {/* Top Floating Navigation */}
        <div className={styles.EPFintro_topBar}>
          <button
            type="button"
            className={styles.EPFintro_backBtn}
            onClick={handleBack}
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={2.2} />
          </button>
        </div>

        {/* Hero Illustration Section (100% full width, static) */}
        <div className={styles.EPFintro_heroSection}>
          <div className={styles.EPFintro_imageContainer}>
            <img
              src={epfoIntroImg}
              alt="EPF Wealth Tracker Illustration"
              className={styles.EPFintro_heroImage}
            />
          </div>
        </div>

        {/* Content & Action Section */}
        <div className={styles.EPFintro_contentCard}>
          {/* Tagline / Subheading */}
          <div className={styles.EPFintro_badge}>
            <span className={styles.EPFintro_badgeDot} />
            <span className={styles.EPFintro_badgeText}>
              YOUR RETIREMENT, IN VIEW
            </span>
          </div>

          {/* Main Title */}
          <h1 className={styles.EPFintro_title}>
            Track Your EPF Savings with Ease
          </h1>

          {/* Features Checklist */}
          <div className={styles.EPFintro_featuresList}>
            {featurePoints.map((text, index) => (
              <div key={index} className={styles.EPFintro_featureRow}>
                <div className={styles.EPFintro_checkIconBadge}>
                  <Check
                    className={styles.EPFintro_checkIcon}
                    strokeWidth={3}
                  />
                </div>
                <p className={styles.EPFintro_featureText}>{text}</p>
              </div>
            ))}
          </div>

          {/* Action CTA - positioned directly after Features Checklist */}
          <div className={styles.EPFintro_footerAction}>
            <button
              type="button"
              className={styles.EPFintro_ctaButton}
              style={{
                backgroundColor: COLORS.primaryButton,
                color: COLORS.primaryButtonText,
              }}
              onClick={handleTrackNow}
            >
              <span className={styles.EPFintro_ctaButtonText}>Track Now</span>
            </button>
          </div>
        </div>
      </div>

      <EPFUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={async () => {
          setShowUploadModal(false);
          try {
            const res = await fetchEpfSummary();
            if (res?.success && res?.data) {
              dispatch(setEpfSummary(res.data));
            }
          } catch (_) {}
          navigate("/epf");
        }}
      />
    </div>
  );
};

export default EPFIntro;
