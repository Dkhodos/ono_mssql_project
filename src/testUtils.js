import SqlServer from "./sqlServer/sqlServer.js";
import {SqlAction} from "./sqlServer/sqlAction.js";

export const TestUtils = {
    initSqlDB: async () => {
        const sqlServer = new SqlServer();
        await sqlServer.generateDB();
        const initAction = new SqlAction(sqlServer, "init-db.sql");
        await initAction.execute();
        return sqlServer;
    },
}
