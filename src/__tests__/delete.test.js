import { SqlAction } from "../sqlServer/sqlAction.js";
import { TestUtils } from "../testUtils.js";
import { User, UserGenerator } from "../dataGenerators/UserGenerator.js";
import { Content, ContentGenerator } from "../dataGenerators/ContentGenerator.js";

describe("Content Deletion", () => {
    const userGenerator = new UserGenerator();
    const contentGenerator = new ContentGenerator();
    let sqlServer;

    // Fixed UUIDs for Users
    const userIDs = [
        "3bba9c78-afb6-4002-bab5-805cdbe562c8",
        "8babf01f-cfeb-4d9e-b41f-723277cbf0f1",
        "f65337b8-2d73-4269-ab74-c25bac081001"
    ].map(item => item.toUpperCase());

    const contentIDs = [
        "a2d53dc8-c911-41b9-b853-3efe93262ed6",
        "958044e9-1271-456f-9344-885204c87475",
        "f0bbd4fb-3f94-4718-8178-ff32c2f0b749"
    ].map(item => item.toUpperCase());

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test("Delete Content Containing Specific Text", async () => {
        // Create static array of Users and Contents
        const users = userIDs.map(id => new User({ id }));
        const contents = [
            new Content({id: contentIDs[0], user_id: userIDs[0], text: 'Content without specific text'}),
            new Content({id: contentIDs[1], user_id: userIDs[1], text: 'Content mentioning Hamas'}),
            new Content({id: contentIDs[2], user_id: userIDs[2], text: 'Another content without specific text'})
        ];

        // Insert data into the database
        await sqlServer.execute(userGenerator.generateQuery(users));
        await sqlServer.execute(contentGenerator.generateQuery(contents));

        // Perform the DELETE operation
        const deleteAction = new SqlAction(sqlServer, 'content-moderation-delete.sql')
        await deleteAction.execute();

        // Test to confirm the deletion
        const results = await sqlServer.execute(`SELECT id FROM Content`);
        const remainingContents = results['recordset'].map(({ id }) => id);
        const expectedRemainingContentIds = [contentIDs[0], contentIDs[2]];
        expect(remainingContents).toStrictEqual(expectedRemainingContentIds);
    });
});
