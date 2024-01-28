import {DockerProcess} from "./processes/dockerProcess.js";
import SqlServer from "./sqlServer/sqlServer.js";
import {SqlAction} from "./sqlServer/sqlAction.js";
import fs from 'fs/promises'


const dockerProcess = DockerProcess.getInstance();

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
        const sqlServer = new SqlServer();
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
        const sqlServer = new SqlServer();
        const action = new SqlAction(sqlServer,"drop-tables.sql");
        await action.execute();
    }
}
