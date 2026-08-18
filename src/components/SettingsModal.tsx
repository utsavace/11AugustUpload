import React from 'react';
import { X, Sliders, Check } from 'lucide-react';

const SURFACE = '#161b27';
const BORDER = '#2a2d3a';
const PURPLE = '#6366f1';
const TEXT = '#f8fafc';
const MUTED = '#cbd5e1';
const DIM = '#94a3b8';

// === POSITION-SIZING FEATURE START [2026-08-18] ===
// capital / riskPct / setCapital / setRiskPct are new optional props; App.tsx passes them
// down and forwards capital+riskPct to the scan URL as query params.
// To revert: remove this comment block, the 4 new props below, and the new "Position
// sizing" card in the JSX further down (also tagged 2026-08-18).
// === POSITION-SIZING FEATURE END [2026-08-18] ===
export const SettingsModal: React.FC<{
  isOpen: boolean; onClose: () => void; customSymbols: string; setCustomSymbols: (v: string) => void;
  capital?: number; setCapital?: (v: number) => void;
  riskPct?: number; setRiskPct?: (v: number) => void;
}> = ({ isOpen, onClose, customSymbols, setCustomSymbols, capital = 100000, setCapital, riskPct = 0.005, setRiskPct }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div style={{ maxWidth: 480, width: '100%', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sliders size={16} color={PURPLE} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Settings</div>
              <div style={{ fontSize: 11, color: MUTED }}>Custom ticker scope</div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 6, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, color: MUTED, cursor: 'pointer', display: 'flex' }}>
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: 14, borderRadius: 8, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', fontSize: 12, lineHeight: 1.6, color: MUTED }}>
            <div style={{ fontWeight: 600, color: '#818cf8', marginBottom: 4 }}>Filter thresholds</div>
            CRSI and ADX thresholds are set by the <strong style={{ color: PURPLE }}>Strict / Lenient</strong> buttons on the main screen.
          </div>
          {/* === POSITION-SIZING FEATURE START [2026-08-18] === */}
          <div style={{ padding: 14, borderRadius: 8, background: '#1e2030', border: `1px solid ${BORDER}` }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Position sizing</label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>Trading capital (₹)</div>
                <input type="number" min={1000} step={1000} value={capital}
                  onChange={e => setCapital && setCapital(Math.max(1000, Number(e.target.value) || 0))}
                  style={{ width: '100%', padding: 8, background: '#0d1018', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: TEXT, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: DIM, marginBottom: 4 }}>Risk per trade</div>
                <select value={riskPct} onChange={e => setRiskPct && setRiskPct(Number(e.target.value))}
                  style={{ width: '100%', padding: 8, background: '#0d1018', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: TEXT, outline: 'none' }}>
                  <option value={0.003}>0.3% (max trades)</option>
                  <option value={0.005}>0.5% (recommended)</option>
                  <option value={0.01}>1.0% (fewer, larger trades)</option>
                </select>
              </div>
            </div>
            <div style={{ fontSize: 11, color: DIM, lineHeight: 1.6 }}>
              Position size = (Capital × Risk%) ÷ (2 × ATR%). Stop-loss = Last close − 2×ATR. Capped between 0.5% and 15% of capital per trade.
            </div>
          </div>
          {/* === POSITION-SIZING FEATURE END [2026-08-18] === */}
          <div style={{ padding: 14, borderRadius: 8, background: '#1e2030', border: `1px solid ${BORDER}` }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Custom ticker symbols (optional)</label>
            <textarea rows={3} value={customSymbols} onChange={e => setCustomSymbols(e.target.value)}
              placeholder="e.g. RELIANCE, TCS, HDFCBANK  (blank = full Nifty 500)"
              style={{ width: '100%', padding: 10, background: '#0d1018', border: `1px solid ${BORDER}`, borderRadius: 7, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#94a3b8', resize: 'none', outline: 'none' }} />
            <div style={{ fontSize: 11, color: DIM, marginTop: 6 }}>Comma-separated NSE tickers without <code style={{ color: MUTED }}>.NS</code> suffix.</div>
          </div>
        </div>
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', background: PURPLE, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <Check size={14} /> Close
          </button>
        </div>
      </div>
    </div>
  );
};
