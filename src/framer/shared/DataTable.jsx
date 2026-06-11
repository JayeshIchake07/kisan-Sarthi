import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from './colors';
import { typography } from './typography';
import { ChevronUp, ChevronDown } from './icons';

/**
 * Animated sortable data table with row enter animations.
 */
export default function DataTable({ columns, data, onRowClick, maxHeight = '400px' }) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortCol) return 0;
    const col = columns.find(c => c.key === sortCol);
    if (!col) return 0;
    const aVal = a[sortCol];
    const bVal = b[sortCol];
    const cmp = typeof aVal === 'number' ? aVal - bVal : String(aVal).localeCompare(String(bVal));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div style={{
      background: colors.bgCard,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      overflow: 'hidden',
    }}>
      <div style={{ maxHeight, overflowY: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          fontFamily: typography.fontFamily, fontSize: typography.sm,
        }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  style={{
                    padding: '12px 16px',
                    textAlign: col.align || 'left',
                    color: colors.textMuted,
                    fontWeight: typography.medium,
                    fontSize: typography.xs,
                    textTransform: 'uppercase',
                    letterSpacing: typography.trackingWide,
                    borderBottom: `1px solid ${colors.border}`,
                    position: 'sticky', top: 0,
                    background: colors.bgCard,
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {sortCol === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sortedData.map((row, i) => (
                <motion.tr
                  key={row.id || i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    borderBottom: `1px solid ${colors.borderLight}`,
                  }}
                  whileHover={{
                    background: colors.bgLighter,
                  }}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      style={{
                        padding: '12px 16px',
                        textAlign: col.align || 'left',
                        color: colors.textPrimary,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
