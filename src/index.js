import {dbConfig} from './dbConfig.js';
import SqlServer from "./sqlServer/index.js";
import {SqlAction} from "./sqlServer/sqlAction.js";
import {DockerProcess} from "./processes/dockerProcess.js";

async function main() {
    const dockerProcess = new DockerProcess();
    await dockerProcess.startDockerDB();

    const sqlServer = new SqlServer(dbConfig);
    await sqlServer.connect();

    try {
        console.log("## start docker azure DB##")

        console.log("## Initialize data base ##");
        const initAction = new SqlAction(sqlServer, "init-db.sql");
        await initAction.execute();

        console.log("## Create 3 users ##")
        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Users');
        console.log("Users", result);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sqlServer.disconnect();
        await dockerProcess.stopDockerDB();
        console.log("All Done :)")
    }
}

main().catch(console.error);
