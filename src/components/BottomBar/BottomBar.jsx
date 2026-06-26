import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Landmark, User } from 'lucide-react';
import styles from './BottomBar.module.css';

const navItems = [
  { label: 'Home', icon: LayoutDashboard, route: '/dashboard' },
  { label: 'MF', icon: TrendingUp, route: '/mf/' },
  { label: 'FD', icon: Landmark, route: '/dashboard' },
  { label: 'Profile', icon: User, route: '/profile' },
];

export default function BottomBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeIndex = navItems.findIndex((item) => {
    if (item.route === '/mf/') return pathname.startsWith('/mf');
    return pathname === item.route;
  });

  const indicatorLeft = activeIndex >= 0 ? `calc(${activeIndex * 25}% + ${50 - 10}px)` : '0px';

  return (
    <div className={styles.BottomBarContainer}>
      {navItems.map((item, idx) => {
        const isActive = idx === activeIndex;
        const Icon = item.icon;

        return (
          <button
            key={idx}
            className={`${styles.BottomBarItem} ${isActive ? styles.BottomBarItemActive : ''}`}
            onClick={() => navigate(item.route)}
          >
            <div className={styles.BottomBarIconWrapper}>
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                color={isActive ? '#0c3e38' : '#9ca3af'}
              />
            </div>
            <span
              className={`${styles.BottomBarLabel} ${
                isActive ? styles.BottomBarLabelActive : styles.BottomBarLabelInactive
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
