
import React, { useState } from 'react';
import styles from './TrackInsuraceUi.module.css';
import InsuraceView from '../InsuraceView';

const TrackInsuraceUi = () => {
    const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);


  return (
    <div className={styles.TrackInsuraceUi_container}>
      {/* Insurance Header */}
      {/* <div className={styles.TrackInsuraceUi_header}>
        <h2 className={styles.TrackInsuraceUi_title}>Insurance</h2>
      </div> */}

      {/* Track Your Insurance CTA Card */}
      <div className={styles.TrackInsuraceUi_trackCard} onClick={() => setIsInsuranceModalOpen(true)}>
        <div className={styles.TrackInsuraceUi_iconWrapper}>
          <svg 
            className={styles.TrackInsuraceUi_shieldIcon} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div className={styles.TrackInsuraceUi_textGroup}>
          <h3 className={styles.TrackInsuraceUi_cardHeading}>Track Your Insurance</h3>
          <p className={styles.TrackInsuraceUi_cardSubheading}>Keep all your policies in one place.</p>
        </div>
        <button className={styles.TrackInsuraceUi_arrowButton} aria-label="Track Insurance">
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>


      {/* <div className={styles.TrackInsuraceUi_listHeader}>
        <h2 className={styles.TrackInsuraceUi_title}>Insurance (Sample)</h2>
        <button className={styles.TrackInsuraceUi_viewAll}>View All</button>
      </div>

   
      <div className={styles.TrackInsuraceUi_policyList}>
    
        <div className={styles.TrackInsuraceUi_policyCard}>
          <div className={`${styles.TrackInsuraceUi_policyIcon} ${styles.TrackInsuraceUi_life}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className={styles.TrackInsuraceUi_policyInfo}>
            <h4 className={styles.TrackInsuraceUi_policyName}>Life Insurance</h4>
            <p className={styles.TrackInsuraceUi_policyId}>POLICY: #LI-49021</p>
          </div>
          <div className={styles.TrackInsuraceUi_policyValue}>
            <span className={styles.TrackInsuraceUi_label}>Premium</span>
            <span className={styles.TrackInsuraceUi_amount}>₹12,400</span>
          </div>
        </div>

        <div className={styles.TrackInsuraceUi_policyCard}>
          <div className={`${styles.TrackInsuraceUi_policyIcon} ${styles.TrackInsuraceUi_health}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className={styles.TrackInsuraceUi_policyInfo}>
            <h4 className={styles.TrackInsuraceUi_policyName}>Health Insurance</h4>
            <p className={styles.TrackInsuraceUi_policyId}>POLICY: #HI-88211</p>
          </div>
          <div className={styles.TrackInsuraceUi_policyValue}>
            <span className={styles.TrackInsuraceUi_label}>Premium</span>
            <span className={styles.TrackInsuraceUi_amount}>₹8,200</span>
          </div>
        </div>
      </div> */}


      <InsuraceView
        isOpen={isInsuranceModalOpen} 
        onClose={() => setIsInsuranceModalOpen(false)} 
      />
    </div>
  );
};

export default TrackInsuraceUi;
