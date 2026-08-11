export interface TradeLog {
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  ret: number;
  win: boolean;
}

export interface StockResult {
  symbol: string;
  date: string;
  timestamp: string;
  minCrsiEver: number | null;
  lastClose: number;
  crsiNow: number | null;
  adxNow: number | null;
  ema200Now: number | null;
  winRate: number;
  pf: number;
  avgReturn: number;
  maxdd: number;
  wins: number;
  losses: number;
  trades: number;
  isLive: boolean;
  // BB + ConnorsRSI fields
  bbCrsiGate: boolean;
  bbCrsiLive: boolean;
  bbCrsiWr: number | null;
  bbCrsiPf: number | null;
  bbCrsiTrades: number;
  bbCrsiAvg: number | null;
  allTrades: TradeLog[];
}

export interface ScanProgress {
  scanned: number;
  total: number;
  currentSymbol: string;
}

export interface ScanStats {
  universe: number;
  scanned: number;
  gatePassed: number;
  liveSignalCount: number;
  lastRunTime?: string;
}

export type FilterMode = 'strict' | 'lenient';