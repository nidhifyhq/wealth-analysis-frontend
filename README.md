import React, { useEffect, useRef, useState } from "react";
import cas1Img from "../../assets/FixedDeposit/cas1.png";
import cas2Img from "../../assets/FixedDeposit/cas2.png";

/**
 * MFCentralTrackFunds
 * ---------------------------------------------------------------
 * Same layout as the reference screen ("Track funds through MF
 * Central"). The preview box plays a looping auto-demo: cas1 and
 * cas2 are stacked into ONE continuous scrollable strip (not two
 * separate overlaid images), so the motion reads as a single page
 * scrolling down rather than a page swap. A little cursor icon
 * visibly moves to and "clicks" the CAS-CAMS+KFintech card, the
 * Email/Password/Confirm fields, and the Submit button, with real
 * typed text appearing in each field before the click.
 *
 * Inline-styled, single file. Drop cas1.png / cas2.png inside an
 * `assets` folder next to this file (or update the two imports).
 * ------------------------------------------------------------- */

const EMAIL_TEXT = "adarsh.demo@gmail.com";
const PASSWORD_MASK = "••••••••••";

const FRAME_WIDTH = 280;
const FRAME_HEIGHT = 380;

// Natural screenshot sizes
const CAS1_W = 455;
const CAS1_H = 817;
const CAS2_W = 475;
const CAS2_H = 962;

const CAS1_SCALE = FRAME_WIDTH / CAS1_W;
const CAS2_SCALE = FRAME_WIDTH / CAS2_W;

const H1 = CAS1_H * CAS1_SCALE; // cas1 rendered height inside the strip
const H2 = CAS2_H * CAS2_SCALE; // cas2 rendered height inside the strip
const TOTAL_H = H1 + H2;
const MAX_SCROLL = TOTAL_H - FRAME_HEIGHT;

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

// Measured (pixel-picked) field boxes on the real screenshots, scaled into strip coords
const CARD = { top: 361 * CAS1_SCALE, bottom: 522 * CAS1_SCALE, left: 20 * CAS1_SCALE, right: 225 * CAS1_SCALE };
const EMAIL = { top: H1 + 498 * CAS2_SCALE, bottom: H1 + 549 * CAS2_SCALE, left: 45 * CAS2_SCALE, right: 434 * CAS2_SCALE };
const PASSWORD = { top: H1 + 709 * CAS2_SCALE, bottom: H1 + 760 * CAS2_SCALE, left: 45 * CAS2_SCALE, right: 434 * CAS2_SCALE };
const CONFIRM = { top: H1 + 824 * CAS2_SCALE, bottom: H1 + 874 * CAS2_SCALE, left: 45 * CAS2_SCALE, right: 434 * CAS2_SCALE };
const SUBMIT = { top: H1 + 908 * CAS2_SCALE, bottom: H1 + 954 * CAS2_SCALE, left: 45 * CAS2_SCALE, right: 163 * CAS2_SCALE };

const centerOf = (box) => ({ x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 });
const clickPoint = (box) => ({ x: box.left + 15, y: (box.top + box.bottom) / 2 });
const centerScroll = (box) => clamp(centerOf(box).y - FRAME_HEIGHT / 2, 0, MAX_SCROLL);

// Timeline driving the whole loop. `cursor` = {x,y} in strip coords, `tap` triggers a click ripple.
const STEPS = [
  { key: "top", duration: 700, scroll: 0 },
  { key: "scroll-card", duration: 650, scroll: centerScroll(CARD) },
  { key: "click-card", duration: 450, scroll: centerScroll(CARD), overlay: "clickCard", cursor: clickPoint(CARD), tap: true },
  { key: "scroll-cas2", duration: 650, scroll: clamp(H1, 0, MAX_SCROLL) },
  { key: "scroll-email", duration: 550, scroll: centerScroll(EMAIL) },
  { key: "focus-email", duration: 350, scroll: centerScroll(EMAIL), overlay: "focusEmail", cursor: clickPoint(EMAIL), tap: true },
  { key: "type-email", duration: 1000, scroll: centerScroll(EMAIL), overlay: "email", typingTarget: EMAIL_TEXT },
  { key: "scroll-bottom", duration: 550, scroll: MAX_SCROLL },
  { key: "focus-password", duration: 300, scroll: MAX_SCROLL, overlay: "focusPassword", cursor: clickPoint(PASSWORD), tap: true },
  { key: "type-password", duration: 450, scroll: MAX_SCROLL, overlay: "password", typingTarget: PASSWORD_MASK },
  { key: "focus-confirm", duration: 300, scroll: MAX_SCROLL, overlay: "focusConfirm", cursor: clickPoint(CONFIRM), tap: true },
  { key: "type-confirm", duration: 450, scroll: MAX_SCROLL, overlay: "confirm", typingTarget: PASSWORD_MASK },
  { key: "click-submit", duration: 550, scroll: MAX_SCROLL, overlay: "clickSubmit", cursor: centerOf(SUBMIT), tap: true },
  { key: "success", duration: 850, scroll: MAX_SCROLL, overlay: "success" },
  { key: "reset", duration: 700, scroll: 0 },
];

