const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('\x1b[36m%s\x1b[0m', '=======================================================');
console.log('\x1b[1m\x1b[32m%s\x1b[0m', '  ✨ ATELIER CLOTHING E-COMMERCE FULL-STACK SERVER');
console.log('\x1b[36m%s\x1b[0m', '=======================================================');

// 1. Check if dependencies are installed
const backendModules = path.join(backendDir, 'node_modules');
const frontendModules = path.join(frontendDir, 'node_modules');

if (!fs.existsSync(backendModules)) {
  console.log('\x1b[33m%s\x1b[0m', '📦 Installing backend dependencies...');
  execSync('npm install', { cwd: backendDir, stdio: 'inherit' });
}

if (!fs.existsSync(frontendModules)) {
  console.log('\x1b[33m%s\x1b[0m', '📦 Installing frontend dependencies...');
  execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
}

// 2. Ensure SQLite database exists and is seeded
const dbPath = path.join(backendDir, 'database', 'ecommerce.db');
if (!fs.existsSync(dbPath)) {
  console.log('\x1b[33m%s\x1b[0m', '📦 Initializing & seeding SQLite database...');
  execSync('node database/seed.js', { cwd: backendDir, stdio: 'inherit' });
  console.log('\x1b[32m%s\x1b[0m', '✅ Database initialized successfully.\n');
}

// 3. Start Backend & Frontend servers concurrently
console.log('\x1b[34m%s\x1b[0m', '🚀 Launching Backend API Server (Port 5000)...');
const backend = spawn('node', ['src/server.js'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: process.env.PORT || '5000' }
});

console.log('\x1b[35m%s\x1b[0m', '⚡ Launching Frontend Vite Server (Port 5173)...');
const viteBin = path.join(frontendDir, 'node_modules', 'vite', 'bin', 'vite.js');
const frontend = spawn('node', [viteBin], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

function killProcess(proc) {
  if (!proc || !proc.pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
    } else {
      proc.kill('SIGTERM');
    }
  } catch (e) {}
}

function terminate(code) {
  killProcess(backend);
  killProcess(frontend);
  process.exit(code || 0);
}

process.on('SIGINT', () => terminate(0));
process.on('SIGTERM', () => terminate(0));
process.on('exit', () => terminate(0));

backend.on('error', (err) => console.error('\x1b[31mBackend Error:\x1b[0m', err));
frontend.on('error', (err) => console.error('\x1b[31mFrontend Error:\x1b[0m', err));
