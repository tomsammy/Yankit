import { Client } from 'ssh2';

const conn = new Client();
const config = {
  host: '31.97.190.197',
  port: 22,
  username: 'root',
  password: 'FOXnetisp12@',
  readyTimeout: 20000
};

conn.on('ready', () => {
  console.log('✔ SSH Connection established.');
  
  const cmd = [
    'cd /var/www/yankit',
    'git pull origin main',
    'npm run build'
  ].join(' && ');
  
  console.log('Running deployment commands on remote VPS...');
  conn.exec(cmd, (execErr, stream) => {
    if (execErr) {
      console.error('Execution error:', execErr);
      conn.end();
      process.exit(1);
    }
    
    stream.on('close', (code) => {
      console.log(`\nVPS commands completed with exit code: ${code}`);
      conn.end();
      process.exit(code);
    }).on('data', (data) => {
      process.stdout.write(data.toString());
    }).stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });
  });
}).on('error', (err) => {
  console.error('Connection failed:', err);
  process.exit(1);
}).connect(config);
