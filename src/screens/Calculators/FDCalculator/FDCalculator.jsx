import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import styles from './FDCalculator.module.css';
import { useNavigate } from 'react-router-dom';

const FDCalculator = () => {
  // Tabs: 'FD' (Fixed Deposit) or 'RD' (Recurring Deposit)
  const [activeTab, setActiveTab] = useState('FD');
 const navigate = useNavigate();
  // Input states
  const [investment, setInvestment] = useState(100000);
  const [returnRate, setReturnRate] = useState(7.1);
  const [timePeriod, setTimePeriod] = useState(5);

  // Math configurations based on selected mode
  const calculations = useMemo(() => {
    const P = investment;
    const r = returnRate / 100;
    const t = timePeriod;

    let investedAmount = 0;
    let totalValue = 0;

    if (activeTab === 'FD') {
      investedAmount = P;
      // Indian Banking Standard: FD compounds quarterly (n = 4)
      // Formula: A = P * (1 + r/4)^(4*t)
      totalValue = P * Math.pow(1 + r / 4, 4 * t);
    } else {
      // RD monthly tracking parameters
      const months = t * 12;
      investedAmount = P * months;
      
      // Formula for RD Maturity Value (Quarterly compounding basis applied to monthly streams)
      // M = P * [ (1 + r/4)^(4 * (n/12)) - 1 ] / [ 1 - (1 + r/4)^(-1/3) ]
      // Alternative standard linear/quarterly approximation used universally by banks:
      const n = 4; // quarterly compounding
      totalValue = 0;
      for (let m = 1; m <= months; m++) {
        // Number of quarters remaining for each individual monthly installment
        const quartersRemaining = (months - m + 1) / 3;
        totalValue += P * Math.pow(1 + r / n, n * (quartersRemaining / 4));
      }
    }

    const estReturns = Math.max(0, totalValue - investedAmount);
    
    // Percentage split for the donut ring chart
    const totalValueSafe = totalValue > 0 ? totalValue : 1;
    const interestPercent = (estReturns / totalValueSafe) * 100;

    return {
      investedAmount: Math.round(investedAmount),
      estReturns: Math.round(estReturns),
      totalValue: Math.round(totalValue),
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
    <div className={styles.FDCalculatorContainer}>
      
      {/* Top Navigation Bar Header */}
      <div className={styles.FDCalculatorHeader}>
        <button className={styles.FDCalculatorBackBtn} aria-label="Go back" onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={styles.FDCalculatorPageTitle}>FD & RD Calculator</h1>
      </div>

      {/* Segmented Controls Toggle Switch */}
      <div className={styles.FDCalculatorTabWrapper}>
        <button 
          className={`${styles.FDCalculatorTab} ${activeTab === 'FD' ? styles.FDCalculatorTabActive : ''}`}
          onClick={() => {
            setActiveTab('FD');
            setInvestment(100000); // Resetting to a standard sensible baseline for FD setup
          }}
        >
          Fixed Deposit
        </button>
        <button 
          className={`${styles.FDCalculatorTab} ${activeTab === 'RD' ? styles.FDCalculatorTabActive : ''}`}
          onClick={() => {
            setActiveTab('RD');
            setInvestment(5000); // Resetting to a standard monthly baseline configuration for RD setup
          }}
        >
          Recurring Deposit
        </button>
      </div>

      {/* Controls & Metrics Section Input Cards */}
      <div className={styles.FDCalculatorCard}>
        
        {/* Dynamic Parameter Row 1 */}
        <div className={styles.FDCalculatorInputGroup}>
          <div className={styles.FDCalculatorLabelRow}>
            <span className={styles.FDCalculatorFieldLabel}>
              {activeTab === 'FD' ? 'Total Investment' : 'Monthly Investment'}
            </span>
            <div className={styles.FDCalculatorValueDisplay}>
              <span className={styles.FDCalculatorCurrencySign}>₹</span>
              <input 
                type="number" 
                value={investment} 
                onChange={(e) => setInvestment(Number(e.target.value))}
                className={styles.FDCalculatorNumericInput}
              />
            </div>
          </div>
          <input 
            type="range" 
            min={activeTab === 'FD' ? 10000 : 500} 
            max={activeTab === 'FD' ? 10000000 : 100000} 
            step={activeTab === 'FD' ? 5000 : 500}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className={styles.FDCalculatorSliderRange}
          />
        </div>

        {/* Dynamic Parameter Row 2 */}
        <div className={styles.FDCalculatorInputGroup}>
          <div className={styles.FDCalculatorLabelRow}>
            <span className={styles.FDCalculatorFieldLabel}>Rate of Interest (p.a. %)</span>
            <div className={styles.FDCalculatorValueDisplay}>
              <input 
                type="number" 
                value={returnRate} 
                step="0.1"
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className={styles.FDCalculatorNumericInputShort}
              />
              <span className={styles.FDCalculatorUnitSign}>%</span>
            </div>
          </div>
          <input 
            type="range" 
            min={2} 
            max={15} 
            step={0.1}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className={styles.FDCalculatorSliderRange}
          />
        </div>

        {/* Dynamic Parameter Row 3 */}
        <div className={styles.FDCalculatorInputGroup}>
          <div className={styles.FDCalculatorLabelRow}>
            <span className={styles.FDCalculatorFieldLabel}>Time Period (Years)</span>
            <div className={styles.FDCalculatorValueDisplay}>
              <input 
                type="number" 
                value={timePeriod} 
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className={styles.FDCalculatorNumericInputShort}
              />
              <span className={styles.FDCalculatorUnitSign}>Yrs</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={25} 
            step={1}
            value={timePeriod}
            onChange={(e) => setTimePeriod(Number(e.target.value))}
            className={styles.FDCalculatorSliderRange}
          />
        </div>

      </div>

      {/* Numerical Ledger Results Card */}
      <div className={styles.FDCalculatorCard}>
        <div className={styles.FDCalculatorTotalBlock}>
          <span className={styles.FDCalculatorTotalLabel}>TOTAL MATURITY VALUE</span>
          <h2 className={styles.FDCalculatorTotalAmount}>
            {formatCurrency(calculations.totalValue)}
          </h2>
        </div>
        
        <div className={styles.FDCalculatorGridSplit}>
          <div className={styles.FDCalculatorSplitItem}>
            <span className={styles.FDCalculatorSplitLabel}>Invested Amount</span>
            <span className={styles.FDCalculatorSplitValue}>
              {formatCurrency(calculations.investedAmount)}
            </span>
          </div>
          <div className={styles.FDCalculatorSplitItem}>
            <span className={styles.FDCalculatorSplitLabel}>Est. Interest</span>
            <span className={`${styles.FDCalculatorSplitValue} ${styles.FDCalculatorGreenText}`}>
              {formatCurrency(calculations.estReturns)}
            </span>
          </div>
        </div>
      </div>

      {/* Donut Data Allocation Ring Chart Card */}
      <div className={styles.FDCalculatorCard}>
        <div className={styles.FDCalculatorChartLayout}>
          
          {/* SVG Vector Ring Architecture */}
          <div className={styles.FDCalculatorDonutWrapper}>
            <svg viewBox="0 0 120 120" className={styles.FDCalculatorSvgCanvas}>
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.FDCalculatorCircleBase}
                strokeWidth="12"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={styles.FDCalculatorCircleProgress}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 60 60)" 
              />
            </svg>
            <div className={styles.FDCalculatorDonutCenter}>
              <span className={styles.FDCalculatorYieldPercent}>{calculations.interestPercent}%</span>
              <span className={styles.FDCalculatorYieldLabel}>YIELD</span>
            </div>
          </div>

          {/* Color Mapping Legend Keys */}
          <div className={styles.FDCalculatorLegendBlock}>
            <div className={styles.FDCalculatorLegendRow}>
              <span className={`${styles.FDCalculatorDot} ${styles.FDCalculatorDotBlue}`} />
              <span className={styles.FDCalculatorLegendText}>Principal Amount</span>
            </div>
            <div className={styles.FDCalculatorLegendRow}>
              <span className={`${styles.FDCalculatorDot} ${styles.FDCalculatorDotGreen}`} />
              <span className={styles.FDCalculatorLegendText}>Interest Earned</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default FDCalculator;