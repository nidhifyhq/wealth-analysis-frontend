import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  ArrowLeft,
  Pencil,
  Phone,
  Calendar,
  FileText,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Trash2,
  ChevronRight
} from 'lucide-react'
import { logout } from '../../store/auth/auth.slice'
import { APP_VERSION } from '../../config/appVersion'
import { selectUserName, selectUserEmail } from '../../store/auth/auth.selectors'
import { fetchUserDetails, deleteUserAccount } from '../../services/apis/user.service'
import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal'
import Terms from '../PolicyPages/Terms/Terms'
import Privacy from '../PolicyPages/Privacy/Privacy'
import Disclaimer from '../PolicyPages/Disclaimer/Disclaimer'
import AboutUs from '../PolicyPages/AboutUs/AboutUs'
import ContactUs from '../PolicyPages/ContactUs/ContactUs'
import FAQs from '../PolicyPages/FAQs/FAQs'
import styles from './UserProfile.module.css'

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function UserProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const reduxName = useSelector(selectUserName)
  const reduxEmail = useSelector(selectUserEmail)

  const [userData, setUserData] = useState(null)
  const [, setIsLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTermsOpen, setIsTermsOpen] = useState(false)
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false)
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false)
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false)
  const [isContactUsOpen, setIsContactUsOpen] = useState(false)
  const [isFaqsOpen, setIsFaqsOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchUserDetails()
      if (res) {
        const data = res.data || res
        setUserData(data)
      }
      setIsLoading(false)
    }
    loadData()
  }, [])

  const name = reduxName || userData?.name || 'User'
  const email = reduxEmail || userData?.email || ''
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    const res = await deleteUserAccount()
    if (res?.success) {
      dispatch(logout())
      navigate('/login')
    } else {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className={styles.UserProfileContainer}>

      {/* Top Header Navigation Bar */}
      <header className={styles.UserProfileTopNav}>
        <div className={styles.UserProfileTopNavLeft}>
          <button className={styles.UserProfileIconButton} aria-label="Go back" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.UserProfileMainTitle}>Profile</h1>
        </div>
        <button className={styles.UserProfileTopNavLogout} onClick={handleLogout}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </header>

      {/* Hero Profile Header Segment */}
      <section className={styles.UserProfileAvatarSection}>
        <div className={styles.UserProfileAvatarWrapper}>
          <div className={styles.UserProfileAvatarBadge}>{initials}</div>
          <button className={styles.UserProfileEditAvatarBtn} aria-label="Edit avatar image">
            <Pencil size={12} fill="currentColor" />
          </button>
        </div>
        <h2 className={styles.UserProfileUserName}>{name}</h2>
        <p className={styles.UserProfileUserEmail}>{email}</p>
        <p className={styles.UserProfileVersion}>v{APP_VERSION}</p>
      </section>

      {/* Main Form Fields / Settings Sheet */}
      <main className={styles.UserProfileDetailsSheet}>

        {/* GROUP 1: Personal Information */}
        <div className={styles.UserProfileSectionBlock}>
          <h3 className={styles.UserProfileSectionLabel}>PERSONAL INFORMATION</h3>
          <div className={styles.UserProfileRowCard}>
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <Phone size={18} />
              </div>
              <div>
                <span className={styles.UserProfileItemTitle}>Mobile No.</span>
                <p className={styles.UserProfileItemValue}>{userData?.mobile || '—'}</p>
              </div>
            </div>
            <ChevronRight size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div className={styles.UserProfileRowCard}>
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <Calendar size={18} />
              </div>
              <div>
                <span className={styles.UserProfileItemTitle}>Account Created</span>
                <p className={styles.UserProfileItemValue}>{formatDate(userData?.createdAt)}</p>
              </div>
            </div>
            <ChevronRight size={18} className={styles.UserProfileChevronRight} />
          </div>
        </div>

        {/* GROUP 2: Investment Details */}
        {userData?.isCasImported && (
          <div className={styles.UserProfileSectionBlock}>
            <h3 className={styles.UserProfileSectionLabel}>INVESTMENT DETAILS</h3>
            <div className={`${styles.UserProfileRowCard} ${styles.UserProfileHasBorderBottom}`}>
              <div className={styles.UserProfileRowLeading}>
                <div className={styles.UserProfileIconFrame}>
                  <Calendar size={18} />
                </div>
                <div>
                  <span className={styles.UserProfileItemTitle}>CAS Import Date</span>
                  <p className={styles.UserProfileItemValue}>{formatDate(userData?.casImportedDate)}</p>
                </div>
              </div>
              <button className={styles.UserProfileRowActionBtn} aria-label="Refresh data">
                <FileText size={16} />
              </button>
            </div>
            <div className={styles.UserProfileRowCard}>
              <div className={styles.UserProfileRowLeading}>
                <div className={styles.UserProfileIconFrame}>
                  <FileText size={18} />
                </div>
                <div>
                  <span className={styles.UserProfileItemTitle}>Statement Date</span>
                  <p className={styles.UserProfileItemValue}>{formatDate(userData?.statementDate)}</p>
                </div>
              </div>
              <ChevronRight size={18} className={styles.UserProfileChevronRight} />
            </div>
          </div>
        )}

        {/* GROUP 3: Legal & Support */}
        <div className={styles.UserProfileSectionBlock}>
          <h3 className={styles.UserProfileSectionLabel}>LEGAL & SUPPORT</h3>
          <div
            className={`${styles.UserProfileRowCard} ${styles.UserProfileHasBorderBottom}`}
            onClick={() => setIsPrivacyOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsPrivacyOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>Privacy Policy</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div
            className={styles.UserProfileRowCard}
            onClick={() => setIsTermsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsTermsOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <FileText size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>Terms & Conditions</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div
            className={styles.UserProfileRowCard}
            onClick={() => setIsDisclaimerOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsDisclaimerOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <FileText size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>Disclaimer</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div
            className={styles.UserProfileRowCard}
            onClick={() => setIsAboutUsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsAboutUsOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>About Us</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div
            className={styles.UserProfileRowCard}
            onClick={() => setIsContactUsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsContactUsOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <FileText size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>Contact Us</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
          <div
            className={styles.UserProfileRowCard}
            onClick={() => setIsFaqsOpen(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setIsFaqsOpen(true)
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.UserProfileRowLeading}>
              <div className={styles.UserProfileIconFrame}>
                <FileText size={18} />
              </div>
              <div>
                <p className={styles.UserProfileStandaloneText}>FAQs</p>
              </div>
            </div>
            <ExternalLink size={18} className={styles.UserProfileChevronRight} />
          </div>
        </div>

        {/* Action Button Stack */}
        <div className={styles.UserProfileActionsContainer}>
          <button className={styles.UserProfileLogoutButton} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <button className={styles.UserProfileDeleteButton} onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={18} />
            <span>Delete Account</span>
          </button>

          <p className={styles.UserProfileWarningFooter}>
            This action is permanent and will close all your associated investment portfolios.
          </p>
        </div>

      </main>

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeleting}
      />

      <Terms isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <Privacy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <Disclaimer isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />
      <AboutUs isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)} />
      <ContactUs isOpen={isContactUsOpen} onClose={() => setIsContactUsOpen(false)} />
      <FAQs isOpen={isFaqsOpen} onClose={() => setIsFaqsOpen(false)} />
    </div>
  )
}
