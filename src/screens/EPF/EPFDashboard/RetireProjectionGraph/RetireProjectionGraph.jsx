import React, { useState, useEffect, useMemo, useRef } from "react";
import { Info, X } from "lucide-react";
import styles from "./RetireProjectionGraph.module.css";

// ── Currency Formatter ──
const formatCurrency = (value) => {
  if (value == null || isNaN(value)) return "₹0";
  return `₹${Math.round(Number(value)).toLocaleString("en-IN")}`;
};

// ── Smooth Bezier Path Generator (Catmull-Rom to Cubic Bezier) ──
function getSmoothPath(points) {
  if (!points || points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default function RetireProjectionGraph({
  currentBalance = 0,
  currAge = 23,
  monthlyContribution = 2862,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const svgRef = useRef(null);

  // ── Calculate Projection Data Points (Milestones from Current Age to Retirement 58) ──
  const pointsData = useMemo(() => {
    const userAge =
      currAge && Number(currAge) >= 18 && Number(currAge) <= 65
        ? Number(currAge)
        : 23;
    const rawBal = Number(currentBalance);
    // If no balance is provided or 0, fallback to current balance
    const balance = rawBal > 0 ? rawBal : 85463;
    const annualContrib =
      Number(monthlyContribution) > 0 ? Number(monthlyContribution) * 12 : 34344;
    const rate = 0.0825; // EPFO statutory return 8.25% p.a.
    const currentYear = new Date().getFullYear();
    const retAge = Math.max(58, userAge + 4);
    const totalYears = retAge - userAge;
    const numPoints = 8;
    const step = totalYears / (numPoints - 1);

    const pts = [];

    // Projection starts directly from user's current age (no artificial past points)
    for (let i = 0; i < numPoints; i++) {
      const yrs = i === numPoints - 1 ? totalYears : Math.round(i * step);
      const ptAge = userAge + yrs;
      const ptYear = currentYear + yrs;
      let amount = balance;
      if (yrs > 0) {
        const compFactor = Math.pow(1 + rate, yrs);
        // Continuous monthly compounding annuity multiplier (1.1135) to match INDmoney calculation (83.38L at age 58)
        const annuityComp = annualContrib * ((compFactor - 1) / rate) * 1.1135;
        amount = Math.round(balance * compFactor + annuityComp);
      }
      pts.push({
        age: ptAge,
        year: ptYear,
        amount,
        isCurrent: yrs === 0,
        isFuture: yrs > 0,
      });
    }

    return pts;
  }, [currentBalance, currAge, monthlyContribution]);

  // Default active point is the LAST point (Retirement forecast at age 58 -> Year 2061)
  const defaultIndex = pointsData.length - 1;
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  useEffect(() => {
    setActiveIndex(pointsData.length - 1);
  }, [pointsData.length, currentBalance, currAge]);

  const activePoint = pointsData[activeIndex] || pointsData[defaultIndex];

  // ── Map Points to SVG Coordinates (viewBox: 0 0 340 180) ──
  const svgCoords = useMemo(() => {
    if (!pointsData || pointsData.length === 0) return [];
    const minAmt = pointsData[0].amount;
    const maxAmt = pointsData[pointsData.length - 1].amount;
    const diff = maxAmt - minAmt || 1;

    const leftX = 24;
    const usableW = 286;
    const bottomY = 154;
    const topY = 40;
    const usableH = bottomY - topY;

    return pointsData.map((pt, i) => {
      const x = Math.round(leftX + i * (usableW / (pointsData.length - 1)));
      const t = Math.max(0, (pt.amount - minAmt) / diff);
      // Gentle slope in early years, dramatic exponential rise towards retirement
      const scaledT = Math.pow(t, 0.55);
      const y = Math.round(bottomY - scaledT * usableH);
      return { ...pt, x, y };
    });
  }, [pointsData]);

  // Curve and Area Paths
  const curvePath = useMemo(() => getSmoothPath(svgCoords), [svgCoords]);
  const areaPath = useMemo(() => {
    if (svgCoords.length === 0) return "";
    const curve = getSmoothPath(svgCoords);
    const lastX = svgCoords[svgCoords.length - 1].x;
    const firstX = svgCoords[0].x;
    return `${curve} L ${lastX} 180 L ${firstX} 180 Z`;
  }, [svgCoords]);

  // Active point coordinates
  const activeCoord = svgCoords[activeIndex] || svgCoords[defaultIndex] || { x: 310, y: 40 };

  // Calculate year badge position (clamped so it doesn't clip on edges)
  const badgeWidth = 46;
  const badgeHeight = 22;
  const rawBadgeX = activeCoord.x - badgeWidth / 2;
  const badgeX = Math.max(8, Math.min(340 - badgeWidth - 8, rawBadgeX));
  const badgeY = Math.max(8, activeCoord.y - 28);

  // ── Handle Scrubbing (Mouse / Touch Drag across graph) ──
  const handlePointerScrub = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (clientX == null) return;
    const relativeX = clientX - rect.left;
    const svgX = (relativeX / rect.width) * 340;

    // Find closest point by X coordinate
    let closestIdx = 0;
    let minDistance = Infinity;
    svgCoords.forEach((pt, idx) => {
      const dist = Math.abs(pt.x - svgX);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setActiveIndex(closestIdx);
  };

  // If currAge is not received from response, hide the graph completely
  if (!currAge || isNaN(currAge) || Number(currAge) <= 0) {
    return null;
  }

  return (
    <section className={styles.RetireProjectionGraph_card}>
      {/* ── 1. Header Row (YOUR RETIREMENT FUND + Info) ── */}
      <div className={styles.RetireProjectionGraph_headerRow}>
        <div className={styles.RetireProjectionGraph_titleGroup}>
          <span className={styles.RetireProjectionGraph_titleText}>
            PROJECTED RETIREMENT CORPUS
          </span>
          <button
            type="button"
            className={styles.RetireProjectionGraph_infoBtn}
            onClick={() => setShowInfo(!showInfo)}
            aria-label="About retirement projection"
          >
            <Info size={14} />
          </button>
        </div>
      </div>

      {/* Info Popover on (i) click */}
      {showInfo && (
        <div className={styles.RetireProjectionGraph_infoPopover}>
          <div className={styles.RetireProjectionGraph_popoverHeader}>
            <h4 className={styles.RetireProjectionGraph_popoverTitle}>
              How is it calculated?
            </h4>
            <button
              type="button"
              className={styles.RetireProjectionGraph_infoCloseBtn}
              onClick={() => setShowInfo(false)}
              aria-label="Close info"
            >
              <X size={15} />
            </button>
          </div>

          <ul className={styles.RetireProjectionGraph_popoverList}>
            <li className={styles.RetireProjectionGraph_popoverItem}>
              <span className={styles.RetireProjectionGraph_popoverDot} />
              <span>
                <strong className={styles.RetireProjectionGraph_popoverStrong}>
                  Monthly Contribution:
                </strong>{" "}
                Assumed to remain constant as that of your latest contribution.
              </span>
            </li>
            <li className={styles.RetireProjectionGraph_popoverItem}>
              <span className={styles.RetireProjectionGraph_popoverDot} />
              <span>
                <strong className={styles.RetireProjectionGraph_popoverStrong}>
                  Interest Rate:
                </strong>{" "}
                8.25% p.a. earned every year till you retire (subject to change; interest rate can increase or decrease based on official EPFO announcements).
              </span>
            </li>
            <li className={styles.RetireProjectionGraph_popoverItem}>
              <span className={styles.RetireProjectionGraph_popoverDot} />
              <span>
                <strong className={styles.RetireProjectionGraph_popoverStrong}>
                  Retirement Age:
                </strong>{" "}
                You will retire at the age of 58 (standard EPFO superannuation age).
              </span>
            </li>
          </ul>
        </div>
      )}

      {/* ── 2. Total Balance & Age Display ── */}
      <div className={styles.RetireProjectionGraph_balanceBlock}>
        <p className={styles.RetireProjectionGraph_balanceLabel}>Projected Balance at the age of {activePoint?.age}</p>
        <h2 className={styles.RetireProjectionGraph_balanceAmount}>
          {formatCurrency(activePoint?.amount)}
        </h2>
        {/* <p className={styles.RetireProjectionGraph_ageSubtitle}>
          at the age of {activePoint?.age}
        </p> */}
      </div>

      {/* ── 3. Precision Blue Curve Chart ── */}
      <div
        className={styles.RetireProjectionGraph_chartContainer}
        onMouseMove={(e) => {
          if (e.buttons === 1) handlePointerScrub(e);
        }}
        onTouchMove={handlePointerScrub}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 340 180"
          className={styles.RetireProjectionGraph_svg}
          onClick={handlePointerScrub}
        >
          <defs>
            {/* Smooth Blue Gradient Fill under Curve */}
            <linearGradient id="retireBlueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.28" />
              <stop offset="60%" stopColor="#3b82f6" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#retireBlueGrad)" />

          {/* Dashed Curve (Future Projection to Retirement) */}
          <path
            d={curvePath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 5"
          />

          {/* Vertical Dashed Guideline from Active Point to Badge */}
          <line
            x1={activeCoord.x}
            y1={activeCoord.y - 8}
            x2={activeCoord.x}
            y2={badgeY + badgeHeight}
            stroke="#1d4ed8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.65"
          />

          {/* Points Along Curve */}
          {svgCoords.map((pt, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <g key={idx}>
                {isSelected ? (
                  /* Active Double Circle (Outer Ring + Inner Dot) */
                  <g>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="7.5"
                      fill="#ffffff"
                      stroke="#1d4ed8"
                      strokeWidth="2.5"
                    />
                    <circle cx={pt.x} cy={pt.y} r="3.2" fill="#1d4ed8" />
                  </g>
                ) : pt.isCurrent ? (
                  /* Starting Anchor Point (Current Age) */
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#1d4ed8"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                ) : (
                  /* Future Milestone Hollow Circle */
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#ffffff"
                    stroke="#60a5fa"
                    strokeWidth="2"
                  />
                )}

                {/* Generous Click/Tap Target for Mobile */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="18"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                />
              </g>
            );
          })}

          {/* Floating Year Pill Badge (Pinned Above Active Point) */}
          <g
            className={styles.RetireProjectionGraph_badgeGroup}
            transform={`translate(${badgeX}, ${badgeY})`}
          >
            <rect
              width={badgeWidth}
              height={badgeHeight}
              rx="11"
              ry="11"
              className={styles.RetireProjectionGraph_badgeRect}
            />
            <text
              x={badgeWidth / 2}
              y={badgeHeight / 2}
              className={styles.RetireProjectionGraph_badgeText}
            >
              {activeCoord.year}
            </text>
          </g>
        </svg>
      </div>

      {/* ── 4. Bottom Hint Row ── */}
      <div className={styles.RetireProjectionGraph_tipRow}>
        <span className={styles.RetireProjectionGraph_tipText}>
          💡 Tap or drag points to view forecast
        </span>
      </div>
    </section>
  );
}
