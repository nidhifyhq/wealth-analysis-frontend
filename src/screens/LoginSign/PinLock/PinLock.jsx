import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, Delete, Check } from 'lucide-react';
import styles from './PinLock.module.css';
import AiIcon from "../../../assets/images/ai-icon.png";
import { hashPin } from '../../../utils/pinHash';
import {
  selectIsAuthenticated,
  selectIsPinSet,
  selectIsPinVerifiedThisSession,
  selectPinHash,
  selectUserName,
} from '../../../store/auth/auth.selectors';
import {
  setPin,
  setPinVerified,
  logout,
} from '../../../store/auth/auth.slice';

const PinLock = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const mode = searchParams.get('mode') || 'verify';

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isPinSet = useSelector(selectIsPinSet);
  const isPinVerifiedThisSession = useSelector(selectIsPinVerifiedThisSession);
  const storedPinHash = useSelector(selectPinHash);
  const userName = useSelector(selectUserName);
  const redirectTo = searchParams.get('redirect');

  const [pin, setPinState] = useState([]);
  const [confirmPin, setConfirmPin] = useState([]);
  const [step, setStep] = useState('pin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [changeStep, setChangeStep] = useState('verify'); // only used when mode=change
  const [newPin, setNewPin] = useState([]);
  const pinLength = 4;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    if (mode === 'set' && isPinSet && isPinVerifiedThisSession) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (mode === 'verify' && isPinVerifiedThisSession) {
      navigate('/dashboard', { replace: true });
      return;
    }
    if (mode === 'verify' && !isPinSet) {
      navigate('/PinLock?mode=set', { replace: true });
    }
    if (mode === 'change' && !isPinSet) {
      navigate('/PinLock?mode=set', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;
    if (mode === 'change') {
      if (changeStep === 'verify' && pin.length === pinLength) {
        handleCheck();
      } else if (changeStep === 'set' && newPin.length === pinLength) {
        handleCheck();
      } else if (changeStep === 'confirm' && confirmPin.length === pinLength) {
        handleCheck();
      }
    } else if (step === 'pin' && pin.length === pinLength) {
      handleCheck();
    } else if (step === 'confirm' && confirmPin.length === pinLength) {
      handleCheck();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, confirmPin, newPin, step, changeStep]);

  const vibrate = () => {
    try { navigator.vibrate(10); } catch (_) {}
  };

  const handleKeyPress = (num) => {
    vibrate();
    setError('');
    if (mode === 'change') {
      if (changeStep === 'verify' && pin.length < pinLength) {
        setPinState([...pin, num]);
      } else if (changeStep === 'set' && newPin.length < pinLength) {
        setNewPin([...newPin, num]);
      } else if (changeStep === 'confirm' && confirmPin.length < pinLength) {
        setConfirmPin([...confirmPin, num]);
      }
      return;
    }
    if (step === 'pin') {
      if (pin.length < pinLength) {
        setPinState([...pin, num]);
      }
    } else {
      if (confirmPin.length < pinLength) {
        setConfirmPin([...confirmPin, num]);
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (mode === 'change') {
      if (changeStep === 'verify') {
        setPinState(pin.slice(0, -1));
      } else if (changeStep === 'set') {
        setNewPin(newPin.slice(0, -1));
      } else {
        setConfirmPin(confirmPin.slice(0, -1));
      }
      return;
    }
    if (step === 'pin') {
      setPinState(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleCheck = async () => {
    if (mode === 'change') {
      if (changeStep === 'verify') {
        if (pin.length !== pinLength) return;
        setLoading(true);
        const enteredHash = await hashPin(pin.join(''));
        setLoading(false);
        if (enteredHash === storedPinHash) {
          setChangeStep('set');
          setPinState([]);
        } else {
          setError('Incorrect PIN. Try again.');
          setPinState([]);
        }
      } else if (changeStep === 'set') {
        if (newPin.length !== pinLength) return;
        setChangeStep('confirm');
      } else {
        if (confirmPin.length !== pinLength) return;
        const first = newPin.join('');
        const second = confirmPin.join('');
        if (first !== second) {
          setError('PINs do not match. Try again.');
          setNewPin([]);
          setConfirmPin([]);
          setChangeStep('set');
          return;
        }
        setLoading(true);
        const hashed = await hashPin(first);
        setLoading(false);
        dispatch(setPin(hashed));
        dispatch(setPinVerified());
        navigate('/profile', { replace: true });
      }
      return;
    }

    if (step === 'pin') {
      if (pin.length !== pinLength) return;
      if (mode === 'set') {
        setStep('confirm');
      } else {
        setLoading(true);
        const enteredHash = await hashPin(pin.join(''));
        setLoading(false);
        if (enteredHash === storedPinHash) {
          dispatch(setPinVerified());
          // navigate('/dashboard', { replace: true });
          navigate(redirectTo || '/dashboard', { replace: true });
        } else {
          setError('Incorrect PIN. Try again.');
          setPinState([]);
        }
      }
    } else {
      if (confirmPin.length !== pinLength) return;
      const first = pin.join('');
      const second = confirmPin.join('');
      if (first !== second) {
        setError('PINs do not match. Try again.');
        setPinState([]);
        setConfirmPin([]);
        setStep('pin');
        return;
      }
      setLoading(true);
      const hashed = await hashPin(first);
      setLoading(false);
      dispatch(setPin(hashed));
      dispatch(setPinVerified());
      if (mode === 'set' && sessionStorage.getItem('isFirstTimeSetup') === '1') {
        sessionStorage.removeItem('isFirstTimeSetup');
        sessionStorage.setItem('showCas', '1');
      }
      // navigate('/dashboard', { replace: true });
      navigate(redirectTo || '/dashboard', { replace: true });
    }
  };

  const handleForgetPin = () => {
    if (mode === 'change') {
      navigate('/profile', { replace: true });
      return;
    }
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const displayPin = mode === 'change'
    ? changeStep === 'verify'
      ? pin
      : changeStep === 'set'
        ? newPin
        : confirmPin
    : step === 'pin'
      ? pin
      : confirmPin;

  const greetingText = userName
    ? `Hi, ${userName.split(' ')[0]}`
    : 'Hi, there';

  const instructionText = mode === 'change'
    ? changeStep === 'verify'
      ? 'Enter your current PIN'
      : changeStep === 'set'
        ? 'Set a new Nidhify PIN'
        : 'Confirm your new Nidhify PIN'
    : mode === 'set'
      ? step === 'pin'
        ? 'Set your Nidhify PIN'
        : 'Confirm your Nidhify PIN'
      : 'Enter your Nidhify PIN';

  return (
    <div className={styles.PinLock_container}>
      <header className={styles.PinLock_header}>
        <img
          src={AiIcon}
          alt="Logo"
          className={styles.PinLock_customLogo}
        />
        <button className={styles.PinLock_profileButton} aria-label="Logout" onClick={() => { sessionStorage.clear(); dispatch(logout()); navigate('/login', { replace: true }); }}>
          <div className={styles.PinLock_profileIconWrapper}>
            <LogOut className={styles.PinLock_profileIcon} />
          </div>
        </button>
      </header>

      <main className={styles.PinLock_mainContent}>
        <h1 className={styles.PinLock_greeting}>{greetingText}</h1>
        <p className={styles.PinLock_instruction}>{instructionText}</p>

        {error && (
          <p style={{ color: '#ef4444', fontSize: 14, margin: '0 0 16px' }}>{error}</p>
        )}

        <div className={styles.PinLock_pinContainer}>
          {Array.from({ length: pinLength }).map((_, index) => (
            <div
              key={index}
              className={`${styles.PinLock_pinBox} ${
                index === displayPin.length ? styles.PinLock_pinBoxActive : ''
              }`}
            >
              {index < displayPin.length && <div className={styles.PinLock_pinDot} />}
            </div>
          ))}
        </div>

        {(mode === 'verify' || (mode === 'change' && changeStep === 'verify')) && (
          <button className={styles.PinLock_biometricLink} onClick={handleForgetPin}>
            {mode === 'change' ? 'Cancel' : 'Forget PIN'}
          </button>
        )}
      </main>

      <div className={styles.PinLock_keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            className={styles.PinLock_key}
            onClick={() => handleKeyPress(num)}
          >
            {num}
          </button>
        ))}

        <button className={styles.PinLock_key} onClick={handleDelete} aria-label="Delete">
          <Delete className={styles.PinLock_keyIcon} />
        </button>
        <button className={styles.PinLock_key} onClick={() => handleKeyPress(0)}>
          0
        </button>
        <button
          className={`${styles.PinLock_key} ${
            displayPin.length !== pinLength ? styles.PinLock_keyDisabled : ''
          }`}
          onClick={handleCheck}
          aria-label="Submit PIN"
        >
          {loading ? '...' : <Check className={styles.PinLock_keyIcon} />}
        </button>
      </div>

    </div>
  );
};

export default PinLock;