const STEP_LIST = [
  { num: 1, text: <>Go to <b>MF Central</b> and enter <b>OTP</b></> },
  { num: 2, text: <>Select <b>All AMCs</b> and generate <b>QR</b></> },
  { num: 3, text: <>Download <b>QR</b> and click <b>Continue</b></> },
];

export default function MFCentralTrackFunds({ onBack, onStart }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const cursorPos = useRef(clickPoint(CARD));
  const [, forceRender] = useState(0);

  const step = STEPS[stepIndex];

  // Advance the timeline
  useEffect(() => {
    const t = setTimeout(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, step.duration);
    return () => clearTimeout(t);
  }, [stepIndex, step.duration]);

  // Keep cursor at its last known point; only move it on steps that define one
  useEffect(() => {
    if (step.cursor) {
      cursorPos.current = step.cursor;
      forceRender((n) => n + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  // Typing effect for whichever field is active this step
  useEffect(() => {
    if (!step.typingTarget) {
      setTypedChars(0);
      return;
    }
    setTypedChars(0);
    const target = step.typingTarget.length;
    const tickMs = Math.max(30, Math.floor(step.duration / (target + 3)));
    let count = 0;
    const id = setInterval(() => {
      count += 1;
      setTypedChars(count);
      if (count >= target) clearInterval(id);
    }, tickMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex]);

  const emailValue = step.overlay === "email" ? EMAIL_TEXT.slice(0, typedChars) : "";
  const passwordValue = step.overlay === "password" ? PASSWORD_MASK.slice(0, typedChars) : "";
  const confirmValue = step.overlay === "confirm" ? PASSWORD_MASK.slice(0, typedChars) : "";

  const cursorVisible = Boolean(step.cursor) || ["email", "password", "confirm"].includes(step.overlay);
  const c = cursorPos.current;

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>

      <button type="button" onClick={onBack} aria-label="Go back" style={styles.backButton}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#12121f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <h1 style={styles.title}>Track funds through MF Central</h1>
      <p style={styles.subtitle}>Generate QR to track all your funds</p>

      <div style={styles.previewBox}>
        <div style={styles.frame}>
          {/* Single continuous scroll strip: cas1 directly followed by cas2 */}
          <div style={{ ...styles.track, transform: `translateY(-${step.scroll}px)` }}>
            <img src={cas1Img} alt="MF Central statement picker" style={{ display: "block", width: FRAME_WIDTH, height: H1 }} />
            <img src={cas2Img} alt="MF Central generate statement form" style={{ display: "block", width: FRAME_WIDTH, height: H2 }} />
          </div>

          {/* Click ring on the CAS-CAMS+KFintech card */}
          {step.overlay === "clickCard" && (
            <div
              style={{
                ...styles.clickRing,
                top: CARD.top - step.scroll,
                left: CARD.left,
                width: CARD.right - CARD.left,
                height: CARD.bottom - CARD.top,
              }}
            />
          )}

          {/* Email value typed into the field */}
          {step.overlay === "email" && (
            <div style={{ ...styles.fieldOverlay, top: EMAIL.top - step.scroll, left: EMAIL.left, width: EMAIL.right - EMAIL.left, height: EMAIL.bottom - EMAIL.top }}>
              <span style={styles.typedText}>{emailValue}</span>
              <span style={styles.caret} />
            </div>
          )}

          {/* Password value typed into the field */}
          {step.overlay === "password" && (
            <div style={{ ...styles.fieldOverlay, top: PASSWORD.top - step.scroll, left: PASSWORD.left, width: 200, height: PASSWORD.bottom - PASSWORD.top }}>
              <span style={styles.typedText}>{passwordValue}</span>
              <span style={styles.caret} />
            </div>
          )}

          {/* Confirm password value typed into the field */}
          {step.overlay === "confirm" && (
            <div style={{ ...styles.fieldOverlay, top: CONFIRM.top - step.scroll, left: CONFIRM.left, width: 200, height: CONFIRM.bottom - CONFIRM.top }}>
              <span style={styles.typedText}>{confirmValue}</span>
              <span style={styles.caret} />
            </div>
          )}

          {/* Submit click ring */}
          {step.overlay === "clickSubmit" && (
            <div
              style={{
                ...styles.clickRing,
                borderRadius: 8,
                top: SUBMIT.top - step.scroll,
                left: SUBMIT.left,
                width: SUBMIT.right - SUBMIT.left,
                height: SUBMIT.bottom - SUBMIT.top,
              }}
            />
          )}

          {step.overlay === "success" && <div style={styles.successToast}>Request submitted ✓</div>}

          {/* Animated mouse cursor */}
          {cursorVisible && (
            <div style={{ ...styles.cursor, left: c.x, top: c.y - step.scroll }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 1.5L17 8.2L10.4 10.1L8 17L2 1.5Z" fill="#12121f" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
              {step.tap && <span key={stepIndex} style={styles.tapRipple} />}
            </div>
          )}
        </div>
      </div>

      <div style={styles.stepsWrap}>
        {STEP_LIST.map((s, i) => (
          <div key={s.num} style={styles.stepRow}>
            <div style={styles.stepDotCol}>
              <div style={styles.stepCircle}>{s.num}</div>
              {i !== STEP_LIST.length - 1 && <div style={styles.stepLine} />}
            </div>
            <div style={styles.stepText}>{s.text}</div>
          </div>
        ))}
      </div>

      <button type="button" onClick={onStart} style={styles.ctaButton}>
        Start on MF Central
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
          <path d="M7 17L17 7M17 7H8M17 7V16" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

const keyframes = `
@keyframes mfc-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
@keyframes mfc-pulse {
  0% { box-shadow: 0 0 0 0 rgba(12,62,56,0.35); }
  70% { box-shadow: 0 0 0 10px rgba(12,62,56,0); }
  100% { box-shadow: 0 0 0 0 rgba(12,62,56,0); }
}
@keyframes mfc-tap {
  0% { transform: scale(0.3); opacity: 0.9; }
  100% { transform: scale(2.4); opacity: 0; }
}
@keyframes mfc-toast-in {
  from { opacity: 0; transform: translate(-50%, 8px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}
`;

const styles = {
  page: {
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: 480,
    margin: "0 auto",
    minHeight: "100vh",
    background: "#ffffff",
    padding: "20px 20px 28px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  backButton: {
    background: "none",
    border: "none",
    padding: 0,
    width: 32,
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  title: { fontSize: 26, fontWeight: 700, color: "#12121f", margin: "20px 0 8px", lineHeight: 1.25 },
  subtitle: { fontSize: 15, color: "#6b7280", margin: "0 0 20px" },
  previewBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 20,
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    background: "#fafafa",
  },
  frame: {
    position: "relative",
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    overflow: "hidden",
    borderRadius: 14,
    background: "#ffffff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  track: {
    width: FRAME_WIDTH,
    transition: "transform 0.65s cubic-bezier(0.45,0,0.15,1)",
    willChange: "transform",
  },
  clickRing: {
    position: "absolute",
    border: "2px solid #0c3e38",
    borderRadius: 12,
    animation: "mfc-pulse 0.8s ease-out",
    pointerEvents: "none",
  },
  fieldOverlay: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.96)",
    border: "1.5px solid #39cc6e",
    borderRadius: 4,
    padding: "0 8px",
    boxSizing: "border-box",
  },
  typedText: { fontSize: 12, color: "#12121f", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden" },
  caret: { display: "inline-block", width: 1.5, height: 14, background: "#0c3e38", marginLeft: 2, animation: "mfc-blink 0.9s steps(1) infinite" },
  cursor: {
    position: "absolute",
    transition: "left 0.4s ease, top 0.4s ease",
    pointerEvents: "none",
    filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
  },
  tapRipple: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: "2px solid #0c3e38",
    animation: "mfc-tap 0.5s ease-out",
  },
  successToast: {
    position: "absolute",
    bottom: 14,
    left: "50%",
    transform: "translate(-50%, 0)",
    background: "#0c3e38",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: 600,
    padding: "8px 14px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    animation: "mfc-toast-in 0.3s ease-out",
  },
  stepsWrap: { marginBottom: 32 },
  stepRow: { display: "flex", alignItems: "flex-start" },
  stepDotCol: { display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    border: "1.5px solid #d1d5db",
    color: "#6b7280",
    fontSize: 14,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepLine: { width: 1.5, flex: 1, minHeight: 32, background: "#e5e7eb", margin: "4px 0" },
  stepText: { fontSize: 17, color: "#12121f", paddingTop: 5, paddingBottom: 24, lineHeight: 1.4 },
  ctaButton: {
    marginTop: "auto",
    background: "#39cc6e",
    color: "#ffffff",
    border: "none",
    borderRadius: 14,
    padding: "16px 20px",
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'DM Sans', sans-serif",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    width: "100%",
  },
};