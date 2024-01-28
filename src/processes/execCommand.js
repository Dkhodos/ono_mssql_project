import { exec } from 'child_process';

const IGNORE_ERROR_IN = ['warning', 'Creating', "Network", 'Container'];

const isFakeError = (message) => {
    if(!message) return true;

    for( const error of IGNORE_ERROR_IN){
        if (error.includes(message)){
            return true;
        }
    }

    return false;
}

export function execCommand(command) {
    return new Promise((resolve, reject) => {
        const childProcess = exec(command);

        // Listen for data from the child process's stdout
        childProcess.stdout.on('data', (data) => {
            console.log(data);
        });

        // Listen for data from the child process's stderr
        childProcess.stderr.on('data', (data) => {
            if (!isFakeError(data)) {
                console.log(data);
            }
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
