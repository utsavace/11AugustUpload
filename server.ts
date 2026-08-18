import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.use(express.json());

// ─── NIFTY 500 STOCKS UNIVERSE ───
export const STOCKS = [
"ACMESOLAR", "3MINDIA", "360ONE", "ACC", "AIAENG", "ABB", "APLAPOLLO", "AUBANK", "AWL", "AADHARHFC",
  "AAVAS", "AARTIIND", "ABBOTINDIA", "ACUTAAS", "ADANIENSOL", "ACE", "ADANIGREEN", "ADANIENT", "ADANIPORTS", "ADANIPOWER",
  "ATGL", "ABCAPITAL", "ABFRL", "ABLBL", "ABSLAMC", "CPPLUS", "ABREL", "AEGISVOPAK", "AFCONS", "AEGISLOG",
  "AFFLE", "AJANTPHARM", "ABDL", "ALKEM", "ARE&M", "AMBER", "AMBUJACEM", "ANANDRATHI", "ANGELONE", "ANTHEM",
  "ANANTRAJ", "ANURAS", "APOLLOHOSP", "APTUS", "APARINDS", "APOLLOTYRE", "ASAHIINDIA", "ASHOKLEY", "ASTERDM", "ATHERENERG",
  "ASIANPAINT", "ASTRAL", "ATUL", "AUROPHARMA", "AIIL", "DMART", "AXISBANK", "BLS", "BAJAJ-AUTO", "BEML",
  "BSE", "BAJFINANCE", "BAJAJFINSV", "BAJAJHLDNG", "BAJAJHFL", "BALRAMCHIN", "BANDHANBNK", "BALKRISIND", "BANKBARODA", "MAHABANK",
  "BANKINDIA", "BELRISE", "BATAINDIA", "BAYERCROP", "BERGEPAINT", "BDL", "BEL", "BHARATFORG", "BHEL", "BPCL",
  "BHARTIARTL", "BHARTIHEXA", "BIKAJI", "GROWW", "BIOCON", "BSOFT", "BLUEDART", "BLUEJET", "BLUESTARCO", "BBTC",
  "FIRSTCRY", "BOSCHLTD", "BRIGADE", "BRITANNIA", "MAPMYINDIA", "CCL", "CESC", "CGPOWER", "CIEINDIA", "CRISIL",
  "CANFINHOME", "CANHLIFE", "CANBK", "CAPLIPOINT", "CGCL", "CARTRADE", "CARBORUNIV", "CEATLTD", "CASTROLIND", "CEMPRO",
  "CENTRALBK", "CDSL", "CHALET", "CHAMBLFERT", "CHENNPETRO", "CHOICEIN", "CHOLAHLDNG", "CHOLAFIN", "CIPLA", "CUB",
  "CLEAN", "COALINDIA", "COCHINSHIP", "COHANCE", "COFORGE", "CAMS", "COLPAL", "CONCORDBIO", "COROMANDEL", "CONCOR",
  "CRAFTSMAN", "CREDITACC", "CROMPTON", "CUMMINSIND", "CYIENT", "DCMSHRIRAM", "DLF", "DOMS", "DALBHARAT", "DABUR",
  "DATAPATTNS", "DELHIVERY", "DEEPAKNTR", "DEEPAKFERT", "DEVYANI", "DIVISLAB", "DIXON", "LALPATHLAB", "DRREDDY", "EIDPARRY",
  "EIHOTEL", "EICHERMOT", "ELECON", "ELGIEQUIP", "EMCURE", "EMAMILTD", "EMMVEE", "ENDURANCE", "ERIS", "ENGINERSIN",
  "ETERNAL", "ESCORTS", "EXIDEIND", "NYKAA", "FACT", "FINCABLES", "FEDERALBNK", "FSL", "FIVESTAR", "FORCEMOT",
  "FORTIS", "GMRAIRPORT", "GAIL", "GVT&D", "GABRIEL", "GALLANTT", "GRSE", "GICRE", "GLAND", "GILLETTE",
  "GLAXO", "GLENMARK", "MEDANTA", "GODIGIT", "GPIL", "GODFRYPHLP", "GODREJCP", "GODREJIND", "GODREJPROP", "GRANULES",
  "GRAPHITE", "GRAVITA", "GRASIM", "GESHIP", "FLUOROCHEM", "GMDCLTD", "HEG", "HBLENGINE", "HDBFS", "HCLTECH",
  "HDFCAMC", "HDFCBANK", "HDFCLIFE", "HFCL", "HAVELLS", "HEXT", "HEROMOTOCO", "HSCL", "HINDALCO", "HAL",
  "HINDCOPPER", "HINDPETRO", "HINDUNILVR", "HINDZINC", "POWERINDIA", "HOMEFIRST", "HONASA", "HONAUT", "HUDCO", "HYUNDAI",
  "ICICIAMC", "ICICIGI", "ICICIBANK", "ICICIPRULI", "IDBI", "IDFCFIRSTB", "IFCI", "IIFL", "IRB", "IRCON",
  "ITCHOTELS", "ITI", "INDGN", "ITC", "INDIACEM", "INDIAMART", "INDIANB", "IEX", "INDHOTEL", "IOC",
  "IOB", "IRCTC", "IRFC", "IREDA", "IGL", "INDUSTOWER", "NAUKRI", "INDUSINDBK", "INFY", "INOXWIND",
  "INTELLECT", "INDIGO", "IGIL", "IKS", "IPCALAB", "JKCEMENT", "JBMA", "JSWCEMENT", "JKTYRE", "JMFINANCIL",
  "JSWDULUX", "JSWINFRA", "JAINREC", "JSWENERGY", "JSWSTEEL", "JPPOWER", "J&KBANK", "JINDALSAW", "JSL", "JIOFIN",
  "JINDALSTEL", "JUBLFOOD", "JUBLINGREA", "JYOTICNC", "JUBLPHARMA", "JWL", "KPRMILL", "KEI", "KPITTECH", "KAJARIACER",
  "KALYANKJIL", "KPIL", "KAYNES", "KARURVYSYA", "KEC", "KFINTECH", "KIMS", "KIRLOSENG", "KOTAKBANK", "LTF",
  "LTTS", "LGEINDIA", "LICHSGFIN", "LTFOODS", "LTM", "LT", "LATENTVIEW", "LAURUSLABS", "THELEELA", "LENSKART",
  "LEMONTREE", "LICI", "LINDEINDIA", "LLOYDSME", "LODHA", "LUPIN", "MMTC", "MRF", "MGL", "M&MFIN",
  "M&M", "MANAPPURAM", "MRPL", "MANKIND", "MARICO", "MARUTI", "MFSL", "MEESHO", "MAXHEALTH", "MAZDOCK",
  "MINDACORP", "MSUMI", "MOTILALOFS", "MPHASIS", "MCX", "MUTHOOTFIN", "NATCOPHARM", "NBCC", "NCC", "NHPC",
  "NLCINDIA", "NMDC", "NSLNISP", "NTPCGREEN", "NTPC", "NH", "NATIONALUM", "NAVA", "NAVINFLUOR", "NESTLEIND",
  "NETWEB", "NEULANDLAB", "NEWGEN", "NAM-INDIA", "NIVABUPA", "NUVAMA", "NUVOCO", "OBEROIRLTY", "ONGC", "OLAELEC",
  "OIL", "OLECTRA", "PAYTM", "ONESOURCE", "POLICYBZR", "OFSS", "PCBL", "PGEL", "PIIND", "PNBHOUSING",
  "PTCIL", "PVRINOX", "PAGEIND", "PARADEEP", "PATANJALI", "PERSISTENT", "PETRONET", "PWL", "PFIZER", "PHOENIXLTD",
  "PIDILITIND", "PINELABS", "PIRAMALFIN", "PPLPHARMA", "POLYMED", "POLYCAB", "PFC", "POONAWALLA", "POWERGRID", "PREMIERENE",
  "PFOCUS", "PRESTIGE", "RRKABEL", "PNB", "RBLBANK", "RECLTD", "RITES", "RHIM", "RADICO", "RVNL",
  "RAILTEL", "RAINBOW", "RKFORGE", "REDINGTON", "SBFC", "RPOWER", "RELIANCE", "SBICARD", "SBILIFE", "SJVN",
  "SAGILITY", "SAILIFE", "SRF", "SAMMAANCAP", "SAPPHIRE", "MOTHERSON", "SARDAEN", "SAREGAMA", "SCHAEFFLER", "SCHNEIDER",
  "SCI", "SHREECEM", "SHYAMMETL", "ENRIN", "SHRIRAMFIN", "SIEMENS", "SIGNATURE", "SOBHA", "SONACOMS", "SOLARINDS",
  "SONATSOFTW", "STARHEALTH", "SBIN", "SUMICHEM", "SAIL", "SUNPHARMA", "SUNDARMFIN", "SUNTV", "SUPREMEIND", "SPLPETRO",
  "SUZLON", "SWANCORP", "SWIGGY", "SYNGENE", "SYRMA", "TBOTEK", "TVSMOTOR", "TATACAP", "TATACHEM", "TATACOMM",
  "TATACONSUM", "TCS", "TMCV", "TATAELXSI", "TATAINVEST", "TMPV", "TATATECH", "TATAPOWER", "TATASTEEL", "TTML",
  "TECHM", "TECHNOE", "TEGA", "TEJASNET", "TENNIND", "NIACL", "RAMCOCEM", "THERMAX", "TIMKEN", "TITAGARH",
  "TITAN", "TORNTPHARM", "TORNTPOWER", "TARIL", "TRAVELFOOD", "TRENT", "TRIDENT", "TRITURBINE", "TIINDIA", "UCOBANK",
  "UNOMINDA", "UTIAMC", "UPL", "ULTRACEMCO", "UNIONBANK", "UBL", "UNITDSPR", "URBANCO", "USHAMART", "VTL",
  "VBL", "VEDL", "VMM", "VIJAYA", "IDEA", "WAAREEENER", "VOLTAS", "WELCORP", "WELSPUNLIV", "WHIRLPOOL",
  "WIPRO", "WOCKPHARMA", "YESBANK", "ZFCVINDIA", "ZENTEC", "ZEEL", "ZENSARTECH", "ZYDUSLIFE", "ZYDUSWELL", "ECLERX"
];

