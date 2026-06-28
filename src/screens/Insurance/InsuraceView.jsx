import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Trash2,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  Building2,
  Tag,
} from "lucide-react";
import {
  fetchInsuranceList,
  deleteInsurance,
} from "../../services/apis/portfolio.service";
import DeleteModal from "../../components/DeleteModal/DeleteModal";
import LoadingDots from "../../components/LoadingDots/LoadingDots";
import InsuranceAddModal from "./InsuranceAddModal/InsuranceAddModal";
import styles from "./InsuraceView.module.css";

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0";
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const formatFullCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const getExpiryBadgeClass = (status) => {
  if (!status) return styles.InsuraceViewModalBadgeActive;
  const s = status.toLowerCase();
  if (s.includes("expired")) return styles.InsuraceViewModalBadgeExpired;
  if (s.includes("expiring")) return styles.InsuraceViewModalBadgeExpiring;
  return styles.InsuraceViewModalBadgeActive;
};

const expiryLabel = (status) => {
  if (!status) return "Active";
  return status;
};

export default function InsuraceView({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [addModalType, setAddModalType] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchInsuranceList();
    if (res?.success) {
      setPolicies(res.data.items || []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      setExpandedId(null);
      setDeleteTarget(null);
      loadData();
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
  }, [isOpen, loadData]);

  const groups = policies.reduce((acc, p) => {
    const type = p.insuranceType || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(p);
    return acc;
  }, {});

  const allCategories = ["Life", "Term", "Health", "Motor"];

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteInsurance(deleteTarget._id);
    setDeleteTarget(null);
    if (res?.success) loadData();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.InsuraceViewModalOverlay} onClick={onClose}>
      <div
        className={styles.InsuraceViewModalSheet}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.InsuraceViewModalHeader}>
          <h2 className={styles.InsuraceViewModalTitle}>Track policy</h2>
          <button
            type="button"
            className={styles.InsuraceViewModalCloseCircle}
            onClick={onClose}
            aria-label="Close sheet"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </header>

        <div className={styles.InsuraceViewModalScrollBody}>
          {isLoading ? (
            <div className={styles.InsuraceViewModalLoadingState}>
              <LoadingDots speed={400} />
            </div>
          ) : (
            allCategories.map((type) => {
              const items = groups[type] || [];
              return (
                <React.Fragment key={type}>
                  <div className={styles.InsuraceViewModalMainRow}>
                    <span className={styles.InsuraceViewModalCategoryName}>
                      {type} Insurance
                    </span>
                    <button
                      type="button"
                      className={styles.InsuraceViewModalActionLink}
                      onClick={() => setAddModalType(type)}
                    >
                      <span>Track Policy</span>
                      <Plus size={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  {items.length > 0 && (
                    <div className={styles.InsuraceViewModalSubItemsContainer}>
                      {items.map((policy) => (
                        <div
                          key={policy._id}
                          className={`${styles.InsuraceViewModalSubRowCard} ${expandedId === policy._id ? styles.InsuraceViewModalSubRowCardExpanded : ""}`}
                        >
                          <div className={styles.InsuraceViewModalCardLeft}>
                            <button
                              className={`${styles.InsuraceViewModalExpandBtn} ${expandedId === policy._id ? styles.InsuraceViewModalExpandBtnActive : ""}`}
                              onClick={() => toggleExpand(policy._id)}
                              aria-label={
                                expandedId === policy._id
                                  ? "Collapse details"
                                  : "Expand details"
                              }
                            >
                              {expandedId === policy._id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>

                            <div
                              className={styles.InsuraceViewModalBrandMeta}
                              onClick={() => toggleExpand(policy._id)}
                            >
                              <div
                                className={
                                  styles.InsuraceViewModalPolicyDetails
                                }
                              >
                                <h4
                                  className={
                                    styles.InsuraceViewModalProviderName
                                  }
                                >
                                  {policy.insuranceCompany}
                                </h4>
                                <div
                                  className={
                                    styles.InsuraceViewModalPolicyMetaRow
                                  }
                                >
                                  {policy.expiryDate ? (
                                    <>
                                      <span
                                        className={
                                          styles.InsuraceViewModalExpiryText
                                        }
                                      >
                                        <Calendar size={11} />{" "}
                                        {formatDate(policy.expiryDate)}
                                      </span>
                                      <span
                                        className={`${styles.InsuraceViewModalExpiryBadge} ${getExpiryBadgeClass(policy.expiryStatus)}`}
                                      >
                                        {expiryLabel(policy.expiryStatus)}
                                      </span>
                                    </>
                                  ) : (
                                    <span
                                      className={
                                        styles.InsuraceViewModalPolicyTypeLabel
                                      }
                                    >
                                      {policy.insuranceType} Insurance
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className={styles.InsuraceViewModalCardRight}>
                            <span
                              className={styles.InsuraceViewModalCoverValue}
                            >
                              {formatCurrency(policy.coverageAmount)}
                            </span>
                          </div>

                          {expandedId === policy._id && (
                            <div
                              className={
                                styles.InsuraceViewModalExpandedDetails
                              }
                            >
                              <div
                                className={styles.InsuraceViewModalDetailGrid}
                              >
                                {policy.policyHolderName && (
                                  <div
                                    className={styles.InsuraceViewModalDetailItem}
                                  >
                                    <User
                                      size={14}
                                      className={
                                        styles.InsuraceViewModalDetailIcon
                                      }
                                    />
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailLabel
                                      }
                                    >
                                      Policy Holder
                                    </span>
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailValue
                                      }
                                    >
                                      {policy.policyHolderName}
                                    </span>
                                  </div>
                                )}
                                {policy.policyType && (
                                  <div
                                    className={styles.InsuraceViewModalDetailItem}
                                  >
                                    <FileText
                                      size={14}
                                      className={
                                        styles.InsuraceViewModalDetailIcon
                                      }
                                    />
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailLabel
                                      }
                                    >
                                      Policy Type
                                    </span>
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailValue
                                      }
                                    >
                                      {policy.policyType}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={styles.InsuraceViewModalDetailItem}
                                >
                                  <Tag
                                    size={14}
                                    className={
                                      styles.InsuraceViewModalDetailIcon
                                    }
                                  />
                                  <span
                                    className={
                                      styles.InsuraceViewModalDetailLabel
                                    }
                                  >
                                    Insurance Type
                                  </span>
                                  <span
                                    className={
                                      styles.InsuraceViewModalDetailValue
                                    }
                                  >
                                    {policy.insuranceType || "—"}
                                  </span>
                                </div>
                                {policy.startDate && (
                                  <div
                                    className={styles.InsuraceViewModalDetailItem}
                                  >
                                    <Calendar
                                      size={14}
                                      className={
                                        styles.InsuraceViewModalDetailIcon
                                      }
                                    />
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailLabel
                                      }
                                    >
                                      Start Date
                                    </span>
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailValue
                                      }
                                    >
                                      {formatDate(policy.startDate)}
                                    </span>
                                  </div>
                                )}
                                {policy.expiryDate && (
                                  <div
                                    className={styles.InsuraceViewModalDetailItem}
                                  >
                                    <Calendar
                                      size={14}
                                      className={
                                        styles.InsuraceViewModalDetailIcon
                                      }
                                    />
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailLabel
                                      }
                                    >
                                      Expiry Date
                                    </span>
                                    <span
                                      className={
                                        styles.InsuraceViewModalDetailValue
                                      }
                                    >
                                      {formatDate(policy.expiryDate)}
                                    </span>
                                  </div>
                                )}
                                <div
                                  className={styles.InsuraceViewModalDetailItem}
                                >
                                  <Building2
                                    size={14}
                                    className={
                                      styles.InsuraceViewModalDetailIcon
                                    }
                                  />
                                  <span
                                    className={
                                      styles.InsuraceViewModalDetailLabel
                                    }
                                  >
                                    Coverage Amount
                                  </span>
                                  <span
                                    className={
                                      styles.InsuraceViewModalDetailValue
                                    }
                                  >
                                    {formatFullCurrency(policy.coverageAmount)}
                                  </span>
                                </div>
                              </div>
                              <button
                                className={
                                  styles.InsuraceViewModalDeleteBtnExpanded
                                }
                                onClick={() => setDeleteTarget(policy)}
                              >
                                <Trash2 size={14} />
                                <span>Remove Policy</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}
        </div>

        <DeleteModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          itemName={deleteTarget?.insuranceCompany}
        />

        <InsuranceAddModal
          isOpen={!!addModalType}
          insuranceType={addModalType}
          onClose={() => setAddModalType(null)}
          onSuccess={loadData}
        />
      </div>
    </div>
  );
}
