import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wallet, TriangleAlert, AlertCircle, CheckCircle } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell as BarCell,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import { fetchBudget, saveBudget, deleteBudget } from '../../services/apis/budget.service';
import styles from './Budget.module.css';

const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

const calculate = (income, rent, emi, others) => {
  const inc = Math.round(Number(income) || 0);
  const fixedCosts = Math.round(
    (Number(rent) || 0) +
    (Number(emi) || 0) +
    (Number(others) || 0)
  );
  if (inc <= 0) return null;

  const fixedPercent = +((fixedCosts / inc) * 100).toFixed(1);
  const remaining = inc - fixedCosts;

  const emergency  = Math.round(remaining * 0.15);
  const rawInvest  = Math.round(remaining * 0.25);
  const life       = Math.round(remaining * 0.50);
  const selfGrowth = remaining - emergency - rawInvest - life;

  const minInvest = inc < 15000 ? 500
    : inc < 30000 ? 1000
    : inc < 50000 ? 2000
    : rawInvest;
  const invest = Math.max(minInvest, rawInvest);

  const emergencyTarget = fixedCosts > 0
    ? fixedCosts * 3
    : Math.round(inc * 0.5);

  const monthsToEmergency = emergency > 0
    ? Math.min(Math.ceil(emergencyTarget / emergency), 60)
    : null;

  const savingsRate = +((emergency + invest) / inc * 100).toFixed(1);

  let warning = null;
  if (fixedPercent > 60) {
    warning = {
      level: 'danger',
      message: "Fixed costs are over 60% of income — very little room left to save or invest.",
    };
  } else if (fixedPercent > 50) {
    warning = {
      level: 'caution',
      message: "Fixed costs are a bit high. Try to keep them under 50% of income.",
    };
  } else if (fixedCosts > 0 && fixedPercent <= 30) {
    warning = {
      level: 'good',
      message: "Fixed costs are very manageable. Great position to build wealth!",
    };
  }

  let insight = '';
  if (fixedPercent > 60) {
    insight = "Fixed costs are eating most of your income. Focus on reducing rent or EMI before thinking about investing.";
  } else if (inc < 15000) {
    insight = "Even ₹500/month SIP now grows significantly over time. Start with your emergency fund first.";
  } else if (remaining > inc * 0.6) {
    insight = "Great control over fixed costs! Put that extra room to work — invest more aggressively.";
  } else {
    insight = "Good balance. Stick to this plan and you will be ahead of most of your peers financially.";
  }

  return {
    inc, fixedCosts, fixedPercent, remaining,
    emergency, invest, life, selfGrowth,
    emergencyTarget, monthsToEmergency,
    savingsRate, warning, insight,
  };
};