// ─── INDICATOR CALCULATIONS ───
function calcEMA(arr: number[], period: number): (number | null)[] {
  const k = 2 / (period + 1);
  const result = new Array(arr.length).fill(null);
  let sum = 0;
  for (let i = 0; i < period && i < arr.length; i++) sum += arr[i];
  if (arr.length >= period) result[period - 1] = sum / period;
  for (let i = period; i < arr.length; i++) {
    if (result[i - 1] !== null)
      result[i] = arr[i] * k + (result[i - 1] as number) * (1 - k);
  }
  return result;
}

function calcRSI(arr: number[], period: number): (number | null)[] {
  const result = new Array(arr.length).fill(null);
  let gains = 0, losses = 0;
  for (let i = 1; i <= period && i < arr.length; i++) {
    const d = arr[i] - arr[i - 1];
    d > 0 ? (gains += d) : (losses -= d);
  }
  let ag = gains / period, al = losses / period;
  if (arr.length > period)
    result[period] = 100 - 100 / (1 + (al === 0 ? 100 : ag / al));
  for (let i = period + 1; i < arr.length; i++) {
    const d = arr[i] - arr[i - 1];
    ag = (ag * (period - 1) + Math.max(d, 0)) / period;
    al = (al * (period - 1) + Math.max(-d, 0)) / period;
    result[i] = 100 - 100 / (1 + (al === 0 ? 100 : ag / al));
  }
  return result;
}

