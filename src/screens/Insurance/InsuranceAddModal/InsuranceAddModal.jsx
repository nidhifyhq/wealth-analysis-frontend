import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { createInsurance } from '../../../services/apis/portfolio.service';
import styles from './InsuranceAddModal.module.css';

const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
};

const healthPolicyTypes = ['Family Floater', 'Personal', 'Company'];

export default function InsuranceAddModal({ isOpen, onClose, onSuccess, insuranceType }) {
  const [insuranceCompany, setInsuranceCompany] = useState('');
  const [policyHolderName, setPolicyHolderName] = useState('');
  const [policyType, setPolicyType] = useState('');
  const [coverageAmount, setCoverageAmount] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [expiryDate, setExpiryDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

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

  useEffect(() => {
    if (!isOpen) {
      setInsuranceCompany('');
      setPolicyHolderName('');
      setPolicyType('');
      setCoverageAmount('');
      setStartDate(null);
      setExpiryDate(null);
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!insuranceCompany.trim()) errs.insuranceCompany = 'Insurance company is required';
    if (!coverageAmount || isNaN(coverageAmount) || Number(coverageAmount) <= 0) errs.coverageAmount = 'Enter a valid coverage amount';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      insuranceType,
      insuranceCompany: insuranceCompany.trim(),
      coverageAmount: Number(coverageAmount),
    };
    if (policyHolderName.trim()) {
      payload.policyHolderName = toTitleCase(policyHolderName.trim());
    }
    if (insuranceType === 'Health' && policyType) {
      payload.policyType = policyType;
    }
    if (startDate) {
      payload.startDate = startDate.toISOString().split('T')[0];
    }
    if (expiryDate) {
      payload.expiryDate = expiryDate.toISOString().split('T')[0];
    }
    const res = await createInsurance(payload);
    setSubmitting(false);
    if (res && res.success) {
      setResult({ success: true, insuranceCompany: insuranceCompany.trim() });
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } else {
      setResult({ success: false });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.InsuranceAddModalOverlay} onClick={result ? undefined : onClose}>
      <div className={styles.InsuranceAddModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.InsuranceAddModalHeader}>
          <h2 className={styles.InsuranceAddModalTitle}>Add {insuranceType} Insurance Policy</h2>
          <button className={styles.InsuranceAddModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div className={styles.InsuranceAddModalResult}>
            {result.success ? (
              <>
                <CheckCircle size={48} className={styles.InsuranceAddModalSuccessIcon} />
                <h3 className={styles.InsuranceAddModalResultTitle}>Added Successfully!</h3>
              </>
            ) : (
              <>
                <XCircle size={48} className={styles.InsuranceAddModalFailIcon} />
                <h3 className={styles.InsuranceAddModalResultTitle}>Failed to Add</h3>
                <p className={styles.InsuranceAddModalResultText}>Please try again later.</p>
              </>
            )}
          </div>
        ) : (
          <>
            {/* <div className={styles.InsuranceAddModalInsuranceTypeBadge}>
              {insuranceType} Insurance
            </div> */}

            <div className={styles.InsuranceAddModalForm}>
              <div className={styles.InsuranceAddModalField}>
                <label className={styles.InsuranceAddModalFieldLabel}>Insurance Company</label>
                <input
                  className={`${styles.InsuranceAddModalInput} ${errors.insuranceCompany ? styles.InsuranceAddModalInputError : ''}`}
                  placeholder="e.g. LIC"
                  value={insuranceCompany}
                  onChange={(e) => { setInsuranceCompany(e.target.value); setErrors((p) => ({ ...p, insuranceCompany: '' })); }}
                />
                {errors.insuranceCompany && <span className={styles.InsuranceAddModalErrorText}>{errors.insuranceCompany}</span>}
              </div>

              <div className={styles.InsuranceAddModalField}>
                <label className={styles.InsuranceAddModalFieldLabel}>Policy Holder Name <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                <input
                  className={`${styles.InsuranceAddModalInput}`}
                  placeholder="e.g. John Doe"
                  value={policyHolderName}
                  onChange={(e) => setPolicyHolderName(e.target.value)}
                />
              </div>

              {insuranceType === 'Health' && (
                <div className={styles.InsuranceAddModalField}>
                  <label className={styles.InsuranceAddModalFieldLabel}>Policy Type</label>
                  <div className={styles.InsuranceAddModalPolicyTypeTabs}>
                    {healthPolicyTypes.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`${styles.InsuranceAddModalPolicyTypeTab} ${policyType === t ? styles.InsuranceAddModalPolicyTypeTabActive : ''}`}
                        onClick={() => setPolicyType(policyType === t ? '' : t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.InsuranceAddModalField}>
                <label className={styles.InsuranceAddModalFieldLabel}>Coverage Amount (₹)</label>
                <input
                  className={`${styles.InsuranceAddModalInput} ${errors.coverageAmount ? styles.InsuranceAddModalInputError : ''}`}
                  type="number"
                  min="0"
                  placeholder="e.g. 10000000"
                  value={coverageAmount}
                  onChange={(e) => { setCoverageAmount(e.target.value); setErrors((p) => ({ ...p, coverageAmount: '' })); }}
                />
                {errors.coverageAmount && <span className={styles.InsuranceAddModalErrorText}>{errors.coverageAmount}</span>}
              </div>

              <div className={styles.InsuranceAddModalField}>
                <DatePicker
                  label="Start Date (optional)"
                  value={startDate}
                  onChange={(v) => setStartDate(v)}
                  placeholder="Select date"
                />
              </div>

              <div className={styles.InsuranceAddModalField}>
                <DatePicker
                  label="Expiry Date (optional)"
                  value={expiryDate}
                  onChange={(v) => setExpiryDate(v)}
                  placeholder="Select date"
                />
              </div>
            </div>

            <button
              type="button"
              className={styles.InsuranceAddModalSubmitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : `Add ${insuranceType} Insurance`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
