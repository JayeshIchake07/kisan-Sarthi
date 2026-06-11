import { useState } from 'react';
import { motion } from 'framer-motion';
import { D } from '@/data/seedData';
import { DISTRICTS } from '@/data/districts';
import { CROPS } from '@/data/crops';
import { colors, typography } from '../shared';
import { staggerContainer, staggerItem } from '../shared/animations';
import FramerCard from '../shared/FramerCard';
import FilterBar from '../shared/FilterBar';
import AnimatedCounter from '../shared/AnimatedCounter';
import { MessageSquare, Send, Users, Check } from '../shared/icons';

/**
 * Bulk Communication — SMS template builder, recipient filters, broadcast simulation.
 */
export default function BulkCommunication() {
  const [template, setTemplate] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [sent, setSent] = useState(false);

  const filteredFarmers = D.plots.filter(p => {
    if (selectedDistrict !== 'all' && p.district !== selectedDistrict) return false;
    if (selectedCrop !== 'all' && p.crop !== selectedCrop) return false;
    return true;
  });

  const TEMPLATES = [
    'Weather Alert: Heavy rain expected in {district}. Protect your {crop} crop. Take immediate action.',
    'Market Update: {crop} prices are rising at {district} APMC. Best time to sell.',
    'Advisory: Based on satellite data, your crop needs attention. Check Kisan Sarthi app for details.',
    'Subsidy Alert: PM-KISAN installment is being credited. Verify your bank details.',
  ];

  const handleBroadcast = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate">
      {/* Summary */}
      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colors.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} color={colors.primary} />
            </div>
            <div>
              <AnimatedCounter value={filteredFarmers.length} fontSize={typography['2xl']} />
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>Recipients</p>
            </div>
          </div>
        </FramerCard>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colors.success}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} color={colors.success} />
            </div>
            <div>
              <AnimatedCounter value={847} fontSize={typography['2xl']} />
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>Messages Sent (Today)</p>
            </div>
          </div>
        </FramerCard>
        <FramerCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${colors.warning}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={20} color={colors.warning} />
            </div>
            <div>
              <AnimatedCounter value={94} suffix="%" fontSize={typography['2xl']} />
              <p style={{ fontSize: typography.xs, color: colors.textMuted, margin: 0, fontFamily: typography.fontFamily }}>Delivery Rate</p>
            </div>
          </div>
        </FramerCard>
      </div>

      {/* Filters */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <FilterBar
          label="District"
          filters={[{ value: 'all', label: 'All Districts' }, ...DISTRICTS.map(d => d.name)]}
          activeFilter={selectedDistrict}
          onFilterChange={setSelectedDistrict}
        />
        <FilterBar
          label="Crop"
          filters={[{ value: 'all', label: 'All Crops' }, ...CROPS]}
          activeFilter={selectedCrop}
          onFilterChange={setSelectedCrop}
        />
      </motion.div>

      {/* Template Selector */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textMuted,
          margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          Quick Templates
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TEMPLATES.map((tmpl, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setTemplate(tmpl)}
              style={{
                padding: '10px 14px', borderRadius: '10px', cursor: 'pointer',
                background: template === tmpl ? `${colors.primary}15` : colors.bgCard,
                border: `1px solid ${template === tmpl ? colors.primary : colors.border}`,
                color: colors.textSecondary, fontSize: typography.sm,
                fontFamily: typography.fontFamily, textAlign: 'left',
              }}
            >
              {tmpl}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Message Input */}
      <motion.div variants={staggerItem} style={{ marginBottom: '1rem' }}>
        <h3 style={{
          fontSize: typography.sm, fontWeight: typography.semibold, color: colors.textMuted,
          margin: '0 0 10px', fontFamily: typography.fontFamily,
          textTransform: 'uppercase', letterSpacing: typography.trackingWide,
        }}>
          Message
        </h3>
        <textarea
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          placeholder="Type your SMS message here..."
          rows={4}
          style={{
            width: '100%', padding: '14px', borderRadius: '12px', resize: 'vertical',
            background: colors.bgLighter, border: `1px solid ${colors.border}`,
            color: colors.textPrimary, fontSize: typography.sm,
            fontFamily: typography.fontFamily, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <p style={{
          fontSize: typography.xs, color: colors.textDim, margin: '6px 0 0',
          fontFamily: typography.fontFamily,
        }}>
          {template.length}/160 characters · {Math.ceil(template.length / 160) || 0} SMS
        </p>
      </motion.div>

      {/* Broadcast Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBroadcast}
        disabled={!template || sent}
        style={{
          width: '100%', padding: '14px', borderRadius: '14px',
          background: sent
            ? colors.success
            : template
              ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`
              : colors.bgLighter,
          border: 'none', cursor: template && !sent ? 'pointer' : 'not-allowed',
          color: '#fff', fontSize: typography.base, fontWeight: typography.semibold,
          fontFamily: typography.fontFamily,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        {sent ? (
          <><Check size={18} /> Broadcast Sent to {filteredFarmers.length} farmers!</>
        ) : (
          <><Send size={18} /> Broadcast to {filteredFarmers.length} farmers</>
        )}
      </motion.button>
    </motion.div>
  );
}