// ─── FIXED CRSI: Correct streak RSI using gains/losses directly ───
function calcCRSI(closes: number[]): (number | null)[] {
  const n = closes.length;

  // Component 1: RSI(3) of closes
  const rsi3 = calcRSI(closes, 3);

  // Component 2: Streak — count consecutive up/down days
  const streak = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    if (closes[i] > closes[i - 1])      streak[i] = Math.max(streak[i - 1], 0) + 1;
    else if (closes[i] < closes[i - 1]) streak[i] = Math.min(streak[i - 1], 0) - 1;
    else                                 streak[i] = 0;
  }

  // RSI(2) of streak: compute gains/losses from streak differences directly
  // This avoids the +100 offset hack which shifts RSI scale incorrectly
  const streakRsi = new Array(n).fill(null);
  const period = 2;
  if (n > period) {
    let ag = 0, al = 0;
    for (let i = 1; i <= period; i++) {
      const d = streak[i] - streak[i - 1];
      d > 0 ? (ag += d) : (al -= d);
    }
    ag /= period; al /= period;
    streakRsi[period] = 100 - 100 / (1 + (al === 0 ? 100 : ag / al));
    for (let i = period + 1; i < n; i++) {
      const d = streak[i] - streak[i - 1];
      ag = (ag * (period - 1) + Math.max(d, 0)) / period;
      al = (al * (period - 1) + Math.max(-d, 0)) / period;
      streakRsi[i] = 100 - 100 / (1 + (al === 0 ? 100 : ag / al));
    }
  }

  // Component 3: 100-period percentile rank of 1-day ROC
  const pr = new Array(n).fill(null);
  for (let i = 100; i < n; i++) {
    const curr = closes[i] - closes[i - 1];
    let below = 0;
    for (let j = i - 99; j <= i; j++)
      if (closes[j] - closes[j - 1] < curr) below++;
    pr[i] = (below / 100) * 100;
  }

  return closes.map((_, i) =>
    rsi3[i] !== null && streakRsi[i] !== null && pr[i] !== null
      ? ((rsi3[i] as number) + (streakRsi[i] as number) + (pr[i] as number)) / 3
      : null
  );
}

