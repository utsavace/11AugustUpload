import fs from 'fs';
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(/Math\.floor\(Date\.now\(\) \/ 1000\)/g, "Math.floor(new Date('2026-07-31T15:00:00Z').getTime() / 1000)");
// We need to stop the server part and just export the stuff or run it
code = code.replace(/app\.listen\([^]*?\);/g, '');
code = code.replace(/startServer\(\);/g, '');

code += `
async function runTest() {
  const { STOCKS } = module.exports;
  
  // We need to extract the functions. But they are not exported.
  // Instead of this, let's just write the testing code directly inside the modified server.ts string.
}
`;
