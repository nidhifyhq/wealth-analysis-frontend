import React, { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import styles from './DeLinkCas.module.css'

export default function DeLinkCas({ isOpen, onCancel, onConfirm, isDeleting }) {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.overflow = 'hidden'
    } else {
      const top = parseFloat(document.body.style.top || '0')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, -top)
    }
    return () => {
      const top = parseFloat(document.body.style.top || '0')
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.overflow = ''
      window.scrollTo(0, -top)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.DeLinkCasOverlay} onClick={onCancel}>
      <div className={styles.DeLinkCasSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.DeLinkCasHandle} />

        <div className={styles.DeLinkCasTitleRow}>
          <AlertTriangle size={20} color="#DC2626" strokeWidth={2.5} />
          <h2 className={styles.DeLinkCasTitle}>
            Are you sure you want to delink your CAS?
          </h2>
        </div>

        <div className={styles.DeLinkCasBullets}>
          <div className={styles.DeLinkCasBullet}>
            <span className={styles.DeLinkCasBulletMarker} />
            <p className={styles.DeLinkCasBulletText}>
              <strong>Mutual Fund Data Wiped:</strong> All tracked mutual fund portfolios, current valuations, and transaction insights generated from your CAS PDF will be permanently deleted from our database.
            </p>
          </div>
          <div className={styles.DeLinkCasBullet}>
            <span className={styles.DeLinkCasBulletMarker} />
            <p className={styles.DeLinkCasBulletText}>
              <strong>What stays intact:</strong> Your Nidhify account, account settings, and any manually tracked Fixed Deposits (FDs) or other wealth products will not be affected.
            </p>
          </div>
          <div className={styles.DeLinkCasBullet}>
            <span className={styles.DeLinkCasBulletMarker} />
            <p className={styles.DeLinkCasBulletText}>
              <strong>This action is irreversible:</strong> If you want to track your mutual funds again later, you will need to re-upload your password-protected CAS PDF.
            </p>
          </div>
        </div>

        <div className={styles.DeLinkCasActions}>
          <button
            type="button"
            className={styles.DeLinkCasCancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.DeLinkCasDeleteBtn}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className={styles.DeLinkCasSpinner} />
            ) : (
              'Delink CAS'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