interface Bar { t: number; o: number; h: number; l: number; c: number; }

// === POSITION-SIZING FEATURE START [2026-08-18] ===
// ATR(14) via Wilder smoothing — used for volatility-based stop-loss & position sizing.
// To revert: delete this block down to POSITION-SIZING FEATURE END, plus the other
// three blocks marked with the same [2026-08-18] tag in this file.
function calcATR(bars: Bar[], period = 14): (number | null)[] {
  const n = bars.length;
  const result: (number | null)[] = new Array(n).fill(null);
  if (n < 2) return result;
  const tr: number[] = [];
  for (let i = 1; i < n; i++) {
    const { h, l } = bars[i], pc = bars[i - 1].c;
    tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
  }
  // tr[i] corresponds to bars[i+1]
  let atr = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
  result[period] = atr; // aligns with bars[period]
  for (let i = period; i < tr.length; i++) {
    atr = (atr * (period - 1) + tr[i]) / period;
    result[i + 1] = atr;
  }
  return result;
}

// Position sizing: risk a fixed % of capital per trade, sized against a 2xATR stop distance.
// capitalRs / riskPct come from the Settings modal (query params), with sane defaults.
function calcPositionSize(lastClose: number, atrValue: number | null, capitalRs: number, riskPct: number) {
  if (atrValue === null || atrValue <= 0 || lastClose <= 0) {
    return { atrPct: null, stopLoss: null, positionSize: null };
  }
  const atrPct = (atrValue / lastClose) * 100;
  const stopDistancePct = 2 * atrPct;               // 2x ATR stop, in %
  const stopLoss = lastClose - 2 * atrValue;
  const riskAmount = capitalRs * riskPct;
  let positionSize = riskAmount / (stopDistancePct / 100);
  const maxCap = capitalRs * 0.15;                   // never more than 15% of capital in one trade
  const minCap = capitalRs * 0.005;                  // never less than 0.5% of capital
  positionSize = Math.min(positionSize, maxCap);
  positionSize = Math.max(positionSize, minCap);
  return {
    atrPct: +atrPct.toFixed(2),
    stopLoss: +stopLoss.toFixed(2),
    positionSize: Math.round(positionSize),
  };
}
// === POSITION-SIZING FEATURE END [2026-08-18] ===

function calcADX(bars: Bar[], period = 14): (number | null)[] {
  const result = new Array(bars.length).fill(null);
  const tr: number[] = [], pdm: number[] = [], mdm: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const { h, l } = bars[i], pc = bars[i - 1].c, ph = bars[i - 1].h, pl = bars[i - 1].l;
    tr.push(Math.max(h - l, Math.abs(h - pc), Math.abs(l - pc)));
    const up = h - ph, dn = pl - l;
    pdm.push(up > dn && up > 0 ? up : 0);
    mdm.push(dn > up && dn > 0 ? dn : 0);
  }
  let trS = tr.slice(0, period).reduce((a, b) => a + b, 0);
  let pS  = pdm.slice(0, period).reduce((a, b) => a + b, 0);
  let mS  = mdm.slice(0, period).reduce((a, b) => a + b, 0);
  const dx: number[] = [];
  for (let i = period; i < tr.length; i++) {
    trS = trS - trS / period + tr[i];
    pS  = pS  - pS  / period + pdm[i];
    mS  = mS  - mS  / period + mdm[i];
    const dp = (pS / trS) * 100, dm = (mS / trS) * 100, s = dp + dm;
    dx.push(s === 0 ? 0 : Math.abs(dp - dm) / s * 100);
  }
  let adxVal = dx.slice(0, period).reduce((a, b) => a + b, 0) / period;
  if (result.length > 2 * period) result[2 * period] = adxVal;
  for (let i = period; i < dx.length; i++) {
    adxVal = (adxVal * (period - 1) + dx[i]) / period;
    if (i + period + 1 < result.length) result[i + period + 1] = adxVal;
  }
  return result;
}

