import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NOTIFICATIONS } from '@/data/notifications';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import { Bell, Check, X } from '../shared/icons';

/**
 * Notifications screen — animated notification list.
 */
export default function Notifications({ t }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      <motion.div variants={staggerItem} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <div>
          <h2 style={{
            fontSize: typography.lg, fontWeight: typography.bold,
            color: colors.textPrimary, margin: '0 0 4px', fontFamily: typography.fontFamily,
          }}>
            {t('notifications')}
          </h2>
          <p style={{ fontSize: typography.sm, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>
            {unreadCount} {t('unread')}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
            style={{
              background: 'none', border: `1px solid ${colors.border}`,
              borderRadius: '10px', padding: '8px 14px', cursor: 'pointer',
              color: colors.textSecondary, fontSize: typography.xs,
              fontFamily: typography.fontFamily, fontWeight: typography.medium,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Check size={14} /> {t('markAllRead')}
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            variants={staggerItem}
            initial={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, x: 0, height: 'auto', marginBottom: 10 }}
            exit={{ opacity: 0, x: 60, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FramerCard
              style={{
                opacity: notif.read ? 0.7 : 1,
                borderLeft: notif.read ? 'none' : `3px solid ${colors.primary}`,
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{notif.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px',
                  }}>
                    <span style={{
                      fontSize: typography.sm, fontWeight: typography.semibold,
                      color: colors.textPrimary, fontFamily: typography.fontFamily,
                    }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: colors.primary, flexShrink: 0,
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: typography.xs, color: colors.textSecondary,
                    margin: '0 0 6px', fontFamily: typography.fontFamily,
                    lineHeight: typography.relaxed,
                  }}>
                    {notif.message}
                  </p>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontSize: typography.xs, color: colors.textDim, fontFamily: typography.fontFamily,
                    }}>
                      {notif.time}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {!notif.read && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => markRead(notif.id)}
                          style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: colors.primary, padding: '2px',
                          }}
                        >
                          <Check size={14} />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => dismiss(notif.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: colors.textDim, padding: '2px',
                        }}
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </FramerCard>
          </motion.div>
        ))}
      </AnimatePresence>

      {notifications.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center', padding: '40px 20px',
            color: colors.textMuted, fontFamily: typography.fontFamily,
          }}
        >
          <Bell size={40} color={colors.textDim} style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: typography.base }}>{t('allCaughtUp')}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
