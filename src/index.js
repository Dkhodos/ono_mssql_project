import {dbConfig} from './dbConfig.js';
import {Action} from "./actions/action.js";
import SqlServer from "./sqlServer/index.js";

async function main() {
    const sqlServer = new SqlServer(dbConfig);
    await sqlServer.connect();

    try {
        console.log("## Initialize data base ##");
        const initAction = new Action(sqlServer, "init-db.sql");
        await initAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Users')

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sqlServer.disconnect();
    }
}

main();
