import React, { useState, useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import styles from './DeleteAccountModal.module.css'

export default function DeleteAccountModal({ isOpen, onCancel, onConfirm, isDeleting }) {
  const [confirmText, setConfirmText] = useState('')

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

  useEffect(() => {
    if (!isOpen) setConfirmText('')
  }, [isOpen])

  const handleConfirm = () => {
    if (confirmText === 'DELETE' && !isDeleting) {
      onConfirm()
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.DeleteAccountModalOverlay} onClick={onCancel}>
      <div className={styles.DeleteAccountModalSheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.DeleteAccountModalHandle} />

        <div className={styles.DeleteAccountModalTitleRow}>
          <AlertTriangle size={20} color="#DC2626" strokeWidth={2.5} />
          <h2 className={styles.DeleteAccountModalTitle}>
            What happens when you delete your account?
          </h2>
        </div>

        <div className={styles.DeleteAccountModalBulletList}>
          <div className={styles.DeleteAccountModalBulletItem}>
            <span className={styles.DeleteAccountModalBulletDot} />
            <p className={styles.DeleteAccountModalBulletText}>
              <strong>Permanent Data Wipe:</strong> All your personal details, manual data, and imported Mutual Fund tracking insights will be permanently erased from Nidhify's databases.
            </p>
          </div>
          <div className={styles.DeleteAccountModalBulletItem}>
            <span className={styles.DeleteAccountModalBulletDot} />
            <p className={styles.DeleteAccountModalBulletText}>
              <strong>CAS File Security:</strong> Any processed statement data will be completely wiped. As a reminder, Nidhify never stored your CAS password, so there is no credential data to delete.
            </p>
          </div>
          <div className={styles.DeleteAccountModalBulletItem}>
            <span className={styles.DeleteAccountModalBulletDot} />
            <p className={styles.DeleteAccountModalBulletText}>
              <strong>Action is Irreversible:</strong> Once deleted, your portfolio dashboard cannot be recovered. If you wish to use Nidhify again in the future, you will need to create a fresh account and re-import your data.
            </p>
          </div>
        </div>

        <p className={styles.DeleteAccountModalInputLabel}>Type DELETE to confirm:</p>
        <input
          className={styles.DeleteAccountModalInput}
          type="text"
          placeholder="Type DELETE"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
        />

        <div className={styles.DeleteAccountModalActions}>
          <button
            type="button"
            className={styles.DeleteAccountModalCancelBtn}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.DeleteAccountModalDeleteBtn}${confirmText !== 'DELETE' ? ` ${styles.DeleteAccountModalDeleteBtnDisabled}` : ''}`}
            onClick={handleConfirm}
            disabled={confirmText !== 'DELETE' || isDeleting}
          >
            {isDeleting ? (
              <div className={styles.DeleteAccountModalSpinner} />
            ) : (
              'Delete Account'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