// ─── BACKTEST ENGINE ───
interface Trade {
  entryDate: number; entryPrice: number;
  exitDate: number;  exitPrice: number;
  ret: number; win: boolean;
}

function backtest(bars: Bar[], crsiBuyLimit = 10, adxThreshold = 29) {
  const closes = bars.map(b => b.c);
  const ema200  = calcEMA(closes, 200);
  const crsiArr = calcCRSI(closes);
  const adxArr  = calcADX(bars);
  const trades: Trade[] = [];
  let inTrade = false, entryPrice = 0, entryDate = 0;

  for (let i = 1; i < bars.length - 1; i++) {
    if (!inTrade) {
      const c = closes[i], e = ema200[i], cr = crsiArr[i], ad = adxArr[i];
      if (e !== null && cr !== null && ad !== null &&
          c > e && cr < crsiBuyLimit && ad > adxThreshold) {
        entryPrice = bars[i + 1].o;
        entryDate  = bars[i + 1].t;
        inTrade    = true;
      }
    } else {
      const cr = crsiArr[i];
      if (cr !== null && cr > 90 && i + 1 < bars.length) {
        const xp  = bars[i + 1].o;
        const ret = (xp - entryPrice) / entryPrice * 100 - 0.2;
        trades.push({ entryDate, entryPrice, exitDate: bars[i + 1].t, exitPrice: xp, ret, win: ret > 0 });
        inTrade = false;
      }
    }
  }
  return trades;
}

// ── BB + CRSI Backtest ──────────────────────────────────
// Entry: CRSI<15 AND Low<=BB(20,2) lower band AND Close>EMA200 AND ADX>threshold
// Exit: CRSI>90 (same as original)
function calcBollingerLower(closes: number[], period = 20, mult = 2): (number | null)[] {
  const lower: (number | null)[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) { lower.push(null); continue; }
    const sl = closes.slice(i - period + 1, i + 1);
    const m  = sl.reduce((a, b) => a + b, 0) / period;
    const sd = Math.sqrt(sl.reduce((a, b) => a + (b - m) ** 2, 0) / period);
    lower.push(m - mult * sd);
  }
  return lower;
}

function backtestBbCrsi(bars: Bar[], crsiBuyLimit = 15, adxThreshold = 29) {
  const closes = bars.map(b => b.c);
  const lows   = bars.map(b => b.l);
  const ema200  = calcEMA(closes, 200);
  const crsiArr = calcCRSI(closes);
  const adxArr  = calcADX(bars);
  const bbLower = calcBollingerLower(closes);
  const trades: Trade[] = [];
  let inTrade = false, entryPrice = 0, entryDate = 0;

  for (let i = 1; i < bars.length - 1; i++) {
    if (!inTrade) {
      const c = closes[i], e = ema200[i], cr = crsiArr[i], ad = adxArr[i], bb = bbLower[i];
      // BOTH conditions: CRSI<15 AND Low<=BB lower
      if (e !== null && cr !== null && ad !== null && bb !== null &&
          c > e && cr < crsiBuyLimit && ad > adxThreshold && lows[i] <= bb) {
        entryPrice = bars[i + 1].o;
        entryDate  = bars[i + 1].t;
        inTrade    = true;
      }
    } else {
      const cr = crsiArr[i];
      if (cr !== null && cr > 90 && i + 1 < bars.length) {
        const xp  = bars[i + 1].o;
        const ret = (xp - entryPrice) / entryPrice * 100 - 0.2;
        trades.push({ entryDate, entryPrice, exitDate: bars[i + 1].t, exitPrice: xp, ret, win: ret > 0 });
        inTrade = false;
      }
    }
  }
  return trades;
}

// ── DARVAS BOX ENGINE ──────────────────────────────────
// Box formation: a new high resets the box. If 3 consecutive days pass
// without a new high, the top is confirmed. Then the lowest low in the
// following days is tracked; 3 consecutive days without a new low confirms
// the bottom. BUY on close above confirmed box top. Stop-loss = box bottom,
// trailed up as new higher boxes get confirmed while in the trade.
// EXIT on close below the trailing stop.
interface DarvasOutcome {
  trades: Trade[];
  boxTop: number | null;
  boxBottom: number | null;
  pending: boolean;             // box ready, price hasn't broken out yet (and no open trade)
  distanceToBreakout: number | null; // % close is below box top, only set when pending
}

