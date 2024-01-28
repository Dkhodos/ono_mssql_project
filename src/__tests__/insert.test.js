import {SqlAction} from "../sqlServer/sqlAction.js";
import {TestUtils} from "../testUtils.js";
describe("Test SQL Inset data", () => {
    let sqlServer;

    beforeEach(async () => {
        sqlServer = await TestUtils.initSqlDB();
    });

    test("Insert 3 new Users: create-users.sql", async () => {
        const expected = [
            {
              id: 'A20D6D3F-6989-4943-8112-9A8FFCC86280',
              email: 'chuck.norris@gmail.com',
              demographic: 'Demographic 2',
              date_of_birth: new Date("1990-02-02T00:00:00.000Z"),
              friend_count: 15
            },
            {
              id: 'ECE7C609-7316-48A1-8719-A223B2F4EB3B',
              email: 'mike.myres@gmail.com',
              demographic: 'Demographic 1',
              date_of_birth: new Date("1980-01-01T00:00:00.000Z"),
              friend_count: 5
            },
            {
              id: '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965',
              email: 'michael.jackson@gmail.com',
              demographic: 'Demographic 3',
              date_of_birth: new Date("2000-03-03T00:00:00.000Z"),
              friend_count: 25
            }
        ]

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Users');

        for (let i = 0; i < expected.length; i++) {
            expect(result['recordset'][i]['id']).toStrictEqual(expected[i]['id']);
            expect(result['recordset'][i]['email']).toStrictEqual(expected[i]['email']);
            expect(result['recordset'][i]['demographic']).toStrictEqual(expected[i]['demographic']);
            expect(result['recordset'][i]['friend_count']).toStrictEqual(expected[i]['friend_count']);
        }
    });

    test("Insert 3 new Contents: create-content.sql", async () => {
        const expected = [
            {
              id: 'AAAC36FF-62B4-463F-8521-259D840A9D6D',
              user_id: 'A20D6D3F-6989-4943-8112-9A8FFCC86280',
              type: 'Post',
              text: 'Martial Arts Training Tips',
              external_link: 'https://martialarts.example.com',
            },
            {
              id: '402C3EE9-DCEA-4073-9616-4AF99D518764',
              user_id: 'ECE7C609-7316-48A1-8719-A223B2F4EB3B',
              type: 'Ad',
              text: 'Check out the Latest Comedy Shows!',
              external_link: 'https://comedyshows.example.com',
            }
        ];

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const contentCreationAction = new SqlAction(sqlServer, "create-content.sql");
        await contentCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Content');
        for (let i = 0; i < expected.length; i++) {
            expect(result['recordset'][i]['id']).toStrictEqual(expected[i]['id']);
            expect(result['recordset'][i]['user_id']).toStrictEqual(expected[i]['user_id']);
            expect(result['recordset'][i]['type']).toStrictEqual(expected[i]['type']);
            expect(result['recordset'][i]['text']).toStrictEqual(expected[i]['text']);
            expect(result['recordset'][i]['external_link']).toStrictEqual(expected[i]['external_link']);
        }
    });

    test("Insert 3 new Interactions: create-interactions.sql", async () => {
        const expected = [
              {
                user_id: '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965',
                content_id: 'AAAC36FF-62B4-463F-8521-259D840A9D6D',
                type: 'Like',
                content: null,
                source: 'discovery',
                time_spent: '0',
              },
              {
                user_id: '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965',
                content_id: 'AAAC36FF-62B4-463F-8521-259D840A9D6D',
                type: 'Share',
                content: null,
                source: 'discovery',
                time_spent: '0',
              },
              {
                user_id: 'ECE7C609-7316-48A1-8719-A223B2F4EB3B',
                content_id: 'AAAC36FF-62B4-463F-8521-259D840A9D6D',
                type: 'Comment',
                content: 'Great tips on martial arts!',
                source: 'discovery',
                time_spent: '120',
              }
        ];

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const contentCreationAction = new SqlAction(sqlServer, "create-content.sql");
        await contentCreationAction.execute();

        const interactionsCreationAction = new SqlAction(sqlServer, "create-interactions.sql");
        await interactionsCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Interactions');
        for (let i = 0; i < expected.length; i++) {
            expect(result['recordset'][i]['user_id']).toStrictEqual(expected[i]['user_id']);
            expect(result['recordset'][i]['content_id']).toStrictEqual(expected[i]['content_id']);
            expect(result['recordset'][i]['type']).toStrictEqual(expected[i]['type']);
            expect(result['recordset'][i]['content']).toStrictEqual(expected[i]['content']);
            expect(result['recordset'][i]['source']).toStrictEqual(expected[i]['source']);
            expect(result['recordset'][i]['time_spent']).toStrictEqual(expected[i]['time_spent']);
        }
    });
})
