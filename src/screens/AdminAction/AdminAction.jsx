import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell } from 'lucide-react'
import styles from './AdminAction.module.css'

const features = [
  {
    id: 'notifications',
    icon: Bell,
    title: 'Notifications',
    description: 'Send push notifications to users',
    path: '/admin/notifications',
    color: '#0c3e38',
  },
]

const AdminAction = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.AdminAction_container}>
      <header className={styles.AdminAction_header}>
        <button
          className={styles.AdminAction_backBtn}
          onClick={() => navigate('/dashboard')}
          aria-label="Back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className={styles.AdminAction_title}>Admin</h1>
      </header>

      <main className={styles.AdminAction_grid}>
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.id}
              className={styles.AdminAction_card}
              onClick={() => navigate(feature.path)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(feature.path)
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div
                className={styles.AdminAction_cardIcon}
                style={{ background: `${feature.color}15`, color: feature.color }}
              >
                <Icon size={28} />
              </div>
              <h3 className={styles.AdminAction_cardTitle}>{feature.title}</h3>
              <p className={styles.AdminAction_cardDesc}>{feature.description}</p>
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default AdminAction
