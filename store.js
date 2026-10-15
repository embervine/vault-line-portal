const { Pool } = require('pg');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required. Configure Neon PostgreSQL.');
const pool = new Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:10000,ssl:{rejectUnauthorized:true}});
async function init(){
 await pool.query(`CREATE TABLE IF NOT EXISTS users(id BIGSERIAL PRIMARY KEY,username TEXT NOT NULL UNIQUE,password_hash TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','customer')),display_name TEXT,created_at TEXT NOT NULL);
 CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower ON users(lower(username));
 CREATE TABLE IF NOT EXISTS transactions(id BIGSERIAL PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id),delta BIGINT NOT NULL CHECK(delta <> 0),reason TEXT NOT NULL,actor_id BIGINT NOT NULL REFERENCES users(id),created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id,id DESC);
 CREATE TABLE IF NOT EXISTS sessions(token_hash TEXT PRIMARY KEY,user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires_at BIGINT NOT NULL);
 CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);`);
}
module.exports={pool,init};
