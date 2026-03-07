const { spawn } = require('child_process');
const fs = require('fs');

const logStream = fs.createWriteStream('server_crash_log.txt', { flags: 'a' });

const prc = spawn('npm', ['run', 'dev'], { shell: true });

prc.stdout.on('data', (data) => {
  console.log(`STDOUT: ${data}`);
  logStream.write(`STDOUT: ${data}\n`);
});

prc.stderr.on('data', (data) => {
  console.error(`STDERR: ${data}`);
  logStream.write(`STDERR: ${data}\n`);
});

prc.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  logStream.end();
});
