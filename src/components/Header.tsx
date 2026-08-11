import React from 'react';
import { Info, Sliders } from 'lucide-react';
import { FilterMode } from '../types';

interface HeaderProps {
  onOpenStrategy: () => void;
  onOpenSettings: () => void;
  filterMode: FilterMode;
}

const SURFACE = '#161b27';
const BORDER = '#2a2d3a';
const PURPLE = '#6366f1';
const TEXT = '#f8fafc';
const MUTED = '#cbd5e1';
const DIM = '#94a3b8';

export const Header: React.FC<HeaderProps> = ({ onOpenStrategy, onOpenSettings, filterMode }) => (
  <header style={{ background: SURFACE, borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, zIndex: 50, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
    {/* Left */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0 }}>CR</div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: TEXT }}>NSE ConnorsRSI <span style={{ color: '#818cf8', fontStyle: 'italic', fontWeight: 400 }}>Screener</span></span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: '#0d1018', color: DIM, border: `1px solid ${BORDER}`, fontWeight: 600, letterSpacing: '0.04em' }}>NIFTY 500</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, letterSpacing: '0.04em',
            background: filterMode === 'strict' ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.05)',
            color: filterMode === 'strict' ? '#818cf8' : DIM,
            border: `1px solid ${filterMode === 'strict' ? PURPLE : BORDER}`,
          }}>
            {filterMode === 'strict' ? '⚡ Strict' : '◎ Lenient'}
          </span>
        </div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>CRSI(3,2,100) · ADX(14) · EMA(200) · Gate filter engine</div>
      </div>
    </div>

    {/* Right */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={onOpenStrategy} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'transparent', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
        <Info size={14} color={PURPLE} /> <span>Strategy</span>
      </button>
      <button onClick={onOpenSettings} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'transparent', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
        <Sliders size={14} /> <span>Settings</span>
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#4ade80' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }}></span>
        NSE Live
      </div>
    </div>
  </header>
);
