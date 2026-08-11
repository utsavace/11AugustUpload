import React from 'react';
import { X, BookOpen, ShieldCheck, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';

const SURFACE = '#161b27';
const BORDER = '#2a2d3a';
const PURPLE = '#6366f1';
const TEXT = '#f8fafc';
const MUTED = '#cbd5e1';
const DIM = '#94a3b8';
const CARD = '#1e2030';

export const StrategyInfoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
      <div style={{ maxWidth: 640, width: '100%', maxHeight: '90vh', overflowY: 'auto', background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BORDER}`, position: 'sticky', top: 0, background: SURFACE }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color={PURPLE} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Strategy rulebook</div>
              <div style={{ fontSize: 11, color: MUTED }}>Mean reversion · NSE equities</div>
            </div>
          </div>
          <button onClick={onClose} style={{ padding: 6, background: 'transparent', border: `1px solid ${BORDER}`, borderRadius: 7, color: MUTED, cursor: 'pointer', display: 'flex' }}><X size={15} /></button>
        </div>

        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12 }}>
          <div style={{ padding: 16, borderRadius: 10, background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontWeight: 600, color: '#818cf8' }}>
              <TrendingUp size={15} color={PURPLE} /> ConnorsRSI (3, 2, 100)
            </div>
            <p style={{ color: MUTED, marginBottom: 10, lineHeight: 1.6 }}>Three-component composite oscillator for extreme mean-reversion setups:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, paddingLeft: 8 }}>
              {[['RSI(3)', '3-period short-term momentum'],['Streak RSI(2)', 'RSI of consecutive up/down streak count'],['PercentRank(100)', '100-day price change percentile']].map(([k,v]) => (
                <div key={k} style={{ color: DIM }}><span style={{ color: PURPLE }}>{k}</span> — {v}</div>
              ))}
            </div>
            <p style={{ color: MUTED, marginTop: 10, lineHeight: 1.6 }}>CRSI below <span style={{ color: '#f59e0b', fontWeight: 600 }}>10</span> → extreme oversold, high mean-reversion probability.</p>
          </div>

          <div style={{ padding: 16, borderRadius: 10, background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontWeight: 600, color: '#4ade80' }}>
              <ShieldCheck size={15} color="#22c55e" /> Gate filter criteria
            </div>
            <p style={{ color: MUTED, marginBottom: 12, lineHeight: 1.6 }}>Stock must pass a 2003–Present daily backtest:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[['≥ 10', 'Min trades'],['≥ 60%', 'Win rate'],['≥ 2.0', 'Profit factor']].map(([v,l]) => (
                <div key={l} style={{ padding: 12, borderRadius: 8, background: '#0d1018', border: `1px solid ${BORDER}`, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: 16, color: '#22c55e', marginBottom: 4 }}>{v}</div>
                  <div style={{ fontSize: 10, color: DIM }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: 16, borderRadius: 10, background: CARD, border: `1px solid ${BORDER}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontWeight: 600, color: TEXT }}>
              <CheckCircle2 size={15} color={PURPLE} /> Execution rules
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#4ade80', lineHeight: 1.7, marginBottom: 10 }}>
              <strong style={{ color: '#22c55e', display: 'block', marginBottom: 4 }}>BUY — next session open:</strong>
              Close &gt; EMA(200)  ·  CRSI &lt; 10  ·  ADX(14) &gt; 29
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#f87171', lineHeight: 1.7 }}>
              <strong style={{ color: '#ef4444', display: 'block', marginBottom: 4 }}>SELL — next session open:</strong>
              Exit when ConnorsRSI closes &gt; 90
            </div>
          </div>

          <div style={{ padding: 14, borderRadius: 8, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <AlertCircle size={14} color={PURPLE} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ color: MUTED, lineHeight: 1.6 }}>For informational and research purposes only. Past backtest performance does not guarantee future results. Always apply proper position sizing and risk management.</p>
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 18px', background: PURPLE, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Got it</button>
        </div>
      </div>
    </div>
  );
};
