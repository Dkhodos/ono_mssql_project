import SqlServer from "../sqlServer/sqlServer.js";
import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";
import {TABLES} from "../consts.js";


describe("Test SQL init data", () => {
    let sqlServer: SqlServer;

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test("Test init for", async () => {
        const verifyTablesAction = new SqlAction(sqlServer, 'verify-all-tables.sql');
        const results = await verifyTablesAction.execute();

        const recivedTables = results['recordset'].map(({TABLE_NAME}: {TABLE_NAME: string}) => TABLE_NAME).sort();
        const expectedTables = TABLES.sort();

        expect(recivedTables).toStrictEqual(expectedTables);
    });
})
