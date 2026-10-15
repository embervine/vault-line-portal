require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');

function hiddenInput(prompt) {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    if (!stdin.isTTY) return reject(new Error('Run this in an interactive terminal.'));
    process.stdout.write(prompt);
    readline.emitKeypressEvents(stdin);
    const wasRaw = stdin.isRaw;
    stdin.setRawMode(true);
    stdin.resume();
    let value = '';
    function cleanup() {
      stdin.removeListener('keypress', onKey);
      stdin.setRawMode(Boolean(wasRaw));
      stdin.pause();
      process.stdout.write('\n');
    }
    function onKey(str, key) {
      if (key && key.ctrl && key.name === 'c') { cleanup(); reject(new Error('Cancelled.')); return; }
      if (key && key.name === 'return') { cleanup(); resolve(value); return; }
      if (key && key.name === 'backspace') { value = value.slice(0, -1); return; }
      if (str && !key?.ctrl && !key?.meta && str >= ' ' && str !== '\x7f') value += str;
    }
    stdin.on('keypress', onKey);
  });
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing. Put your private Neon connection string in a .env file in this folder.');
  const { pool, init } = require('../store');
  try {
    await init();
    const { rows } = await pool.query("SELECT id, username FROM users WHERE role='admin' ORDER BY id LIMIT 2");
    if (rows.length !== 1) throw new Error(rows.length ? 'More than one admin found; cannot safely select one.' : 'No admin exists yet. Run npm run setup first.');
    const username = rows[0].username;
    console.log('Resetting password for administrator: ' + username);
    console.log('Password will not appear while you type. Use at least 12 characters.');
    const password = await hiddenInput('New password: ');
    if (password.length < 12) throw new Error('Password must have at least 12 characters. No changes made.');
    const confirm = await hiddenInput('Type the new password again: ');
    if (password !== confirm) throw new Error('Passwords did not match. No changes made.');
    const hash = await bcrypt.hash(password, 12);
    await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2 AND role=$3', [hash, rows[0].id, 'admin']);
    await pool.query('DELETE FROM sessions WHERE user_id=$1', [rows[0].id]);
    console.log('Success! Sign in as ' + username + ' using your new password.');
  } finally { await pool.end(); }
}
main().catch(e => { console.error('Reset failed:', e.message); process.exitCode=1; });
