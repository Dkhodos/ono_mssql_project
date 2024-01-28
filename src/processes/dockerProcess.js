import {execCommand} from "./execCommand.js";
import {sleep} from "../utils/sleep.js";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class DockerProcess{

    async startDockerDB(){
        await this.#startDockerDB();
    }

    async #startDockerDB(){
        await execCommand(`cd ${__dirname}/../../.db && ./start-sql-server.sh`);
    }

    async stopDockerDB(){
        await execCommand(`cd ${__dirname}/../../.db && ./stop-sql-server.sh`);
    }

}
