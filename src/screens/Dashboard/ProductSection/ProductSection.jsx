import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import styles from "./ProductSection.module.css";
import othersImg from "../../../assets/images/others.png";
import OtherProducts from "./OtherProducts/OtherProducts";
import GoldAddModal from "../../Gold/GoldAddModal/GoldAddModal";
import RDAddModal from "../../RecurringDeposit/RDAddModal/RDAddModal";

const ProductSection = ({ onRefresh }) => {
  const [openOtherProductModal, setOpenOtherProductModal] = useState(false);
  const [openGoldModal, setOpenGoldModal] = useState(false);
  const [openRDModal, setOpenRDModal] = useState(false);
  const navigate = useNavigate();

  return (
    <section className={styles.productSection_portfolio_section}>
      <div className={styles.productSection_titleRow}>
        <h3 className={styles.productSection_title}>Assets</h3>
        <button
          className={styles.productSection_refreshBtn}
          onClick={() => onRefresh?.()}
        >
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <div className={styles.productSection_grid}>
        {/* Mutual Funds */}
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentBlue}`}
          onClick={() => navigate("/mf")}
        >
          <span className={styles.productSection_label}>MUTUAL FUNDS</span>
          <span className={styles.productSection_subtitle}>Explore & Track</span>
        </div>

        {/* Fixed Deposit */}
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentIndigo}`}
          onClick={() => navigate("/fd")}
        >
          <span className={styles.productSection_label}>FIXED DEPOSIT</span>
          <span className={styles.productSection_subtitle}>Manage FDs</span>
        </div>

        {/* SubLayout: Recurring Deposit & Gold */}
        <div className={styles.productSection_subLayout}>
          {/* Recurring Deposit */}
          <div
            className={`${styles.productSection_card} ${styles.productSection_accentOrange}`}
            onClick={() => navigate("/rd")}
          >
            <span className={styles.productSection_label}>RECURRING DEPOSIT</span>
            <span className={styles.productSection_subtitle}>Manage RDs</span>
          </div>

          {/* Gold */}
          <div
            className={`${styles.productSection_card} ${styles.productSection_accentYellow}`}
            onClick={() => navigate("/gold")}
          >
            <span className={styles.productSection_label}>GOLD</span>
            <span className={styles.productSection_subtitle}>Manage Gold</span>
          </div>
        </div>

        {/* Others */}
        <div
          className={`${styles.productSection_card} ${styles.productSection_spanTwoRows} ${styles.productSection_accentPurple} ${styles.productSection_othersCard}`}
          onClick={() => setOpenOtherProductModal(true)}
        >
          <span className={styles.productSection_label}>OTHERS</span>
          <img
            src={othersImg}
            alt="Others"
            className={styles.productSection_othersImage}
          />
        </div>
      </div>

      <OtherProducts
        isOpen={openOtherProductModal}
        onClose={() => setOpenOtherProductModal(false)}
        onDataChange={() => onRefresh?.()}
      />

      <GoldAddModal
        isOpen={openGoldModal}
        onClose={() => setOpenGoldModal(false)}
        onSuccess={() => {
          setOpenGoldModal(false);
          onRefresh?.();
        }}
      />

      <RDAddModal
        isOpen={openRDModal}
        onClose={() => setOpenRDModal(false)}
        onSuccess={() => {
          setOpenRDModal(false);
          onRefresh?.();
        }}
      />
    </section>
  );
};

export default ProductSection;
