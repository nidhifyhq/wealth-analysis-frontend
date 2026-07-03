import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart3, RefreshCw, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'
import { syncNav, updatePortfolios } from '../../../services/apis/admin.service'
import styles from './DailyNAVUpdat.module.css'

const DailyNAVUpdat = () => {
  const navigate = useNavigate()

  const [navLoading, setNavLoading] = useState(false)
  const [portfolioLoading, setPortfolioLoading] = useState(false)
  const [navResult, setNavResult] = useState(null)
  const [portfolioResult, setPortfolioResult] = useState(null)

  const handleSyncNav = async () => {
    setNavLoading(true)
    setNavResult(null)
    setPortfolioResult(null)
    const res = await syncNav()
    setNavLoading(false)
    if (res?.success) {
      // const { updated, failed } = res.data || {}
      let msg = res.message || 'NAV sync started'
      if (res.estimatedTime) msg += ` (est. ${res.estimatedTime})`
      setNavResult({ type: 'success', message: msg })
      toast.success(msg)
    } else {
      const msg = res?.message || 'Failed to sync NAV'
      setNavResult({ type: 'error', message: msg })
      toast.error(msg)
    }
  }

  const handleUpdatePortfolios = async () => {
    setPortfolioLoading(true)
    setPortfolioResult(null)
    const res = await updatePortfolios()
    setPortfolioLoading(false)
    if (res?.success) {
      const { totalPortfolios, updatedPortfolios, failedPortfolios } = res.data
      setPortfolioResult({
        type: 'success',
        message: res.message || `Portfolio update complete: ${totalPortfolios} found, ${updatedPortfolios} updated, ${failedPortfolios} failed`,
      })
      toast.success(`Portfolio update complete: ${updatedPortfolios} updated`)
    } else {
      const msg = res?.message || 'Failed to update portfolios'
      setPortfolioResult({ type: 'error', message: msg })
      toast.error(msg)
    }
  }

  return (
    <div className={styles.DailyNAVUpdat_container}>
      <header className={styles.DailyNAVUpdat_header}>
        <button
          className={styles.DailyNAVUpdat_backBtn}
          onClick={() => navigate('/admin')}
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.DailyNAVUpdat_title}>Daily NAV & Product Update</h1>
      </header>

      <main className={styles.DailyNAVUpdat_content}>
        <div className={styles.DailyNAVUpdat_sequenceInfo}>
          <Info size={18} className={styles.DailyNAVUpdat_sequenceInfoIcon} />
          <span>Run "Sync NAV" first, then "Update Portfolios" to apply the latest NAV data to all portfolios.</span>
        </div>

        <div className={styles.DailyNAVUpdat_card}>
          <div className={styles.DailyNAVUpdat_cardHeader}>
            <div className={styles.DailyNAVUpdat_cardIcon} style={{ background: '#2563eb15', color: '#2563eb' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className={styles.DailyNAVUpdat_cardTitle}>Sync NAV</h3>
              <p className={styles.DailyNAVUpdat_cardDesc}>Fetch and update the latest NAV data for all schemes</p>
            </div>
          </div>

          <button
            className={`${styles.DailyNAVUpdat_btn} ${styles.DailyNAVUpdat_btnNav}`}
            onClick={handleSyncNav}
            disabled={navLoading}
          >
            {navLoading ? (
              <>
                <Loader2 size={18} className={styles.DailyNAVUpdat_spinner} />
                Syncing...
              </>
            ) : (
              <>
                <BarChart3 size={18} />
                Start NAV Sync
              </>
            )}
          </button>

          {navResult && (
            <div className={`${styles.DailyNAVUpdat_result} ${navResult.type === 'error' ? styles.DailyNAVUpdat_resultError : ''}`}>
              {navResult.type === 'success' ? (
                <CheckCircle2 size={18} className={styles.DailyNAVUpdat_resultIcon} />
              ) : (
                <AlertCircle size={18} className={styles.DailyNAVUpdat_resultIcon} />
              )}
              <span>{navResult.message}</span>
            </div>
          )}
        </div>

        <div className={styles.DailyNAVUpdat_card}>
          <div className={styles.DailyNAVUpdat_cardHeader}>
            <div className={styles.DailyNAVUpdat_cardIcon} style={{ background: '#7c3aed15', color: '#7c3aed' }}>
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className={styles.DailyNAVUpdat_cardTitle}>Update Portfolios</h3>
              <p className={styles.DailyNAVUpdat_cardDesc}>Recalculate portfolio values using the latest NAV data</p>
            </div>
          </div>

          <button
            className={`${styles.DailyNAVUpdat_btn} ${styles.DailyNAVUpdat_btnPortfolio}`}
            onClick={handleUpdatePortfolios}
            disabled={portfolioLoading}
          >
            {portfolioLoading ? (
              <>
                <Loader2 size={18} className={styles.DailyNAVUpdat_spinner} />
                Updating...
              </>
            ) : (
              <>
                <RefreshCw size={18} />
                Start Portfolio Update
              </>
            )}
          </button>

          {portfolioResult && (
            <div className={`${styles.DailyNAVUpdat_result} ${portfolioResult.type === 'error' ? styles.DailyNAVUpdat_resultError : ''}`}>
              {portfolioResult.type === 'success' ? (
                <CheckCircle2 size={18} className={styles.DailyNAVUpdat_resultIcon} />
              ) : (
                <AlertCircle size={18} className={styles.DailyNAVUpdat_resultIcon} />
              )}
              <span>{portfolioResult.message}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DailyNAVUpdat