function calcDarvasBox(bars: Bar[], confirmDays = 3): DarvasOutcome {
  const n = bars.length;
  const trades: Trade[] = [];

  let highestHighSoFar = -Infinity;
  let boxTopCandidate: number | null = null;
  let daysSinceNewHigh = 0;
  let topConfirmed = false;
  let lowestLowCandidate: number | null = null;
  let daysSinceNewLow = 0;
  let bottomConfirmed = false;
  let currentBoxTop: number | null = null;
  let currentBoxBottom: number | null = null;

  let inTrade = false, entryPrice = 0, entryDate = 0, trailStop = 0;

  for (let i = 0; i < n; i++) {
    const { h, l, c, t } = bars[i];

    if (h > highestHighSoFar) {
      highestHighSoFar = h;
      boxTopCandidate = h;
      daysSinceNewHigh = 0;
      topConfirmed = false;
      bottomConfirmed = false;
      lowestLowCandidate = null;
    } else {
      daysSinceNewHigh++;
      if (!topConfirmed && daysSinceNewHigh >= confirmDays) {
        topConfirmed = true;
        lowestLowCandidate = l;
        daysSinceNewLow = 0;
      }
      if (topConfirmed && !bottomConfirmed && lowestLowCandidate !== null) {
        if (l < lowestLowCandidate) {
          lowestLowCandidate = l;
          daysSinceNewLow = 0;
        } else {
          daysSinceNewLow++;
          if (daysSinceNewLow >= confirmDays) {
            bottomConfirmed = true;
            currentBoxTop = boxTopCandidate;
            currentBoxBottom = lowestLowCandidate;
            if (inTrade && currentBoxBottom !== null && currentBoxBottom > trailStop) {
              trailStop = currentBoxBottom; // trail SL up as price makes new higher boxes
            }
          }
        }
      }
    }

    if (!inTrade) {
      if (currentBoxTop !== null && c > currentBoxTop) {
        inTrade = true;
        entryPrice = c;
        entryDate = t;
        trailStop = currentBoxBottom ?? l;
      }
    } else {
      if (c < trailStop) {
        const ret = (c - entryPrice) / entryPrice * 100 - 0.2; // slippage/costs, same convention as CRSI engine
        trades.push({ entryDate, entryPrice, exitDate: t, exitPrice: c, ret, win: ret > 0 });
        inTrade = false;
      }
    }
  }

  const lastClose = n > 0 ? bars[n - 1].c : null;
  const pending = !inTrade && currentBoxTop !== null && lastClose !== null && lastClose < currentBoxTop;
  const distanceToBreakout = pending && lastClose !== null && currentBoxTop !== null
    ? +(((currentBoxTop - lastClose) / lastClose) * 100).toFixed(2)
    : null;

  return { trades, boxTop: currentBoxTop, boxBottom: currentBoxBottom, pending, distanceToBreakout };
}

function calcCompoundedReturn(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const eq = trades.reduce((acc, t) => acc * (1 + t.ret / 100), 1);
  return +((eq - 1) * 100).toFixed(2);
}

// Gate check — two modes
function gatePass(trades: Trade[], mode: 'strict' | 'lenient') {
  const minTrades = 10;
  const minWinRate = mode === 'strict' ? 0.60 : 0.60;
  const minPF      = mode === 'strict' ? 2.0  : 1.5;

  if (trades.length < minTrades) return false;
  const wins = trades.filter(t => t.win);
  if (wins.length / trades.length < minWinRate) return false;
  const sw = wins.reduce((a, t) => a + t.ret, 0);
  const sl = Math.abs(trades.filter(t => !t.win).reduce((a, t) => a + t.ret, 0));
  return sl === 0 ? true : sw / sl >= minPF;
}

function calcStats(trades: Trade[]) {
  const wins   = trades.filter(t => t.win);
  const losses = trades.filter(t => !t.win);
  const wr  = wins.length / trades.length * 100;
  const sw  = wins.reduce((a, t) => a + t.ret, 0);
  const sl  = Math.abs(losses.reduce((a, t) => a + t.ret, 0));
  const pf  = sl === 0 ? 999 : sw / sl;
  const avg = trades.reduce((a, t) => a + t.ret, 0) / trades.length;
  let eq = 100, pk = 100, md = 0;
  for (const t of trades) {
    eq *= (1 + t.ret / 100);
    if (eq > pk) pk = eq;
    const dd = (pk - eq) / pk * 100;
    if (dd > md) md = dd;
  }
  return {
    wr: +wr.toFixed(1), pf: +pf.toFixed(2), avg: +avg.toFixed(2),
    md: +md.toFixed(1), wins: wins.length, losses: losses.length,
  };
}

