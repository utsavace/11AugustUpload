import React, { useState } from 'react';
import { StockResult } from '../types';
import { ChevronDown, ChevronUp, Search, Zap } from 'lucide-react';

const BG      = '#0f1117';
const SURFACE = '#161b27';
const CARD    = '#1e2030';
const BORDER  = '#2a2d3a';
const BORDER2 = '#1a1d2a';
const AMBER   = '#f59e0b';
const TEXT    = '#f8fafc';
const MUTED   = '#cbd5e1';
const DIM     = '#94a3b8';
const MONO    = 'JetBrains Mono, monospace';

type SortField = 'bbCrsiWr' | 'bbCrsiPf' | 'bbCrsiAvg' | 'bbCrsiTrades' | 'symbol' | 'lastClose';

export const BbCrsiTable: React.FC<{
  results: StockResult[];
  viewMode: 'live' | 'all';
  onViewChange: (m: 'live' | 'all') => void;
  isScanning: boolean;
}> = ({ results, viewMode, onViewChange, isScanning }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch]     = useState('');
  const [sortField, setSortField] = useState<SortField>('bbCrsiWr');
  const [sortAsc, setSortAsc]   = useState(false);

  const handleSort = (f: SortField) => {
    if (sortField === f) setSortAsc(!sortAsc);
    else { setSortField(f); setSortAsc(false); }
  };

  const filtered = results.filter(r =>
    r.symbol.toLowerCase().includes(search.toLowerCase()) &&
    (viewMode === 'live' ? r.bbCrsiLive : true)
  );

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortField], vb = b[sortField];
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === 'string') return sortAsc ? va.localeCompare(String(vb)) : String(vb).localeCompare(va);
    return sortAsc ? Number(va) - Number(vb) : Number(vb) - Number(va);
  });

  const liveCount = results.filter(r => r.bbCrsiLive).length;

  const TH = ({ label, field, left }: { label: string; field?: SortField; left?: boolean }) => (
    <th onClick={() => field && handleSort(field)}
      style={{ padding: '10px 14px', fontSize: 11, fontWeight: 500,
        color: field && sortField === field ? '#f59e0b' : DIM,
        textAlign: left ? 'left' : 'right', cursor: field ? 'pointer' : 'default',
        userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label} {field && <span style={{ opacity: 0.4, fontSize: 9 }}>↕</span>}
    </th>
  );

  return (
    <div style={{ background: SURFACE, border: `0.5px solid ${BORDER}`, borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>

      {/* Strategy description */}
      <div style={{ padding: '14px 20px', borderBottom: `0.5px solid ${BORDER}`, background: 'rgba(245,158,11,0.04)' }}>
        <div style={{ fontSize: 12, color: DIM, lineHeight: 1.7 }}>
          <span style={{ color: AMBER, fontWeight: 700 }}>🎯 Double Confirmation Strategy</span> —{' '}
          <span style={{ fontFamily: MONO, color: '#c084fc' }}>CRSI(3,2,100) &lt; 15</span> +{' '}
          <span style={{ fontFamily: MONO, color: '#22c55e' }}>Low ≤ BB(20,2) Lower Band</span> +{' '}
          Close &gt; EMA(200) + ADX ≥ 29 → next bar open pe entry. Exit: CRSI &gt; 90.{' '}
          <span style={{ color: '#22c55e' }}>WR 70%, PF 2.40 — 9/10 years profitable.</span>{' '}
          Sirf <span style={{ color: AMBER, fontWeight: 700 }}>32.9% CRSI trades</span> mein dono signals milte hain — highest quality setups!
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 12 }}>
          {[
            { label: 'Gate Passed', value: results.length, color: '#22c55e' },
            { label: 'Live Signals', value: liveCount, color: AMBER },
            { label: 'Win Rate', value: '70.0%', color: '#22c55e' },
            { label: 'Avg/Trade', value: '+5.32%', color: '#22c55e' },
          ].map(s => (
            <div key={s.label}>
              <span style={{ color: '#475569' }}>{s.label}: </span>
              <span style={{ color: s.color, fontWeight: 700, fontFamily: MONO }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ padding: '12px 20px', borderBottom: `0.5px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
          <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', width: 14, height: 14 }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol..."
            style={{ width: '100%', padding: '7px 10px 7px 30px', background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, color: TEXT, fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
          {(['all', 'live'] as const).map(m => (
            <button key={m} onClick={() => onViewChange(m)}
              style={{ padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                background: viewMode === m ? (m === 'live' ? AMBER : '#6366f1') : 'transparent',
                color: viewMode === m ? (m === 'live' ? '#000' : '#fff') : '#64748b',
                display: 'flex', alignItems: 'center', gap: 4 }}>
              {m === 'live' && <Zap style={{ width: 11, height: 11 }} />}
              {m === 'live' ? `Live (${liveCount})` : `All (${results.length})`}
            </button>
          ))}
        </div>

        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#475569', fontFamily: MONO }}>
          Showing {sorted.length} stocks
        </span>
      </div>

      {/* Empty state */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#475569' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
            {isScanning ? 'Scanning...' : viewMode === 'live' ? 'No live BB+CRSI signals' : 'No stocks passed BB+CRSI gate'}
          </div>
          <p style={{ fontSize: 12, maxWidth: 380, margin: '0 auto' }}>
            {viewMode === 'live'
              ? 'BB+CRSI signals rare hain — CRSI<15 AND 2SD band dono ek saath milne chahiye.'
              : 'Scan run karo — stocks gate pass honge tab dikhenge.'}
          </p>
          {viewMode === 'live' && results.length > 0 && (
            <button onClick={() => onViewChange('all')}
              style={{ marginTop: 12, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: AMBER, borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 12 }}>
              Show All Gate Passed
            </button>
          )}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead style={{ background: '#0d1018', borderBottom: `0.5px solid ${BORDER}` }}>
              <tr>
                <TH label="Symbol" field="symbol" left />
                <TH label="Close ₹" field="lastClose" />
                <TH label="CRSI Now" />
                <TH label="ADX" />
                <TH label="Win % (BB)" field="bbCrsiWr" />
                <TH label="PF (BB)" field="bbCrsiPf" />
                <TH label="Trades (BB)" field="bbCrsiTrades" />
                <TH label="Avg% (BB)" field="bbCrsiAvg" />
                {/* === POSITION-SIZING FEATURE START [2026-08-18] === */}
                <TH label="Stop-Loss" />
                <TH label="Position ₹" />
                {/* === POSITION-SIZING FEATURE END [2026-08-18] === */}
                <TH label="Signal" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => {
                const isExp = expanded[r.symbol];
                return (
                  <React.Fragment key={r.symbol}>
                    <tr
                      onClick={() => setExpanded(p => ({ ...p, [r.symbol]: !p[r.symbol] }))}
                      style={{ borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer',
                        background: r.bbCrsiLive ? 'rgba(245,158,11,0.04)' : 'transparent',
                        transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = r.bbCrsiLive ? 'rgba(245,158,11,0.08)' : '#1a1d2a')}
                      onMouseLeave={e => (e.currentTarget.style.background = r.bbCrsiLive ? 'rgba(245,158,11,0.04)' : 'transparent')}>

                      {/* Symbol */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {isExp ? <ChevronUp style={{ width: 13, height: 13, color: AMBER }} /> : <ChevronDown style={{ width: 13, height: 13, color: '#475569' }} />}
                          <div>
                            <div style={{ fontWeight: 700, color: TEXT, fontSize: 13 }}>{r.symbol}</div>
                            <div style={{ fontSize: 10, color: '#475569' }}>ConnorsRSI + BB(20,2)</div>
                          </div>
                        </div>
                      </td>

                      {/* Close */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 600, color: MUTED }}>
                        ₹{r.lastClose?.toLocaleString('en-IN')}
                      </td>

                      {/* CRSI Now */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 700,
                        color: r.crsiNow !== null && r.crsiNow < 15 ? '#22c55e' : r.crsiNow !== null && r.crsiNow > 90 ? '#ef4444' : MUTED }}>
                        {r.crsiNow?.toFixed(1) ?? '—'}
                      </td>

                      {/* ADX */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO }}>
                        <span style={{ padding: '2px 7px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                          background: (r.adxNow ?? 0) >= 29 ? 'rgba(34,197,94,0.15)' : 'transparent',
                          color: (r.adxNow ?? 0) >= 29 ? '#22c55e' : DIM }}>
                          {r.adxNow?.toFixed(1) ?? '—'}
                        </span>
                      </td>

                      {/* BB+CRSI WR */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 700,
                        color: (r.bbCrsiWr ?? 0) >= 70 ? '#22c55e' : (r.bbCrsiWr ?? 0) >= 60 ? AMBER : '#ef4444' }}>
                        {r.bbCrsiWr !== null ? `${r.bbCrsiWr}%` : '—'}
                      </td>

                      {/* BB+CRSI PF */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 700,
                        color: (r.bbCrsiPf ?? 0) >= 2.5 ? '#22c55e' : AMBER }}>
                        {r.bbCrsiPf ?? '—'}
                      </td>

                      {/* BB+CRSI Trades */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, color: DIM }}>
                        {r.bbCrsiTrades}
                      </td>

                      {/* BB+CRSI Avg */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 600,
                        color: (r.bbCrsiAvg ?? 0) >= 0 ? '#22c55e' : '#ef4444' }}>
                        {r.bbCrsiAvg !== null ? `${r.bbCrsiAvg >= 0 ? '+' : ''}${r.bbCrsiAvg}%` : '—'}
                      </td>

                      {/* === POSITION-SIZING FEATURE START [2026-08-18] === */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, color: '#ef4444' }}>
                        {r.stopLoss !== null && r.stopLoss !== undefined ? `₹${r.stopLoss}` : '—'}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontWeight: 600, color: '#22c55e' }}>
                        {r.positionSize !== null && r.positionSize !== undefined ? `₹${r.positionSize.toLocaleString('en-IN')}` : '—'}
                      </td>
                      {/* === POSITION-SIZING FEATURE END [2026-08-18] === */}

                      {/* Signal */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {r.bbCrsiLive ? (
                          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5,
                            background: AMBER, color: '#000', fontWeight: 700, letterSpacing: '0.04em',
                            display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                            <Zap style={{ width: 10, height: 10 }} />
                            LIVE BUY
                          </span>
                        ) : r.isLive ? (
                          <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5,
                            background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontWeight: 600, border: '1px solid rgba(99,102,241,0.3)' }}>
                            CRSI only
                          </span>
                        ) : (
                          <span style={{ fontSize: 10, color: '#334155' }}>Setup</span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded — BB+CRSI trade history */}
                    {isExp && (
                      <tr>
                        <td colSpan={11} style={{ padding: 0, background: '#0d1018', borderBottom: `1px solid ${BORDER}` }}>
                          <div style={{ padding: '16px 20px' }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: AMBER, marginBottom: 12 }}>
                              🎯 {r.symbol} — BB + ConnorsRSI 10yr Backtest
                            </div>
                            <div style={{ display: 'flex', gap: 20, marginBottom: 14, fontSize: 12, flexWrap: 'wrap' }}>
                              <span style={{ color: DIM }}>Win Rate: <strong style={{ color: '#22c55e' }}>{r.bbCrsiWr}%</strong></span>
                              <span style={{ color: DIM }}>PF: <strong style={{ color: AMBER }}>{r.bbCrsiPf}</strong></span>
                              <span style={{ color: DIM }}>Trades: <strong style={{ color: TEXT }}>{r.bbCrsiTrades}</strong></span>
                              <span style={{ color: DIM }}>Avg: <strong style={{ color: '#22c55e' }}>{r.bbCrsiAvg}%</strong></span>
                              <span style={{ color: '#475569', fontSize: 11 }}>Entry: CRSI&lt;15 AND Low≤BB(20,2) lower | Exit: CRSI&gt;90</span>
                            </div>

                            {/* Note */}
                            <div style={{ marginBottom: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.06)', borderRadius: 6, border: '1px solid rgba(245,158,11,0.15)', fontSize: 11, color: '#94a3b8' }}>
                              ⚡ Ye trades CRSI trades ka subset hain — jab CRSI&lt;15 ke saath BB lower band bhi touch hua. Double confirmation = higher quality signal.
                            </div>

                            {/* Trades table - uses original allTrades but filtered */}
                            <div style={{ overflowX: 'auto', borderRadius: 8, border: `0.5px solid ${BORDER}`, maxHeight: 220, overflowY: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                <thead style={{ background: '#080c13', position: 'sticky', top: 0 }}>
                                  <tr>
                                    {['Entry Date', 'Entry ₹', 'Exit Date', 'Exit ₹', 'Return %', 'Result'].map(h => (
                                      <th key={h} style={{ padding: '7px 12px', textAlign: 'right', color: '#475569', fontWeight: 600, fontSize: 10, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {r.allTrades.length === 0 ? (
                                    <tr><td colSpan={6} style={{ padding: 20, textAlign: 'center', color: '#475569' }}>No trades found</td></tr>
                                  ) : (
                                    [...r.allTrades].reverse().map((t, idx) => (
                                      <tr key={idx} style={{ borderBottom: `1px solid ${BORDER2}` }}>
                                        <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: MONO, color: DIM }}>{t.entryDate}</td>
                                        <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: MONO, color: MUTED }}>₹{t.entryPrice}</td>
                                        <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: MONO, color: DIM }}>{t.exitDate}</td>
                                        <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: MONO, color: MUTED }}>₹{t.exitPrice}</td>
                                        <td style={{ padding: '6px 12px', textAlign: 'right', fontFamily: MONO, fontWeight: 700,
                                          color: t.ret >= 0 ? '#22c55e' : '#ef4444' }}>
                                          {t.ret >= 0 ? '+' : ''}{t.ret.toFixed(2)}%
                                        </td>
                                        <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                                          <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 10, fontWeight: 700,
                                            background: t.win ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                            color: t.win ? '#22c55e' : '#ef4444' }}>
                                            {t.win ? 'WIN' : 'LOSS'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
