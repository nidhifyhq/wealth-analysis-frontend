import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bell,
  Send,
  Globe,
  Users,
  X,
  Check,
  Loader2,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  fetchUsers,
  sendNotification,
  sendRandomNotification,
} from '../../../services/apis/admin.service'
import styles from './AdminNotification.module.css'

const AdminNotification = () => {
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  const [activeTab, setActiveTab] = useState('custom')

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [sendToAll, setSendToAll] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [scheduleAt, setScheduleAt] = useState('')

  const [sending, setSending] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const loadUsers = async () => {
    setLoadingUsers(true)
    const res = await fetchUsers()
    if (res?.users) setUsers(res.users)
    setLoadingUsers(false)
  }

  const handleSendCustom = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Title and message are required')
      return
    }
    setSending(true)
    const payload = {
      title: title.trim(),
      message: message.trim(),
      url: url.trim() || undefined,
      sendToAll,
      ...(sendToAll ? {} : { userIds: selectedUserIds }),
    }
    const res = await sendNotification(payload)
    setSending(false)
    if (res?.success) {
      toast.success(`Sent to ${res.totalUserReceived} users`)
      setTitle('')
      setMessage('')
      setUrl('')
      setSelectedUserIds([])
    } else {
      toast.error('Failed to send notification')
    }
  }

  const handleSendRandom = async () => {
    setSending(true)
    const payload = scheduleAt ? { scheduleAt } : {}
    const res = await sendRandomNotification(payload)
    setSending(false)
    if (res?.success) {
      toast.success(`Random notification sent to ${res.totalUserReceived} users`)
    } else {
      toast.error('Failed to send random notification')
    }
  }

  const toggleUser = (userId) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  return (
    <div className={styles.AdminNotification_container}>
      <header className={styles.AdminNotification_header}>
        <button
          className={styles.AdminNotification_backBtn}
          onClick={() => navigate('/admin')}
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.AdminNotification_title}>Notifications</h1>
      </header>

      <main className={styles.AdminNotification_content}>
        <div className={styles.AdminNotification_tabs}>
          <button
            className={`${styles.AdminNotification_tab} ${activeTab === 'custom' ? styles.AdminNotification_tabActive : ''}`}
            onClick={() => setActiveTab('custom')}
          >
            Custom
          </button>
          <button
            className={`${styles.AdminNotification_tab} ${activeTab === 'random' ? styles.AdminNotification_tabActive : ''}`}
            onClick={() => setActiveTab('random')}
          >
            Random
          </button>
        </div>

        {activeTab === 'custom' && (
          <div className={styles.AdminNotification_form}>
            <div className={styles.AdminNotification_field}>
              <label className={styles.AdminNotification_label}>Title</label>
              <input
                className={styles.AdminNotification_input}
                type="text"
                placeholder="e.g. Special Offer Just for You"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
            </div>

            <div className={styles.AdminNotification_field}>
              <label className={styles.AdminNotification_label}>Message</label>
              <textarea
                className={styles.AdminNotification_textarea}
                placeholder="Write your notification message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={500}
              />
              <span className={styles.AdminNotification_charCount}>
                {message.length}/500
              </span>
            </div>

            <div className={styles.AdminNotification_field}>
              <label className={styles.AdminNotification_label}>
                URL <span className={styles.AdminNotification_optional}>(optional)</span>
              </label>
              <input
                className={styles.AdminNotification_input}
                type="url"
                placeholder="https://wealth.nidhify.com/dashboard"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className={styles.AdminNotification_field}>
              <label className={styles.AdminNotification_label}>Send to</label>
              <div className={styles.AdminNotification_segment}>
                <button
                  className={`${styles.AdminNotification_segmentBtn} ${sendToAll ? styles.AdminNotification_segmentActive : ''}`}
                  onClick={() => setSendToAll(true)}
                >
                  <Globe size={16} />
                  All Users
                </button>
                <button
                  className={`${styles.AdminNotification_segmentBtn} ${!sendToAll ? styles.AdminNotification_segmentActive : ''}`}
                  onClick={() => setSendToAll(false)}
                >
                  <Users size={16} />
                  Specific
                </button>
              </div>
            </div>

            {!sendToAll && (
              <div className={styles.AdminNotification_field} ref={dropdownRef}>
                <label className={styles.AdminNotification_label}>Select Users</label>
                <div
                  className={styles.AdminNotification_dropdownTrigger}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setDropdownOpen(!dropdownOpen)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span>
                    {selectedUserIds.length > 0
                      ? `${selectedUserIds.length} user${selectedUserIds.length > 1 ? 's' : ''} selected`
                      : 'Choose users...'}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`${styles.AdminNotification_chevron} ${dropdownOpen ? styles.AdminNotification_chevronOpen : ''}`}
                  />
                </div>
                {dropdownOpen && (
                  <div className={styles.AdminNotification_dropdown}>
                    {loadingUsers ? (
                      <div className={styles.AdminNotification_dropdownState}>Loading...</div>
                    ) : users.length === 0 ? (
                      <div className={styles.AdminNotification_dropdownState}>No users found</div>
                    ) : (
                      users.map((user) => (
                        <div
                          key={user.userId}
                          className={`${styles.AdminNotification_dropdownItem} ${selectedUserIds.includes(user.userId) ? styles.AdminNotification_dropdownItemSelected : ''}`}
                          onClick={() => toggleUser(user.userId)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              toggleUser(user.userId)
                            }
                          }}
                          role="option"
                          tabIndex={0}
                          aria-selected={selectedUserIds.includes(user.userId)}
                        >
                          <span>{user.name}</span>
                          {selectedUserIds.includes(user.userId) && (
                            <Check size={16} className={styles.AdminNotification_checkIcon} />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
                {selectedUserIds.length > 0 && (
                  <div className={styles.AdminNotification_chips}>
                    {selectedUserIds.map((id) => {
                      const user = users.find((u) => u.userId === id)
                      return (
                        <span key={id} className={styles.AdminNotification_chip}>
                          {user?.name || `User #${id}`}
                          <button
                            className={styles.AdminNotification_chipRemove}
                            onClick={() => toggleUser(id)}
                            aria-label={`Remove ${user?.name || id}`}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {(title || message) && (
              <div className={styles.AdminNotification_preview}>
                <div className={styles.AdminNotification_previewHeader}>
                  <Bell size={16} />
                  <span className={styles.AdminNotification_previewLabel}>Preview</span>
                </div>
                <div className={styles.AdminNotification_previewCard}>
                  <div className={styles.AdminNotification_previewIcon}>
                    <Bell size={20} />
                  </div>
                  <div className={styles.AdminNotification_previewText}>
                    <p className={styles.AdminNotification_previewTitle}>
                      {title || 'Notification Title'}
                    </p>
                    <p className={styles.AdminNotification_previewMessage}>
                      {message || 'Notification message will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              className={styles.AdminNotification_submitBtn}
              onClick={handleSendCustom}
              disabled={sending || !title.trim() || !message.trim()}
            >
              {sending ? (
                <>
                  <Loader2 size={18} className={styles.AdminNotification_spinner} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Notification
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'random' && (
          <div className={styles.AdminNotification_form}>
            <div className={styles.AdminNotification_field}>
              <label className={styles.AdminNotification_label}>Pick from</label>
              <div className={styles.AdminNotification_segment}>
                <button
                  className={`${styles.AdminNotification_segmentBtn} ${scheduleAt === '' ? styles.AdminNotification_segmentActive : ''}`}
                  onClick={() => setScheduleAt('')}
                >
                  Any
                </button>
                <button
                  className={`${styles.AdminNotification_segmentBtn} ${scheduleAt === 'morning' ? styles.AdminNotification_segmentActive : ''}`}
                  onClick={() => setScheduleAt('morning')}
                >
                  Morning
                </button>
                <button
                  className={`${styles.AdminNotification_segmentBtn} ${scheduleAt === 'evening' ? styles.AdminNotification_segmentActive : ''}`}
                  onClick={() => setScheduleAt('evening')}
                >
                  Evening
                </button>
              </div>
            </div>

            <button
              className={styles.AdminNotification_submitBtn}
              onClick={handleSendRandom}
              disabled={sending}
            >
              {sending ? (
                <>
                  <Loader2 size={18} className={styles.AdminNotification_spinner} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Random Notification
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminNotification
