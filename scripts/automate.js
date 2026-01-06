const { exec } = require('child_process');

const INTERVAL_MS = 5 * 60 * 1000; // 5 Minutes

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing: ${command}`, error);
                reject(error);
                return;
            }
            if (stdout) console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
        });
    });
}

async function loop() {
    console.log(`[${new Date().toISOString()}] Starting Update Cycle...`);

    try {
        await runCommand('npm run fetch');
        await runCommand('npm run build');
        console.log('Cycle Complete. Waiting for next run...');
    } catch (e) {
        console.error('Cycle Failed:', e);
    }
}

// Initial Run
loop();

// Interval Loop
setInterval(loop, INTERVAL_MS);
