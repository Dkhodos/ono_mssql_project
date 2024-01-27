import {execCommand} from "./execCommand.js";
import * as path from 'path'
import { fileURLToPath } from 'url';
import {sleep} from "../utils/sleep.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startDockerDB(){
    console.log("Start Docker DB")
    await execCommand(`cd ${__dirname}/../../.db && ./start-sql-server.sh`);
    console.log("Docker is up waiting 7s for connection...");
    await sleep(7000);
}
