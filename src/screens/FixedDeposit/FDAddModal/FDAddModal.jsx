import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import Select from 'react-select';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { createFD } from '../../../services/apis/portfolio.service';
import styles from './FDAddModal.module.css';

const fdTypeOptions = [
  { value: 'Cumulative', label: 'Cumulative (interest reinvested, paid at maturity)' },
  { value: 'Payout', label: 'Payout (interest paid periodically)' },
  { value: 'TaxSaving', label: 'TaxSaving (5-year lock-in)' },
];

const compoundingOptions = [
  { value: 'AtMaturity', label: 'At Maturity' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'HalfYearly', label: 'Half-Yearly' },
  { value: 'Yearly', label: 'Yearly' },
];

const selectStyles = {
  control: (base, state) => ({
    ...base,
    background: '#fafafa',
    border: state.isFocused ? '1.5px solid #0c3e38' : '1.5px solid #d1d5db',
    borderRadius: 12,
    padding: '2px 4px',
    boxShadow: 'none',
    cursor: 'pointer',
    '&:hover': { borderColor: '#0c3e38' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: 14, fontWeight: 400 }),
  singleValue: (base) => ({ ...base, color: '#111827', fontSize: 14, fontWeight: 500 }),
  menu: (base) => ({ ...base, borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', zIndex: 60 }),
  option: (base, state) => ({
    ...base,
    fontSize: 13,
    color: state.isSelected ? '#ffffff' : '#374151',
    background: state.isSelected ? '#0c3e38' : state.isFocused ? '#f0fdf4' : '#ffffff',
    cursor: 'pointer',
  }),
  valueContainer: (base) => ({ ...base, padding: '4px 8px' }),
  indicatorSeparator: () => ({ display: 'none' }),
  dropdownIndicator: (base) => ({ ...base, color: '#9ca3af', padding: '4px' }),
};

export default function FDAddModal({ isOpen, onClose, onSuccess }) {
  const [institutionName, setInstitutionName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [fdType, setFdType] = useState(null);
  const [compoundingFrequency, setCompoundingFrequency] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [tenureYears, setTenureYears] = useState('0');
  const [tenureMonths, setTenureMonths] = useState('0');
  const [tenureDays, setTenureDays] = useState('0');
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
      setInstitutionName('');
      setPrincipal('');
      setInterestRate('');
      setFdType(null);
      setCompoundingFrequency(null);
      setStartDate(null);
      setTenureYears('0');
      setTenureMonths('0');
      setTenureDays('0');
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!institutionName.trim()) errs.institutionName = 'Institution name is required';
    if (!principal || isNaN(principal) || Number(principal) <= 0) errs.principal = 'Enter a valid principal amount';
    if (!interestRate || isNaN(interestRate) || Number(interestRate) <= 0) errs.interestRate = 'Enter a valid interest rate';
    if (!fdType) errs.fdType = 'Select FD type';
    if (!compoundingFrequency) errs.compoundingFrequency = 'Select compounding frequency';
    if (!startDate) errs.startDate = 'Select start date';
    const y = Number(tenureYears);
    const m = Number(tenureMonths);
    const d = Number(tenureDays);
    if (isNaN(y) || y < 0 || y > 10) errs.tenureYears = 'Years must be between 0 and 10.';
    if (isNaN(m) || m < 0 || m > 12) errs.tenureMonths = 'Months must be between 0 and 12.';
    if (isNaN(d) || d < 0 || d > 30) errs.tenureDays = 'Days must be between 0 and 30.';
    if (!errs.tenureYears && !errs.tenureMonths && !errs.tenureDays && y === 0 && m === 0 && d === 0) {
      errs.tenureYears = 'Please enter at least one tenure value.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      institutionName: institutionName.trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      principal: Number(principal),
      interestRate: Number(interestRate),
      fdType: fdType.value,
      compoundingFrequency: compoundingFrequency.value,
      startDate: startDate.toISOString().split('T')[0],
      tenure: `${Number(tenureYears)}Y ${Number(tenureMonths)}M ${Number(tenureDays)}D`,
    };
    const res = await createFD(payload);
    setSubmitting(false);
    if (res && res.success) {
      setResult({ success: true, institutionName: institutionName.trim(), principal: Number(principal) });
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
    <div className={styles.FDAddModalOverlay} onClick={result ? undefined : onClose}>
      <div className={styles.FDAddModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.FDAddModalHeader}>
          <h2 className={styles.FDAddModalTitle}>Add Fixed Deposit Investment Information</h2>
          <button className={styles.FDAddModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div className={styles.FDAddModalResult}>
            {result.success ? (
              <>
                <CheckCircle size={48} className={styles.FDAddModalSuccessIcon} />
                <h3 className={styles.FDAddModalResultTitle}>Added Successfully!</h3>
                <p className={styles.FDAddModalResultText}>
                  {result.institutionName.toUpperCase()} — ₹{result.principal.toLocaleString('en-IN')}
                </p>
              </>
            ) : (
              <>
                <XCircle size={48} className={styles.FDAddModalFailIcon} />
                <h3 className={styles.FDAddModalResultTitle}>Failed to Add</h3>
                <p className={styles.FDAddModalResultText}>Please try again later.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={styles.FDAddModalForm}>
              <div className={styles.FDAddModalField}>
                <label className={styles.FDAddModalFieldLabel}>Organisation Name</label>
                <input
                  className={`${styles.FDAddModalInput} ${errors.institutionName ? styles.FDAddModalInputError : ''}`}
                  placeholder="e.g. State Bank of India"
                  value={institutionName}
                  onChange={(e) => { setInstitutionName(e.target.value); setErrors((p) => ({ ...p, institutionName: '' })); }}
                />
                {errors.institutionName && <span className={styles.FDAddModalErrorText}>{errors.institutionName}</span>}
              </div>

              <div className={styles.FDAddModalRow}>
                <div className={styles.FDAddModalField}>
                  <label className={styles.FDAddModalFieldLabel}>Enter Invested Value (₹)</label>
                  <input
                    className={`${styles.FDAddModalInput} ${errors.principal ? styles.FDAddModalInputError : ''}`}
                    type="number"
                    placeholder="100000"
                    value={principal}
                    onChange={(e) => { setPrincipal(e.target.value); setErrors((p) => ({ ...p, principal: '' })); }}
                  />
                  {errors.principal && <span className={styles.FDAddModalErrorText}>{errors.principal}</span>}
                </div>
                <div className={styles.FDAddModalField}>
                  <label className={styles.FDAddModalFieldLabel}>Interest Rate (Annual)</label>
                  <input
                    className={`${styles.FDAddModalInput} ${errors.interestRate ? styles.FDAddModalInputError : ''}`}
                    type="number"
                    step="0.1"
                    placeholder="7.5"
                    value={interestRate}
                    onChange={(e) => { setInterestRate(e.target.value); setErrors((p) => ({ ...p, interestRate: '' })); }}
                  />
                  {errors.interestRate && <span className={styles.FDAddModalErrorText}>{errors.interestRate}</span>}
                </div>
              </div>

              <div className={styles.FDAddModalRow}>
                <div className={styles.FDAddModalField}>
                  <label className={styles.FDAddModalFieldLabel}>FD Type</label>
                  <Select
                    options={fdTypeOptions}
                    value={fdType}
                    onChange={(v) => { setFdType(v); setErrors((p) => ({ ...p, fdType: '' })); }}
                    placeholder="Select type"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  {errors.fdType && <span className={styles.FDAddModalErrorText}>{errors.fdType}</span>}
                </div>
                <div className={styles.FDAddModalField}>
                  <label className={styles.FDAddModalFieldLabel}>Compounding Frequency</label>
                  <Select
                    options={compoundingOptions}
                    value={compoundingFrequency}
                    onChange={(v) => { setCompoundingFrequency(v); setErrors((p) => ({ ...p, compoundingFrequency: '' })); }}
                    placeholder="Select"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  {errors.compoundingFrequency && <span className={styles.FDAddModalErrorText}>{errors.compoundingFrequency}</span>}
                </div>
              </div>

              <div className={styles.FDAddModalField}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(v) => { setStartDate(v); setErrors((p) => ({ ...p, startDate: '' })); }}
                  placeholder="Select start date"
                />
                {errors.startDate && <span className={styles.FDAddModalErrorText}>{errors.startDate}</span>}
              </div>

              <div className={styles.FDAddModalField}>
                <label className={styles.FDAddModalFieldLabel}>Tenure</label>
                <div className={styles.FDAddModalTenureRow}>
                  <div className={styles.FDAddModalTenureField}>
                    <input
                      className={`${styles.FDAddModalInput} ${errors.tenureYears ? styles.FDAddModalInputError : ''}`}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="0"
                      value={tenureYears}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        if (v === '' || Number(v) <= 10) { setTenureYears(v); setErrors((p) => ({ ...p, tenureYears: '' })); }
                      }}
                    />
                    <span className={styles.FDAddModalTenureLabel}>Year(s)</span>
                  </div>
                  <div className={styles.FDAddModalTenureField}>
                    <input
                      className={`${styles.FDAddModalInput} ${errors.tenureMonths ? styles.FDAddModalInputError : ''}`}
                      type="number"
                      min="0"
                      max="12"
                      placeholder="0"
                      value={tenureMonths}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        if (v === '' || Number(v) <= 12) { setTenureMonths(v); setErrors((p) => ({ ...p, tenureMonths: '' })); }
                      }}
                    />
                    <span className={styles.FDAddModalTenureLabel}>Month(s)</span>
                  </div>
                  <div className={styles.FDAddModalTenureField}>
                    <input
                      className={`${styles.FDAddModalInput} ${errors.tenureDays ? styles.FDAddModalInputError : ''}`}
                      type="number"
                      min="0"
                      max="30"
                      placeholder="0"
                      value={tenureDays}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        if (v === '' || Number(v) <= 30) { setTenureDays(v); setErrors((p) => ({ ...p, tenureDays: '' })); }
                      }}
                    />
                    <span className={styles.FDAddModalTenureLabel}>Day(s)</span>
                  </div>
                </div>
                {errors.tenureYears && <span className={styles.FDAddModalErrorText}>{errors.tenureYears}</span>}
                {!errors.tenureYears && errors.tenureMonths && <span className={styles.FDAddModalErrorText}>{errors.tenureMonths}</span>}
                {!errors.tenureYears && !errors.tenureMonths && errors.tenureDays && <span className={styles.FDAddModalErrorText}>{errors.tenureDays}</span>}
              </div>
            </div>

            <button
              type="button"
              className={styles.FDAddModalSubmitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Fixed Deposit'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
