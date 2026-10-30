import React, { useState, useEffect, useRef } from "react";
import { X, Upload, CheckCircle, XCircle, Eye, EyeOff, Check, RefreshCw } from "lucide-react";
import { uploadEpfPassbook } from "../../../services/apis/epf.service";
import EPFImportModal from "../EPFImport/EPFImportModal";
import { COLORS } from "../../../designConfig/colors";
import styles from "./EPFUploadModal.module.css";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export default function EPFUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showImportGuide, setShowImportGuide] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [needsPasswordPrompt, setNeedsPasswordPrompt] = useState(false);

  const fileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const top = parseFloat(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    }
    return () => {
      const top = parseFloat(document.body.style.top || "0");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, -top);
    };
  }, [isOpen]);

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setPassword("");
      setShowPassword(false);
      setUploading(false);
      setUploadError("");
      setTermsAccepted(false);
      setShowImportGuide(false);
      setUploadResult(null);
      setNeedsPasswordPrompt(false);
    }
  }, [isOpen]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    setUploadError("");
    setNeedsPasswordPrompt(false);
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF files are supported");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File is too large (max 3MB)");
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadError("");
    setNeedsPasswordPrompt(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a PDF file first");
      return;
    }

    if (!termsAccepted) {
      setUploadError("Please agree to the terms and conditions before uploading");
      return;
    }

    if (needsPasswordPrompt && !password.trim()) {
      setUploadError("Please enter your PDF password to continue");
      passwordInputRef.current?.focus();
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (password.trim()) {
      formData.append("password", password.trim());
    }

    const result = await uploadEpfPassbook(formData);
    setUploading(false);

    if (!result) {
      setUploadError("Network error. Please try again.");
      return;
    }

    // 1. Success (200 OK)
    if (result.success) {
      setUploadResult(result);
      if (onUploadSuccess) onUploadSuccess(result);
      return;
    }

    // 2. Password protected (403)
    if (result.needsPassword) {
      setNeedsPasswordPrompt(true);
      setUploadError(result.message || "PDF is password protected. Please enter your password.");
      setTimeout(() => passwordInputRef.current?.focus(), 100);
      return;
    }

    // 3. Other errors
    setUploadError(result.message || "Upload failed. Please try again.");
  };

  const handleSuccessClose = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={styles.EPFupload_overlay}
        onClick={uploadResult ? undefined : onClose}
      >
        <div
          className={styles.EPFupload_sheet}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Center Drag Handle */}
          <div
            className={styles.EPFupload_dragHandle}
            onClick={onClose}
            aria-label="Drag handle"
          />

          {uploadResult ? (
            /* Upload Success View */
            <div className={styles.EPFupload_successContainer}>
              <div className={styles.EPFupload_successIconWrapper}>
                <div className={styles.EPFupload_successIconCircle}>
                  <RefreshCw size={32} color={COLORS.primaryButton || "#3B82F6"} strokeWidth={2.5} />
                </div>
                <div className={styles.EPFupload_successBadge}>
                  <Check size={14} color="#ffffff" strokeWidth={3} />
                </div>
              </div>

              <p className={styles.EPFupload_successLabel}>EPF PASSBOOK SYNCED</p>
              <h2 className={styles.EPFupload_successTitle}>Successfully Tracked!</h2>
              <p className={styles.EPFupload_successMessage}>
                {uploadResult.message || "EPF passbook parsed and merged successfully"}
              </p>

              <button
                type="button"
                className={styles.EPFupload_successBtn}
                style={{
                  backgroundColor: COLORS.primaryButton,
                  color: COLORS.primaryButtonText,
                }}
                onClick={handleSuccessClose}
              >
                Close
              </button>
            </div>
          ) : (
            /* Upload Form View */
            <>
              {/* Header */}
              <div className={styles.EPFupload_header}>
                <h2 className={styles.EPFupload_title}>Upload EPF Passbook</h2>
                <button
                  type="button"
                  className={styles.EPFupload_closeBtn}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              {/* File Drop Zone / Selected View */}
              {!selectedFile ? (
                <div
                  className={styles.EPFupload_dropZone}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={32} className={styles.EPFupload_dropZoneIcon} />
                  <p className={styles.EPFupload_dropZoneText}>Tap to upload PDF</p>
                  <p className={styles.EPFupload_dropZoneHint}>Max 3MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />
                </div>
              ) : (
                <div className={styles.EPFupload_fileSelected}>
                  <CheckCircle size={20} className={styles.EPFupload_fileSelectedIcon} />
                  <span className={styles.EPFupload_fileSelectedName}>
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    className={styles.EPFupload_fileSelectedRemove}
                    onClick={handleRemoveFile}
                    aria-label="Remove selected file"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              )}

              {/* Error Banner */}
              {uploadError && (
                <p className={styles.EPFupload_errorText}>{uploadError}</p>
              )}

              {/* Password Input - ONLY displayed if PDF is password-protected */}
              {needsPasswordPrompt && (
                <div className={styles.EPFupload_passwordSection}>
                  <p className={styles.EPFupload_fieldLabel}>
                    PDF Password <span className={styles.EPFupload_fieldRequired}>(required)</span>
                  </p>
                  <div className={styles.EPFupload_passwordWrapper}>
                    <input
                      ref={passwordInputRef}
                      className={`${styles.EPFupload_passwordInput} ${styles.EPFupload_passwordInputHighlight}`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your PDF password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.EPFupload_passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className={styles.EPFupload_passwordHint}>
                    Enter the password to decrypt your EPFO passbook statement.
                  </p>
                </div>
              )}

              {/* Simple Terms Checkbox */}
              <div className={styles.EPFupload_termsRow}>
                <label className={styles.EPFupload_termsLabel}>
                  <input
                    type="checkbox"
                    className={styles.EPFupload_termsCheckbox}
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  <span>I agree with the terms and conditions</span>
                </label>
              </div>

              {/* Actions */}
              <div className={styles.EPFupload_actions}>
                <button
                  type="button"
                  className={styles.EPFupload_secondaryBtn}
                  onClick={() => setShowImportGuide(true)}
                >
                  Get EPF Passbook
                </button>
                <button
                  type="button"
                  className={styles.EPFupload_primaryBtn}
                  style={{
                    backgroundColor: COLORS.primaryButton,
                    color: COLORS.primaryButtonText,
                  }}
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading
                    ? "Uploading..."
                    : needsPasswordPrompt
                    ? "Unlock & Upload"
                    : "Upload Passbook"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Nested Guide Modal */}
      <EPFImportModal
        isOpen={showImportGuide}
        onClose={() => setShowImportGuide(false)}
        onProceed={() => setShowImportGuide(false)}
      />
    </>
  );
}
