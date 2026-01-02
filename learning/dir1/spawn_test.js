const { spawn } = require('child_process');
const child = spawn('ls', ['-la', '/tmp'], { shell: true });

child.stdout.on('data', (data) => {
    console.log(`stdout ${data}`);
});