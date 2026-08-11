import { STOCKS } from './server';
import fs from 'fs';

// Read server.ts
let serverCode = fs.readFileSync('server.ts', 'utf-8');

// Remove express routes and server start
serverCode = serverCode.replace(/const app = express\(\);[\s\S]*?startServer\(\);/m, '');
serverCode = serverCode.replace(/import express.*/g, '');
serverCode = serverCode.replace(/import path.*/g, '');
serverCode = serverCode.replace(/import { fileURLToPath }.*/g, '');
serverCode = serverCode.replace(/import { createServer.*/g, '');

// Save to temp
fs.writeFileSync('temp_server.ts', serverCode);
