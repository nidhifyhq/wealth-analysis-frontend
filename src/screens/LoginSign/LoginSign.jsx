import React, { useState, useEffect, useRef } from 'react';
import styles from './LoginSign.module.css';

// Universal Back Chevron Arrow
const ArrowBackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

// Alert Banner Triangle
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
);

export default function LoginSign() {
  // Navigation steps: 'INITIAL' | 'PASSWORD' | 'SIGNUP' | 'OTP'
  const [step, setStep] = useState('INITIAL');
  
  // Shared Form Parameters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // OTP Management State (4 fields split string)
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [errorMsg, setErrorMsg] = useState('');
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Simulate an active countdown timer for OTP screen
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Back Button Navigation Rules
  const handleBackNavigation = () => {
    setErrorMsg('');
    if (step === 'PASSWORD' || step === 'SIGNUP') {
      setStep('INITIAL');
    } else if (step === 'OTP') {
      setStep(name ? 'SIGNUP' : 'INITIAL');
    }
  };

  // Step 1: Handle initial email checking submission
  const handleInitialProceed = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    // Mock Business Logic: "test@user.com" is treated as existing
    if (email.toLowerCase() === 'test@user.com') {
      setStep('PASSWORD');
    } else {
      setStep('SIGNUP');
    }
  };

  // Step 2A: Handle Existing User Password Validation
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (password.length < 6) {
      setErrorMsg('Invalid credentials. Please verify your password.');
      return;
    }
    alert('Logged in successfully!');
  };

  // Step 2B: Handle New Registration Validation
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) return setErrorMsg('Name field cannot be blank.');
    if (mobile.length < 8) return setErrorMsg('Enter a valid mobile number.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (!agreeTerms) return setErrorMsg('You must accept the terms and conditions.');

    // Transition to verification stage
    setTimer(60);
    setStep('OTP');
  };

  // Step 3: Handle Verification Sequence
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const cleanValue = value.substring(value.length - 1);
    const updatedOtp = [...otp];
    updatedOtp[index] = cleanValue;
    setOtp(updatedOtp);

    // Dynamic autofocus adjustment moving forward
    if (cleanValue !== '' && index < 3) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Structural regression autofocus moving backwards
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 4) {
      setErrorMsg('Please fill in the entire 4-digit code.');
      return;
    }
    
    // Mock Validation: Success criteria code is 1234
    if (fullOtp !== '1234') {
      setErrorMsg('The security code you entered is incorrect. Try again.');
      return;
    }

    alert('Account successfully registered & verified!');
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      setOtp(['', '', '', '']);
      setTimer(60);
      setErrorMsg('');
      alert('A fresh verification token has been routed to your inbox.');
    }
  };

  return (
    <div className={styles.LoginSignContainer}>
      {/* Top Graphic Jumbotron Hero Frame */}
      <header className={styles.LoginSignHeaderBanner}>
        {step !== 'INITIAL' && (
          <button 
            type="button" 
            className={styles.LoginSignBackButton} 
            onClick={handleBackNavigation}
            aria-label="Navigate back"
          >
            <ArrowBackIcon />
          </button>
        )}
        
        <div className={styles.LoginSignHeroTextGroup}>
          {step === 'INITIAL' && (
            <>
              <h2 className={styles.LoginSignTitle}>Welcome to Investment</h2>
              <p className={styles.LoginSignSubtitle}>Enter your details to coordinate wealth growth pipelines.</p>
            </>
          )}
          {step === 'PASSWORD' && (
            <>
              <h2 className={styles.LoginSignTitle}>Welcome back!</h2>
              <p className={styles.LoginSignSubtitle}>Please provide authorization credentials linked to {email}.</p>
            </>
          )}
          {step === 'SIGNUP' && (
            <>
              <h2 className={styles.LoginSignTitle}>Create Account</h2>
              <p className={styles.LoginSignSubtitle}>Set up a profile space to access premier capital markets assets.</p>
            </>
          )}
          {step === 'OTP' && (
            <>
              <h2 className={styles.LoginSignTitle}>Verify Email</h2>
              <p className={styles.LoginSignSubtitle}>We have issued a multi-factor passcode verification block to {email}.</p>
            </>
          )}
        </div>
      </header>

      {/* Dynamic Sheet Block Container */}
      <main className={styles.LoginSignFormSheet}>
        {/* Styled Contextual Application Error Framework */}
        {errorMsg && (
          <div className={styles.LoginSignErrorAlert}>
            <AlertIcon />
            <span className={styles.LoginSignErrorText}>{errorMsg}</span>
          </div>
        )}

        {/* INITIAL EMAIL DISCOVERY FLOW */}
        {step === 'INITIAL' && (
          <form onSubmit={handleInitialProceed} className={styles.LoginSignFormLayout}>
            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Email Address</label>
              <input 
                type="email" 
                placeholder="e.g. wadewarren@gmail.com" 
                className={styles.LoginSignInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.LoginSignActionBtn}>
              Proceed
            </button>
          </form>
        )}

        {/* RETURNING USER SIGN IN FLOW */}
        {step === 'PASSWORD' && (
          <form onSubmit={handlePasswordSubmit} className={styles.LoginSignFormLayout}>
            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Enter Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={styles.LoginSignInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className={styles.LoginSignActionBtn}>
              Sign In
            </button>
          </form>
        )}

        {/* REGISTRATION SEQUENCE FLOW */}
        {step === 'SIGNUP' && (
          <form onSubmit={handleSignupSubmit} className={styles.LoginSignFormLayout}>
            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Full Name</label>
              <input 
                type="text" 
                placeholder="Wade Warren" 
                className={styles.LoginSignInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Mobile Number</label>
              <input 
                type="tel" 
                placeholder="Enter mobile number" 
                className={styles.LoginSignInput}
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Email Address</label>
              <input 
                type="email" 
                className={styles.LoginSignInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={styles.LoginSignInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className={styles.LoginSignInput}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className={styles.LoginSignCheckboxBlock}>
              <label className={styles.LoginSignCheckboxLabel}>
                <input 
                  type="checkbox" 
                  className={styles.LoginSignCheckbox}
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className={styles.LoginSignCheckboxText}>I agree with terms and conditions</span>
              </label>
            </div>

            <button type="submit" className={styles.LoginSignActionBtn}>
              Create Account
            </button>
          </form>
        )}

        {/* OTP DUAL AUTHENTICATION SCREEN */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className={styles.LoginSignFormLayout}>
            <div className={styles.LoginSignInputBlock} style={{ alignItems: 'center' }}>
              <label className={styles.LoginSignLabel} style={{ alignSelf: 'flex-start' }}>Enter 4-Digit OTP</label>
              
              <div className={styles.LoginSignOtpRow}>
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={otpRefs[idx]}
                    className={styles.LoginSignOtpBox}
                    onChange={(e) => handleOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    pattern="\d*"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
            </div>

            <div className={styles.LoginSignTimerBlock}>
              {timer > 0 ? (
                <p className={styles.LoginSignTimerActive}>Resend OTP code available in: <strong>{timer}s</strong></p>
              ) : (
                <button 
                  type="button" 
                  className={styles.LoginSignResendBtn} 
                  onClick={handleResendOtp}
                >
                  Resend OTP Code
                </button>
              )}
            </div>

            <button type="submit" className={styles.LoginSignActionBtn}>
              Verify OTP
            </button>
          </form>
        )}
      </main>
    </div>
  );
}