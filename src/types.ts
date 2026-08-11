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

export interface DarvasResult {
  symbol: string;
  date: string;
  timestamp: string;
  lastClose: number;
  boxTop: number | null;
  boxBottom: number | null;
  pending: boolean;
  distanceToBreakout: number | null; // % away from box top, only set when pending
  totalReturn: number;               // compounded historical return, used to rank best performers
  winRate: number;
  pf: number;
  avgReturn: number;
  maxdd: number;
  wins: number;
  losses: number;
  trades: number;
  allTrades: TradeLog[];
}

export interface DarvasStats {
  universe: number;
  scanned: number;
  pendingCount: number;
  lastRunTime?: string;
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