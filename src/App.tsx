import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { ProgressBar } from './components/ProgressBar';
import { StockTable } from './components/StockTable';
import { BbCrsiTable } from './components/BbCrsiTable';
import { DarvasTable } from './components/DarvasTable';
import { StrategyInfoModal } from './components/StrategyInfoModal';
import { SettingsModal } from './components/SettingsModal';
import { StockResult, DarvasResult, ScanProgress, ScanStats, FilterMode } from './types';
import { Play, Square, RotateCcw, Zap, Filter } from 'lucide-react';

export default function App() {
  const [allResults, setAllResults]   = useState<StockResult[]>([]);
  const [isScanning, setIsScanning]   = useState<boolean>(false);
  const [progress, setProgress]       = useState<ScanProgress>({ scanned: 0, total: 500, currentSymbol: '' });
  const [filterMode, setFilterMode]   = useState<FilterMode>('strict');
  const [stats, setStats]             = useState<ScanStats>({
    universe: 500, scanned: 0, gatePassed: 0, liveSignalCount: 0,
  });
  const [viewMode, setViewMode]           = useState<'live' | 'all'>('all');
  const [customSymbols, setCustomSymbols] = useState<string>('');
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'crsi' | 'bbcrsi' | 'darvas'>('crsi');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // ── Darvas Box module state (separate scan pipeline) ──
  const [darvasResults, setDarvasResults]     = useState<DarvasResult[]>([]);
  const [isDarvasScanning, setIsDarvasScanning] = useState<boolean>(false);
  const [darvasProgress, setDarvasProgress]   = useState<ScanProgress>({ scanned: 0, total: 500, currentSymbol: '' });
  const [darvasScanned, setDarvasScanned]     = useState<number>(0);
  const [darvasLastRun, setDarvasLastRun]     = useState<string | undefined>(undefined);
  const darvasEventSourceRef = useRef<EventSource | null>(null);

  const PRESETS: Record<FilterMode, { crsi: number; adx: number }> = {
    strict:  { crsi: 10, adx: 29 },
    lenient: { crsi: 15, adx: 20 },
  };

  useEffect(() => {
    fetch('/api/stocks-count').then(r => r.json()).then(d => {
      if (d?.count) {
        setStats(prev => ({ ...prev, universe: d.count }));
        setProgress(prev => ({ ...prev, total: d.count }));
      }
    }).catch(() => {});
  }, []);

  const stopScan = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setIsScanning(false);
  };

  const startScan = (mode?: FilterMode) => {
    if (isScanning) return;
    const activeMode = mode || filterMode;
    const preset = PRESETS[activeMode];
    setAllResults([]);
    setIsScanning(true);
    setProgress({ scanned: 0, total: stats.universe || 500, currentSymbol: '' });
    setStats(prev => ({ ...prev, scanned: 0, gatePassed: 0, liveSignalCount: 0 }));

    let query = `?crsiLimit=${preset.crsi}&adxMin=${preset.adx}&mode=${activeMode}`;
    if (customSymbols.trim()) query += `&symbols=${encodeURIComponent(customSymbols.trim())}`;

    const es = new EventSource(`/api/scan${query}`);
    eventSourceRef.current = es;
    let gateCount = 0, liveCount = 0;

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'start') {
          setProgress(prev => ({ ...prev, total: msg.total }));
          setStats(prev => ({ ...prev, universe: msg.total }));
        } else if (msg.type === 'progress') {
          setProgress(prev => ({ ...prev, scanned: msg.i, total: msg.total, currentSymbol: msg.sym }));
          setStats(prev => ({ ...prev, scanned: msg.i }));
        } else if (msg.type === 'result') {
          gateCount++;
          if (msg.isLive) liveCount++;
          setStats(prev => ({ ...prev, gatePassed: gateCount, liveSignalCount: liveCount }));
          setAllResults(prev => [...prev, msg]);
        } else if (msg.type === 'done') {
          setIsScanning(false);
          es.close();
          eventSourceRef.current = null;
          setStats(prev => ({
            ...prev,
            lastRunTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }));
        }
      } catch (err) { console.error('SSE error', err); }
    };
    es.onerror = () => { setIsScanning(false); eventSourceRef.current?.close(); eventSourceRef.current = null; };
  };

  const clearAll = () => {
    stopScan();
    setAllResults([]);
    setProgress({ scanned: 0, total: stats.universe, currentSymbol: '' });
    setStats(prev => ({ ...prev, scanned: 0, gatePassed: 0, liveSignalCount: 0, lastRunTime: undefined }));
  };

  // ── Darvas Box scan ──
  const stopDarvasScan = () => {
    darvasEventSourceRef.current?.close();
    darvasEventSourceRef.current = null;
    setIsDarvasScanning(false);
  };

  const startDarvasScan = () => {
    if (isDarvasScanning) return;
    setDarvasResults([]);
    setIsDarvasScanning(true);
    setDarvasProgress({ scanned: 0, total: stats.universe || 500, currentSymbol: '' });
    setDarvasScanned(0);

    let query = '';
    if (customSymbols.trim()) query = `?symbols=${encodeURIComponent(customSymbols.trim())}`;

    const es = new EventSource(`/api/scan-darvas${query}`);
    darvasEventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'start') {
          setDarvasProgress(prev => ({ ...prev, total: msg.total }));
        } else if (msg.type === 'progress') {
          setDarvasProgress(prev => ({ ...prev, scanned: msg.i, total: msg.total, currentSymbol: msg.sym }));
          setDarvasScanned(msg.i);
        } else if (msg.type === 'result') {
          setDarvasResults(prev => [...prev, msg]);
        } else if (msg.type === 'done') {
          setIsDarvasScanning(false);
          es.close();
          darvasEventSourceRef.current = null;
          setDarvasLastRun(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      } catch (err) { console.error('SSE error', err); }
    };
    es.onerror = () => { setIsDarvasScanning(false); darvasEventSourceRef.current?.close(); darvasEventSourceRef.current = null; };
  };

  const clearDarvas = () => {
    stopDarvasScan();
    setDarvasResults([]);
    setDarvasProgress({ scanned: 0, total: stats.universe, currentSymbol: '' });
    setDarvasScanned(0);
    setDarvasLastRun(undefined);
  };

  const switchMode = (mode: FilterMode) => {
    setFilterMode(mode);
    if (isScanning) { stopScan(); clearAll(); }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f1117', color: '#f1f5f9' }}>
      <Header
        onOpenStrategyInfo={() => setIsStrategyModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        isScanning={isScanning}
        onStartScan={() => startScan()}
        filterMode={filterMode}
      />
      <StatsBar stats={stats} filterMode={filterMode} />

      <main className="flex-1 max-w-7xl w-full mx-auto py-6 px-4 md:px-8">
        {/* Control Card */}
        <div className="mb-5 rounded-xl overflow-hidden" style={{ background: '#161b27', border: '0.5px solid #2a2d3a' }}>
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderBottom: '0.5px solid #2a2d3a' }}>
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#f1f5f9' }}>Quantitative NSE Equity Screener</h2>
              <p className="text-xs mt-0.5" style={{ color: '#94a3b8' }}>ConnorsRSI(3,2,100) · ADX(14) · EMA(200) · Nifty 500 · Gate Filter Engine</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {activeTab === 'darvas' ? (
                isDarvasScanning ? (
                  <button onClick={stopDarvasScan}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                    <Square className="w-3.5 h-3.5 fill-white" /> Stop
                  </button>
                ) : (
                  <button onClick={startDarvasScan}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ background: '#f59e0b', color: '#000', border: 'none' }}>
                    <Play className="w-3.5 h-3.5 fill-black" /> Run scan
                  </button>
                )
              ) : (
                isScanning ? (
                  <button onClick={stopScan}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ background: '#ef4444', color: 'white', border: 'none' }}>
                    <Square className="w-3.5 h-3.5 fill-white" /> Stop
                  </button>
                ) : (
                  <button onClick={() => startScan()}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ background: '#6366f1', color: 'white', border: 'none' }}>
                    <Play className="w-3.5 h-3.5 fill-white" /> Run scan
                  </button>
                )
              )}
              <button onClick={activeTab === 'darvas' ? clearDarvas : clearAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                style={{ background: 'transparent', color: '#64748b', border: '0.5px solid #2a2d3a' }}>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Filter mode buttons — only relevant to the CRSI-based modules */}
          {activeTab !== 'darvas' && (
          <div className="p-4 flex flex-col sm:flex-row gap-3">
            <button onClick={() => switchMode('strict')}
              className="flex-1 p-4 rounded-lg text-left cursor-pointer transition-all"
              style={{
                background: filterMode === 'strict' ? '#6366f1' : 'rgba(99,102,241,0.05)',
                border: filterMode === 'strict' ? '0.5px solid #6366f1' : '0.5px solid #2a2d3a',
              }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Zap className="w-4 h-4" style={{ color: filterMode === 'strict' ? 'white' : '#6366f1' }} />
                <span className="text-sm font-semibold" style={{ color: filterMode === 'strict' ? 'white' : '#818cf8' }}>Strict filter</span>
                {filterMode === 'strict' && <span className="ml-auto text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Active</span>}
              </div>
              <p className="text-[11px] font-mono" style={{ color: filterMode === 'strict' ? 'rgba(255,255,255,0.9)' : '#94a3b8' }}>
                CRSI &lt; 10 · ADX ≥ 29 · PF ≥ 2.0
              </p>
              <p className="text-[11px] mt-1" style={{ color: filterMode === 'strict' ? 'rgba(255,255,255,0.7)' : '#64748b' }}>
                Fewer, higher-quality setups
              </p>
            </button>

            <button onClick={() => switchMode('lenient')}
              className="flex-1 p-4 rounded-lg text-left cursor-pointer transition-all"
              style={{
                background: filterMode === 'lenient' ? '#6366f1' : 'rgba(99,102,241,0.05)',
                border: filterMode === 'lenient' ? '0.5px solid #6366f1' : '0.5px solid #2a2d3a',
              }}>
              <div className="flex items-center gap-2 mb-1.5">
                <Filter className="w-4 h-4" style={{ color: filterMode === 'lenient' ? 'white' : '#6366f1' }} />
                <span className="text-sm font-semibold" style={{ color: filterMode === 'lenient' ? 'white' : '#818cf8' }}>Lenient filter</span>
                {filterMode === 'lenient' && <span className="ml-auto text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>Active</span>}
              </div>
              <p className="text-[11px] font-mono" style={{ color: filterMode === 'lenient' ? 'rgba(255,255,255,0.9)' : '#94a3b8' }}>
                CRSI &lt; 15 · ADX &gt; 20 · PF ≥ 1.5
              </p>
              <p className="text-[11px] mt-1" style={{ color: filterMode === 'lenient' ? 'rgba(255,255,255,0.7)' : '#64748b' }}>
                More stocks, broader opportunity
              </p>
            </button>
          </div>
          )}
        </div>

        <ProgressBar progress={activeTab === 'darvas' ? darvasProgress : progress} isScanning={activeTab === 'darvas' ? isDarvasScanning : isScanning} />

        {/* Module Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #2a2d3a', marginBottom: 0 }}>
          <button
            onClick={() => setActiveTab('crsi')}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === 'crsi' ? '#161b27' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'crsi' ? '2px solid #6366f1' : '2px solid transparent',
              color: activeTab === 'crsi' ? '#f1f5f9' : '#64748b',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.15s',
            }}>
            📊 ConnorsRSI
            <span style={{ marginLeft: 6, background: activeTab === 'crsi' ? 'rgba(99,102,241,0.2)' : '#1e2030', borderRadius: 10, padding: '1px 7px', fontSize: 11, color: activeTab === 'crsi' ? '#818cf8' : '#475569' }}>
              {allResults.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('bbcrsi')}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === 'bbcrsi' ? '#161b27' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'bbcrsi' ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === 'bbcrsi' ? '#f1f5f9' : '#64748b',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.15s',
            }}>
            🎯 BB + ConnorsRSI
            <span style={{ marginLeft: 6, background: activeTab === 'bbcrsi' ? 'rgba(245,158,11,0.2)' : '#1e2030', borderRadius: 10, padding: '1px 7px', fontSize: 11, color: activeTab === 'bbcrsi' ? '#f59e0b' : '#475569' }}>
              {allResults.filter(r => r.bbCrsiGate).length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('darvas')}
            style={{
              padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              background: activeTab === 'darvas' ? '#161b27' : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'darvas' ? '2px solid #f59e0b' : '2px solid transparent',
              color: activeTab === 'darvas' ? '#f1f5f9' : '#64748b',
              borderRadius: '8px 8px 0 0',
              transition: 'all 0.15s',
            }}>
            📦 Darvas Box
            <span style={{ marginLeft: 6, background: activeTab === 'darvas' ? 'rgba(245,158,11,0.2)' : '#1e2030', borderRadius: 10, padding: '1px 7px', fontSize: 11, color: activeTab === 'darvas' ? '#f59e0b' : '#475569' }}>
              {darvasResults.filter(r => r.pending).length}
            </span>
          </button>
        </div>

        {activeTab === 'crsi' ? (
          <StockTable
            results={allResults}
            viewMode={viewMode}
            onViewChange={setViewMode}
            isScanning={isScanning}
            crsiLimit={PRESETS[filterMode].crsi}
          />
        ) : activeTab === 'bbcrsi' ? (
          <BbCrsiTable
            results={allResults.filter(r => r.bbCrsiGate)}
            viewMode={viewMode}
            onViewChange={setViewMode}
            isScanning={isScanning}
          />
        ) : (
          <DarvasTable
            results={darvasResults}
            isScanning={isDarvasScanning}
          />
        )}
      </main>

      <footer className="py-4 px-6 text-center text-[11px]" style={{ color: '#1e2234', borderTop: '0.5px solid #161b27' }}>
        NSE ConnorsRSI Quantitative Engine · Nifty 500 · Yahoo Finance · Educational use only
      </footer>

      <StrategyInfoModal isOpen={isStrategyModalOpen} onClose={() => setIsStrategyModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} customSymbols={customSymbols} setCustomSymbols={setCustomSymbols} />
    </div>
  );
}
