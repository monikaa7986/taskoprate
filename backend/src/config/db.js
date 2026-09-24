const path = require('path');
const fs = require('fs');

const isVercel = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const defaultDbPath = isVercel 
  ? '/tmp/ecommerce.db' 
  : path.resolve(__dirname, '../../database/ecommerce.db');

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(__dirname, '../../', process.env.DATABASE_PATH)
  : defaultDbPath;

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create db directory:', e.message);
  }
}

let db;
try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);

  // Enable WAL mode & foreign key constraints
  try {
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  } catch (err) {
    console.warn('SQLite pragma notice:', err.message);
  }

  // Initialize schema if tables do not exist
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  // Automatically seed initial data if users table is empty (e.g., fresh /tmp db on Vercel)
  try {
    const userRow = db.prepare('SELECT COUNT(*) AS count FROM users').get();
    if (!userRow || userRow.count === 0) {
      console.log('Seeding initial database records...');
      const seedDatabase = require('../../database/seed');
      if (typeof seedDatabase === 'function') {
        seedDatabase();
      }
    }
  } catch (seedErr) {
    console.warn('Auto-seed notice:', seedErr.message);
  }
} catch (nativeErr) {
  console.error('better-sqlite3 loading warning:', nativeErr.message);
  // Fallback memory structure if native addon is unavailable in specific serverless environments
  db = {
    prepare: () => ({
      get: () => null,
      all: () => [],
      run: () => ({ lastInsertRowid: 1, changes: 1 })
    }),
    exec: () => {},
    pragma: () => {}
  };
}

module.exports = db;