const projectWealth = (monthly, years, rate = 12) => {
  if (!monthly || monthly <= 0 || years <= 0) return 0;
  const r = rate / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

const getInvestSplit = (amount) => [
  { name: 'Index Fund SIP',  percent: 40, color: '#6366f1' },
  { name: 'Mid Cap SIP',     percent: 25, color: '#8b5cf6' },
  { name: 'Flexi Cap SIP',   percent: 20, color: '#a78bfa' },
  { name: 'Digital Gold',    percent: 15, color: '#f59e0b' },
].map(i => ({
  ...i,
  amount: Math.round(amount * i.percent / 100),
}));

const getProjectionData = (monthly) => [1, 3, 5, 7, 10, 15, 20].map(y => ({
  year: `${y}Y`,
  Invested: monthly * 12 * y,
  'Portfolio Value': projectWealth(monthly, y),
}));

const formatAxis = (v) =>
  v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `₹${(v / 100000).toFixed(0)}L`
  : v >= 1000   ? `₹${(v / 1000).toFixed(0)}K`
  : `₹${v}`;

const springUp = {
  initial: { opacity: 0, y: 24, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 0.96 },
  transition: { type: 'spring', stiffness: 300, damping: 28, mass: 0.8 },
};

const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const tabVariants = {
  initial: { opacity: 0, x: 30, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -30, scale: 0.98 },
  transition: { type: 'spring', stiffness: 350, damping: 30, mass: 0.9 },
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Budget() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ income: '', rent: '', emi: '', others: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown');

  const result = calculate(form.income, form.rent, form.emi, form.others);
  const showResult = result !== null;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchBudget();
        if (res && res.success && res.data) {
          setForm({
            income: res.data.income || '',
            rent:   res.data.rent   || '',
            emi:    res.data.emi    || '',
            others: res.data.others || '',
          });
          setSaved(true);
        }
      } catch (e) {
        console.error('Failed to load budget:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!result || saving) return;
    setSaving(true);
    try {
      const res = await saveBudget(form);
      if (res && res.success) setSaved(true);
    } catch (e) {
      console.error('Save failed:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      await deleteBudget();
      setForm({ income: '', rent: '', emi: '', others: '' });
      setSaved(false);
      setActiveTab('breakdown');
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const donutData = result ? [
    { name: 'Fixed Costs',    value: result.fixedCosts, color: '#ef4444' },
    { name: 'Emergency',      value: result.emergency,  color: '#f59e0b' },
    { name: 'Invest',         value: result.invest,     color: '#22c55e' },
    { name: 'Life Money',     value: result.life,       color: '#6366f1' },
    { name: 'Self Growth',    value: result.selfGrowth, color: '#a78bfa' },
  ].filter(d => d.value > 0) : [];

  const splitData = result ? getInvestSplit(result.invest) : [];
  const projectionData = result ? getProjectionData(result.invest) : [];

  const breakdownRows = result ? [
    { icon: '🔒', iconClass: styles['Budget__bIcon--fixed'],     label: 'Fixed Costs',    val: result.fixedCosts, color: '#ef4444', sub: 'Rent + EMI + Others' },
    { icon: '🛡️', iconClass: styles['Budget__bIcon--emergency'], label: 'Emergency Fund', val: result.emergency,  color: '#f59e0b', sub: `Target: ${fmt(result.emergencyTarget)}` },
    { icon: '📈', iconClass: styles['Budget__bIcon--invest'],     label: 'Invest',         val: result.invest,     color: '#22c55e', sub: 'SIP in mutual funds' },
    { icon: '🎯', iconClass: styles['Budget__bIcon--life'],       label: 'Life Money',     val: result.life,       color: '#6366f1', sub: 'Guilt-free spending' },
    { icon: '🌱', iconClass: styles['Budget__bIcon--growth'],     label: 'Self Growth',    val: result.selfGrowth, color: '#a78bfa', sub: 'Courses, health, skills' },
  ] : [];

  return (
    <div className={styles.Budget__page}>
      <motion.div
        className={styles.Budget__header}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <motion.button
          className={styles.Budget__backBtn}
          onClick={() => navigate('/dashboard')}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <ArrowLeft size={20} />
        </motion.button>
        <div className={styles.Budget__headerContent}>
          <h1 className={styles.Budget__title}>My Budget</h1>
          <p className={styles.Budget__subtitle}>Plan. Save. Grow.</p>
        </div>
        <div className={styles.Budget__headerRing}>
          <Wallet size={16} />
        </div>
      </motion.div>

      {loading && (
        <div className={styles.Budget__skeletonWrap}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={styles.Budget__skeleton}
              style={{ height: i === 1 ? 180 : 120, marginBottom: 12 }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div key="content" {...springUp}>
            <div className={styles.Budget__inputSection}>
              <div className={styles.Budget__inputHeader}>
                <span className={styles.Budget__inputTitle}>Your Monthly Numbers</span>
                <AnimatePresence>
                  {saved && (
                    <motion.span
                      className={styles.Budget__savedBadge}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      ✓ Saved
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.Budget__incomeField}>
                <label className={styles.Budget__label}>Monthly Income</label>
                <p className={styles.Budget__labelHint}>
                  Salary · Stipend · Freelance · Pocket money
                </p>
                <div className={styles.Budget__incomeRow}>
                  <span className={styles.Budget__rupeeSymbol}>₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="45000"
                    value={form.income}
                    onChange={e => handleChange('income', e.target.value)}
                    className={styles.Budget__incomeInput}
                  />
                </div>
              </div>

              <div className={styles.Budget__sectionDivider}>
                <span>Fixed monthly costs</span>
              </div>

              <div className={styles.Budget__fieldRow}>
                <div className={styles.Budget__fieldLeft}>
                  <div className={`${styles.Budget__fieldIcon} ${styles['Budget__fieldIcon--rent']}`}>
                    🏠
                  </div>
                  <div className={styles.Budget__fieldLabelWrap}>
                    <span className={`${styles.Budget__fieldLabel} ${styles['Budget__fieldLabel--rent']}`}>
                      Rent / PG / Hostel
                    </span>
                    <span className={styles.Budget__fieldHint}>Monthly housing cost</span>
                  </div>
                </div>
                <div className={styles.Budget__fieldInputBox}>
                  <span className={styles.Budget__fieldRupee}>₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.rent}
                    onChange={e => handleChange('rent', e.target.value)}
                    className={styles.Budget__fieldInput}
                  />
                </div>
              </div>
              <div className={styles.Budget__fieldRow}>
                <div className={styles.Budget__fieldLeft}>
                  <div className={`${styles.Budget__fieldIcon} ${styles['Budget__fieldIcon--emi']}`}>
                    📱
                  </div>
                  <div className={styles.Budget__fieldLabelWrap}>
                    <span className={`${styles.Budget__fieldLabel} ${styles['Budget__fieldLabel--emi']}`}>
                      Loan EMIs
                    </span>
                    <span className={styles.Budget__fieldHint}>Education · Personal · Vehicle</span>
                  </div>
                </div>
                <div className={styles.Budget__fieldInputBox}>
                  <span className={styles.Budget__fieldRupee}>₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.emi}
                    onChange={e => handleChange('emi', e.target.value)}
                    className={styles.Budget__fieldInput}
                  />
                </div>
              </div>
              <div className={styles.Budget__fieldRow}>
                <div className={styles.Budget__fieldLeft}>
                  <div className={`${styles.Budget__fieldIcon} ${styles['Budget__fieldIcon--others']}`}>
                    📦
                  </div>
                  <div className={styles.Budget__fieldLabelWrap}>
                    <span className={`${styles.Budget__fieldLabel} ${styles['Budget__fieldLabel--others']}`}>
                      Other fixed costs
                    </span>
                    <span className={styles.Budget__fieldHint}>
                      Subscriptions · Transport pass · Gym
                    </span>
                  </div>
                </div>
                <div className={styles.Budget__fieldInputBox}>
                  <span className={styles.Budget__fieldRupee}>₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={form.others}
                    onChange={e => handleChange('others', e.target.value)}
                    className={styles.Budget__fieldInput}
                  />
                </div>
              </div>

              <AnimatePresence>
                {showResult && (
                  <motion.button
                    className={styles.Budget__saveBtn}
                    onClick={handleSave}
                    disabled={saving || saved}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileTap={!(saving || saved) ? { scale: 0.98 } : {}}
                  >
                    {saving ? 'Saving...' : saved ? '✓ Budget Saved' : 'Save My Budget'}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  className={styles.Budget__results}
                  key="results"
                  initial="initial"
                  animate="animate"
                  variants={staggerContainer}
                >
                  {result.warning && (
                    <div
                      className={`${styles.Budget__banner} ${styles[`Budget__banner--${result.warning.level}`]}`}
                    >
                      <div className={styles.Budget__bannerIcon}>
                        {result.warning.level === 'danger' ? (
                          <TriangleAlert size={18} />
                        ) : result.warning.level === 'caution' ? (
                          <AlertCircle size={18} />
                        ) : (
                          <CheckCircle size={18} />
                        )}
                      </div>
                      <p>{result.warning.message}</p>
                    </div>
                  )}

                  <div className={styles.Budget__summaryRow}>
                    {[
                      { icon: '🔒', wrapClass: styles['Budget__summaryIconWrap--fixed'],   value: fmt(result.fixedCosts), label: `Fixed · ${result.fixedPercent}%` },
                      { icon: '💚', wrapClass: styles['Budget__summaryIconWrap--free'],     value: fmt(result.remaining),  label: 'Free Money' },
                      { icon: '📊', wrapClass: styles['Budget__summaryIconWrap--savings'],  value: `${result.savingsRate}%`, label: 'Savings Rate' },
                    ].map((card, i) => (
                      <motion.div
                        key={i}
                        className={styles.Budget__summaryCard}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * i, type: 'spring', stiffness: 300, damping: 26 }}
                      >
                        <div className={`${styles.Budget__summaryIconWrap} ${card.wrapClass}`}>
                          {card.icon}
                        </div>
                        <span className={styles.Budget__summaryValue}>{card.value}</span>
                        <span className={styles.Budget__summaryLabel}>{card.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className={styles.Budget__tabBar}>
                    {[
                      { id: 'breakdown',  label: '💸 Breakdown' },
                      { id: 'invest',     label: '📈 Invest'    },
                      { id: 'projection', label: '🚀 Grow'      },
                    ].map(tab => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${styles.Budget__tab} ${activeTab === tab.id ? styles.Budget__tabActive : ''}`}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      >
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === 'breakdown' && (
                      <motion.div
                        key="breakdown"
                        className={styles.Budget__tabPanel}
                        variants={tabVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className={styles.Budget__donutWrap}>
                          <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                              <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={65}
                                outerRadius={95}
                                paddingAngle={2}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                isAnimationActive={true}
                                animationBegin={100}
                                animationDuration={800}
                                animationEasing="ease-out"
                              >
                                {donutData.map((entry, i) => (
                                  <Cell key={i} fill={entry.color} strokeWidth={0} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(v) => [fmt(v), '']} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className={styles.Budget__donutCenter}>
                            <span className={styles.Budget__donutAmount}>{fmt(result.inc)}</span>
                            <span className={styles.Budget__donutLabel}>per month</span>
                          </div>
                        </div>

                        <div className={styles.Budget__breakdownWrap}>
                          {breakdownRows.map((row, i) => (
                            <motion.div
                              key={i}
                              className={styles.Budget__breakdownRow}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.04 * i, type: 'spring', stiffness: 300, damping: 28 }}
                            >
                              <div className={styles.Budget__breakdownLeft}>
                                <div className={`${styles.Budget__bIcon} ${row.iconClass}`}>
                                  {row.icon}
                                </div>
                                <div>
                                  <span className={styles.Budget__bLabel}>{row.label}</span>
                                  <span className={styles.Budget__bSub}>{row.sub}</span>
                                </div>
                              </div>
                              <div className={styles.Budget__breakdownRight}>
                                <span className={styles.Budget__bAmount} style={{ color: row.color }}>
                                  {fmt(row.val)}
                                </span>
                                <span className={styles.Budget__bPercent}>
                                  {((row.val / result.inc) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <motion.div
                          className={styles.Budget__emergencyCard}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 26 }}
                        >
                          <div className={styles.Budget__emergencyTop}>
                            <span>🚨 Emergency Fund Target</span>
                            <span>{fmt(result.emergencyTarget)}</span>
                          </div>
                          <div className={styles.Budget__progressTrack}>
                            <motion.div
                              className={styles.Budget__progressFill}
                              initial={{ width: '0%' }}
                              animate={{ width: '0%' }}
                            />
                          </div>
                          <p className={styles.Budget__emergencyNote}>
                            Saving {fmt(result.emergency)}/month →
                            Target in {result.monthsToEmergency} months
                          </p>
                        </motion.div>

                        <motion.div
                          className={styles.Budget__insightBox}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 26 }}
                        >
                          <span className={styles.Budget__insightIcon}>💡</span>
                          <p>{result.insight}</p>
                        </motion.div>

                        <motion.div
                          className={styles.Budget__yearBox}
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 26 }}
                        >
                          <h3 className={styles.Budget__yearTitle}>
                            📅 If you follow this all year
                          </h3>
                          <div className={styles.Budget__yearGrid}>
                            {[
                              { value: fmt(result.invest * 12),   label: 'Invested',         color: '#22c55e' },
                              { value: fmt(result.emergency * 12), label: 'Emergency saved', color: '#f59e0b' },
                              { value: fmt((result.invest + result.emergency) * 12), label: 'Total set aside', color: '#6366f1' },
                            ].map((item, i) => (
                              <div key={i} className={styles.Budget__yearItem}>
                                <span className={styles.Budget__yearValue} style={{ color: item.color }}>
                                  {item.value}
                                </span>
                                <span className={styles.Budget__yearLabel}>{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {activeTab === 'invest' && (
                      <motion.div
                        key="invest"
                        className={styles.Budget__tabPanel}
                        variants={tabVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <p className={styles.Budget__investIntro}>
                          How to invest your{' '}
                          <strong>{fmt(result.invest)}/month</strong>
                        </p>

                        <div className={styles.Budget__chartBox}>
                          <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={splitData} layout="vertical" margin={{ left: 0, right: 16 }}>
                              <XAxis type="number" hide />
                              <YAxis
                                type="category"
                                dataKey="name"
                                width={115}
                                tick={{ fontSize: 11, fill: '#64748B' }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <Tooltip formatter={(v) => [fmt(v), 'Amount']} />
                              <Bar dataKey="amount" radius={[0, 8, 8, 0]} isAnimationActive={true} animationDuration={600} animationEasing="ease-out">
                                {splitData.map((entry, i) => (
                                  <Cell key={i} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className={styles.Budget__investWrap}>
                          {splitData.map((item, i) => (
                            <motion.div
                              key={i}
                              className={styles.Budget__investRow}
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.06 * i, type: 'spring', stiffness: 300, damping: 28 }}
                            >
                              <div
                                className={styles.Budget__investDot}
                                style={{ background: item.color }}
                              />
                              <div className={styles.Budget__investText}>
                                <span className={styles.Budget__investName}>{item.name}</span>
                                <span className={styles.Budget__investPct}>{item.percent}% of invest budget</span>
                              </div>
                              <span className={styles.Budget__investAmt}>{fmt(item.amount)}/mo</span>
                            </motion.div>
                          ))}
                        </div>

                        <div className={styles.Budget__disclaimer}>
                          Suggested allocation based on general diversification principles.
                          Not personalized investment advice. Consult a SEBI registered
                          financial advisor for personalized guidance. Mutual fund
                          investments are subject to market risks.
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'projection' && (
                      <motion.div
                        key="projection"
                        className={styles.Budget__tabPanel}
                        variants={tabVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <p className={styles.Budget__projIntro}>
                          What <strong>{fmt(result.invest)}/month SIP</strong> becomes
                          over time at 12% annual return
                        </p>

                        <div className={styles.Budget__chartBox}>
                          <ResponsiveContainer width="100%" height={220}>
                            <LineChart
                              data={projectionData}
                              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                              <XAxis
                                dataKey="year"
                                tick={{ fontSize: 11, fill: '#94A3B8' }}
                                axisLine={false}
                                tickLine={false}
                              />
                              <YAxis
                                tickFormatter={formatAxis}
                                tick={{ fontSize: 10, fill: '#94A3B8' }}
                                axisLine={false}
                                tickLine={false}
                                width={52}
                              />
                              <Tooltip formatter={(v, name) => [fmt(v), name]} />
                              <Line
                                type="monotone"
                                dataKey="Portfolio Value"
                                stroke="#059669"
                                strokeWidth={2.5}
                                dot={{ fill: '#059669', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={true}
                                animationDuration={800}
                                animationEasing="ease-out"
                              />
                              <Line
                                type="monotone"
                                dataKey="Invested"
                                stroke="#E2E8F0"
                                strokeWidth={1.5}
                                strokeDasharray="5 5"
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        {[
                          { year: 5,  emoji: '🌱', label: 'In 5 years'  },
                          { year: 10, emoji: '🌳', label: 'In 10 years' },
                          { year: 20, emoji: '🏆', label: 'In 20 years' },
                        ].map(({ year, emoji, label }, i) => {
                          const val = projectWealth(result.invest, year);
                          const inv = result.invest * 12 * year;
                          return (
                            <motion.div
                              key={year}
                              className={styles.Budget__projCard}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300, damping: 26 }}
                            >
                              <div className={styles.Budget__projEmoji}>{emoji}</div>
                              <div className={styles.Budget__projLeft}>
                                <span className={styles.Budget__projYear}>{label}</span>
                                <span className={styles.Budget__projVal}>{fmt(val)}</span>
                                <span className={styles.Budget__projGain}>
                                  +{fmt(val - inv)} from returns
                                </span>
                              </div>
                              <div className={styles.Budget__projRight}>
                                <span className={styles.Budget__projInvLabel}>You invest</span>
                                <span className={styles.Budget__projInvVal}>{fmt(inv)}</span>
                              </div>
                            </motion.div>
                          );
                        })}

                        <div className={styles.Budget__disclaimer}>
                          Projections assume 12% annual returns based on historical
                          Nifty 50 average. Actual returns may vary. Not a guarantee.
                          Mutual fund investments are subject to market risks.
                          Past performance does not guarantee future results.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {saved && (
                      <motion.button
                        className={styles.Budget__resetBtn}
                        onClick={handleReset}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        Reset Budget
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
