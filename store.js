const { DatabaseSync } = require('node:sqlite');
const path=require('path'); const fs=require('fs');
let instance;
function init(){if(instance)return instance;const dir=path.resolve(process.env.DATA_DIR||'./data');fs.mkdirSync(dir,{recursive:true});instance=new DatabaseSync(path.join(dir,'portal.sqlite'));instance.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');instance.exec(`
 CREATE TABLE IF NOT EXISTS site_text(key TEXT PRIMARY KEY,value TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT NOT NULL UNIQUE COLLATE NOCASE,password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','customer')),display_name TEXT,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS transactions(id INTEGER PRIMARY KEY AUTOINCREMENT,user_id INTEGER NOT NULL REFERENCES users(id),delta INTEGER NOT NULL CHECK(delta != 0),reason TEXT NOT NULL,actor_id INTEGER NOT NULL REFERENCES users(id),created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id,id DESC);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at INTEGER NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
 `);return instance;}
function db(){return init()}
module.exports={init,db};
