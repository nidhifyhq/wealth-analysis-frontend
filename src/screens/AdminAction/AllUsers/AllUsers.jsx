import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Loader2, Search, RefreshCw, Smartphone, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchAllUsers } from '../../../services/apis/admin.service'
import styles from './AllUsers.module.css'

const PLATFORM_ICONS = { a: 'Android', android: 'Android', i: 'iOS', ios: 'iOS', w: 'Web', web: 'Web' }

const getDayRange = () => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  return { todayStart, yesterdayStart: todayStart - 24 * 60 * 60 * 1000 }
}

const AllUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => { loadUsers() }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchAllUsers()
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data)
      } else {
        setUsers([])
        toast.error('Unexpected response format')
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load users'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const counts = useMemo(() => {
    const { todayStart, yesterdayStart } = getDayRange()
    let today = 0
    let yesterday = 0
    users.forEach((u) => {
      if (u.dl == null) return
      const t = u.dl * 1000
      if (t >= todayStart) today += 1
      else if (t >= yesterdayStart) yesterday += 1
    })
    return { all: users.length, today, yesterday }
  }, [users])

  const filtered = useMemo(() => {
    let list = users

    if (activeTab !== 'all') {
      const { todayStart, yesterdayStart } = getDayRange()
      list = list.filter((u) => {
        if (u.dl == null) return false
        const t = u.dl * 1000
        return activeTab === 'today'
          ? t >= todayStart
          : (t >= yesterdayStart && t < todayStart)
      })
      list = [...list].sort((a, b) => (b.dl ?? 0) - (a.dl ?? 0))
    }

    if (!search.trim()) return list
    const q = search.toLowerCase().trim()
    return list.filter((u) =>
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.emailId && u.emailId.toLowerCase().includes(q)) ||
      (u.userId != null && u.userId.toString().includes(q))
    )
  }, [users, search, activeTab])

  const getInitials = (name, email) => {
    const src = name || email || ''
    return src
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

const formatDl = (epochSeconds) => {
  if (epochSeconds == null) return 'Never'

  const date = new Date(epochSeconds * 1000)

  if (isNaN(date.getTime())) return 'Unknown'

  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

  const getPlatformLabel = (dp) => {
    if (!dp) return 'Unknown'
    return PLATFORM_ICONS[dp.toLowerCase()] || dp
  }

  if (loading) {
    return (
      <div className={styles.AllUsers_container}>
        <header className={styles.AllUsers_header}>
          <button className={styles.AllUsers_backBtn} onClick={() => navigate('/admin')} aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.AllUsers_title}>All Users</h1>
        </header>
        <div className={styles.AllUsers_loading}>
          <Loader2 size={32} className={styles.AllUsers_spinner} />
          <span>Loading users...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.AllUsers_container}>
        <header className={styles.AllUsers_header}>
          <button className={styles.AllUsers_backBtn} onClick={() => navigate('/admin')} aria-label="Back">
            <ArrowLeft size={22} />
          </button>
          <h1 className={styles.AllUsers_title}>All Users</h1>
        </header>
        <div className={styles.AllUsers_error}>
          <AlertCircle size={40} strokeWidth={1.5} />
          <p>{error}</p>
          <button className={styles.AllUsers_retryBtn} onClick={loadUsers}>Retry</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.AllUsers_container}>
      <header className={styles.AllUsers_header}>
        <button className={styles.AllUsers_backBtn} onClick={() => navigate('/admin')} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.AllUsers_title}>
          All Users
          <span className={styles.AllUsers_count}>({users.length})</span>
        </h1>
        <button className={styles.AllUsers_refreshBtn} onClick={loadUsers} aria-label="Refresh">
          <RefreshCw size={18} />
        </button>
      </header>

      <main className={styles.AllUsers_content}>
        {users.length > 0 && (
          <div className={styles.AllUsers_tabs}>
            {[
              { key: 'all', label: 'All', count: counts.all },
              { key: 'today', label: 'Today', count: counts.today },
              { key: 'yesterday', label: 'Yesterday', count: counts.yesterday },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`${styles.AllUsers_tab} ${activeTab === tab.key ? styles.AllUsers_tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                <span className={styles.AllUsers_tabCount}>{tab.count}</span>
              </button>
            ))}
          </div>
        )}

        {users.length > 0 && (
          <div className={styles.AllUsers_searchWrap}>
            <Search size={16} className={styles.AllUsers_searchIcon} />
            <input
              type="text"
              placeholder="Search by name, email or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.AllUsers_searchInput}
            />
            {search && (
              <button className={styles.AllUsers_clearBtn} onClick={() => setSearch('')}>
                &times;
              </button>
            )}
          </div>
        )}

        {users.length === 0 ? (
          <div className={styles.AllUsers_empty}>
            <Users size={48} strokeWidth={1.2} />
            <p className={styles.AllUsers_emptyTitle}>No users found</p>
            <p className={styles.AllUsers_emptySub}>Users will appear here once they register.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.AllUsers_empty}>
            {search.trim() ? (
              <Search size={40} strokeWidth={1.2} />
            ) : (
              <Users size={40} strokeWidth={1.2} />
            )}
            <p className={styles.AllUsers_emptyTitle}>
              {search.trim()
                ? 'No results'
                : activeTab === 'today'
                ? 'No users active today'
                : activeTab === 'yesterday'
                ? 'No users active yesterday'
                : 'No users found'}
            </p>
            <p className={styles.AllUsers_emptySub}>
              {search.trim()
                ? 'Try a different search term.'
                : activeTab === 'today'
                ? 'Users who opened the app today will appear here.'
                : activeTab === 'yesterday'
                ? 'Users who opened the app yesterday will appear here.'
                : 'Users will appear here once they register.'}
            </p>
          </div>
        ) : (
          <div className={styles.AllUsers_list}>
            {filtered.map((user) => (
              <div key={user.userId} className={styles.AllUsers_card}>
                <div className={styles.AllUsers_avatar}>
                  {getInitials(user.name, user.emailId)}
                </div>
                <div className={styles.AllUsers_info}>
                  <p className={styles.AllUsers_name}>{user.name || 'Unknown'}</p>
                  {/* <p className={styles.AllUsers_email}>{user.emailId}</p> */}
                  <p className={styles.AllUsers_userId}>ID: {user.userId}</p>
                </div>
                {(user.dp || user.dl != null) && (
                  <div className={styles.AllUsers_meta}>
                    {user.dp && (
                      <span className={styles.AllUsers_badge} title="Platform">
                        <Smartphone size={12} />
                        {getPlatformLabel(user.dp)}
                      </span>
                    )}
                    {user.dl != null && (
                      <span className={styles.AllUsers_time} title="Last login">
                        {formatDl(user.dl)}
                      </span>
                    )}

                     <p className={styles.AllUsers_email}>{user.emailId}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default AllUsers
