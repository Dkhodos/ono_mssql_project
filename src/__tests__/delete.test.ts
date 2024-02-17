import {User, UserGenerator} from "../dataGenerators/UserGenerator.js";
import {Content, ContentGenerator} from "../dataGenerators/ContentGenerator.js";
import SqlServer from "../sqlServer/sqlServer.js";
import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";
import {Recommendation, RecommendationGenerator} from "../dataGenerators/RecommendationGenerator.js";
import {Segment, SegmentGenerator} from "../dataGenerators/SegementsGenerator.js";
import {expect} from "vitest";


describe("Content Deletion", () => {
    const userGenerator = new UserGenerator();
    const contentGenerator = new ContentGenerator();
    const recommendationGenerator = new RecommendationGenerator();
    const segmentGenerator = new SegmentGenerator();

    let sqlServer: SqlServer;

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
        const remainingContents = results['recordset'].map(({ id }: {id: string}) => id);
        const expectedRemainingContentIds = [contentIDs[0], contentIDs[2]];
        expect(remainingContents).toStrictEqual(expectedRemainingContentIds);
    });

    test("Delete Recommendations associated with the user's content", async () => {
        const users = [
            new User({id: userIDs[0]}),
            new User({id: userIDs[1]}),
            new User({id: userIDs[2]}),
        ]

        const contents = [
            new Content({user_id: users[0].id}),
            new Content({user_id: users[1].id}),
            new Content({user_id: users[2].id} ),
            new Content({user_id: users[1].id}),
        ]

        const segments = [
            new Segment({}),
            new Segment({}),
        ]

        const recommendations = [
            new Recommendation({content_id: contents[1].id, segment_id: segments[0].id}),
            new Recommendation({content_id: contents[1].id, segment_id: segments[1].id}),
            new Recommendation({content_id: contents[2].id, segment_id: segments[0].id}),
            new Recommendation({content_id: contents[1].id, segment_id: segments[1].id}),
            new Recommendation({content_id: contents[2].id, segment_id: segments[0].id}),
            new Recommendation({content_id: contents[0].id, segment_id: segments[1].id}),
        ]

        await sqlServer.execute(userGenerator.generateQuery(users));
        await sqlServer.execute(contentGenerator.generateQuery(contents));
        await sqlServer.execute(segmentGenerator.generateQuery(segments));
        await sqlServer.execute(recommendationGenerator.generateQuery(recommendations));

        const action = new SqlAction(sqlServer, "delete-specific-recommendations-by-content.sql");
        await action.execute();

        const expectedRecommendationsIds = recommendations.filter(r => r.content_id != contents[1].id)
            .map(({id}) => id.toUpperCase()).sort();

        const a = await sqlServer.execute('SELECT * from Recommendations');
        console.log(JSON.stringify(a['recordset'], null));

        const recommendationsResults = await sqlServer.execute('SELECT id from Recommendations');
        const recommendationsResultsIds = recommendationsResults['recordset'].map(({ id }: {id: string}) => id).sort();
        expect(recommendationsResultsIds).toStrictEqual(expectedRecommendationsIds);
    })
});
