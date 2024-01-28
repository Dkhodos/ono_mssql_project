import {DockerProcess} from "./processes/dockerProcess.js";
import SqlServer from "./sqlServer/index.js";
import {SqlAction} from "./sqlServer/sqlAction.js";
import {dbConfig} from "./dbConfig.js";
import fs from 'fs/promises'


const dockerProcess = new DockerProcess();

export const TestUtils = {
    startDB: async () => {
        try {
            await dockerProcess.startDockerDB();
        } catch (e){
            console.error(e);
            await fs.writeFile("error.log", String(e), 'utf8')
            throw new Error(e)
        }
    },

    initSqlDB: async () => {
        const sqlServer = new SqlServer(dbConfig);
        const initAction = new SqlAction(sqlServer, "init-db.sql");
        await initAction.execute();
    },

    destroySqlDb: async () => {
        try {
            await dockerProcess.stopDockerDB();
        } catch (e){
            console.error(e);
            throw new Error(e)
        }
    },

    clearSqlDb: async () => {
        const sqlServer = new SqlServer(dbConfig);
        const action = new SqlAction(sqlServer,"drop-tables.sql");
        await action.execute();
    }
}
