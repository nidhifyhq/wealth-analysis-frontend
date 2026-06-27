import React, { useState, useEffect } from "react";
import styles from "./ProductSection.module.css";
import { fetchDashboardProduct } from "../../../services/apis/dashboard.service";
import othersImg from "../../../assets/images/others.png";
import OtherProducts from "./OtherProducts/OtherProducts";

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

const ProductSection = () => {
  const [productData, setProductData] = useState(null);
  const [openOtherProductModal, setOpenOtherProductModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetchDashboardProduct();
      if (res) setProductData(res);
    };
    load();
  }, []);

  const data = {
    mutualFunds: productData?.MutualFunds ?? 0,
    rd: productData?.RD ?? 0,
    fd: productData?.FD ?? 0,
    gold: productData?.Gold ?? 0,
    other: productData?.Other ?? 0,
  };

  return (
    <section className={styles.productSection_portfolio_section}>
      <h3 className={styles.productSection_title}>Assets</h3>

      <div className={styles.productSection_grid}>
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentBlue}`}
        >
          <span className={styles.productSection_label}>MUTUAL FUNDS</span>
          <span className={styles.productSection_value}>
            {formatCurrency(data.mutualFunds)}
          </span>
        </div>
        <div
          className={`${styles.productSection_card} ${styles.productSection_accentIndigo}`}
        >
          <span className={styles.productSection_label}>Fixed Deposit</span>
          <span className={styles.productSection_value}>
            {formatCurrency(data.fd)}
          </span>
        </div>

        <div className={styles.productSection_subLayout}>
          <div
            className={`${styles.productSection_card} ${styles.productSection_accentOrange}`}
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
      />
    </section>
  );
};

export default ProductSection;
