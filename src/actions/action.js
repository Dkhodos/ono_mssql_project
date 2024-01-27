import fs from 'fs/promises'
import * as path from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export class Action{
    #fileName;
    #sqlServer;
    constructor(sqlServer, fileName) {
        this.#fileName = fileName;
        this.#sqlServer = sqlServer;
    }

    async execute(){
        const filePath = path.resolve(__dirname, "../queries/", this.#fileName);
        const file = await fs.readFile(filePath, 'utf8');

        console.log(`## executing ${this.#fileName} ##`);
        console.log(file);

        await this.#sqlServer.execute(file)
    }
}
