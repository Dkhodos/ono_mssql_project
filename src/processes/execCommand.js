import { exec } from 'child_process';

export function execCommand(command) {
    return new Promise((resolve, reject) => {
        const childProcess = exec(command);

        // Listen for data from the child process's stdout
        childProcess.stdout.on('data', (data) => {
            console.log(data);
        });

        // Listen for data from the child process's stderr
        childProcess.stderr.on('data', (data) => {
            console.log(data);
        });

        childProcess.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(`Child process exited with code ${code}`);
            }
        });

        childProcess.on('error', (error) => {
            reject(`Child process error: ${error.message}`);
        });
    });
}
