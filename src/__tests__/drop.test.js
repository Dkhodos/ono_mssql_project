import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";

describe("Test SQL drop data", () => {
    let sqlServer;

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test("Test drop db", async () => {
        const dropAction = new SqlAction(sqlServer, 'drop-tables.sql');
        await dropAction.execute();

        const verifyTablesAction = new SqlAction(sqlServer, 'verify-all-tables.sql');
        const results = await verifyTablesAction.execute();

        expect(results['recordset'].length === 0).toBeTruthy();
    });
})
