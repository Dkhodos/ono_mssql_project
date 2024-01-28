import {execCommand} from "./execCommand.js";
import {sleep} from "../utils/sleep.js";
import path from "path";
import {fileURLToPath} from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DockerActionStatus = {
    'idle': 'idle',
    'starting': 'starting',
    'running': 'running',
    'stopping': 'stopping',
    'stopped': 'stopped'
}

export class DockerProcess{
    static #TIMEOUT = 7000;
    static #instance;

    #status = DockerActionStatus.idle;

    constructor() {
        this.#status = DockerActionStatus.idle;
    }

    static getInstance(){
        if(DockerProcess.#instance){
            return DockerProcess.#instance;
        }

        DockerProcess.#instance = new DockerProcess();
        return DockerProcess.#instance;
    }

    async startDockerDB(){
        if(this.#status !== DockerActionStatus.idle) return;

        console.warn("Docker service is up, restarting...")
        this.#status = DockerActionStatus.running;
        await this.#startDockerDB();
        this.#status = DockerActionStatus.starting;
    }

    async #startDockerDB(){
        console.log("Start Docker DB")
        await execCommand(`cd ${__dirname}/../../.db && ./start-sql-server.sh`);
        console.log(`Docker is up waiting ${DockerProcess.#TIMEOUT / 1000}s for connection...`);
        await sleep(DockerProcess.#TIMEOUT);
    }

    async stopDockerDB(){
        if(this.#status !== DockerActionStatus.running) return ;

        console.log("Stop Docker DB")

        this.#status = DockerActionStatus.stopping;
        await execCommand(`cd ${__dirname}/../../.db && ./stop-sql-server.sh`);
        this.#status = DockerActionStatus.stopping;
    }

}
