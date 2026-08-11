const http = require('http');

function scan(mode, crsi, adx) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:3000/api/scan?mode=${mode}&crsiLimit=${crsi}&adxMin=${adx}`, (res) => {
      let liveCrsi = [];
      let liveBbCrsi = [];
      let total = 0;
      res.on('data', chunk => {
        chunk.toString().split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            try {
              const d = JSON.parse(line.substring(6));
              if (d.type === 'start') {
                total = d.total;
              } else if (d.type === 'result') {
                if (d.isLive) liveCrsi.push(d.symbol);
                if (d.bbCrsiLive) liveBbCrsi.push(d.symbol);
              } else if (d.type === 'progress') {
                if (d.scanned % 50 === 0) console.log(`[${mode}] Progress: ${d.scanned}/${total}`);
              }
            } catch (e) {}
          }
        });
      });
      res.on('end', () => {
        console.log(`[${mode}] CRSI Live: ${liveCrsi.join(', ')}`);
        console.log(`[${mode}] BB+CRSI Live: ${liveBbCrsi.join(', ')}`);
        resolve();
      });
      res.on('error', (e) => {
        console.error(`[${mode}] Error:`, e);
        resolve();
      });
    });
  });
}

async function run() {
  await scan('strict', 10, 29);
  await scan('lenient', 15, 20);
}

run();
