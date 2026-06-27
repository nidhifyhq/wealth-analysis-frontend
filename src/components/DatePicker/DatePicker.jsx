import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DatePicker.module.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DatePicker({ value, onChange, placeholder = 'Select date', label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(value ? value.getFullYear() : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [viewMode, setViewMode] = useState('days');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setViewYear(value.getFullYear());
      setViewMonth(value.getMonth());
    }
  }, [value]);

  const daysInMonth = useCallback((y, m) => new Date(y, m + 1, 0).getDate(), []);

  const firstDayOfMonth = useCallback((y, m) => new Date(y, m, 1).getDay(), []);

  const isToday = (d) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  const isSelected = (d) => {
    if (!value) return false;
    return d.getDate() === value.getDate() &&
      d.getMonth() === value.getMonth() &&
      d.getFullYear() === value.getFullYear();
  };

  const formatDisplayDate = (date) => {
    if (!date) return '';
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };

  const handlePrev = () => {
    if (viewMode === 'days') {
      if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
      else { setViewMonth((m) => m - 1); }
    } else if (viewMode === 'months') {
      setViewYear((y) => y - 1);
    } else {
      setViewYear((y) => y - 12);
    }
  };

  const handleNext = () => {
    if (viewMode === 'days') {
      if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
      else { setViewMonth((m) => m + 1); }
    } else if (viewMode === 'months') {
      setViewYear((y) => y + 1);
    } else {
      setViewYear((y) => y + 12);
    }
  };

  const handleDateSelect = (day) => {
    const selected = new Date(viewYear, viewMonth, day);
    onChange(selected);
    setIsOpen(false);
  };

  const handleMonthSelect = (m) => {
    setViewMonth(m);
    setViewMode('days');
  };

  const handleTitleClick = () => {
    if (viewMode === 'days') setViewMode('months');
    else if (viewMode === 'months') setViewMode('years');
  };

  const getNavTitle = () => {
    if (viewMode === 'days') return `${MONTHS[viewMonth]} ${viewYear}`;
    if (viewMode === 'months') return `${viewYear}`;
    const start = Math.floor(viewYear / 12) * 12;
    return `${start} – ${start + 11}`;
  };

  const generateDays = () => {
    const totalDays = daysInMonth(viewYear, viewMonth);
    const startDay = firstDayOfMonth(viewYear, viewMonth);
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);
    return days;
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setViewMode('days');
    if (!value) {
      const now = new Date();
      setViewYear(now.getFullYear());
      setViewMonth(now.getMonth());
    }
  };

  return (
    <div className={styles.DatePickerWrapper} ref={wrapperRef}>
      {label && <label className={styles.DatePickerLabel}>{label}</label>}
      <button
        type="button"
        className={`${styles.DatePickerTrigger} ${isOpen ? styles.DatePickerTriggerActive : ''}`}
        onClick={toggleOpen}
      >
        <span className={value ? styles.DatePickerTriggerText : styles.DatePickerTriggerPlaceholder}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <svg className={styles.DatePickerChevron} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.DatePickerDropdown}>
          <div className={styles.DatePickerNav}>
            <button type="button" className={styles.DatePickerNavBtn} onClick={handlePrev}>
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className={styles.DatePickerNavTitle}
              onClick={handleTitleClick}
            >
              {getNavTitle()}
            </button>
            <button type="button" className={styles.DatePickerNavBtn} onClick={handleNext}>
              <ChevronRight size={16} />
            </button>
          </div>

          {viewMode === 'days' && (
            <>
              <div className={styles.DatePickerWeekdays}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <span key={d} className={styles.DatePickerWeekday}>{d}</span>
                ))}
              </div>
              <div className={styles.DatePickerDays}>
                {generateDays().map((day, idx) => {
                  if (day === null) {
                    return <div key={`e-${idx}`} className={styles.DatePickerDayEmpty} />;
                  }
                  const dateObj = new Date(viewYear, viewMonth, day);
                  return (
                    <button
                      key={`d-${day}`}
                      type="button"
                      className={`${styles.DatePickerDay} ${isToday(dateObj) ? styles.DatePickerDayToday : ''} ${isSelected(dateObj) ? styles.DatePickerDaySelected : ''}`}
                      onClick={() => handleDateSelect(day)}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {viewMode === 'months' && (
            <div className={styles.DatePickerMonthGrid}>
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  className={`${styles.DatePickerMonthItem} ${i === viewMonth ? styles.DatePickerMonthItemActive : ''}`}
                  onClick={() => handleMonthSelect(i)}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {viewMode === 'years' && (
            <div className={styles.DatePickerYearGrid}>
              {Array.from({ length: 12 }, (_, i) => {
                const start = Math.floor(viewYear / 12) * 12;
                const y = start + i;
                return (
                  <button
                    key={y}
                    type="button"
                    className={`${styles.DatePickerYearItem} ${y === viewYear ? styles.DatePickerYearItemActive : ''} ${y === new Date().getFullYear() ? styles.DatePickerYearItemCurrent : ''}`}
                    onClick={() => { setViewYear(y); setViewMode('months'); }}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
