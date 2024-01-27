import {dbConfig} from './dbConfig.js';
import {Action} from "./actions/action.js";
import SqlServer from "./sqlServer/index.js";
import {startDockerDB} from "./processes/startDockerDB.js";
import {stopDockerDB} from "./processes/stopDockerDB.js";

async function main() {
    await startDockerDB();

    const sqlServer = new SqlServer(dbConfig);
    await sqlServer.connect();

    try {
        console.log("## start docker azure DB##")

        console.log("## Initialize data base ##");
        const initAction = new Action(sqlServer, "init-db.sql");
        await initAction.execute();

        console.log("## Create 3 users ##")
        const userCreationAction = new Action(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Users');
        console.log("Users", result);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sqlServer.disconnect();
        await stopDockerDB();
        console.log("All Done :)")
    }
}

main().catch(console.error);
