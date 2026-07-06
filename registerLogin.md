Create two files: src/screens/Budget/Budget.jsx and src/screens/Budget/Budget.module.css
All CSS class names must be prefixed with Budget__. Use only React hooks and Recharts for charts. No other libraries. Use System api call and method only such as services/api/budget.service.js

BACKEND API
Base URL: http://localhost:5000

POST /api/budget  → save { income, rent, emi, others }
GET  /api/budget  → get saved values
DELETE /api/budget → delete budget

CONSTANTS AND HELPERS — define at top of Budget.jsx before component
javascriptimport React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Cell as BarCell,
  LineChart, Line, CartesianGrid
} from 'recharts';
import styles from './Budget.module.css';

const BASE_URL = 'http://localhost:5000';
const getToken = () => localStorage.getItem('token');
const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

// Indian currency formatter
const fmt = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

// All calculations — pure math, no API needed
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
      message: "Fixed costs are over 60% of income — very little room left to save or invest."
    };
  } else if (fixedPercent > 50) {
    warning = {
      level: 'caution',
      message: "Fixed costs are a bit high. Try to keep them under 50% of income."
    };
  } else if (fixedCosts > 0 && fixedPercent <= 30) {
    warning = {
      level: 'good',
      message: "Fixed costs are very manageable. Great position to build wealth!"
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
    savingsRate, warning, insight
  };
};

// SIP future value projection
const projectWealth = (monthly, years, rate = 12) => {
  if (!monthly || monthly <= 0 || years <= 0) return 0;
  const r = rate / 100 / 12;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

// Investment split — fixed allocation
const getInvestSplit = (amount) => [
  { name: 'Index Fund SIP',  percent: 40, color: '#6366f1' },
  { name: 'Mid Cap SIP',     percent: 25, color: '#8b5cf6' },
  { name: 'Flexi Cap SIP',   percent: 20, color: '#a78bfa' },
  { name: 'Digital Gold',    percent: 15, color: '#f59e0b' }
].map(i => ({
  ...i,
  amount: Math.round(amount * i.percent / 100)
}));

// Projection data for line chart
const getProjectionData = (monthly) => [1, 3, 5, 7, 10, 15, 20].map(y => ({
  year: `${y}Y`,
  Invested: monthly * 12 * y,
  'Portfolio Value': projectWealth(monthly, y)
}));

// Y-axis formatter for large numbers
const formatAxis = (v) =>
  v >= 10000000 ? `₹${(v / 10000000).toFixed(1)}Cr`
  : v >= 100000 ? `₹${(v / 100000).toFixed(0)}L`
  : v >= 1000   ? `₹${(v / 1000).toFixed(0)}K`
  : `₹${v}`;

STATE — inside Budget component
javascriptconst navigate = useNavigate();
const [form, setForm] = useState({ income: '', rent: '', emi: '', others: '' });
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);
const [activeTab, setActiveTab] = useState('breakdown');

// Live calculation — recalculates on every form change
const result = calculate(form.income, form.rent, form.emi, form.others);
const showResult = result !== null;

