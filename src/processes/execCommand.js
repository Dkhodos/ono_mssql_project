import { exec } from 'child_process';

const IGNORE_ERROR_IN = ['warning', 'Creating'];

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
        exec(command, (error, stdout, stderr) => {
            if(isFakeError(stderr) || isFakeError(error)){
                resolve(stdout);
            }

            if (error) {
                reject(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout);
        });
    });
}
