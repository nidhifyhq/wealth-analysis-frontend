import React, { useEffect, useState } from "react";
import {
  X,
  TrendingUp,
  Briefcase,
  Grid,
  PlusCircle,
  ChevronRight,
  Globe,
  RockingChair,
  ListCollapse,
  Activity,
  Landmark,
  HandCoins,
  CircleStar,
} from "lucide-react";
import styles from "./OtherProducts.module.css";
import { fetchOtherInvestmentAssets } from "../../../../services/apis/dashboard.service";
import LoadingDots from "../../../../components/LoadingDots/LoadingDots";

const formatCurrency = (num) => {
  if (num == null) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const formatAllocation = (val) => {
  if (val == null) return null;
  return `${Number(val).toFixed(2)}% allocation`;
};

const defaultSubtitles = {
  MutualFunds: "Track your Mutual Funds",
  FD: "Track your FD",
  RD: "Track your RD",
  Gold: "Track your Gold",
};

const OtherProducts = ({ isOpen, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimateIn(true));
      document.body.style.overflow = "hidden";
      setIsLoading(true);
      fetchOtherInvestmentAssets().then((res) => {
        if (res) setApiData(res);
        setIsLoading(false);
      });
    } else {
      setAnimateIn(false);
      setApiData(null);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !animateIn) return null;

  const getAmount = (key) => {
    if (isLoading) return null;
    if (!apiData || !apiData[key]) return "₹0";
    return formatCurrency(apiData[key].currentVal);
  };

  const getSubtitle = (key) => {
    if (isLoading) return "Loading...";
    if (apiData?.[key]?.allocation != null)
      return formatAllocation(apiData[key].allocation);
    return defaultSubtitles[key];
  };

  const portfolioItems = [
    {
      id: "mf",
      title: "Mutual Funds",
      subtitle: getSubtitle("MutualFunds"),
      icon: <TrendingUp className={styles.OtherProductsIconAsset} />,
      amount: getAmount("MutualFunds"),
      isLoading,
      type: "portfolio",
    },
    {
      id: "fd",
      title: "Fixed Deposits",
      subtitle: getSubtitle("FD"),
      icon: <Landmark className={styles.OtherProductsIconAsset} />,
      amount: getAmount("FD"),
      isLoading,
      type: "portfolio",
    },
    {
      id: "rd",
      title: "Recurring Deposits",
      subtitle: getSubtitle("RD"),
      icon: <HandCoins className={styles.OtherProductsIconAsset} />,
      amount: getAmount("RD"),
      isLoading,
      type: "portfolio",
      isComingSoon: true,
    },
    {
      id: "gold",
      title: "Gold",
      subtitle: getSubtitle("Gold"),
      icon: <CircleStar className={styles.OtherProductsIconAsset} />,
      amount: getAmount("Gold"),
      isLoading,
      type: "portfolio",
      isComingSoon: true,
    },
  ];

  const comingSoonItems = [
    {
      id: "epf",
      title: "EPF",
      subtitle: "Track your EPF",
      icon: <Grid className={styles.OtherProductsIconAsset} />,
      amount: "₹90,500",
      isComingSoon: true,
      type: "portfolio",
    },
    {
      id: "stocks",
      title: "Stocks",
      subtitle: "Tracks your stocks",
      icon: <Activity className={styles.OtherProductsIconAsset} />,
      isCircleIcon: true,
      actionText: "Add",
      type: "discover",
      isComingSoon: true,
    },
    {
      id: "nps",
      title: "NPS",
      subtitle: "Secure your future",
      icon: <RockingChair className={styles.OtherProductsIconAsset} />,
      isCircleIcon: true,
      isComingSoon: true,
      actionText: "Add",
      type: "discover",
    },
    {
      id: "others",
      title: "Other",
      subtitle: "Track others",
      icon: <ListCollapse className={styles.OtherProductsIconAsset} />,
      isCircleIcon: true,
      isComingSoon: true,
      actionText: "Add",
      type: "discover",
    },
  ];

  const allProducts = [...portfolioItems, ...comingSoonItems];

  return (
    <div
      className={`${styles.OtherProductsOverlay} ${animateIn ? styles.OtherProductsOverlayVisible : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.OtherProductsModal} ${animateIn ? styles.OtherProductsModalOpen : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.OtherProductsDragHandle} onClick={handleClose} />

        <div className={styles.OtherProductsHeader}>
          <h2 className={styles.OtherProductsTitle}>Your investments</h2>
          <button
            className={styles.OtherProductsCloseBtn}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.OtherProductsContent}>
          <div className={styles.OtherProductsList}>
            {allProducts.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  className={`${styles.OtherProductsRow} ${item.isComingSoon ? styles.OtherProductsRowDisabled : ""}`}
                  role={item.isComingSoon ? "presentation" : "button"}
                >
                  <div className={styles.OtherProductsLeftCell}>
                    <div
                      className={`${styles.OtherProductsIconWrapper} ${item.isCircleIcon ? styles.OtherProductsCircleIcon : ""}`}
                    >
                      {item.icon}
                    </div>
                    <div className={styles.OtherProductsMeta}>
                      <span className={styles.OtherProductsItemTitle}>
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className={styles.OtherProductsItemSub}>
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className={styles.OtherProductsRightCell}>
                    {item.isComingSoon ? (
                      <span className={styles.OtherProductsComingSoonTag}>
                        Coming soon
                      </span>
                    ) : item.isLoading ? (
                      <div className={styles.OtherProductsValueBlock}>
                        <span className={styles.OtherProductsActualValue}>
                          <LoadingDots speed={400} />
                        </span>
                      </div>
                    ) : item.type === "portfolio" ? (
                      <>
                        <div className={styles.OtherProductsValueBlock}>
                          <span className={styles.OtherProductsActualValue}>
                            {item.amount}
                          </span>
                        </div>
                        <ChevronRight
                          size={18}
                          className={styles.OtherProductsChevron}
                        />
                      </>
                    ) : (
                      <button className={styles.OtherProductsActionBtn}>
                        <span className={styles.OtherProductsActionText}>
                          {item.actionText}
                        </span>
                        <PlusCircle
                          size={20}
                          className={styles.OtherProductsPlusIcon}
                        />
                      </button>
                    )}
                  </div>
                </div>

                {index < allProducts.length - 1 && (
                  <hr className={styles.OtherProductsDivider} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherProducts;
