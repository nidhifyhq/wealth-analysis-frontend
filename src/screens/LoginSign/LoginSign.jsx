import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import styles from './LoginSign.module.css';
import { checkEmail, userLogin, registerSendOtp, registerVerifyOtp, forgotPasswordSendOtp, forgotPasswordReset } from '../../services/apis/login.service';
import { setAuthFromLogin } from '../../store/auth/auth.slice';
import logoFull from '../../assets/images/nidhifylogofull.png';
import RegisterConcentModal from './RegisterConcentModal/RegisterConcentModal';
import MFCasImportModal from '../MutualFund/MFCasImport/MFCasImportModal';
import TermsModal from '../PolicyPages/Terms/Terms';
import PrivacyModal from '../PolicyPages/Privacy/Privacy';
import DisclaimerModal from '../PolicyPages/Disclaimer/Disclaimer';
import AboutModal from '../PolicyPages/AboutUs/AboutUs';
import ContactModal from '../PolicyPages/ContactUs/ContactUs';
import FaqsModal from '../PolicyPages/FAQs/FAQs';
import InstallAppBanner from '../../components/InstallAppBanner/InstallAppBanner';
import { APP_VERSION } from '../../config/appVersion';

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
  const [forgotFlow, setForgotFlow] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [forgotOtp, setForgotOtp] = useState(['', '', '', '']);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyTermsModal, setShowPolicyTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFaqsModal, setShowFaqsModal] = useState(false);
  const [showCasModal, setShowCasModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const resetFormFields = () => {
    setEmail('');
    setPassword('');
    setName('');
    setMobile('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setOtp(['', '', '', '']);
    setTimer(60);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setForgotFlow(false);
    setForgotLoading(false);
    setInitialLoading(false);
    setLoginLoading(false);
    setSignupLoading(false);
    setVerifyLoading(false);
    setResetLoading(false);
    setResendLoading(false);
    setNewPassword('');
    setForgotOtp(['', '', '', '']);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Reset all form fields when returning to INITIAL step
  useEffect(() => {
    if (step === 'INITIAL') {
      resetFormFields();
    }
  }, [step]);

  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const forgotOtpRefs = [useRef(), useRef(), useRef(), useRef()];

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
    if ((step === 'OTP' || (step === 'PASSWORD' && forgotFlow)) && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer, forgotFlow]);

  // Back Button Navigation Rules
  const handleBackNavigation = () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (forgotFlow) {
      setForgotFlow(false);
      setForgotOtp(['', '', '', '']);
      setNewPassword('');
      return;
    }
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

    setInitialLoading(true);
    const res = await checkEmail({ email });
    setInitialLoading(false);
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

    setLoginLoading(true);
    const res = await userLogin({ email, password });
    setLoginLoading(false);
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

    setSignupLoading(true);
    const res = await registerSendOtp({
      name: titleCaseName,
      mobile,
      email,
      password,
      isRegisterConsent: agreeTerms,
    });
    setSignupLoading(false);
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

    setVerifyLoading(true);
    const res = await registerVerifyOtp({ email, otp: fullOtp });
    setVerifyLoading(false);
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

  const handleForgotSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setForgotLoading(true);
    const res = await forgotPasswordSendOtp({ email });
    setForgotLoading(false);
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (!res.success) {
      setErrorMsg(res.message || 'Failed to send OTP');
      return;
    }
    setTimer(60);
    setForgotFlow(true);
  };

  const handleForgotResendOtp = async () => {
    if (timer === 0) {
      setResendLoading(true);
      const res = await forgotPasswordSendOtp({ email });
      setResendLoading(false);
      if (!res || !res.success) {
        setErrorMsg(res?.message || 'Failed to resend OTP. Try again.');
        return;
      }
      setForgotOtp(['', '', '', '']);
      setTimer(60);
      setErrorMsg('');
      setSuccessMsg(res?.message || 'OTP sent successfully');
    }
  };

  const handleForgotOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const cleanValue = value.substring(value.length - 1);
    const updatedOtp = [...forgotOtp];
    updatedOtp[index] = cleanValue;
    setForgotOtp(updatedOtp);
    if (cleanValue !== '' && index < 3) {
      forgotOtpRefs[index + 1].current.focus();
    }
  };

  const handleForgotOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && forgotOtp[index] === '' && index > 0) {
      forgotOtpRefs[index - 1].current.focus();
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const fullOtp = forgotOtp.join('');
    if (fullOtp.length < 4) {
      setErrorMsg('Please fill in the entire 4-digit code.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }
    setResetLoading(true);
    const res = await forgotPasswordReset({ email, otp: fullOtp, newPassword });
    setResetLoading(false);
    if (!res) {
      setErrorMsg('Network error. Please try again.');
      return;
    }
    if (!res.success) {
      setErrorMsg(res.message || 'Reset failed. Try again.');
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

  const handleResendOtp = async () => {
    if (timer === 0) {
      const titleCaseName = name.replace(/\b\w/g, (c) => c.toUpperCase());
      setResendLoading(true);
      const res = await registerSendOtp({
        name: titleCaseName,
        mobile,
        email,
        password,
        isRegisterConsent: agreeTerms,
      });
      setResendLoading(false);
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
          {step === 'PASSWORD' && !forgotFlow && (
            <>
              <h2 className={styles.LoginSignTitle}>Welcome back{name ? `, ${formatFirstName(name)}` : ''}!</h2>
              <p className={styles.LoginSignSubtitle}>Please provide authorization credentials linked to {email}.</p>
            </>
          )}
          {step === 'PASSWORD' && forgotFlow && (
            <>
              <h2 className={styles.LoginSignTitle}>Set New Password</h2>
              <p className={styles.LoginSignSubtitle}>Enter the OTP sent to {email} and your new password.</p>
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
            <button type="submit" className={styles.LoginSignActionBtn} disabled={initialLoading}>
              {initialLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Proceed'}
            </button>
          </form>
        )}

        {/* RETURNING USER SIGN IN FLOW */}
        {step === 'PASSWORD' && !forgotFlow && (
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
            <button type="submit" className={styles.LoginSignActionBtn} disabled={loginLoading}>
              {loginLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Sign In'}
            </button>
            <button type="button" className={styles.LoginSignForgotBtn} onClick={handleForgotSendOtp} disabled={forgotLoading}>
              {forgotLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Forgot Password?'}
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD — RESET FORM */}
        {step === 'PASSWORD' && forgotFlow && (
          <form onSubmit={handleForgotReset} className={styles.LoginSignFormLayout}>
            <div className={styles.LoginSignInputBlock} style={{ alignItems: 'center' }}>
              <label className={styles.LoginSignLabel} style={{ alignSelf: 'flex-start' }}>Enter 4-Digit OTP</label>
              <div className={styles.LoginSignOtpRow}>
                {forgotOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    ref={forgotOtpRefs[idx]}
                    className={styles.LoginSignOtpBox}
                    onChange={(e) => handleForgotOtpChange(e.target.value, idx)}
                    onKeyDown={(e) => handleForgotOtpKeyDown(e, idx)}
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
                  onClick={handleForgotResendOtp}
                  disabled={resendLoading}
                >
                  {resendLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Resend OTP Code'}
                </button>
              )}
            </div>

            <div className={styles.LoginSignInputBlock}>
              <label className={styles.LoginSignLabel}>New Password</label>
              <div className={styles.LoginSignPasswordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className={styles.LoginSignInput}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button type="button" className={styles.LoginSignPasswordToggle} onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button type="submit" className={styles.LoginSignActionBtn} disabled={resetLoading}>
              {resetLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Reset Password'}
            </button>
            <button type="button" className={styles.LoginSignForgotBtn} onClick={() => { setForgotFlow(false); setForgotOtp(['', '', '', '']); setNewPassword(''); setErrorMsg(''); }}>
              Back to Sign In
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
                placeholder="Enter you name" 
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

            <button type="submit" className={styles.LoginSignActionBtn} disabled={signupLoading}>
              {signupLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Create Account'}
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
                  disabled={resendLoading}
                >
                  {resendLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Resend OTP Code'}
                </button>
              )}
            </div>

            <button type="submit" className={styles.LoginSignActionBtn} disabled={verifyLoading}>
              {verifyLoading ? <>Please wait <span className={styles.LoginSignLoadingDots}><span>.</span><span>.</span><span>.</span></span></> : 'Verify OTP'}
            </button>
          </form>
        )}

        {/* Footer Links----------- */}
        <footer className={styles.LoginSignFooter}>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowPolicyTermsModal(true)}>Terms</button>
          <span className={styles.LoginSignFooterDot}>·</span>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowPrivacyModal(true)}>Privacy</button>
          <span className={styles.LoginSignFooterDot}>·</span>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowDisclaimerModal(true)}>Disclaimer</button>
          <span className={styles.LoginSignFooterDot}>·</span>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowAboutModal(true)}>About</button>
          <span className={styles.LoginSignFooterDot}>·</span>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowContactModal(true)}>Contact Us</button>
          <span className={styles.LoginSignFooterDot}>·</span>
          <button type="button" className={styles.LoginSignFooterLink} onClick={() => setShowFaqsModal(true)}>FAQs</button>
        </footer>

        <p className={styles.LoginSignVersion}>v{APP_VERSION}</p>

        <TermsModal isOpen={showPolicyTermsModal} onClose={() => setShowPolicyTermsModal(false)} />
        <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
        <DisclaimerModal isOpen={showDisclaimerModal} onClose={() => setShowDisclaimerModal(false)} />
        <AboutModal isOpen={showAboutModal} onClose={() => setShowAboutModal(false)} />
        <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
        <FaqsModal isOpen={showFaqsModal} onClose={() => setShowFaqsModal(false)} />
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

      <InstallAppBanner />
    </div>
  );
}