EFFECTS AND HANDLERS
javascript// Load saved budget on mount
useEffect(() => {
  const load = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/budget`, { headers: getHeaders() });
      const json = await res.json();
      if (json.success && json.data) {
        setForm({
          income: json.data.income || '',
          rent:   json.data.rent   || '',
          emi:    json.data.emi    || '',
          others: json.data.others || ''
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
  setSaved(false); // mark unsaved when any field changes
};

const handleSave = async () => {
  if (!result || saving) return;
  setSaving(true);
  try {
    const res = await fetch(`${BASE_URL}/api/budget`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form)
    });
    const json = await res.json();
    if (json.success) setSaved(true);
  } catch (e) {
    console.error('Save failed:', e);
  } finally {
    setSaving(false);
  }
};

const handleReset = async () => {
  try {
    await fetch(`${BASE_URL}/api/budget`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    setForm({ income: '', rent: '', emi: '', others: '' });
    setSaved(false);
    setActiveTab('breakdown');
  } catch (e) {
    console.error('Delete failed:', e);
  }
};

RENDER — complete JSX
jsxreturn (
  <div className={styles.Budget__page}>

    {/* HEADER */}
    <div className={styles.Budget__header}>
      <button
        className={styles.Budget__backBtn}
        onClick={() => navigate('/dashboard')}
      >←</button>
      <div>
        <h1 className={styles.Budget__title}>My Budget 💸</h1>
        <p className={styles.Budget__subtitle}>Know where every rupee goes</p>
      </div>
    </div>

    {/* LOADING SKELETON */}
    {loading && (
      <div className={styles.Budget__skeletonWrap}>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.Budget__skeleton}
            style={{ height: i === 1 ? 180 : 120, marginBottom: 12 }} />
        ))}
      </div>
    )}

    {!loading && (
      <>
        {/* INPUT CARD */}
        <div className={styles.Budget__inputCard}>
          <div className={styles.Budget__inputHeader}>
            <span className={styles.Budget__inputTitle}>Your Monthly Numbers</span>
            {saved && (
              <span className={styles.Budget__savedBadge}>✓ Saved</span>
            )}
          </div>

          {/* INCOME — most prominent field */}
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

          {/* RENT */}
          <div className={styles.Budget__fieldRow}>
            <div className={styles.Budget__fieldLeft}>
              <span className={styles.Budget__fieldIcon}>🏠</span>
              <div>
                <span className={styles.Budget__fieldLabel}>Rent / PG / Hostel</span>
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
          <button
            className={styles.Budget__quickBtn}
            onClick={() => handleChange('rent', 0)}
          >
            🏡 Living at home — set to ₹0
          </button>

          {/* EMI */}
          <div className={styles.Budget__fieldRow}>
            <div className={styles.Budget__fieldLeft}>
              <span className={styles.Budget__fieldIcon}>📱</span>
              <div>
                <span className={styles.Budget__fieldLabel}>Loan EMIs</span>
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
          <button
            className={styles.Budget__quickBtn}
            onClick={() => handleChange('emi', 0)}
          >
            ✓ No loans
          </button>

          {/* OTHERS */}
          <div className={styles.Budget__fieldRow}>
            <div className={styles.Budget__fieldLeft}>
              <span className={styles.Budget__fieldIcon}>📦</span>
              <div>
                <span className={styles.Budget__fieldLabel}>Other fixed costs</span>
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

          {/* SAVE BUTTON */}
          {showResult && (
            <button
              className={styles.Budget__saveBtn}
              onClick={handleSave}
              disabled={saving || saved}
            >
              {saving ? 'Saving...' : saved ? '✓ Budget Saved' : 'Save My Budget'}
            </button>
          )}
        </div>

        {/* RESULT SECTION — appears as user types income */}
        {showResult && (
          <div className={styles.Budget__results}>

            {/* WARNING BANNER */}
            {result.warning && (
              <div className={`${styles.Budget__banner} ${styles[`Budget__banner--${result.warning.level}`]}`}>
                <span>
                  {result.warning.level === 'danger' ? '🚨'
                  : result.warning.level === 'caution' ? '⚠️'
                  : '✅'}
                </span>
                <p>{result.warning.message}</p>
              </div>
            )}

            {/* SUMMARY CARDS — 3 cards in a row */}
            <div className={styles.Budget__summaryRow}>
              {[
                { icon: '🔒', value: fmt(result.fixedCosts), label: `Fixed · ${result.fixedPercent}%` },
                { icon: '💚', value: fmt(result.remaining),  label: 'Free Money' },
                { icon: '📊', value: `${result.savingsRate}%`, label: 'Savings Rate' }
              ].map((card, i) => (
                <div key={i} className={styles.Budget__summaryCard}>
                  <span className={styles.Budget__summaryIcon}>{card.icon}</span>
                  <span className={styles.Budget__summaryValue}>{card.value}</span>
                  <span className={styles.Budget__summaryLabel}>{card.label}</span>
                </div>
              ))}
            </div>

            {/* TABS */}
            <div className={styles.Budget__tabBar}>
              {[
                { id: 'breakdown',  label: '💸 Breakdown' },
                { id: 'invest',     label: '📈 Invest'    },
                { id: 'projection', label: '🚀 Grow'      }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.Budget__tab} ${activeTab === tab.id ? styles.Budget__tabActive : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB: BREAKDOWN */}
            {activeTab === 'breakdown' && (
              <div className={styles.Budget__tabPanel}>

                {/* DONUT CHART */}
                {(() => {
                  const donutData = [
                    { name: 'Fixed Costs',    value: result.fixedCosts, color: '#ef4444' },
                    { name: 'Emergency',      value: result.emergency,  color: '#f59e0b' },
                    { name: 'Invest',         value: result.invest,     color: '#22c55e' },
                    { name: 'Life Money',     value: result.life,       color: '#6366f1' },
                    { name: 'Self Growth',    value: result.selfGrowth, color: '#a78bfa' }
                  ].filter(d => d.value > 0);

                  return (
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
                          >
                            {donutData.map((entry, i) => (
                              <Cell key={i} fill={entry.color} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v) => [fmt(v), '']} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center label — absolutely positioned inside donut hole */}
                      <div className={styles.Budget__donutCenter}>
                        <span className={styles.Budget__donutAmount}>{fmt(result.inc)}</span>
                        <span className={styles.Budget__donutLabel}>per month</span>
                      </div>
                    </div>
                  );
                })()}

                {/* BREAKDOWN LIST */}
                {[
                  { icon: '🔒', label: 'Fixed Costs',    val: result.fixedCosts, color: '#ef4444', sub: 'Rent + EMI + Others' },
                  { icon: '🛡️', label: 'Emergency Fund', val: result.emergency,  color: '#f59e0b', sub: `Target: ${fmt(result.emergencyTarget)}` },
                  { icon: '📈', label: 'Invest',         val: result.invest,     color: '#22c55e', sub: 'SIP in mutual funds' },
                  { icon: '🎯', label: 'Life Money',     val: result.life,       color: '#6366f1', sub: 'Guilt-free spending' },
                  { icon: '🌱', label: 'Self Growth',    val: result.selfGrowth, color: '#a78bfa', sub: 'Courses, health, skills' }
                ].map((row, i) => (
                  <div key={i} className={styles.Budget__breakdownRow}>
                    <div className={styles.Budget__breakdownLeft}>
                      <span className={styles.Budget__bIcon}>{row.icon}</span>
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
                  </div>
                ))}

                {/* EMERGENCY FUND CARD */}
                <div className={styles.Budget__emergencyCard}>
                  <div className={styles.Budget__emergencyTop}>
                    <span>🚨 Emergency Fund Target</span>
                    <span>{fmt(result.emergencyTarget)}</span>
                  </div>
                  <div className={styles.Budget__progressTrack}>
                    <div
                      className={styles.Budget__progressFill}
                      style={{ width: '0%' }}
                    />
                  </div>
                  <p className={styles.Budget__emergencyNote}>
                    Saving {fmt(result.emergency)}/month →
                    Target in {result.monthsToEmergency} months
                  </p>
                </div>

                {/* INSIGHT */}
                <div className={styles.Budget__insightBox}>
                  <span>💡</span>
                  <p>{result.insight}</p>
                </div>

                {/* YEARLY SNAPSHOT */}
                <div className={styles.Budget__yearBox}>
                  <h3 className={styles.Budget__yearTitle}>
                    📅 If you follow this all year
                  </h3>
                  <div className={styles.Budget__yearGrid}>
                    {[
                      { value: fmt(result.invest * 12),   label: 'Invested',         color: '#22c55e' },
                      { value: fmt(result.emergency * 12), label: 'Emergency saved', color: '#f59e0b' },
                      { value: fmt((result.invest + result.emergency) * 12), label: 'Total set aside', color: '#6366f1' }
                    ].map((item, i) => (
                      <div key={i} className={styles.Budget__yearItem}>
                        <span className={styles.Budget__yearValue} style={{ color: item.color }}>
                          {item.value}
                        </span>
                        <span className={styles.Budget__yearLabel}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: INVEST */}
            {activeTab === 'invest' && (
              <div className={styles.Budget__tabPanel}>
                <p className={styles.Budget__investIntro}>
                  How to invest your{' '}
                  <strong>{fmt(result.invest)}/month</strong>
                </p>

                {/* HORIZONTAL BAR CHART */}
                {(() => {
                  const splitData = getInvestSplit(result.invest);
                  return (
                    <>
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
                            <Bar dataKey="amount" radius={[0, 8, 8, 0]}>
                              {splitData.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* INVEST SPLIT CARDS */}
                      {splitData.map((item, i) => (
                        <div key={i} className={styles.Budget__investRow}>
                          <div
                            className={styles.Budget__investDot}
                            style={{ background: item.color }}
                          />
                          <div className={styles.Budget__investText}>
                            <span className={styles.Budget__investName}>{item.name}</span>
                            <span className={styles.Budget__investPct}>{item.percent}% of invest budget</span>
                          </div>
                          <span className={styles.Budget__investAmt}>{fmt(item.amount)}/mo</span>
                        </div>
                      ))}
                    </>
                  );
                })()}

                <div className={styles.Budget__disclaimer}>
                  Suggested allocation based on general diversification principles.
                  Not personalized investment advice. Consult a SEBI registered
                  financial advisor for personalized guidance. Mutual fund
                  investments are subject to market risks.
                </div>
              </div>
            )}

            {/* TAB: PROJECTION */}
            {activeTab === 'projection' && (
              <div className={styles.Budget__tabPanel}>
                <p className={styles.Budget__projIntro}>
                  What <strong>{fmt(result.invest)}/month SIP</strong> becomes
                  over time at 12% annual return
                </p>

                {/* LINE CHART */}
                <div className={styles.Budget__chartBox}>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                      data={getProjectionData(result.invest)}
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
                        stroke="#22c55e"
                        strokeWidth={2.5}
                        dot={{ fill: '#22c55e', r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
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

                {/* MILESTONE CARDS */}
                {[
                  { year: 5,  emoji: '🌱', label: 'In 5 years'  },
                  { year: 10, emoji: '🌳', label: 'In 10 years' },
                  { year: 20, emoji: '🏆', label: 'In 20 years' }
                ].map(({ year, emoji, label }) => {
                  const val = projectWealth(result.invest, year);
                  const inv = result.invest * 12 * year;
                  return (
                    <div key={year} className={styles.Budget__projCard}>
                      <span className={styles.Budget__projEmoji}>{emoji}</span>
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
                    </div>
                  );
                })}

                <div className={styles.Budget__disclaimer}>
                  Projections assume 12% annual returns based on historical
                  Nifty 50 average. Actual returns may vary. Not a guarantee.
                  Mutual fund investments are subject to market risks.
                  Past performance does not guarantee future results.
                </div>
              </div>
            )}

            {/* RESET */}
            {saved && (
              <button
                className={styles.Budget__resetBtn}
                onClick={handleReset}
              >
                Reset Budget
              </button>
            )}
          </div>
        )}
      </>
    )}
  </div>
);

src/pages/Budget.module.css — complete styles
css.Budget__page {
  min-height: 100vh;
  background: #F8FAFC;
  max-width: 480px;
  margin: 0 auto;
  padding-bottom: 48px;
  font-family: system-ui, -apple-system, sans-serif;
}

.Budget__header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #ffffff;
  padding: 16px 20px;
  border-bottom: 1px solid #E2E8F0;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.Budget__backBtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid #E2E8F0;
  background: #F8FAFC;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}
.Budget__backBtn:hover { background: #E2E8F0; }

.Budget__title {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}
.Budget__subtitle {
  font-size: 12px;
  color: #94A3B8;
  margin: 2px 0 0;
}

/* SKELETON */
.Budget__skeletonWrap { padding: 16px; }
.Budget__skeleton {
  background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
  background-size: 200% 100%;
  animation: Budget__shimmer 1.5s infinite;
  border-radius: 16px;
}
@keyframes Budget__shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* INPUT CARD */
.Budget__inputCard {
  background: #ffffff;
  margin: 16px;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.Budget__inputHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.Budget__inputTitle {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}
.Budget__savedBadge {
  font-size: 12px;
  font-weight: 600;
  color: #22c55e;
  background: #f0fdf4;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1px solid #bbf7d0;
}

/* INCOME FIELD */
.Budget__incomeField { margin-bottom: 4px; }
.Budget__label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 4px;
}
.Budget__labelHint {
  font-size: 12px;
  color: #94A3B8;
  margin: 0 0 10px;
}
.Budget__incomeRow {
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border: 2px solid #E2E8F0;
  border-radius: 12px;
  padding: 0 16px;
  transition: border-color 0.2s;
}
.Budget__incomeRow:focus-within { border-color: #6366f1; }
.Budget__rupeeSymbol {
  font-size: 20px;
  font-weight: 700;
  color: #6366f1;
  margin-right: 8px;
}
.Budget__incomeInput {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 24px;
  font-weight: 700;
  color: #0F172A;
  padding: 14px 0;
  outline: none;
  width: 100%;
}
.Budget__incomeInput::placeholder { color: #CBD5E1; }
.Budget__incomeInput::-webkit-outer-spin-button,
.Budget__incomeInput::-webkit-inner-spin-button { -webkit-appearance: none; }

/* DIVIDER */
.Budget__sectionDivider {
  font-size: 11px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 20px 0 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.Budget__sectionDivider::before,
.Budget__sectionDivider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}

/* FIELD ROWS */
.Budget__fieldRow {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #F8FAFC;
}
.Budget__fieldLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}
.Budget__fieldIcon { font-size: 20px; width: 28px; text-align: center; }
.Budget__fieldLabel {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: block;
}
.Budget__fieldHint {
  font-size: 11px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
}
.Budget__fieldInputBox {
  display: flex;
  align-items: center;
  background: #F8FAFC;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  padding: 0 10px;
  width: 110px;
  transition: border-color 0.2s;
}
.Budget__fieldInputBox:focus-within { border-color: #6366f1; }
.Budget__fieldRupee {
  font-size: 13px;
  color: #94A3B8;
  margin-right: 4px;
  flex-shrink: 0;
}
.Budget__fieldInput {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  padding: 10px 0;
  outline: none;
  text-align: right;
}
.Budget__fieldInput::-webkit-outer-spin-button,
.Budget__fieldInput::-webkit-inner-spin-button { -webkit-appearance: none; }

/* QUICK BUTTONS */
.Budget__quickBtn {
  font-size: 11px;
  color: #6366f1;
  background: none;
  border: none;
  padding: 4px 0 10px 40px;
  cursor: pointer;
  display: block;
  text-align: left;
}
.Budget__quickBtn:hover { text-decoration: underline; }

/* SAVE BUTTON */
.Budget__saveBtn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  transition: opacity 0.2s;
}
.Budget__saveBtn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RESULTS */
.Budget__results { padding: 0 16px; }

/* WARNING BANNER */
.Budget__banner {
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 13px;
  line-height: 1.5;
}
.Budget__banner p { margin: 0; }
.Budget__banner--danger {
  background: #FEF2F2;
  border: 1px solid #FECACA;
  color: #991B1B;
}
.Budget__banner--caution {
  background: #FFFBEB;
  border: 1px solid #FDE68A;
  color: #92400E;
}
.Budget__banner--good {
  background: #F0FDF4;
  border: 1px solid #BBF7D0;
  color: #166534;
}

/* SUMMARY CARDS */
.Budget__summaryRow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 16px;
}
.Budget__summaryCard {
  background: #ffffff;
  border-radius: 14px;
  padding: 14px 8px;
  text-align: center;
  border: 1px solid #F1F5F9;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.Budget__summaryIcon { font-size: 18px; }
.Budget__summaryValue {
  font-size: 14px;
  font-weight: 800;
  color: #0F172A;
}
.Budget__summaryLabel {
  font-size: 10px;
  color: #94A3B8;
  font-weight: 500;
}

/* TABS */
.Budget__tabBar {
  display: flex;
  gap: 6px;
  background: #F1F5F9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 14px;
}
.Budget__tab {
  flex: 1;
  padding: 9px 4px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
}
.Budget__tabActive {
  background: #ffffff;
  color: #6366f1;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.Budget__tabPanel {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #F1F5F9;
  margin-bottom: 14px;
}

/* DONUT CHART */
.Budget__donutWrap {
  position: relative;
  margin-bottom: 8px;
}
.Budget__donutCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}
.Budget__donutAmount {
  display: block;
  font-size: 16px;
  font-weight: 800;
  color: #0F172A;
}
.Budget__donutLabel {
  display: block;
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

/* BREAKDOWN LIST */
.Budget__breakdownRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F8FAFC;
}
.Budget__breakdownRow:last-of-type { border-bottom: none; }
.Budget__breakdownLeft {
  display: flex;
  align-items: center;
  gap: 12px;
}
.Budget__bIcon { font-size: 18px; width: 26px; text-align: center; }
.Budget__bLabel {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  display: block;
}
.Budget__bSub {
  font-size: 11px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
}
.Budget__breakdownRight { text-align: right; }
.Budget__bAmount {
  font-size: 15px;
  font-weight: 800;
  display: block;
}
.Budget__bPercent {
  font-size: 11px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
}

/* EMERGENCY CARD */
.Budget__emergencyCard {
  background: #FFFBEB;
  border-radius: 12px;
  padding: 14px;
  margin-top: 16px;
  border: 1px solid #FDE68A;
}
.Budget__emergencyTop {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #92400E;
  margin-bottom: 10px;
}
.Budget__progressTrack {
  height: 8px;
  background: #FEF3C7;
  border-radius: 100px;
  overflow: hidden;
  margin-bottom: 8px;
}
.Budget__progressFill {
  height: 100%;
  background: #f59e0b;
  border-radius: 100px;
  transition: width 0.6s ease;
}
.Budget__emergencyNote {
  font-size: 12px;
  color: #92400E;
  margin: 0;
}

/* INSIGHT */
.Budget__insightBox {
  background: #EEF2FF;
  border-radius: 12px;
  padding: 14px;
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border: 1px solid #C7D2FE;
}
.Budget__insightBox p {
  font-size: 13px;
  color: #3730A3;
  line-height: 1.6;
  margin: 0;
}

/* YEARLY BOX */
.Budget__yearBox {
  background: #F0FDF4;
  border-radius: 12px;
  padding: 16px;
  margin-top: 14px;
  border: 1px solid #BBF7D0;
}
.Budget__yearTitle {
  font-size: 14px;
  font-weight: 700;
  color: #166534;
  margin: 0 0 14px;
}
.Budget__yearGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  text-align: center;
}
.Budget__yearValue {
  font-size: 14px;
  font-weight: 800;
  display: block;
}
.Budget__yearLabel {
  font-size: 10px;
  color: #166534;
  display: block;
  margin-top: 4px;
}

/* INVEST TAB */
.Budget__investIntro {
  font-size: 14px;
  color: #374151;
  margin: 0 0 16px;
}
.Budget__chartBox { margin: 0 0 16px; }
.Budget__investRow {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F8FAFC;
}
.Budget__investRow:last-of-type { border-bottom: none; }
.Budget__investDot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.Budget__investText { flex: 1; }
.Budget__investName {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  display: block;
}
.Budget__investPct {
  font-size: 11px;
  color: #94A3B8;
  display: block;
  margin-top: 2px;
}
.Budget__investAmt {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  white-space: nowrap;
}

/* PROJECTION TAB */
.Budget__projIntro {
  font-size: 13px;
  color: #64748B;
  line-height: 1.6;
  margin: 0 0 16px;
}
.Budget__projCard {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #F8FAFC;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 10px;
  border: 1px solid #E2E8F0;
}
.Budget__projEmoji { font-size: 28px; flex-shrink: 0; }
.Budget__projLeft { flex: 1; }
.Budget__projYear {
  font-size: 12px;
  color: #94A3B8;
  display: block;
}
.Budget__projVal {
  font-size: 20px;
  font-weight: 800;
  color: #22c55e;
  display: block;
}
.Budget__projGain {
  font-size: 11px;
  color: #64748B;
  display: block;
  margin-top: 2px;
}
.Budget__projRight { text-align: right; flex-shrink: 0; }
.Budget__projInvLabel {
  font-size: 10px;
  color: #94A3B8;
  display: block;
}
.Budget__projInvVal {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  display: block;
}

/* DISCLAIMER */
.Budget__disclaimer {
  font-size: 11px;
  color: #94A3B8;
  line-height: 1.6;
  margin-top: 16px;
  padding: 12px;
  background: #F8FAFC;
  border-radius: 8px;
  text-align: center;
}

/* RESET */
.Budget__resetBtn {
  display: block;
  margin: 4px auto 8px;
  background: none;
  border: 1.5px solid #E2E8F0;
  color: #94A3B8;
  padding: 10px 28px;
  border-radius: 100px;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.Budget__resetBtn:hover { border-color: #ef4444; color: #ef4444; }

RULES:


All calculations in frontend only — backend stores 4 numbers only
Result appears live as user types — no submit button to see output
Save button only appears once income is entered
Saved badge shows after successful save
inputMode="numeric" on all number inputs for mobile keyboard
Hide number input spinners via CSS
Build both files completely, no TODOs, no placeholders
navigate('/dashboard') for back button using useNavigate from react-router-dom
Disclaimer shown on both invest and projection tabs

in this file written as use fetch, but you should call apis same as in another file