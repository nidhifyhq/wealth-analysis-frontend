import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import Select from 'react-select';
import DatePicker from '../../../components/DatePicker/DatePicker';
import { createGold } from '../../../services/apis/portfolio.service';
import styles from './GoldAddModal.module.css';

const categoryOptions = [
  { value: 'Jewellery', label: 'Jewellery' },
  { value: 'Coin', label: 'Coin' },
  { value: 'Bar', label: 'Bar' },
  { value: 'Digital', label: 'Digital' },
  { value: 'Other', label: 'Other' },
];

const caratOptions = [
  { value: '18K', label: '18K' },
  { value: '22K', label: '22K' },
  { value: '24K', label: '24K' },
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

export default function GoldAddModal({ isOpen, onClose, onSuccess }) {
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState(null);
  const [carat, setCarat] = useState(null);
  const [weightGrams, setWeightGrams] = useState('');
  const [purchasePricePerGram, setPurchasePricePerGram] = useState('');
  const [currentPricePerGram, setCurrentPricePerGram] = useState('');
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
      setAssetName('');
      setCategory(null);
      setCarat(null);
      setWeightGrams('');
      setPurchasePricePerGram('');
      setCurrentPricePerGram('');
      setDateOfInvestment(null);
      setErrors({});
      setSubmitting(false);
      setResult(null);
    }
  }, [isOpen]);

  const validate = () => {
    const errs = {};
    if (!assetName.trim()) errs.assetName = 'Asset name is required';
    if (!category) errs.category = 'Select a category';
    if (!carat) errs.carat = 'Select carat';
    if (!weightGrams || isNaN(weightGrams) || Number(weightGrams) <= 0) errs.weightGrams = 'Enter a valid weight';
    if (!purchasePricePerGram || isNaN(purchasePricePerGram) || Number(purchasePricePerGram) <= 0) errs.purchasePricePerGram = 'Enter a valid price';
    if (!currentPricePerGram || isNaN(currentPricePerGram) || Number(currentPricePerGram) <= 0) errs.currentPricePerGram = 'Enter a valid price';
    if (!dateOfInvestment) errs.dateOfInvestment = 'Select date of investment';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const payload = {
      assetName: assetName.trim(),
      category: category.value,
      carat: carat.value,
      weightGrams: Number(weightGrams),
      purchasePricePerGram: Number(purchasePricePerGram),
      currentPricePerGram: Number(currentPricePerGram),
      dateOfInvestment: dateOfInvestment.toISOString().split('T')[0],
    };
    const res = await createGold(payload);
    setSubmitting(false);
    if (res && res.success) {
      setResult({ success: true, assetName: assetName.trim() });
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
    <div className={styles.GoldAddModalOverlay} onClick={result ? undefined : onClose}>
      <div className={styles.GoldAddModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.GoldAddModalHeader}>
          <h2 className={styles.GoldAddModalTitle}>Add Gold Investment Information</h2>
          <button className={styles.GoldAddModalCloseBtn} onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div className={styles.GoldAddModalResult}>
            {result.success ? (
              <>
                <CheckCircle size={48} className={styles.GoldAddModalSuccessIcon} />
                <h3 className={styles.GoldAddModalResultTitle}>Added Successfully!</h3>
              </>
            ) : (
              <>
                <XCircle size={48} className={styles.GoldAddModalFailIcon} />
                <h3 className={styles.GoldAddModalResultTitle}>Failed to Add</h3>
                <p className={styles.GoldAddModalResultText}>Please try again later.</p>
              </>
            )}
          </div>
        ) : (
          <>
            <div className={styles.GoldAddModalForm}>
              <div className={styles.GoldAddModalField}>
                <label className={styles.GoldAddModalFieldLabel}>Asset Name</label>
                <input
                  className={`${styles.GoldAddModalInput} ${errors.assetName ? styles.GoldAddModalInputError : ''}`}
                  placeholder="e.g. Gold Necklace"
                  value={assetName}
                  onChange={(e) => { setAssetName(e.target.value); setErrors((p) => ({ ...p, assetName: '' })); }}
                />
                {errors.assetName && <span className={styles.GoldAddModalErrorText}>{errors.assetName}</span>}
              </div>

              <div className={styles.GoldAddModalRow}>
                <div className={styles.GoldAddModalField}>
                  <label className={styles.GoldAddModalFieldLabel}>Category</label>
                  <Select
                    options={categoryOptions}
                    value={category}
                    onChange={(v) => { setCategory(v); setErrors((p) => ({ ...p, category: '' })); }}
                    placeholder="Select category"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                </div>
                <div className={styles.GoldAddModalField}>
                  <label className={styles.GoldAddModalFieldLabel}>Carat</label>
                  <Select
                    options={caratOptions}
                    value={carat}
                    onChange={(v) => { setCarat(v); setErrors((p) => ({ ...p, carat: '' })); }}
                    placeholder="Select"
                    styles={selectStyles}
                    isSearchable={false}
                  />
                </div>
              </div>
              <div className={styles.GoldAddModalField}>
                {errors.category && <span className={styles.GoldAddModalErrorText}>{errors.category}</span>}
                {!errors.category && errors.carat && <span className={styles.GoldAddModalErrorText}>{errors.carat}</span>}
              </div>
              <div className={styles.GoldAddModalField}>
                <label className={styles.GoldAddModalFieldLabel}>Weight (Grams)</label>
                <input
                  className={`${styles.GoldAddModalInput} ${errors.weightGrams ? styles.GoldAddModalInputError : ''}`}
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="20.5"
                  value={weightGrams}
                  onChange={(e) => { setWeightGrams(e.target.value); setErrors((p) => ({ ...p, weightGrams: '' })); }}
                />
                {errors.weightGrams && <span className={styles.GoldAddModalErrorText}>{errors.weightGrams}</span>}
              </div>

              <div className={styles.GoldAddModalField}>
                <label className={styles.GoldAddModalFieldLabel}>Purchase Price (per Gram ₹)</label>
                <input
                  className={`${styles.GoldAddModalInput} ${errors.purchasePricePerGram ? styles.GoldAddModalInputError : ''}`}
                  type="number"
                  placeholder="5500"
                  value={purchasePricePerGram}
                  onChange={(e) => { setPurchasePricePerGram(e.target.value); setErrors((p) => ({ ...p, purchasePricePerGram: '' })); }}
                />
                {errors.purchasePricePerGram && <span className={styles.GoldAddModalErrorText}>{errors.purchasePricePerGram}</span>}
              </div>

              <div className={styles.GoldAddModalField}>
                <label className={styles.GoldAddModalFieldLabel}>Current Price (per Gram ₹)</label>
                <input
                  className={`${styles.GoldAddModalInput} ${errors.currentPricePerGram ? styles.GoldAddModalInputError : ''}`}
                  type="number"
                  placeholder="6200"
                  value={currentPricePerGram}
                  onChange={(e) => { setCurrentPricePerGram(e.target.value); setErrors((p) => ({ ...p, currentPricePerGram: '' })); }}
                />
                {errors.currentPricePerGram && <span className={styles.GoldAddModalErrorText}>{errors.currentPricePerGram}</span>}
              </div>

              <div className={styles.GoldAddModalField}>
                <DatePicker
                  label="Date of Investment"
                  value={dateOfInvestment}
                  onChange={(v) => { setDateOfInvestment(v); setErrors((p) => ({ ...p, dateOfInvestment: '' })); }}
                  placeholder="Select date"
                />
                {errors.dateOfInvestment && <span className={styles.GoldAddModalErrorText}>{errors.dateOfInvestment}</span>}
              </div>
            </div>

            <button
              type="button"
              className={styles.GoldAddModalSubmitBtn}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Investment'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
