import fs from 'fs/promises'
import * as path from 'path'
import { fileURLToPath } from 'url';
import SqlServer from "./sqlServer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export class SqlAction {
    fileName;
    sqlServer;
    constructor(sqlServer: SqlServer, fileName: string) {
        this.fileName = fileName;
        this.sqlServer = sqlServer;
    }

    async execute(){
        const filePath = path.resolve(__dirname, "../queries/", this.fileName);
        const file = await fs.readFile(filePath, 'utf8');

        console.log(`## executing ${this.fileName} ##`);
        console.log(file);

        return await this.sqlServer.execute(file)
    }
}
