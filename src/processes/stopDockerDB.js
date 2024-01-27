import {execCommand} from "./execCommand.js";
import * as path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export async function stopDockerDB(){
    console.log("Stop Docker DB")
    await execCommand(`cd ${__dirname}/../../.db && ./stop-sql-server.sh`);
}
