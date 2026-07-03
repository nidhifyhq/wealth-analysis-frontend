import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Loader2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchUsers } from '../../../services/apis/admin.service'
import styles from './AllUsers.module.css'

const AllUsers = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const res = await fetchUsers()
    if (res?.users) {
      setUsers(res.users)
    } else {
      toast.error('Failed to load users')
    }
    setLoading(false)
  }

  const filtered = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.userId && u.userId.toString().includes(q))
    )
  })

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={styles.AllUsers_container}>
      <header className={styles.AllUsers_header}>
        <button
          className={styles.AllUsers_backBtn}
          onClick={() => navigate('/admin')}
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.AllUsers_title}>
          Users
          {!loading && (
            <span className={styles.AllUsers_count}>({users.length})</span>
          )}
        </h1>
      </header>

      <main className={styles.AllUsers_content}>
        {loading ? (
          <div className={styles.AllUsers_loading}>
            <Loader2 size={28} className={styles.AllUsers_spinner} />
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className={styles.AllUsers_empty}>
            <Users size={40} strokeWidth={1.5} />
            <p>No users found</p>
          </div>
        ) : (
          <>
            {users.length > 8 && (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    fontSize: 14,
                    outline: 'none',
                    background: '#ffffff',
                    boxSizing: 'border-box',
                  }}
                />
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )}

            <div className={styles.AllUsers_list}>
              {filtered.map((user) => (
                <div key={user.userId} className={styles.AllUsers_card}>
                  <div className={styles.AllUsers_avatar}>
                    {getInitials(user.name)}
                  </div>
                  <div className={styles.AllUsers_info}>
                    <p className={styles.AllUsers_name}>{user.name || 'Unknown'}</p>
                    {user.email && (
                      <p className={styles.AllUsers_email}>{user.email}</p>
                    )}
                    <p className={styles.AllUsers_userId}>ID: {user.userId}</p>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className={styles.AllUsers_empty}>
                <p>No users match your search</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default AllUsers
