const http = require('http');

async function runScan(mode, crsiLimit, adxMin) {
  return new Promise((resolve, reject) => {
    console.log(`\nRunning Scan: Mode=${mode}, CRSI<${crsiLimit}, ADX>=${adxMin}`);
    const req = http.get(`http://127.0.0.1:3000/api/scan?mode=${mode}&crsiLimit=${crsiLimit}&adxMin=${adxMin}`, (res) => {
      let liveCrsi = [];
      let liveBbCrsi = [];
      let scanned = 0;

      res.on('data', (chunk) => {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.type === 'result') {
                scanned++;
                if (data.isLive) {
                  liveCrsi.push(data.symbol);
                }
                if (data.bbCrsiLive) {
                  liveBbCrsi.push(data.symbol);
                }
              }
            } catch (e) {}
          }
        }
      });

      res.on('end', () => {
        console.log(`Total scanned: ${scanned}`);
        console.log(`Live CRSI signals (${mode}):`, liveCrsi.join(', ') || 'None');
        console.log(`Live BB+CRSI signals (${mode}):`, liveBbCrsi.join(', ') || 'None');
        resolve();
      });
    });

    req.on('error', reject);
  });
}

async function main() {
  await runScan('strict', 10, 29);
  await runScan('lenient', 15, 20);
}

main();
