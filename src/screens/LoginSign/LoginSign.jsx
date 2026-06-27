import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import styles from './LoginSign.module.css';
import { checkEmail, userLogin, registerSendOtp, registerVerifyOtp } from '../../services/apis/login.service';
import { setAuthFromLogin } from '../../store/auth/auth.slice';
import logoFull from '../../assets/images/nidhifylogofull.png';
import RegisterConcentModal from './RegisterConcentModal/RegisterConcentModal';
import MFCasImportModal from '../MutualFund/MFCasImport/MFCasImportModal';

export default function LoginSign() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatFirstName = (fullName) => {
    if (!fullName) return '';
    const first = fullName.split(' ')[0];
    return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
  };

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showCasModal, setShowCasModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Lock body scroll when terms modal is open
  useEffect(() => {
    if (showTermsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showTermsModal]);

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
    setSuccessMsg('');
    if (step === 'PASSWORD' || step === 'SIGNUP') {
      setStep('INITIAL');
    } else if (step === 'OTP') {
      setStep(name ? 'SIGNUP' : 'INITIAL');
    }
  };

  // Step 1: Handle initial email checking submission
  const handleInitialProceed = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    const res = await checkEmail({ email });
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (res.isExist) {
      if (res.Name) setName(res.Name);
      setStep('PASSWORD');
    } else {
      setName('');
      setStep('SIGNUP');
    }
  };

  // Step 2A: Handle Existing User Password Validation
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (password.length < 6) {
      setErrorMsg('Invalid credentials. Please verify your password.');
      return;
    }

    const res = await userLogin({ email, password });
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid email or password');
      return;
    }

    dispatch(setAuthFromLogin({
      authToken: res.token,
      userId: res.userId,
      name: res.Name,
      email,
    }));
    navigate('/dashboard');
  };

  // Step 2B: Handle New Registration Validation
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) return setErrorMsg('Name field cannot be blank.');
    if (!/^[6-9]\d{9}$/.test(mobile)) return setErrorMsg('Mobile number must be 10 digits starting with 6-9.');
    if (password !== confirmPassword) return setErrorMsg('Passwords do not match.');
    if (password.length < 6) return setErrorMsg('Password must be at least 6 characters.');
    if (!agreeTerms) return setErrorMsg('You must accept the terms and conditions.');

    const titleCaseName = name.replace(/\b\w/g, (c) => c.toUpperCase());

    const res = await registerSendOtp({
      name: titleCaseName,
      mobile,
      email,
      password,
      isRegisterConsent: agreeTerms,
    });
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed. Please try again.');
      return;
    }

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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 4) {
      setErrorMsg('Please fill in the entire 4-digit code.');
      return;
    }

    const res = await registerVerifyOtp({ email, otp: fullOtp });
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid OTP. Try again.');
      return;
    }

    dispatch(setAuthFromLogin({
      authToken: res.token,
      userId: res.userId,
      name: res.Name,
      email,
    }));
    setShowCasModal(true);
  };

  const handleResendOtp = async () => {
    if (timer === 0) {
      const titleCaseName = name.replace(/\b\w/g, (c) => c.toUpperCase());
      const res = await registerSendOtp({
        name: titleCaseName,
        mobile,
        email,
        password,
        isRegisterConsent: agreeTerms,
      });
      if (!res || !res.success) {
        setErrorMsg(res?.message || 'Failed to resend OTP. Try again.');
        return;
      }
      setOtp(['', '', '', '']);
      setTimer(60);
      setErrorMsg('');
      setSuccessMsg(res?.message || 'OTP sent successfully');
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
            <ArrowLeft size={20} />
          </button>
        )}
        
        <div className={styles.LoginSignHeroTextGroup}>
          <img src={logoFull} alt="Nidhify" className={styles.LoginSignLogo} />
          {step === 'INITIAL' && (
            <>
              <h2 className={styles.LoginSignTitle}>All Your Investments. One Place</h2>
              <p className={styles.LoginSignSubtitle}>Keep track of your investments and watch your wealth grow over time.</p>
            </>
          )}
          {step === 'PASSWORD' && (
            <>
              <h2 className={styles.LoginSignTitle}>Welcome back{name ? `, ${formatFirstName(name)}` : ''}!</h2>
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
        {/* Success Notification Banner */}
        {successMsg && (
          <div className={styles.LoginSignSuccessAlert}>
            <span className={styles.LoginSignSuccessText}>{successMsg}</span>
          </div>
        )}

        {/* Styled Contextual Application Error Framework */}
        {errorMsg && (
          <div className={styles.LoginSignErrorAlert}>
            <AlertTriangle size={16} />
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
              <div className={styles.LoginSignPasswordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={styles.LoginSignInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
                <button type="button" className={styles.LoginSignPasswordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/\D/g, '');
                  if (cleaned.length > 0 && !/^[6-9]/.test(cleaned[0])) return;
                  setMobile(cleaned.slice(0, 10));
                }}
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
              <div className={styles.LoginSignPasswordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={styles.LoginSignInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.LoginSignPasswordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>Confirm Password</label>
              <div className={styles.LoginSignPasswordWrapper}>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={styles.LoginSignInput}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.LoginSignPasswordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)} tabIndex={-1}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.LoginSignCheckboxBlock}>
              <label className={styles.LoginSignCheckboxLabel} onClick={() => setShowTermsModal(true)} style={{ cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  className={styles.LoginSignCheckbox}
                  checked={agreeTerms}
                  readOnly
                />
                <span className={styles.LoginSignCheckboxText}>
                  I agree to the Terms of Service and understand Nidhify is a tracking tool, not a financial advisory service.
                </span>
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

        {/* Footer Links */}
        <footer className={styles.LoginSignFooter}>
          <a href="/terms" className={styles.LoginSignFooterLink}>Terms</a>
          <span className={styles.LoginSignFooterDot}>·</span>
          <a href="/privacy" className={styles.LoginSignFooterLink}>Privacy</a>
          <span className={styles.LoginSignFooterDot}>·</span>
          <a href="/disclaimer" className={styles.LoginSignFooterLink}>Disclaimer</a>
          <span className={styles.LoginSignFooterDot}>·</span>
          <a href="/about" className={styles.LoginSignFooterLink}>About</a>
          <span className={styles.LoginSignFooterDot}>·</span>
          <a href="/contact" className={styles.LoginSignFooterLink}>Contact Us</a>
          <span className={styles.LoginSignFooterDot}>·</span>
          <a href="/faq" className={styles.LoginSignFooterLink}>FAQs</a>
        </footer>
      </main>

      {showTermsModal && (
        <RegisterConcentModal
          onClose={() => { setAgreeTerms(false); setShowTermsModal(false); }}
          onConsent={() => { setAgreeTerms(true); setShowTermsModal(false); }}
        />
      )}

      {showCasModal && (
        <MFCasImportModal
          isOpen={showCasModal}
          skipUrl="/dashboard"
          onProceed={() => setShowCasModal(false)}
          illustrationSrc={logoFull}
        />
      )}

    </div>
  );
}