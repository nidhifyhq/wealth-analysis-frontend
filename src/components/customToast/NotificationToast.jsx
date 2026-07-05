import React, { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';

const NotificationToast = ({ title, body, onClose }) => {
  const [progress, setProgress] = useState(100);
  const duration = 5000;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    const interval = setInterval(() => {
      setProgress((p) => Math.max(0, p - (100 / (duration / 10))));
    }, 10);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 'env(safe-area-inset-top, 12px)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999999999,
        width: 'max-content',
        minWidth: '320px',
        maxWidth: '90vw',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
        animation: 'notif-toast-slide 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <style>{`
        @keyframes notif-toast-slide {
          from { transform: translate(-50%, -20px); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '14px 16px', gap: '12px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#0c3e38',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <Bell size={18} color="#ffffff" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#0c3e38',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title || 'Nidhify'}
          </p>
          {body && (
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '13px',
                fontWeight: '400',
                color: '#6b7280',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {body}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            padding: '6px',
            cursor: 'pointer',
            color: '#9ca3af',
            display: 'flex',
            borderRadius: '8px',
            flexShrink: 0,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#9ca3af';
          }}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div
        style={{
          height: '3px',
          width: '100%',
          backgroundColor: '#f3f4f6',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#0c3e38',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
};

export default NotificationToast;