async function fetchYahooChart(symbol: string): Promise<Bar[] | null> {
  const ticker  = symbol.endsWith('.NS') ? symbol : `${symbol}.NS`;
  const period1 = Math.floor(new Date('2003-01-01').getTime() / 1000);
  const period2 = Math.floor(Date.now() / 1000);
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://finance.yahoo.com',
    'Referer': `https://finance.yahoo.com/quote/${ticker}`,
  };

  const targetTime = Math.floor(new Date('2026-07-31T23:59:59Z').getTime() / 1000);
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=1d&includeAdjustedClose=true`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=1d&includeAdjustedClose=true`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) continue;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) continue;
      const timestamps = result.timestamp || [];
      const quote = result.indicators?.quote?.[0] || {};
      const bars: Bar[] = [];
      for (let idx = 0; idx < timestamps.length; idx++) {
        const o = quote.open?.[idx], h = quote.high?.[idx],
              l = quote.low?.[idx],  c = quote.close?.[idx];
        if (o != null && h != null && l != null && c != null)
          bars.push({ t: timestamps[idx] * 1000, o: +o, h: +h, l: +l, c: +c });
      }
      if (bars.length >= 220) return bars;
    } catch (_) { /* try next */ }
  }

  // No fallback — return null so the stock is skipped cleanly
  return null;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

app.get('/api/stocks-count', (_, res) => {
  res.json({ count: STOCKS.length, stocks: STOCKS });
});

// SSE SCAN — accepts mode=strict|lenient
app.get('/api/scan', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const send = (type: string, data: any) =>
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);

  const crsiLimit  = Number(req.query.crsiLimit) || 10;
  const adxMin     = Number(req.query.adxMin)    || 29;
  const mode       = (req.query.mode as string) === 'lenient' ? 'lenient' : 'strict';
  // === POSITION-SIZING FEATURE START [2026-08-18] ===
  // capital & riskPct come from the Settings modal; defaults = Rs 1,00,000 capital, 0.5% risk/trade
  const capitalRs  = Number(req.query.capital) > 0 ? Number(req.query.capital) : 100000;
  const riskPct    = Number(req.query.riskPct) > 0 ? Number(req.query.riskPct) : 0.005;
  // === POSITION-SIZING FEATURE END [2026-08-18] ===
  const customStr  = req.query.symbols ? String(req.query.symbols) : '';
  const stockList  = customStr
    ? customStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : STOCKS;

  send('start', { total: stockList.length });

  for (let i = 0; i < stockList.length; i++) {
    const sym = stockList[i];
    send('progress', { i: i + 1, total: stockList.length, sym });

    try {
      const bars = await fetchYahooChart(sym);
      if (!bars) { await sleep(50); continue; }   // skip — no fake data

      const trades = backtest(bars, crsiLimit, adxMin);
      if (!gatePass(trades, mode)) { await sleep(50); continue; }

      const stats   = calcStats(trades);
      const closes  = bars.map(b => b.c);
      const n       = bars.length - 1;
      const ema200  = calcEMA(closes, 200);
      const crsiArr = calcCRSI(closes);
      const adxArr  = calcADX(bars);

      const crsiNow  = crsiArr[n] !== null ? +(crsiArr[n] as number).toFixed(2) : null;
      const adxNow   = adxArr[n]  !== null ? +(adxArr[n]  as number).toFixed(2) : null;
      const emaNow   = ema200[n]  !== null ? +(ema200[n]  as number).toFixed(2) : null;
      const lastClose = +closes[n].toFixed(2);

      const isLive = crsiNow !== null && adxNow !== null && emaNow !== null
        && crsiNow < crsiLimit && adxNow > adxMin && lastClose > emaNow;

      // === POSITION-SIZING FEATURE START [2026-08-18] ===
      const atrArr = calcATR(bars);
      const atrNow = atrArr[n];
      const { atrPct, stopLoss, positionSize } = calcPositionSize(lastClose, atrNow, capitalRs, riskPct);
      // Max-hold display: 70 calendar days from "today" (informational only — the actual
      // exit-by date is measured from the day you enter, not from scan day).
      const maxExitDate = new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      // === POSITION-SIZING FEATURE END [2026-08-18] ===

      // BB+CRSI — double confirmation
      const bbCrsiTrades = backtestBbCrsi(bars, 15, adxMin);
      const bbCrsiGate   = bbCrsiTrades.length >= 10 && gatePass(bbCrsiTrades, mode);
      const bbCrsiStats  = bbCrsiGate ? calcStats(bbCrsiTrades) : null;

      // BB+CRSI live: CRSI<15 AND Low<=BB(20,2) lower AND Close>EMA200 AND ADX>=29
      const bbLowerArr = calcBollingerLower(closes);
      const bbLowerNow = bbLowerArr[n];
      const lastLow    = bars[n].l;
      const isBbLive   = isLive && bbLowerNow !== null && lastLow <= bbLowerNow;

      const date = new Date(bars[n].t).toISOString().slice(0, 10);
      const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const validCrsi = crsiArr.filter(c => c !== null);
      const minCrsiEver = validCrsi.length > 0 ? +(Math.min(...validCrsi)).toFixed(2) : null;

      send('result', {
        symbol: sym, date, timestamp, minCrsiEver, lastClose, crsiNow, adxNow, ema200Now: emaNow,
        winRate: stats.wr, pf: stats.pf, avgReturn: stats.avg, maxdd: stats.md,
        wins: stats.wins, losses: stats.losses, trades: trades.length,
        isLive,
        // === POSITION-SIZING FEATURE START [2026-08-18] ===
        atrPct, stopLoss, positionSize, maxExitDate,
        // === POSITION-SIZING FEATURE END [2026-08-18] ===
        // BB+CRSI fields
        bbCrsiGate,
        bbCrsiLive:   isBbLive,
        bbCrsiWr:     bbCrsiStats?.wr ?? null,
        bbCrsiPf:     bbCrsiStats?.pf ?? null,
        bbCrsiTrades: bbCrsiTrades.length,
        bbCrsiAvg:    bbCrsiStats?.avg ?? null,
        allTrades: trades.slice(-15).map(t => ({
          entryDate:  new Date(t.entryDate).toISOString().slice(0, 10),
          exitDate:   new Date(t.exitDate).toISOString().slice(0, 10),
          entryPrice: +t.entryPrice.toFixed(2),
          exitPrice:  +t.exitPrice.toFixed(2),
          ret: +t.ret.toFixed(2), win: t.win,
        })),
      });
    } catch (_) { /* skip failed stocks */ }

    await sleep(80);
  }

  send('done', { total: stockList.length });
  res.end();
});

