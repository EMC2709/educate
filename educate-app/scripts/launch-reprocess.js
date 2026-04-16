#!/usr/bin/env node
/**
 * Parallel reprocess launcher
 * Loads .env.local, then spawns 5 parallel instances of process-past-papers.ts
 * each covering a different offset range.
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envVars = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) {
      const key = m[1].trim();
      let val = m[2].trim();
      // Strip surrounding quotes
      val = val.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      // Strip literal \n sequences and carriage returns
      val = val.replace(/\\n/g, '').replace(/\r/g, '').trim();
      envVars[key] = val;
    }
  }
}

console.log(`Loaded ${Object.keys(envVars).length} vars from .env.local`);
if (!envVars.DATABASE_URL)      { console.error('ERROR: DATABASE_URL missing'); process.exit(1); }
if (!envVars.ANTHROPIC_API_KEY) { console.error('ERROR: ANTHROPIC_API_KEY missing'); process.exit(1); }
console.log('DATABASE_URL:', envVars.DATABASE_URL.substring(0, 40) + '...');
console.log('ANTHROPIC_API_KEY:', envVars.ANTHROPIC_API_KEY.substring(0, 20) + '...');

const appDir = path.join(__dirname, '..');

const instances = [
  { offset: 0,     limit: 5231, log: 'reprocess-1.log' },
  { offset: 5231,  limit: 5231, log: 'reprocess-2.log' },
  { offset: 10462, limit: 5231, log: 'reprocess-3.log' },
  { offset: 15693, limit: 5231, log: 'reprocess-4.log' },
  { offset: 20924, limit: 5307, log: 'reprocess-5.log' },
];

// Merge current process env + .env.local vars
const childEnv = { ...process.env, ...envVars };

for (const inst of instances) {
  const logPath = path.join(__dirname, inst.log);
  const logStream = fs.createWriteStream(logPath, { flags: 'w' });

  // Use shell:true on Windows to avoid EINVAL with env blocks
  const cmd = `npx tsx scripts/process-past-papers.ts --force --offset ${inst.offset} --limit ${inst.limit} --concurrency 4`;
  const child = spawn(cmd, [], {
    cwd: appDir,
    env: childEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    shell: true,
  });

  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  child.on('exit', (code) => {
    logStream.write(`\n--- Process exited with code ${code} ---\n`);
    logStream.end();
    console.log(`Instance offset=${inst.offset} exited with code ${code}`);
  });

  console.log(`Launched offset=${inst.offset} limit=${inst.limit} PID=${child.pid} -> scripts/${inst.log}`);
}

console.log('\nAll 5 instances running. Monitor with:');
console.log('  node -e "const fs=require(\'fs\'); setInterval(()=>{[1,2,3,4,5].forEach(i=>{try{const lines=fs.readFileSync(`scripts/reprocess-${i}.log`,\'utf-8\').split(\'\\n\').slice(-3).join(\'\\n\');console.log(`--- LOG ${i} ---`,lines);}catch{}});},10000);"');
