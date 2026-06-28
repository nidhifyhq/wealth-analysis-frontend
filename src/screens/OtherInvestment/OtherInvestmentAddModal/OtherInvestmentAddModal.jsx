import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { createOtherInvestment } from '../../../services/apis/portfolio.service';
import styles from './OtherInvestmentAddModal.module.css';

export default function OtherInvestmentAddModal({ isOpen, onClose, onSuccess }) {
  const [investmentName, setInvestmentName] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [numberOfUnits, setNumberOfUnits] = useState('');
  const [currentPricePerUnit, setCurrentPricePerUnit] = useState('');
  const [dateOfInvestment, setDateOfInvestment] = useState(null);
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
      setInvestmentName('');
      setPricePerUnit('');
      setNumberOfUnits('');
      setCurrentPricePerUnit('');
      setDateOfInvestment(null);
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!investmentName.trim()) errs.investmentName = 'Investment name is required';
    if (!pricePerUnit || isNaN(pricePerUnit) || Number(pricePerUnit) <= 0) errs.pricePerUnit = 'Enter a valid price';
    if (!numberOfUnits || isNaN(numberOfUnits) || Number(numberOfUnits) <= 0) errs.numberOfUnits = 'Enter a valid number';
    if (!currentPricePerUnit || isNaN(currentPricePerUnit) || Number(currentPricePerUnit) <= 0) errs.currentPricePerUnit = 'Enter a valid price';
    if (!dateOfInvestment) errs.dateOfInvestment = 'Select date of investment';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      investmentName: investmentName.trim(),
      pricePerUnit: Number(pricePerUnit),
      numberOfUnits: Number(numberOfUnits),
      currentPricePerUnit: Number(currentPricePerUnit),
      dateOfInvestment: dateOfInvestment.toISOString().split('T')[0],
    };
    const res = await createOtherInvestment(payload);
    setSubmitting(false);
    if (res && res.success) {
      setResult({ success: true, investmentName: investmentName.trim() });
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
    <div className={styles.OtherInvestmentAddModalOverlay} onClick={result ? undefined : onClose}>
      <div className={styles.OtherInvestmentAddModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.OtherInvestmentAddModalHeader}>
          <h2 className={styles.OtherInvestmentAddModalTitle}>Add Other Investment Information</h2>
          <button className={styles.OtherInvestmentAddModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div className={styles.OtherInvestmentAddModalResult}>
            {result.success ? (
              <>
                <CheckCircle size={48} className={styles.OtherInvestmentAddModalSuccessIcon} />
                <h3 className={styles.OtherInvestmentAddModalResultTitle}>Added Successfully!</h3>
              </>
            ) : (
              <>
                <XCircle size={48} className={styles.OtherInvestmentAddModalFailIcon} />
                <h3 className={styles.OtherInvestmentAddModalResultTitle}>Failed to Add</h3>
                <p className={styles.OtherInvestmentAddModalResultText}>Please try again later.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={styles.OtherInvestmentAddModalForm}>
              <div className={styles.OtherInvestmentAddModalField}>
                <label className={styles.OtherInvestmentAddModalFieldLabel}>Investment Name</label>
                <input
                  className={`${styles.OtherInvestmentAddModalInput} ${errors.investmentName ? styles.OtherInvestmentAddModalInputError : ''}`}
                  placeholder="e.g. PPF"
                  value={investmentName}
                  onChange={(e) => { setInvestmentName(e.target.value); setErrors((p) => ({ ...p, investmentName: '' })); }}
                />
                {errors.investmentName && <span className={styles.OtherInvestmentAddModalErrorText}>{errors.investmentName}</span>}
              </div>

              <div className={styles.OtherInvestmentAddModalField}>
                <DatePicker
                  label="Date of Investment"
                  value={dateOfInvestment}
                  onChange={(v) => { setDateOfInvestment(v); setErrors((p) => ({ ...p, dateOfInvestment: '' })); }}
                  placeholder="Select date"
                />
                {errors.dateOfInvestment && <span className={styles.OtherInvestmentAddModalErrorText}>{errors.dateOfInvestment}</span>}
              </div>

              <div className={styles.OtherInvestmentAddModalField}>
                <label className={styles.OtherInvestmentAddModalFieldLabel}>Investment value per Unit (₹)</label>
                <input
                  className={`${styles.OtherInvestmentAddModalInput} ${errors.pricePerUnit ? styles.OtherInvestmentAddModalInputError : ''}`}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100"
                  value={pricePerUnit}
                  onChange={(e) => { setPricePerUnit(e.target.value); setErrors((p) => ({ ...p, pricePerUnit: '' })); }}
                />
                {errors.pricePerUnit && <span className={styles.OtherInvestmentAddModalErrorText}>{errors.pricePerUnit}</span>}
              </div>

              <div className={styles.OtherInvestmentAddModalField}>
                <label className={styles.OtherInvestmentAddModalFieldLabel}>Number of Units</label>
                <input
                  className={`${styles.OtherInvestmentAddModalInput} ${errors.numberOfUnits ? styles.OtherInvestmentAddModalInputError : ''}`}
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={numberOfUnits}
                  onChange={(e) => { setNumberOfUnits(e.target.value); setErrors((p) => ({ ...p, numberOfUnits: '' })); }}
                />
                {errors.numberOfUnits && <span className={styles.OtherInvestmentAddModalErrorText}>{errors.numberOfUnits}</span>}
              </div>

              <div className={styles.OtherInvestmentAddModalField}>
                <label className={styles.OtherInvestmentAddModalFieldLabel}>Current Price per Unit (₹)</label>
                <input
                  className={`${styles.OtherInvestmentAddModalInput} ${errors.currentPricePerUnit ? styles.OtherInvestmentAddModalInputError : ''}`}
                  type="number"
                  step="0.01"
                  placeholder="115"
                  value={currentPricePerUnit}
                  onChange={(e) => { setCurrentPricePerUnit(e.target.value); setErrors((p) => ({ ...p, currentPricePerUnit: '' })); }}
                />
                {errors.currentPricePerUnit && <span className={styles.OtherInvestmentAddModalErrorText}>{errors.currentPricePerUnit}</span>}
              </div>
            </div>

            <button
              type="button"
              className={styles.OtherInvestmentAddModalSubmitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Other Investment'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
