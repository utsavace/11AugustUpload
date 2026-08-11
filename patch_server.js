const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
  "      const isBbLive   = isLive && bbLowerNow !== null && lastLow <= bbLowerNow;\n\n      send('result', {\n        symbol: sym, lastClose, crsiNow, adxNow, ema200Now: emaNow,",
  "      const isBbLive   = isLive && bbLowerNow !== null && lastLow <= bbLowerNow;\n\n      const date = new Date(bars[n].t).toISOString().slice(0, 10);\n      const validCrsi = crsiArr.filter(c => c !== null);\n      const minCrsiEver = validCrsi.length > 0 ? +(Math.min(...validCrsi)).toFixed(2) : null;\n\n      send('result', {\n        symbol: sym, date, minCrsiEver, lastClose, crsiNow, adxNow, ema200Now: emaNow,"
);
fs.writeFileSync('server.ts', code);
