import {User, UserGenerator} from "../dataGenerators/UserGenerator.js";
import SqlServer from "../sqlServer/sqlServer.js";
import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";
import {expect} from "vitest";
import {Recommendation, RecommendationGenerator} from "../dataGenerators/RecommendationGenerator.js";
import {Segment, SegmentGenerator} from "../dataGenerators/SegementsGenerator.js";
import {Content, ContentGenerator} from "../dataGenerators/ContentGenerator.js";
import {c} from "vitest/dist/reporters-5f784f42.js";

describe('SQL update data', () => {
    const userGenerator = new UserGenerator();
    const recommendationGenerator = new RecommendationGenerator();
    const segmentGenerator = new SegmentGenerator();
    const contentGenerator = new ContentGenerator();

    let sqlServer: SqlServer;

    beforeEach(async () => {
     sqlServer = await TestUtils.initSqlDB();
    });

    test('Update all users with a "USA" demographic to "United States"', async () => {
        const users = [
            new User({demographic: 'USA'}),
            new User({demographic: 'Canada'}),
        ]

        const query = userGenerator.generateQuery(users);
        await sqlServer.execute(query);

        const results1 = await sqlServer.execute("SELECT * FROM Users WHERE demographic='USA'");
        expect(results1['recordset'].length).toBe(1);

        const results2 = await sqlServer.execute("SELECT * FROM Users WHERE demographic='United States'");
        expect(results2['recordset'].length).toBe(0);

        const action = new SqlAction(
          sqlServer,
          'update-demographic-for-usa-users.sql'
        );
        await action.execute();

        const results3 = await sqlServer.execute("SELECT * FROM Users WHERE demographic='USA'");
        expect(results3['recordset'].length).toBe(0);

        const results4 = await sqlServer.execute("SELECT * FROM Users WHERE demographic='United States'");
        expect(results4['recordset'].length).toBe(1);
    });


test('Move a specific recommendation to a new segment', async () => {
        // Specific UUIDs for segments and recommendation
        const segmentAId = '64EFEF9A-5682-42A9-8894-0A80811738D0';
        const segmentBId = 'DCAD39E6-8F67-4D2C-A423-A6E698BA8932';
        const recommendationId = '4dad31c7-049a-4f85-a5c8-1187d8275d01';
        const contentId = '3c840aab-2714-4ebc-a8f7-c809c0e87a89'; // Assuming this content ID exists

        const users = [
            new User({})
        ];

        await sqlServer.execute(userGenerator.generateQuery(users));

        const content = [
            new Content({user_id: users[0].id, id: contentId})
        ];

        await sqlServer.execute(contentGenerator.generateQuery(content));

        const segments = [
            new Segment({id: segmentAId, name: 'Segment A'}),
            new Segment({id: segmentBId, name: 'Segment B'})
        ];

        await sqlServer.execute(segmentGenerator.generateQuery(segments));

        const recommendations = [
            new Recommendation({
                id: recommendationId,
                segment_id: segments[0].id,
                content_id: content[0].id
            })
        ];

        await sqlServer.execute(recommendationGenerator.generateQuery(recommendations));

        // Verify the recommendation is associated with the first segment
        let results = await sqlServer.execute(`SELECT * FROM Recommendations WHERE id='${recommendationId}'`);
        expect(results['recordset'][0].segment_id).toBe(segmentAId);

        // Execute the SQL action to move the recommendation to the second segment
        const action = new SqlAction(
            sqlServer,
            'update-recommendations-segment.sql'
        );
        await action.execute();

        // Verify the recommendation is now associated with the second segment
        results = await sqlServer.execute(`SELECT * FROM Recommendations WHERE id='${recommendationId}'`);
        expect(results['recordset'][0].segment_id).toBe(segmentBId);
    });
})
