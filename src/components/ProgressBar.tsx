import React from 'react';
import { ScanProgress } from '../types';
import { Loader2 } from 'lucide-react';

const SURFACE = '#161b27';
const BORDER = '#2a2d3a';
const PURPLE = '#6366f1';
const DIM = '#94a3b8';

export const ProgressBar: React.FC<{ progress: ScanProgress; isScanning: boolean; statusText?: string }> = ({ progress, isScanning, statusText }) => {
  if (!isScanning && !statusText) return null;
  const pct = progress.total > 0 ? Math.min(100, Math.round((progress.scanned / progress.total) * 100)) : 0;
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isScanning ? <Loader2 size={15} color={PURPLE} style={{ animation: 'spin 1s linear infinite' }} /> : <span style={{ width: 8, height: 8, borderRadius: '50%', background: BORDER, display: 'inline-block' }}></span>}
          <span style={{ fontSize: 12, fontWeight: 500, color: '#cbd5e1' }}>{isScanning ? 'Fetching & backtesting NSE universe...' : 'Scan complete'}</span>
        </div>
        <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#cbd5e1' }}>{progress.scanned} / {progress.total} ({pct}%)</span>
      </div>
      <div style={{ width: '100%', height: 5, borderRadius: 99, background: '#0d1018', overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', width: `${pct}%`, transition: 'width 0.3s ease' }}></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: DIM }}>
        <span>{progress.currentSymbol ? <>Analyzing <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#818cf8', fontWeight: 600 }}>{progress.currentSymbol}.NS</span></> : statusText || 'Ready'}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: DIM }}>CRSI(3,2,100) + Gate filter</span>
      </div>
    </div>
  );
};
