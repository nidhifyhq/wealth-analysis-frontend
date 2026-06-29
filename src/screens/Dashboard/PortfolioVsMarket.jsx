import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid,
} from 'recharts';
import { Info, ArrowDownUp  } from 'lucide-react';
import { fetchPortfolioComparison } from '../../services/apis/dashboard.service';

// const PERIODS = ['1D', '1W', '1M', '6M', '1Y', 'ALL'];
const PERIODS = ['1M', '3M', '6M', '1Y', 'ALL'];
const BENCHMARKS = [
  { value: 'nifty50', label: 'NIFTY 50' },
  { value: 'sensex', label: 'SENSEX' },
  { value: 'niftymid150', label: 'NIFTY MIDCAP 150' },
  { value: 'niftysmall250', label: 'NIFTY 500' },
];

const formatReturn = (num) => {
  if (num == null) return '0.00%';
  const sign = num >= 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

const formatValue = (num) => {
  if (num == null) return '₹0';
  return `₹${Number(num).toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
};

const CustomTooltip = ({ active, payload, label, mode, benchmarkLabel }) => {
  if (!active || !payload || !payload.length) return null;
  const portfolio = payload.find((p) => p.dataKey === 'portfolioReturn' || p.dataKey === 'portfolioValue');
  const benchmark = payload.find((p) => p.dataKey === 'benchmarkReturn' || p.dataKey === 'benchmarkValue');
  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 13 }}>
      <p style={{ fontWeight: 700, margin: '0 0 6px', color: '#111' }}>{label}</p>
      {portfolio && <p style={{ margin: 0, color: '#4F46E5' }}>Portfolio: {mode === 'return' ? formatReturn(portfolio.value) : formatValue(portfolio.value)}</p>}
      {benchmark && <p style={{ margin: '2px 0 0', color: '#C2410C' }}>{benchmarkLabel}: {mode === 'return' ? formatReturn(benchmark.value) : formatValue(benchmark.value)}</p>}
    </div>
  );
};

const SkeletonBlock = ({ height, width }) => (
  <div style={{ height: height || 20, width: width || '100%', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', borderRadius: 8, animation: 'shimmer 1.5s infinite' }} />
);

const shimmerStyle = `@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`;

export default function PortfolioVsMarket() {
  const [period, setPeriod] = useState('6M');
  const [mode, setMode] = useState('return');
  const [benchmark, setBenchmark] = useState('nifty50');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    const res = await fetchPortfolioComparison({ benchmark, period, mode });
    if (!res || !res.success) {
      setError(res?.message || 'Failed to load comparison data');
      setData(null);
    } else {
      setData(res.data);
    }
    setLoading(false);
  }, [benchmark, period, mode]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const timeline = data?.timeline || [];
  const summary = data?.summary;
  const meta = data?.meta;
  const benchmarkLabel = BENCHMARKS.find((b) => b.value === benchmark)?.label || 'NIFTY 50';

  const portfolioSummary = summary?.portfolio;
  const benchmarkSummary = summary?.benchmark;

  const renderSkeletonCards = () => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, background: '#f9fafb', borderRadius: 12, padding: 16 }}>
        <SkeletonBlock height={14} width="60%" />
        <div style={{ height: 8 }} />
        <SkeletonBlock height={28} width="70%" />
        <div style={{ height: 6 }} />
        <SkeletonBlock height={12} width="50%" />
      </div>
      <div style={{ flex: 1, background: '#f9fafb', borderRadius: 12, padding: 16 }}>
        <SkeletonBlock height={14} width="60%" />
        <div style={{ height: 8 }} />
        <SkeletonBlock height={28} width="70%" />
        <div style={{ height: 6 }} />
        <SkeletonBlock height={12} width="50%" />
      </div>
    </div>
  );

  const renderSkeletonChart = () => (
    <div style={{ height: 280, display: 'flex', alignItems: 'flex-end', padding: '16px 0', gap: 4 }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: `${30 + Math.random() * 70}%`, background: '#f0f0f0', borderRadius: '4px 4px 0 0' }} />
      ))}
    </div>
  );

  return (
    <div style={{ background: '#fff', padding: 16 }}>
      <style>{shimmerStyle}</style>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#092042', marginBottom: '10px' }}>Portfolio vs Market</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6B7280', marginBottom: '5px' }}>
            {period} {mode === 'return' ? 'Absolute Returns' : 'Portfolio Value'}
          </p>
        </div>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowTooltip(true)}
            style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#9CA3AF' }}
          >
            <Info size={16} />
          </button>
          {showTooltip && (
            <>
              <div
                style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9 }}
                onClick={() => setShowTooltip(false)}
              />
              <div style={{ position: 'absolute', top: 36, right: 0, background: '#111827', color: '#fff', fontSize: 12, padding: '10px 14px', borderRadius: 10, width: 220, zIndex: 10, lineHeight: 1.5, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
                Compares your portfolio returns with benchmark indices over the selected period. Benchmark data and portfolio valuations are approximate estimates and may contain parsing mismatches or data feed delays. Please cross-verify critical performance numbers independently.
                <div style={{ position: 'absolute', top: -6, right: 10, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid #111827' }} />
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', fontSize: 13, color: '#DC2626', margin: '12px 0' }}>
          {error}
        </div>
      )}

      {/* Comparison Cards */}
      {loading ? renderSkeletonCards() : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
          {/* Portfolio Card */}
          <div style={{ flex: 1, background: '#EEF2FF', borderRadius: 12, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: 0.5 }}>My Portfolio</p>
            <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: '#4F46E5', lineHeight: 1.2 }}>
              {mode === 'return' ? formatReturn(portfolioSummary?.absoluteReturn) : formatValue(portfolioSummary?.currentValue)}
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#6366F1' }}>
              {mode === 'return' ? formatValue(portfolioSummary?.currentValue) : formatReturn(portfolioSummary?.absoluteReturn)}
            </p>
          </div>

          {/* VS Divider */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', flexShrink: 0 }}>vs</div>

          {/* Benchmark Card */}
          <div
            onClick={() => {
              const idx = BENCHMARKS.findIndex(b => b.value === benchmark);
              const next = (idx + 1) % BENCHMARKS.length;
              setBenchmark(BENCHMARKS[next].value);
            }}
            style={{ flex: 1, background: '#FFF7ED', borderRadius: 12, padding: 16, cursor: 'pointer' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: '#C2410C', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {benchmarkLabel} <ArrowDownUp  size={10} />
            </span>
            <p style={{ margin: '6px 0 0', fontSize: 14, fontWeight: 600, color: '#C2410C', lineHeight: 1.2 }}>
              {mode === 'return' ? formatReturn(benchmarkSummary?.absoluteReturn) : formatValue(benchmarkSummary?.hypotheticalValue)}
              <span style={{ fontSize: 11, marginLeft: 4 }}>
                {benchmarkSummary?.absoluteReturn != null && (benchmarkSummary.absoluteReturn >= 0 ? '▲' : '▼')}
              </span>
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EA580C' }}>
              {mode === 'return' ? formatValue(benchmarkSummary?.hypotheticalValue) : formatReturn(benchmarkSummary?.absoluteReturn)}
            </p>
          </div>
        </div>
      )}

      {/* Line Chart */}
      {loading ? renderSkeletonChart() : timeline.length > 0 ? (
        <div style={{ height: 280, marginBottom: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 8, right: 20, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9CA3AF' }}
                interval={Math.max(0, Math.floor((timeline.length - 1) / 5))}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip mode={mode} benchmarkLabel={benchmarkLabel} />} />
              {mode === 'return' && <ReferenceLine y={0} stroke="#D1D5DB" strokeDasharray="4 4" />}
              <Line
                type="monotone"
                dataKey={mode === 'return' ? 'portfolioReturn' : 'portfolioValue'}
                stroke="#4F46E5"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={mode === 'return' ? 'benchmarkReturn' : 'benchmarkValue'}
                stroke="#C2410C"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: 14 }}>
          No timeline data available
        </div>
      )}

      {/* Period Selector + Mode */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                background: period === p ? '#092042' : '#F3F4F6', color: period === p ? '#fff' : '#6B7280', transition: 'all 0.15s',
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => setMode(prev => prev === 'return' ? 'value' : 'return')}
          style={{ padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#F3F4F6', color: '#6B7280', fontFamily: 'inherit' }}
        >
          {mode === 'return' ? 'Return' : 'Value'}
        </button>
      </div>

      {/* Footer */}
      {meta?.generatedAt && (
        <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
          Last updated on {new Date(meta.generatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      )}
    </div>
  );
}
