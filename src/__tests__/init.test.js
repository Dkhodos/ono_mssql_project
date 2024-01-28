import {TestUtils} from "../testUtils.js";

describe("Test SQL init data", () => {
    let sqlServer;

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test.each([
        'Users',
        'Tags',
        'Segments',
        'Content',
        'Media',
        'Content_Tags',
        'Interactions',
        'Segment_Tags',
        'Segment_Users',
        'Recommendations'
    ])("Test init for: %s", async (tableName) => {
        const result = await sqlServer.execute(`SELECT * FROM ${tableName}`);
        expect(result['recordset'].length).toBe(0)
    });
})
