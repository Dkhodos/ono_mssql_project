import {DockerProcess} from "./processes/dockerProcess.js";
import SqlServer from "./sqlServer/sqlServer.js";
import {SqlAction} from "./sqlServer/sqlAction.js";


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
        const sqlServer = new SqlServer();
        await sqlServer.generateDB();
        const initAction = new SqlAction(sqlServer, "init-db.sql");
        await initAction.execute();
        return sqlServer;
    },

    destroySqlDb: async () => {
        try {
            await dockerProcess.stopDockerDB();
        } catch (e){
            console.error(e);
            throw new Error(e)
        }
    },
}
