import React from 'react';
import { ScanStats, FilterMode } from '../types';
import { Database, CheckCircle2, Zap, Clock } from 'lucide-react';

const BG = '#0d1018';
const BORDER = '#1a1d2a';
const DIM = '#94a3b8';
const MUTED = '#cbd5e1';

export const StatsBar: React.FC<{ stats: ScanStats; filterMode: FilterMode }> = ({ stats, filterMode }) => (
  <div style={{ background: BG, borderBottom: `1px solid ${BORDER}`, padding: '8px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, overflowX: 'auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 24, whiteSpace: 'nowrap', fontSize: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Database size={13} color={DIM} />
        <span style={{ color: DIM }}>Universe</span>
        <span style={{ color: MUTED, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{stats.universe || 500}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: DIM }}>Scanned</span>
        <span style={{ color: MUTED, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{stats.scanned}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <CheckCircle2 size={13} color="#22c55e" />
        <span style={{ color: DIM }}>Gate passed</span>
        <span style={{ color: '#22c55e', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>{stats.gatePassed}</span>
        <span style={{ color: DIM, fontSize: 10 }}>({filterMode === 'strict' ? 'PF≥2.0' : 'PF≥1.5'})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 6 }}>
        <Zap size={13} color="#f59e0b" />
        <span style={{ color: '#f59e0b' }}>Live signals</span>
        <span style={{ color: '#fbbf24', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 14 }}>{stats.liveSignalCount}</span>
      </div>
    </div>
    {stats.lastRunTime && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: DIM, whiteSpace: 'nowrap' }}>
        <Clock size={12} color={DIM} />
        Last run: <span style={{ fontFamily: 'JetBrains Mono, monospace', color: MUTED }}>{stats.lastRunTime}</span>
      </div>
    )}
  </div>
);
