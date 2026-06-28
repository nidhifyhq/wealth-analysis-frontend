import useDeviceCheck from '../../utils/useDeviceCheck';
import styles from './MobileOnlyLayout.module.css';
import logoFull from '../../assets/images/nidhifylogofull.png';

export default function MobileOnlyLayout({ children }) {
  const { isDesktopUtils } = useDeviceCheck();

  if (isDesktopUtils) {
    return (
      <div className={styles.container}>
        <img src={logoFull} alt="Nidhify" className={styles.logo} />
        <div className={styles.phoneFrame}>
          <div className={styles.notch} />
        </div>
        <h1 className={styles.heading}>Mobile Only</h1>
        <p className={styles.subtext}>
          This platform is built exclusively for mobile devices.
        </p>
        <p className={styles.subtext}>
          Please open it on your smartphone for the best experience.
        </p>
      </div>
    );
  }

  return children;
}
