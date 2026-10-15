require('dotenv').config();
const readline = require('node:readline');
const bcrypt = require('bcryptjs');
const {init,pool} = require('../store');
const rl = readline.createInterface({input:process.stdin,output:process.stdout});
function ask(q){return new Promise(resolve=>rl.question(q,resolve));}
(async()=>{
  await init();
  const result=await pool.query("SELECT id,username FROM users WHERE role='admin' ORDER BY id LIMIT 1");
  const admin=result.rows[0];
  if(!admin){console.log('No admin account exists. Run npm run setup first.');return;}
  console.log('Resetting password for admin username:',admin.username);
  const password=await ask('Enter a NEW admin password (12+ characters): ');
  if(password.length<12)throw Error('Password must be at least 12 characters.');
  const confirm=await ask('Enter the password again: ');
  if(password!==confirm)throw Error('Passwords do not match.');
  await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2',[await bcrypt.hash(password,12),admin.id]);
  await pool.query('DELETE FROM sessions WHERE user_id=$1',[admin.id]);
  console.log('Admin password updated successfully.');
})().catch(err=>{console.error('Reset failed:',err.message);process.exitCode=1}).finally(async()=>{rl.close();await pool.end();});
