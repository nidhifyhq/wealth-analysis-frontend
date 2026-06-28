import { useState, useEffect, useRef } from 'react';
import useDeviceCheck from '../../utils/useDeviceCheck';
import styles from './InstallAppBanner.module.css';

export default function InstallAppBanner() {
  const { isMobileUtils } = useDeviceCheck();
  const deferredPrompt = useRef(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      localStorage.setItem('nidhifyInstallDismissed', 'true');
      return;
    }
    if (localStorage.getItem('nidhifyInstallDismissed') === 'true') return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem('nidhifyInstallDismissed', 'true');
      setShowBanner(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem('nidhifyInstallDismissed', 'true');
    }
    deferredPrompt.current = null;
    setShowBanner(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('nidhifyInstallDismissed', 'true');
    setShowBanner(false);
  };

  if (!isMobileUtils || !showBanner) return null;

  return (
    <div className={styles.InstallAppBannerOverlay}>
      <div className={styles.InstallAppBannerBanner}>
        <div className={styles.InstallAppBannerIconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className={styles.InstallAppBannerTextWrap}>
          <strong className={styles.InstallAppBannerTitle}>Install Nidhify</strong>
          <span className={styles.InstallAppBannerSubtitle}>Add to home screen for quick access</span>
        </div>
        <div className={styles.InstallAppBannerActions}>
          <button className={styles.InstallAppBannerInstallBtn} onClick={handleInstall}>Install</button>
          <button className={styles.InstallAppBannerCloseBtn} onClick={handleDismiss} aria-label="Dismiss">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