// SSE SCAN — Darvas Box module
app.get('/api/scan-darvas', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const send = (type: string, data: any) =>
    res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);

  const customStr = req.query.symbols ? String(req.query.symbols) : '';
  const stockList = customStr
    ? customStr.split(',').map(s => s.trim().toUpperCase()).filter(Boolean)
    : STOCKS;

  send('start', { total: stockList.length });

  for (let i = 0; i < stockList.length; i++) {
    const sym = stockList[i];
    send('progress', { i: i + 1, total: stockList.length, sym });

    try {
      const bars = await fetchYahooChart(sym);
      if (!bars) { await sleep(50); continue; }

      const { trades, boxTop, boxBottom, pending, distanceToBreakout } = calcDarvasBox(bars);

      // Need either a usable trade history (to rank as performer) or an active pending setup
      if (trades.length === 0 && !pending) { await sleep(50); continue; }

      const stats = trades.length > 0
        ? calcStats(trades)
        : { wr: 0, pf: 0, avg: 0, md: 0, wins: 0, losses: 0 };
      const totalReturn = calcCompoundedReturn(trades);

      const lastBar = bars[bars.length - 1];
      const lastClose = +lastBar.c.toFixed(2);
      const date = new Date(lastBar.t).toISOString().slice(0, 10);
      const timestamp = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      send('result', {
        symbol: sym, date, timestamp, lastClose,
        boxTop: boxTop !== null ? +boxTop.toFixed(2) : null,
        boxBottom: boxBottom !== null ? +boxBottom.toFixed(2) : null,
        pending, distanceToBreakout, totalReturn,
        winRate: stats.wr, pf: stats.pf, avgReturn: stats.avg, maxdd: stats.md,
        wins: stats.wins, losses: stats.losses, trades: trades.length,
        allTrades: trades.slice(-15).map(t => ({
          entryDate:  new Date(t.entryDate).toISOString().slice(0, 10),
          exitDate:   new Date(t.exitDate).toISOString().slice(0, 10),
          entryPrice: +t.entryPrice.toFixed(2),
          exitPrice:  +t.exitPrice.toFixed(2),
          ret: +t.ret.toFixed(2), win: t.win,
        })),
      });
    } catch (_) { /* skip failed stocks */ }

    await sleep(80);
  }

  send('done', { total: stockList.length });
  res.end();
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }
  app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
}

startServer();