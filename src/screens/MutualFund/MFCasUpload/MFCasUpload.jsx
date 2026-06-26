import React, { useState, useEffect, useRef } from 'react'
import { X, Upload, CheckCircle, FileText, XCircle, Eye, EyeOff } from 'lucide-react'
import { uploadCas } from '../../../services/apis/portfolio.service'
import MFCasImportModal from '../MFCasImport/MFCasImportModal'
import styles from './MFCasUpload.module.css'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function MFCasUpload({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showCasImport, setShowCasImport] = useState(false)
  const fileInputRef = useRef(null)

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
    if (!isOpen) {
      setSelectedFile(null)
      setPassword('')
      setUploading(false)
      setUploadError('')
      setTermsAccepted(false)
    }
  }, [isOpen])

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    setUploadError('')
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File too large (max 10MB)')
      return
    }

    const fileNameWithoutExt = file.name.replace(/\.pdf$/i, '')
    if (!/^CAS_\d+$/.test(fileNameWithoutExt)) {
      setUploadError('File name must start with CAS_ followed by digits (e.g. CAS_203256)')
      return
    }

    setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a PDF file first')
      return
    }

    if (!termsAccepted) {
      setUploadError('Please agree to the terms before uploading')
      return
    }

    setUploading(true)
    setUploadError('')

    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('uploadConsent', 'true')
    if (password.trim()) {
      formData.append('password', password.trim())
    }

    const result = await uploadCas(formData)
    setUploading(false)

    if (!result) {
      setUploadError('Network error. Please try again.')
      return
    }

    if (result.success) {
      if (onUploadSuccess) onUploadSuccess(result.data)
      onClose()
      return
    }

    if (result.needsPassword) {
      setUploadError('This PDF is password protected. Please provide the password.')
      return
    }

    if (result.wrongPassword) {
      setUploadError('Incorrect password. Please try again.')
      return
    }

    setUploadError(result.message || 'Upload failed. Please try again.')
  }

  const handleGetCasPdf = () => {
    setShowCasImport(true)
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.MFCasUploadOverlay} onClick={onClose}>
        <div className={styles.MFCasUploadSheet} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.MFCasUploadHeader}>
            <h2 className={styles.MFCasUploadTitle}>Upload CAS</h2>
            <button className={styles.MFCasUploadCloseBtn} onClick={onClose} aria-label="Close">
              <X size={22} />
            </button>
          </div>

          {/* File Picker Drop Zone */}
          {!selectedFile ? (
            <div className={styles.MFCasUploadDropZone} onClick={() => fileInputRef.current?.click()}>
              <Upload size={32} className={styles.MFCasUploadDropZoneIcon} />
              <p className={styles.MFCasUploadDropZoneText}>Tap to upload PDF</p>
              <p className={styles.MFCasUploadDropZoneHint}>Max 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />
            </div>
          ) : (
            <div className={styles.MFCasUploadFileSelected}>
              <CheckCircle size={20} className={styles.MFCasUploadFileSelectedIcon} />
              <span className={styles.MFCasUploadFileSelectedName}>{selectedFile.name}</span>
              <button className={styles.MFCasUploadFileSelectedRemove} onClick={handleRemoveFile} aria-label="Remove file">
                <XCircle size={18} />
              </button>
            </div>
          )}

          {/* Password Input */}
          <p className={styles.MFCasUploadFieldLabel}>
            PDF Password <span className={styles.MFCasUploadFieldOptional}>(optional)</span>
          </p>
          <div className={styles.MFCasUploadPasswordWrapper}>
            <input
              className={styles.MFCasUploadPasswordInput}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password if PDF is protected"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.MFCasUploadPasswordToggle}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className={styles.MFCasUploadPasswordHint}>
           Enter the password that you created when requesting your CAS PDF statement from CAMS.
          </p>

          {/* Error */}
          {uploadError && <p className={styles.MFCasUploadErrorText}>{uploadError}</p>}

          {/* Terms Checkbox */}
          <label className={styles.MFCasUploadTermsRow}>
            <input
              type="checkbox"
              className={styles.MFCasUploadTermsCheckbox}
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className={styles.MFCasUploadTermsLabel}>
              I authorize Nidhify to process this statement and understand the data shown is for tracking purposes only.
            </span>
          </label>

          {/* Action Buttons */}
          <div className={styles.MFCasUploadActions}>
            <button type="button" className={styles.MFCasUploadSecondaryBtn} onClick={handleGetCasPdf}>
              Get CAS PDF
            </button>
            <button
              type="button"
              className={styles.MFCasUploadPrimaryBtn}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload CAS'}
            </button>
          </div>
        </div>
      </div>

      {/* Nested MFCasImportModal */}
      <MFCasImportModal
        isOpen={showCasImport}
        onSkip={() => setShowCasImport(false)}
        onProceed={() => setShowCasImport(false)}
      />
    </>
  )
}
