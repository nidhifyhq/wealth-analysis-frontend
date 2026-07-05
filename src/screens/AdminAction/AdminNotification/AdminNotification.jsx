import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Send, Globe, Users, Loader2 } from 'lucide-react'
import Select from 'react-select'
import toast from 'react-hot-toast'
import {
  fetchUsers,
  sendNotification,
  sendRandomNotification,
} from '../../../services/apis/admin.service'
import styles from './AdminNotification.module.css'

const selectStyles = {
  control: (base, state) => ({
    ...base,
    borderColor: state.isFocused ? '#0c3e38' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(12,62,56,0.15)' : 'none',
    borderRadius: 12,
    minHeight: 46,
    padding: '0 4px',
    '&:hover': { borderColor: '#0c3e38' },
  }),
  placeholder: (base) => ({ ...base, color: '#9ca3af', fontSize: 14 }),
  multiValue: (base) => ({
    ...base,
    background: '#f0fdf4',
    borderRadius: 8,
  }),
  multiValueLabel: (base) => ({ ...base, color: '#166534', fontSize: 13, fontWeight: 500 }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#166534',
    borderRadius: '0 8px 8px 0',
    '&:hover': { background: '#dcfce7', color: '#14532d' },
  }),
  menu: (base) => ({ ...base, borderRadius: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#0c3e38' : state.isFocused ? '#f0fdf4' : 'white',
    color: state.isSelected ? 'white' : '#111827',
    fontSize: 14,
  }),
  noOptionsMessage: (base) => ({ ...base, fontSize: 14, color: '#9ca3af' }),
  loadingMessage: (base) => ({ ...base, fontSize: 14, color: '#9ca3af' }),
}

const AdminNotification = () => {
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('custom')

  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [sendToAll, setSendToAll] = useState(true)
  const [users, setUsers] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])

  const [scheduleAt, setScheduleAt] = useState('')

  const [sending, setSending] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    loadUsers()
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
      image: image.trim() || undefined,
      sendToAll,
      ...(sendToAll ? {} : { userIds: selectedUserIds }),
    }
    const res = await sendNotification(payload)
    setSending(false)
    if (res?.success) {
      toast.success(res.message || 'Notification sent')
      setTitle('')
      setMessage('')
      setUrl('')
      setImage('')
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
      toast.success(res.message || 'Notification sent')
    } else {
      toast.error('Failed to send random notification')
    }
  }

  const userOptions = users.map((u) => ({ value: u.userId, label: u.name }))
  const selectedValues = userOptions.filter((o) => selectedUserIds.includes(o.value))

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
              <label className={styles.AdminNotification_label}>
                Image URL <span className={styles.AdminNotification_optional}>(optional)</span>
              </label>
              <input
                className={styles.AdminNotification_input}
                type="url"
                placeholder="https://your-cdn.com/diwali-banner.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
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
              <div className={styles.AdminNotification_field}>
                <label className={styles.AdminNotification_label}>Select Users</label>
                <Select
                  isMulti
                  options={userOptions}
                  value={selectedValues}
                  onChange={(selected) => setSelectedUserIds(selected ? selected.map((o) => o.value) : [])}
                  placeholder="Choose users..."
                  isLoading={loadingUsers}
                  loadingMessage={() => 'Loading users...'}
                  noOptionsMessage={() => 'No users found'}
                  styles={selectStyles}
                  closeMenuOnSelect={false}
                  menuPlacement="top"
                />
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
