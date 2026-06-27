import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import Select from 'react-select';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { createRD } from '../../../services/apis/portfolio.service';
import styles from './RDAddModal.module.css';

const compoundingOptions = [
  { value: 'Quarterly', label: 'Quarterly' },
  { value: 'HalfYearly', label: 'Half-Yearly' },
  { value: 'Yearly', label: 'Yearly' },
];

const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}`,
}));

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

export default function RDAddModal({ isOpen, onClose, onSuccess }) {
  const [institutionName, setInstitutionName] = useState('');
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [depositDayOfMonth, setDepositDayOfMonth] = useState(null);
  const [compoundingFrequency, setCompoundingFrequency] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [tenureYears, setTenureYears] = useState('0');
  const [tenureMonths, setTenureMonths] = useState('0');
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
      setMonthlyDeposit('');
      setInterestRate('');
      setDepositDayOfMonth(null);
      setCompoundingFrequency(null);
      setStartDate(null);
      setTenureYears('0');
      setTenureMonths('0');
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!institutionName.trim()) errs.institutionName = 'Institution name is required';
    if (!monthlyDeposit || isNaN(monthlyDeposit) || Number(monthlyDeposit) <= 0) errs.monthlyDeposit = 'Enter a valid monthly deposit amount';
    if (!interestRate || isNaN(interestRate) || Number(interestRate) <= 0) errs.interestRate = 'Enter a valid interest rate';
    if (!depositDayOfMonth) errs.depositDayOfMonth = 'Select deposit day';
    if (!compoundingFrequency) errs.compoundingFrequency = 'Select compounding frequency';
    if (!startDate) errs.startDate = 'Select start date';
    const y = Number(tenureYears);
    const m = Number(tenureMonths);
    if (isNaN(y) || y < 0 || y > 10) errs.tenureYears = 'Years must be between 0 and 10.';
    if (isNaN(m) || m < 0 || m > 12) errs.tenureMonths = 'Months must be between 0 and 12.';
    if (!errs.tenureYears && !errs.tenureMonths && y === 0 && m === 0) {
      errs.tenureYears = 'Please enter at least one tenure value.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const computeDate = (date, years, months) => {
    const d = new Date(date);
    d.setFullYear(d.getFullYear() + years);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const y = Number(tenureYears);
    const m = Number(tenureMonths);
    const startISO = startDate.toISOString().split('T')[0];
    const payload = {
      institutionName: institutionName.trim().replace(/\b\w/g, (c) => c.toUpperCase()),
      monthlyDeposit: Number(monthlyDeposit),
      interestRate: Number(interestRate),
      depositDayOfMonth: depositDayOfMonth.value,
      compoundingFrequency: compoundingFrequency.value,
      startDate: startISO,
      maturityDate: computeDate(startDate, y, m),
      tenure: `${y}Y ${m}M`,
    };
    const res = await createRD(payload);
    setSubmitting(false);
    if (res && res.success) {
      setResult({ success: true, institutionName: institutionName.trim(), monthlyDeposit: Number(monthlyDeposit) });
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
    <div className={styles.RDAddModalOverlay} onClick={result ? undefined : onClose}>
      <div className={styles.RDAddModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.RDAddModalHeader}>
          <h2 className={styles.RDAddModalTitle}>Add Recurring Deposit Investment Information</h2>
          <button className={styles.RDAddModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div className={styles.RDAddModalResult}>
            {result.success ? (
              <>
                <CheckCircle size={48} className={styles.RDAddModalSuccessIcon} />
                <h3 className={styles.RDAddModalResultTitle}>Added Successfully!</h3>
                {/* <p className={styles.RDAddModalResultText}>
                  {result.institutionName.toUpperCase()} — ₹{result.monthlyDeposit.toLocaleString('en-IN')}/month
                </p> */}
              </>
            ) : (
              <>
                <XCircle size={48} className={styles.RDAddModalFailIcon} />
                <h3 className={styles.RDAddModalResultTitle}>Failed to Add</h3>
                <p className={styles.RDAddModalResultText}>Please try again later.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={styles.RDAddModalForm}>
              <div className={styles.RDAddModalField}>
                <label className={styles.RDAddModalFieldLabel}>Organisation Name</label>
                <input
                  className={`${styles.RDAddModalInput} ${errors.institutionName ? styles.RDAddModalInputError : ''}`}
                  placeholder="e.g. Post Office"
                  value={institutionName}
                  onChange={(e) => { setInstitutionName(e.target.value); setErrors((p) => ({ ...p, institutionName: '' })); }}
                />
                {errors.institutionName && <span className={styles.RDAddModalErrorText}>{errors.institutionName}</span>}
              </div>

              <div className={styles.RDAddModalRow}>
                <div className={styles.RDAddModalField}>
                  <label className={styles.RDAddModalFieldLabel}>Monthly Deposit (₹)</label>
                  <input
                    className={`${styles.RDAddModalInput} ${errors.monthlyDeposit ? styles.RDAddModalInputError : ''}`}
                    type="number"
                    placeholder="5000"
                    value={monthlyDeposit}
                    onChange={(e) => { setMonthlyDeposit(e.target.value); setErrors((p) => ({ ...p, monthlyDeposit: '' })); }}
                  />
                  {errors.monthlyDeposit && <span className={styles.RDAddModalErrorText}>{errors.monthlyDeposit}</span>}
                </div>
                <div className={styles.RDAddModalField}>
                  <label className={styles.RDAddModalFieldLabel}>Interest Rate (Annual)</label>
                  <input
                    className={`${styles.RDAddModalInput} ${errors.interestRate ? styles.RDAddModalInputError : ''}`}
                    type="number"
                    step="0.1"
                    placeholder="6.7"
                    value={interestRate}
                    onChange={(e) => { setInterestRate(e.target.value); setErrors((p) => ({ ...p, interestRate: '' })); }}
                  />
                  {errors.interestRate && <span className={styles.RDAddModalErrorText}>{errors.interestRate}</span>}
                </div>
              </div>

              <div className={styles.RDAddModalRow}>
                <div className={styles.RDAddModalField}>
                  <label className={styles.RDAddModalFieldLabel}>Deposit Day of Month</label>
                  <Select
                    options={dayOptions}
                    value={depositDayOfMonth}
                    onChange={(v) => { setDepositDayOfMonth(v); setErrors((p) => ({ ...p, depositDayOfMonth: '' })); }}
                    placeholder="Select day"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  {errors.depositDayOfMonth && <span className={styles.RDAddModalErrorText}>{errors.depositDayOfMonth}</span>}
                </div>
                <div className={styles.RDAddModalField}>
                  <label className={styles.RDAddModalFieldLabel}>Compounding Frequency</label>
                  <Select
                    options={compoundingOptions}
                    value={compoundingFrequency}
                    onChange={(v) => { setCompoundingFrequency(v); setErrors((p) => ({ ...p, compoundingFrequency: '' })); }}
                    placeholder="Select"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                  {errors.compoundingFrequency && <span className={styles.RDAddModalErrorText}>{errors.compoundingFrequency}</span>}
                </div>
              </div>

              <div className={styles.RDAddModalField}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(v) => { setStartDate(v); setErrors((p) => ({ ...p, startDate: '' })); }}
                  placeholder="Select start date"
                />
                {errors.startDate && <span className={styles.RDAddModalErrorText}>{errors.startDate}</span>}
              </div>

              <div className={styles.RDAddModalField}>
                <label className={styles.RDAddModalFieldLabel}>Tenure</label>
                <div className={styles.RDAddModalTenureRow}>
                  <div className={styles.RDAddModalTenureField}>
                    <input
                      className={`${styles.RDAddModalInput} ${errors.tenureYears ? styles.RDAddModalInputError : ''}`}
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
                    <span className={styles.RDAddModalTenureLabel}>Year(s)</span>
                  </div>
                  <div className={styles.RDAddModalTenureField}>
                    <input
                      className={`${styles.RDAddModalInput} ${errors.tenureMonths ? styles.RDAddModalInputError : ''}`}
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
                    <span className={styles.RDAddModalTenureLabel}>Month(s)</span>
                  </div>
                </div>
                {errors.tenureYears && <span className={styles.RDAddModalErrorText}>{errors.tenureYears}</span>}
                {!errors.tenureYears && errors.tenureMonths && <span className={styles.RDAddModalErrorText}>{errors.tenureMonths}</span>}
              </div>
            </div>

            <button
              type="button"
              className={styles.RDAddModalSubmitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Recurring Deposit'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
