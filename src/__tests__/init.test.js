import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";
import {TABLES} from "../consts.js";

describe("Test SQL init data", () => {
    let sqlServer;

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test("Test init for", async () => {
        const verifyTablesAction = new SqlAction(sqlServer, 'verify-all-tables.sql');
        const results = await verifyTablesAction.execute();

        expect(results['recordset']).toBeTruthy(TABLES);
    });
})
