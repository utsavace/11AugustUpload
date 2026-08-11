import fs from 'fs';

// Read logic from server.ts
const code = fs.readFileSync('server.ts', 'utf-8');

// I will just use eval or I can just append to server.ts
