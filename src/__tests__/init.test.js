import SqlServer from "../sqlServer/index.js";

describe("Test SQL init data", () => {
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
        const sqlServer = new SqlServer();
        const result = await sqlServer.execute(`SELECT * FROM ${tableName}`);
        expect(result['recordset'].length).toBe(0)
    });
})
