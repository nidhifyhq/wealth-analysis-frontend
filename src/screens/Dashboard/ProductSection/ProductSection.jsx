import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import styles from "./ProductSection.module.css";
import { fetchDashboardProduct } from "../../../services/apis/dashboard.service";
import othersImg from "../../../assets/images/others.png";
import OtherProducts from "./OtherProducts/OtherProducts";
import GoldAddModal from "../../Gold/GoldAddModal/GoldAddModal";
import RDAddModal from "../../RecurringDeposit/RDAddModal/RDAddModal";

const formatCurrency = (num) => {
  if (num == null) return "₹0";
  const n = Number(num);
  if (isNaN(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
};

const ProductSection = ({ onRefresh }) => {
  const [productData, setProductData] = useState(null);
  const [openOtherProductModal, setOpenOtherProductModal] = useState(false);
  const [openGoldModal, setOpenGoldModal] = useState(false);
  const [openRDModal, setOpenRDModal] = useState(false);

  const loadData = useCallback(async () => {
    const res = await fetchDashboardProduct();
    if (res) setProductData(res);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const navigate = useNavigate();

  const data = {
    mutualFunds: productData?.MutualFunds ?? 0,
    rd: productData?.RD ?? 0,
    fd: productData?.FD ?? 0,
    gold: productData?.Gold ?? 0,
    other: productData?.Other ?? 0,
  };

  return (
    <section className={styles.productSection_portfolio_section}>
      <div className={styles.productSection_titleRow}>
        <h3 className={styles.productSection_title}>Assets</h3>
        <button className={styles.productSection_refreshBtn} onClick={() => { loadData(); onRefresh?.(); }}>
          <RefreshCw size={14} />
          <span>Refresh</span>
        </button>
      </div>

      <div className={styles.productSection_grid}>
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentBlue}`}
          onClick={() => navigate("/mf")}
        >
          <span className={styles.productSection_label}>MUTUAL FUNDS</span>
          <span className={styles.productSection_value}>
            {formatCurrency(data.mutualFunds)}
          </span>
        </div>
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentIndigo}`}
          onClick={() => navigate("/fd")}
        >
          <span className={styles.productSection_label}>Fixed Deposit</span>
          <span className={styles.productSection_value}>
            {formatCurrency(data.fd)}
          </span>
        </div>

        <div className={styles.productSection_subLayout}>
          <div
            className={`${styles.productSection_card} ${styles.productSection_accentOrange}`}
            onClick={() => {
              if (data.rd === 0) setOpenRDModal(true);
              else navigate("/rd");
            }}
          >
            <span className={styles.productSection_label}>
              Recurring Deposit
            </span>
            <span className={styles.productSection_value}>
              {formatCurrency(data.rd)}
            </span>
          </div>
          <div
            className={`${styles.productSection_card} ${styles.productSection_accentYellow}`}
            onClick={() => {
              if (data.gold === 0) setOpenGoldModal(true);
              else navigate("/gold");
            }}
          >
            <span className={styles.productSection_label}>GOLD</span>
            <span className={styles.productSection_value}>
              {formatCurrency(data.gold)}
            </span>
          </div>
        </div>

        <div
          className={`${styles.productSection_card} ${styles.productSection_spanTwoRows} ${styles.productSection_accentPurple} ${styles.productSection_othersCard}`}
          onClick={() => setOpenOtherProductModal(true)}
        >
          <span className={styles.productSection_label}>OTHERS</span>
          {/* <span className={styles.productSection_value}>{formatCurrency(data.other)}</span> */}
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
        onDataChange={() => { loadData(); onRefresh?.(); }}
      />

      <GoldAddModal
        isOpen={openGoldModal}
        onClose={() => setOpenGoldModal(false)}
        onSuccess={() => { setOpenGoldModal(false); loadData(); onRefresh?.(); }}
      />

      <RDAddModal
        isOpen={openRDModal}
        onClose={() => setOpenRDModal(false)}
        onSuccess={() => { setOpenRDModal(false); loadData(); onRefresh?.(); }}
      />
    </section>
  );
};

export default ProductSection;
