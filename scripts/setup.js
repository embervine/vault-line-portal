require('dotenv').config();
const bcrypt = require('bcryptjs');
const { init, db } = require('../store');
const crypto = require('crypto');
init();
if(db().prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) {
 console.log('An admin already exists. Setup will not overwrite existing credentials.');
 process.exit(0);
}
const username = (process.env.ADMIN_USERNAME || 'admin').trim();
const password = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url');
if(password.length < 12) throw new Error('Admin password must be at least 12 characters.');
const now = new Date().toISOString();
db().prepare('INSERT INTO users (username,password_hash,role,created_at) VALUES (?,?,?,?)').run(username,bcrypt.hashSync(password,12),'admin',now);
console.log('\nADMIN CREDENTIALS — SAVE THESE SECURELY');
console.log('Username:',username);
console.log('Password:',password);
console.log('Change credentials before giving anyone access. These credentials are only printed during setup.\n');
