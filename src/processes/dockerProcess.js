import {execCommand} from "./execCommand.js";
import {sleep} from "../utils/sleep.js";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class DockerProcess{
    static #TIMEOUT = 7000;

    async startDockerDB(){
        console.warn("Docker service is up, restarting...")
        await this.#startDockerDB();
    }

    async #startDockerDB(){
        console.log("Start Docker DB")
        await execCommand(`cd ${__dirname}/../../.db && ./start-sql-server.sh`);
        console.log(`Docker is up waiting ${DockerProcess.#TIMEOUT / 1000}s for connection...`);
        await sleep(DockerProcess.#TIMEOUT);
    }

    async stopDockerDB(){
        console.log("Stop Docker DB")
        return await execCommand(`cd ${__dirname}/../../.db && ./stop-sql-server.sh`);
    }

}
