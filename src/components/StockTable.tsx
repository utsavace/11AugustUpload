import React, { useState } from 'react';
import { StockResult } from '../types';
import { ChevronDown, ChevronUp, Search, Download, Flame, Eye, TrendingUp, CheckCircle, XCircle, ExternalLink } from 'lucide-react';

const BG = '#0f1117';
const SURFACE = '#161b27';
const CARD = '#1e2030';
const BORDER = '#2a2d3a';
const BORDER2 = '#1a1d2a';
const PURPLE = '#6366f1';
const TEXT = '#f8fafc';
const MUTED = '#cbd5e1';
const DIM = '#94a3b8';
const MONO = 'JetBrains Mono, monospace';

type SortField = 'crsiNow' | 'winRate' | 'pf' | 'avgReturn' | 'maxdd' | 'symbol' | 'lastClose';

export const StockTable: React.FC<{
  results: StockResult[]; viewMode: 'live' | 'all';
  onViewChange: (m: 'live' | 'all') => void; isScanning: boolean; crsiLimit: number;
}> = ({ results, viewMode, onViewChange, isScanning, crsiLimit }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('crsiNow');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (f: SortField) => { if (sortField === f) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(f === 'symbol' || f === 'crsiNow' || f === 'maxdd'); } };

  const filtered = results.filter(r => r.symbol.toLowerCase().includes(search.toLowerCase()) && (viewMode === 'live' ? r.isLive : true));
  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortField], vb = b[sortField];
    if (va == null) return 1; if (vb == null) return -1;
    if (typeof va === 'string') return sortAsc ? va.localeCompare(String(vb)) : String(vb).localeCompare(va);
    return sortAsc ? Number(va) - Number(vb) : Number(vb) - Number(va);
  });

  const exportCSV = () => {
    if (!sorted.length) return;
    const h = ['Symbol','Date','Close','CRSI','Min CRSI Ever','ADX','EMA200','Win%','PF','Trades','AvgReturn%','MaxDD%','Status'];
    const r = sorted.map(r => [r.symbol,r.date,r.lastClose,r.crsiNow??'',r.minCrsiEver??'',r.adxNow??'',r.ema200Now??'',r.winRate,r.pf,r.trades,r.avgReturn,r.maxdd,r.isLive?'LIVE':'SETUP']);
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURI([h,...r].map(x=>x.join(',')).join('\n'));
    a.download = `nse_crsi_${viewMode}_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const TH = ({ label, field, left }: { label: string; field?: SortField; left?: boolean }) => (
    <th onClick={() => field && handleSort(field)} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 500, color: field && sortField === field ? '#818cf8' : DIM, textAlign: left ? 'left' : 'right', cursor: field ? 'pointer' : 'default', userSelect: 'none', whiteSpace: 'nowrap' }}>
      {label} {field && <span style={{ opacity: 0.4, fontSize: 9 }}>↕</span>}
    </th>
  );

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {([['live', <Flame size={13}/>, 'Live signals only'], ['all', null, `All gate passed (${results.length})`]] as const).map(([mode, icon, label]) => {
            const active = viewMode === mode;
            return (
              <button key={mode} onClick={() => onViewChange(mode as 'live' | 'all')} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid',
                background: active ? (mode === 'live' ? 'rgba(245,158,11,0.12)' : 'rgba(99,102,241,0.12)') : 'transparent',
                color: active ? (mode === 'live' ? '#f59e0b' : '#818cf8') : MUTED,
                borderColor: active ? (mode === 'live' ? 'rgba(245,158,11,0.3)' : 'rgba(99,102,241,0.3)') : BORDER,
              }}>
                {icon} {label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: DIM }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search symbol..." style={{ paddingLeft: 30, paddingRight: 10, paddingTop: 7, paddingBottom: 7, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, fontFamily: MONO, color: '#94a3b8', width: 180, outline: 'none' }} />
          </div>
          <button onClick={exportCSV} disabled={!sorted.length} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'transparent', color: MUTED, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 12, cursor: 'pointer', opacity: sorted.length ? 1 : 0.3 }}>
            <Download size={13} color={PURPLE} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#0d1018', borderBottom: `1px solid ${BORDER}` }}>
                <TH label="Ticker" field="symbol" left />
                <TH label="Date / Time" field="date" left />
                <TH label="Close" field="lastClose" />
                <TH label="Exit rule" />
                <TH label="CRSI" field="crsiNow" />
                <TH label="Min CRSI Ever" field="minCrsiEver" />
                <TH label="ADX" />
                <TH label="Win %" field="winRate" />
                <TH label="PF" field="pf" />
                <TH label="Trades" />
                <TH label="Avg ret" field="avgReturn" />
                <TH label="Max DD" field="maxdd" />
                <TH label="Status" />
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={13} style={{ padding: '60px 20px', textAlign: 'center' }}>
                    <div style={{ maxWidth: 300, margin: '0 auto' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: CARD, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        {isScanning ? <Flame size={20} color={PURPLE} style={{ animation: 'pulse 1.5s infinite' }} /> : <Eye size={20} color={DIM} />}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>
                        {isScanning ? 'Scanning NSE universe...' : viewMode === 'live' ? 'No live signals today' : 'Run a scan to see results'}
                      </div>
                      <div style={{ fontSize: 11, color: DIM, lineHeight: 1.6 }}>
                        {isScanning ? 'Fetching and backtesting daily OHLC data' : viewMode === 'live' ? 'CRSI < 10, ADX > 29, Close > EMA(200)' : 'Click "Run scan" to start screening'}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : sorted.map(r => {
                const isExp = !!expanded[r.symbol];
                const crsiVal = r.crsiNow;
                const isOversold = crsiVal !== null && crsiVal < crsiLimit;

                return (
                  <React.Fragment key={r.symbol}>
                    <tr onClick={() => setExpanded(p => ({ ...p, [r.symbol]: !p[r.symbol] }))} style={{ borderBottom: `1px solid ${BORDER2}`, cursor: 'pointer', background: r.isLive ? 'rgba(245,158,11,0.03)' : 'transparent', transition: 'background 0.1s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = r.isLive ? 'rgba(245,158,11,0.07)' : '#1a1d2a')}
                      onMouseLeave={e => (e.currentTarget.style.background = r.isLive ? 'rgba(245,158,11,0.03)' : 'transparent')}>

                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT, fontStyle: 'italic' }}>{r.symbol}</span>
                          <a href={`https://finance.yahoo.com/quote/${r.symbol}.NS`} target="_blank" rel="noreferrer"
                            onClick={e => e.stopPropagation()} style={{ color: BORDER, display: 'flex' }}
                            onMouseEnter={e => (e.currentTarget.style.color = PURPLE)}
                            onMouseLeave={e => (e.currentTarget.style.color = BORDER)}>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'left', fontFamily: MONO }}>
                        <div style={{ fontSize: 12, color: MUTED }}>{r.date}</div>
                        <div style={{ fontSize: 10, color: DIM, marginTop: 2 }}>{r.timestamp}</div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, color: MUTED }}>₹{r.lastClose.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 11, color: DIM }}>CRSI&gt;90</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 700, padding: isOversold ? '2px 8px' : '0', borderRadius: 5, background: isOversold ? PURPLE : 'transparent', color: isOversold ? 'white' : crsiVal !== null && crsiVal < 30 ? '#818cf8' : MUTED }}>
                          {crsiVal !== null ? crsiVal.toFixed(2) : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, color: MUTED }}>{r.minCrsiEver !== null ? r.minCrsiEver.toFixed(2) : '—'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, color: r.adxNow !== null && r.adxNow > 29 ? '#22c55e' : DIM }}>{r.adxNow !== null ? r.adxNow.toFixed(1) : '—'}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, fontWeight: 600, color: r.winRate >= 70 ? '#22c55e' : r.winRate >= 60 ? '#f59e0b' : '#ef4444' }}>{r.winRate}%</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, fontWeight: 600, color: r.pf >= 2.5 ? '#22c55e' : '#f59e0b' }}>{r.pf}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, color: DIM }}>{r.trades}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, fontWeight: 600, color: r.avgReturn >= 0 ? '#22c55e' : '#ef4444' }}>{r.avgReturn >= 0 ? '+' : ''}{r.avgReturn}%</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontFamily: MONO, fontSize: 12, color: MUTED }}>-{r.maxdd}%</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                          {r.isLive
                            ? <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: '#f59e0b', color: '#000', fontWeight: 700, letterSpacing: '0.04em' }}>LIVE BUY</span>
                            : <span style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, border: `1px solid ${BORDER}`, color: DIM, fontWeight: 500 }}>SETUP</span>}
                          {isExp ? <ChevronUp size={15} color={PURPLE} /> : <ChevronDown size={15} color={DIM} />}
                        </div>
                      </td>
                    </tr>

                    {isExp && (
                      <tr style={{ background: '#0d1018', borderBottom: `1px solid ${BORDER}` }}>
                        <td colSpan={11} style={{ padding: 20 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {/* Stat cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                              {[
                                ['Last close', `₹${r.lastClose}`, '#94a3b8', null],
                                ['EMA(200)', `₹${r.ema200Now ?? '—'}`, r.ema200Now && r.lastClose > r.ema200Now ? '#22c55e' : '#ef4444', r.ema200Now && r.lastClose > r.ema200Now ? '▲ Above' : '▼ Below'],
                                ['CRSI now', String(r.crsiNow ?? '—'), '#818cf8', 'Buy zone < 10'],
                                ['ADX now', String(r.adxNow ?? '—'), '#22c55e', 'Min > 29'],
                                ['Score', `${r.wins}W / ${r.losses}L`, TEXT, `WR: ${r.winRate}% · PF: ${r.pf}`],
                              ].map(([label, val, color, sub]) => (
                                <div key={String(label)} style={{ padding: 12, borderRadius: 8, background: SURFACE, border: `1px solid ${BORDER}` }}>
                                  <div style={{ fontSize: 10, color: DIM, marginBottom: 6 }}>{label}</div>
                                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 13, color: String(color) }}>{val}</div>
                                  {sub && <div style={{ fontSize: 10, color: label === 'EMA(200)' ? String(color) : DIM, marginTop: 3 }}>{sub}</div>}
                                </div>
                              ))}
                            </div>

                            {/* Trade log */}
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: TEXT }}>
                                  <TrendingUp size={13} color={PURPLE} /> Last 15 backtest trades
                                </div>
                                <span style={{ fontSize: 10, fontFamily: MONO, color: DIM }}>Buy next open CRSI&lt;10 · Exit next open CRSI&gt;90</span>
                              </div>
                              {r.allTrades?.length > 0 ? (
                                <div style={{ borderRadius: 8, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, fontFamily: MONO }}>
                                    <thead>
                                      <tr style={{ background: '#0a0d14', borderBottom: `1px solid ${BORDER}` }}>
                                        {['Entry date','Exit date','Entry ₹','Exit ₹','Return %','Result'].map(h => (
                                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: DIM, fontWeight: 500 }}>{h}</th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {[...r.allTrades].reverse().map((t, i) => (
                                        <tr key={i} style={{ borderBottom: `1px solid #13161f` }}>
                                          <td style={{ padding: '8px 12px', color: MUTED }}>{t.entryDate}</td>
                                          <td style={{ padding: '8px 12px', color: MUTED }}>{t.exitDate}</td>
                                          <td style={{ padding: '8px 12px', color: DIM }}>₹{t.entryPrice}</td>
                                          <td style={{ padding: '8px 12px', color: DIM }}>₹{t.exitPrice}</td>
                                          <td style={{ padding: '8px 12px', fontWeight: 700, color: t.win ? '#22c55e' : '#ef4444' }}>{t.win ? '+' : ''}{t.ret}%</td>
                                          <td style={{ padding: '8px 12px' }}>
                                            {t.win
                                              ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22c55e', fontWeight: 700 }}><CheckCircle size={12} /> WIN</span>
                                              : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', fontWeight: 700 }}><XCircle size={12} /> LOSS</span>}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div style={{ padding: 16, textAlign: 'center', fontSize: 12, color: DIM, background: SURFACE, borderRadius: 8, border: `1px solid ${BORDER}` }}>No completed trades in recent window</div>
                              )}
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
      </div>
    </div>
  );
};
