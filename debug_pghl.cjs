const fs = require('fs');

async function debug() {
  const fetchYahooChart = async (symbol) => {
    const ticker = symbol + '.NS';
    const period1 = Math.floor(new Date('2003-01-01').getTime() / 1000);
    const period2 = Math.floor(Date.now() / 1000);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${period1}&period2=${period2}&interval=1d&includeAdjustedClose=true`;
    const res = await fetch(url);
    const json = await res.json();
    const result = json.chart.result[0];
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    const bars = [];
    for(let i=0; i<timestamps.length; i++) {
        const o = quote.open[i], h = quote.high[i], l = quote.low[i], c = quote.close[i];
        if(o != null && h != null && l != null && c != null) {
            bars.push({ t: timestamps[i]*1000, o, h, l, c });
        }
    }
    return bars;
  };

  // We need the technical indicators logic
}
debug();
