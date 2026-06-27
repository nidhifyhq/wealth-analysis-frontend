import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './SIPCalculator.module.css';
import { useNavigate } from 'react-router-dom';

const SIPCalculator = () => {
  // Tabs: 'SIP' or 'Lumpsum'
  const [activeTab, setActiveTab] = useState('SIP');
  const navigate = useNavigate();

  // Input states (Values initialized in INR)
  const [investment, setInvestment] = useState(25000);
  const [returnRate, setReturnRate] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  // Math configurations based on selected mode
  const calculations = useMemo(() => {
    const P = investment;
    const i = returnRate / 12 / 100;
    const n = timePeriod * 12;

    let investedAmount = 0;
    let totalValue = 0;

    if (activeTab === 'SIP') {
      investedAmount = P * n;
      // SIP Formula: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
      totalValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    } else {
      investedAmount = P;
      // Lumpsum Formula: A = P * (1 + r/100)^t
      totalValue = P * Math.pow(1 + returnRate / 100, timePeriod);
    }

    const estReturns = Math.max(0, totalValue - investedAmount);
    
    // Percentage split for the donut ring chart
    const principalPercent = totalValue > 0 ? (investedAmount / totalValue) * 100 : 100;
    const interestPercent = totalValue > 0 ? (estReturns / totalValue) * 100 : 0;

    return {
      investedAmount: Math.round(investedAmount),
      estReturns: Math.round(estReturns),
      totalValue: Math.round(totalValue),
      principalPercent: Math.round(principalPercent),
      interestPercent: Math.round(interestPercent)
    };
  }, [activeTab, investment, returnRate, timePeriod]);

  // Indian Currency Formatter (en-IN layout standard)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // SVG Donut Setup Properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calculations.interestPercent / 100) * circumference;

  return (
    <div className={styles.SIPCalculatorContainer}>
      
      {/* Top Navigation Bar Header */}
      <div className={styles.SIPCalculatorHeader}>
        <button className={styles.SIPCalculatorBackBtn} aria-label="Go back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.SIPCalculatorPageTitle}>SIP & Lumpsum Calculator</h1>
      </div>

      {/* Segmented Controls Toggle Switch */}
      <div className={styles.SIPCalculatorTabWrapper}>
        <button 
          className={`${styles.SIPCalculatorTab} ${activeTab === 'SIP' ? styles.SIPCalculatorTabActive : ''}`}
          onClick={() => setActiveTab('SIP')}
        >
          SIP
        </button>
        <button 
          className={`${styles.SIPCalculatorTab} ${activeTab === 'Lumpsum' ? styles.SIPCalculatorTabActive : ''}`}
          onClick={() => setActiveTab('Lumpsum')}
        >
          Lumpsum
        </button>
      </div>

      {/* Controls & Metrics Section Input Cards */}
      <div className={styles.SIPCalculatorCard}>
        
        {/* Dynamic Parameter Row 1 */}
        <div className={styles.SIPCalculatorInputGroup}>
          <div className={styles.SIPCalculatorLabelRow}>
            <span className={styles.SIPCalculatorFieldLabel}>
              {activeTab === 'SIP' ? 'Monthly Investment' : 'Total Investment'}
            </span>
            <div className={styles.SIPCalculatorValueDisplay}>
              <span className={styles.SIPCalculatorCurrencySign}>₹</span>
              <input 
                type="number" 
                value={investment} 
                onChange={(e) => setInvestment(Number(e.target.value))}
                className={styles.SIPCalculatorNumericInput}
              />
            </div>
          </div>
          <input 
            type="range" 
            min={500} 
            max={500000} 
            step={500}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className={styles.SIPCalculatorSliderRange}
          />
        </div>

        {/* Dynamic Parameter Row 2 */}
        <div className={styles.SIPCalculatorInputGroup}>
          <div className={styles.SIPCalculatorLabelRow}>
            <span className={styles.SIPCalculatorFieldLabel}>Expected Return Rate (%)</span>
            <div className={styles.SIPCalculatorValueDisplay}>
              <input 
                type="number" 
                value={returnRate} 
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className={styles.SIPCalculatorNumericInputShort}
              />
              <span className={styles.SIPCalculatorUnitSign}>%</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={30} 
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className={styles.SIPCalculatorSliderRange}
          />
        </div>

        {/* Dynamic Parameter Row 3 */}
        <div className={styles.SIPCalculatorInputGroup}>
          <div className={styles.SIPCalculatorLabelRow}>
            <span className={styles.SIPCalculatorFieldLabel}>Time Period (Years)</span>
            <div className={styles.SIPCalculatorValueDisplay}>
              <input 
                type="number" 
                value={timePeriod} 
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className={styles.SIPCalculatorNumericInputShort}
              />
              <span className={styles.SIPCalculatorUnitSign}>Yrs</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={40} 
            step={1}
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className={styles.SIPCalculatorSliderRange}
          />
        </div>

      </div>

      {/* Numerical Ledger Results Card */}
      <div className={styles.SIPCalculatorCard}>
        <div className={styles.SIPCalculatorTotalBlock}>
          <span className={styles.SIPCalculatorTotalLabel}>TOTAL VALUE</span>
          <h2 className={styles.SIPCalculatorTotalAmount}>
            {formatCurrency(calculations.totalValue)}
          </h2>
        </div>
        
        <div className={styles.SIPCalculatorGridSplit}>
          <div className={styles.SIPCalculatorSplitItem}>
            <span className={styles.SIPCalculatorSplitLabel}>Invested</span>
            <span className={styles.SIPCalculatorSplitValue}>
              {formatCurrency(calculations.investedAmount)}
            </span>
          </div>
          <div className={styles.SIPCalculatorSplitItem}>
            <span className={styles.SIPCalculatorSplitLabel}>Est. Returns</span>
            <span className={`${styles.SIPCalculatorSplitValue} ${styles.SIPCalculatorGreenText}`}>
              {formatCurrency(calculations.estReturns)}
            </span>
          </div>
        </div>
      </div>

      {/* Donut Data Allocation Ring Chart Card */}
      <div className={styles.SIPCalculatorCard}>
        <div className={styles.SIPCalculatorChartLayout}>
          
          {/* SVG Vector Ring Architecture */}
          <div className={styles.SIPCalculatorDonutWrapper}>
            <svg viewBox="0 0 120 120" className={styles.SIPCalculatorSvgCanvas}>
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.SIPCalculatorCircleBase}
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.SIPCalculatorCircleProgress}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 60 60)" 
              />
            </svg>
            <div className={styles.SIPCalculatorDonutCenter}>
              <span className={styles.SIPCalculatorYieldPercent}>{calculations.interestPercent}%</span>
              <span className={styles.SIPCalculatorYieldLabel}>YIELD</span>
            </div>
          </div>

          {/* Color Mapping Legend Keys */}
          <div className={styles.SIPCalculatorLegendBlock}>
            <div className={styles.SIPCalculatorLegendRow}>
              <span className={`${styles.SIPCalculatorDot} ${styles.SIPCalculatorDotBlue}`} />
              <span className={styles.SIPCalculatorLegendText}>Principal</span>
            </div>
            <div className={styles.SIPCalculatorLegendRow}>
              <span className={`${styles.SIPCalculatorDot} ${styles.SIPCalculatorDotGreen}`} />
              <span className={styles.SIPCalculatorLegendText}>Interest</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SIPCalculator;