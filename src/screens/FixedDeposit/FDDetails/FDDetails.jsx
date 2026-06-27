import React, { useState, useEffect } from 'react';
import { X, Calendar, Building2, Percent, Banknote, TrendingUp, Clock, Trash2, AlertTriangle, XCircle, CheckCircle, FileText, RotateCw } from 'lucide-react';
import { fetchFDById, deleteFD } from '../../../services/apis/portfolio.service';
import styles from './FDDetails.module.css';

const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return '₹0.00';
  return `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const getStatusClass = (status) => {
  if (!status) return '';
  const map = {
    'Active': styles.FDDetailsStatusActive,
    'Matured': styles.FDDetailsStatusMatured,
    'Upcoming': styles.FDDetailsStatusUpcoming,
  };
  return map[status] || '';
};

export default function FDDetails({ isOpen, onClose, fdId, onDelete }) {
  const [fdData, setFdData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);

  useEffect(() => {
    if (isOpen && fdId) {
      loadDetails();
    }
  }, [isOpen, fdId]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      const top = parseFloat(document.body.style.top || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, -top);
    }
    return () => {
      const top = parseFloat(document.body.style.top || '0');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, -top);
    };
  }, [isOpen]);

  const loadDetails = async () => {
    setLoading(true);
    setError('');
    setShowConfirm(false);
    setDeleteResult(null);
    const res = await fetchFDById(fdId);
    if (res?.success) {
      setFdData(res.data);
    } else {
      setError('Failed to load FD details.');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const res = await deleteFD(fdId);
    setDeleting(false);
    if (res?.success) {
      setDeleteResult('deleted');
      setTimeout(() => {
        onClose();
        if (onDelete) onDelete();
      }, 1500);
    } else {
      setDeleteResult('failed');
    }
  };

  const handleClose = () => {
    if (!deleting) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.FDDetailsOverlay} onClick={deleteResult ? undefined : handleClose}>
      <div className={styles.FDDetailsSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.FDDetailsHeader}>
          <h2 className={styles.FDDetailsTitle}>FD Details</h2>
          <button className={styles.FDDetailsCloseBtn} onClick={handleClose} aria-label="Close" disabled={deleting}>
            <X size={22} />
          </button>
        </div>

        {deleteResult === 'deleted' ? (
          <div className={styles.FDDetailsResultBlock}>
            <CheckCircle size={48} className={styles.FDDetailsSuccessIcon} />
            <h3 className={styles.FDDetailsResultTitle}>FD Deleted Successfully</h3>
          </div>
        ) : deleteResult === 'failed' ? (
          <div className={styles.FDDetailsResultBlock}>
            <XCircle size={48} className={styles.FDDetailsFailIcon} />
            <h3 className={styles.FDDetailsResultTitle}>Failed to Delete</h3>
            <p className={styles.FDDetailsResultText}>Please try again later.</p>
          </div>
        ) : loading ? (
          <div className={styles.FDDetailsLoadingBlock}>
            <div className={styles.FDDetailsSpinner} />
            <p className={styles.FDDetailsLoadingText}>Loading details...</p>
          </div>
        ) : error ? (
          <div className={styles.FDDetailsLoadingBlock}>
            <XCircle size={32} className={styles.FDDetailsFailIcon} />
            <p className={styles.FDDetailsLoadingText}>{error}</p>
          </div>
        ) : fdData ? (
          <>
            <div className={styles.FDDetailsContent}>
              <div className={styles.FDDetailsNameRow}>
                <h3 className={styles.FDDetailsBankName}>{fdData.institutionName}</h3>
                {fdData.planStatus && (
                  <span className={`${styles.FDDetailsStatusBadge} ${getStatusClass(fdData.planStatus)}`}>
                    {fdData.planStatus}
                  </span>
                )}
              </div>

              <div className={styles.FDDetailsMetricsGrid}>
                <div className={styles.FDDetailsMetricCard}>
                  <div className={styles.FDDetailsMetricIcon} style={{ background: '#eafbf0', color: '#0b451f' }}>
                    <Banknote size={16} />
                  </div>
                  <span className={styles.FDDetailsMetricLabel}>Principal</span>
                  <span className={styles.FDDetailsMetricValue}>{formatCurrency(fdData.principal)}</span>
                </div>
                <div className={styles.FDDetailsMetricCard}>
                  <div className={styles.FDDetailsMetricIcon} style={{ background: '#e8f4fd', color: '#065986' }}>
                    <TrendingUp size={16} />
                  </div>
                  <span className={styles.FDDetailsMetricLabel}>Current Value</span>
                  <span className={styles.FDDetailsMetricValue}>{formatCurrency(fdData.currentValue)}</span>
                </div>
                <div className={styles.FDDetailsMetricCard}>
                  <div className={styles.FDDetailsMetricIcon} style={{ background: '#fef3c7', color: '#92400e' }}>
                    <Banknote size={16} />
                  </div>
                  <span className={styles.FDDetailsMetricLabel}>Maturity Value</span>
                  <span className={styles.FDDetailsMetricValue}>{formatCurrency(fdData.maturityValue)}</span>
                </div>
                <div className={styles.FDDetailsMetricCard}>
                  <div className={styles.FDDetailsMetricIcon} style={{ background: '#f3e8ff', color: '#6b21a8' }}>
                    <Percent size={16} />
                  </div>
                  <span className={styles.FDDetailsMetricLabel}>Returns</span>
                  <span className={`${styles.FDDetailsMetricValue} ${fdData.returnPercent != null && fdData.returnPercent < 0 ? styles.FDDetailsNegative : styles.FDDetailsPositive}`}>
                    {fdData.returnPercent != null ? `${fdData.returnPercent.toFixed(2)}%` : '—'}
                  </span>
                </div>
              </div>

              <div className={styles.FDDetailsInfoSection}>
                <h4 className={styles.FDDetailsInfoTitle}>Deposit Information</h4>
                <div className={styles.FDDetailsInfoGrid}>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <Building2 size={13} /> Institution
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{fdData.institutionName}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <Percent size={13} /> Interest Rate
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{fdData.interestRate}%</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <FileText size={13} /> FD Type
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{fdData.fdType || '—'}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <RotateCw size={13} /> Compounding
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{fdData.compoundingFrequency || '—'}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <Calendar size={13} /> Start Date
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{formatDate(fdData.startDate)}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <Calendar size={13} /> Maturity
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{formatDate(fdData.maturityDate)}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <Clock size={13} /> Tenure
                    </span>
                    <span className={styles.FDDetailsInfoValue}>{fdData.tenure || '—'}</span>
                  </div>
                  <div className={styles.FDDetailsInfoItem}>
                    <span className={styles.FDDetailsInfoLabel}>
                      <TrendingUp size={13} /> Interest Earned
                    </span>
                    <span className={`${styles.FDDetailsInfoValue} ${fdData.interestEarned != null && fdData.interestEarned >= 0 ? styles.FDDetailsPositive : styles.FDDetailsNegative}`}>
                      {fdData.interestEarned != null ? formatCurrency(Math.abs(fdData.interestEarned)) : '—'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {showConfirm ? (
              <div className={styles.FDDetailsConfirmBox}>
                <AlertTriangle size={20} className={styles.FDDetailsConfirmIcon} />
                <p className={styles.FDDetailsConfirmText}>Are you sure you want to remove this FD?</p>
                <div className={styles.FDDetailsConfirmActions}>
                  <button
                    type="button"
                    className={styles.FDDetailsCancelBtn}
                    onClick={() => setShowConfirm(false)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={styles.FDDetailsDeleteBtn}
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Yes, Remove'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className={styles.FDDetailsRemoveBtn}
                onClick={() => setShowConfirm(true)}
              >
                <Trash2 size={16} />
                Remove FD
              </button>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}
