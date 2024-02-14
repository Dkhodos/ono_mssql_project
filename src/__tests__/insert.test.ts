import SqlServer from "../sqlServer/sqlServer.js";
import {TestUtils} from "../testUtils.js";
import {SqlAction} from "../sqlServer/sqlAction.js";
import getSortByKey from "../utils/getSortByKey.js";

const interactionSorter = getSortByKey("user_id");
const userSorter = getSortByKey('id');
const contentSorter = getSortByKey('user_id');
const mediaSorter = getSortByKey('content_id');

describe("Test SQL Inset data", () => {
    let sqlServer: SqlServer;

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
              id: '26102B74-F154-4592-97FF-A3255C9266B5',
              email: 'madona@gmail.com',
              demographic: 'Demographic 3',
              date_of_birth: new Date("2023-03-07T00:00:00.000Z"),
              friend_count: 2500
            },
            {
              id: '9485B8DB-BE44-4131-99F2-F90C4025DE46',
              email: 'jay.z@gmail.com',
              demographic: 'Demographic 3',
              date_of_birth: new Date("2010-11-07T00:11:11.000Z"),
              friend_count: 1000
            },
            {
              id: '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965',
              email: 'michael.jackson@gmail.com',
              demographic: 'Demographic 3',
              date_of_birth: new Date("2000-03-03T00:00:00.000Z"),
              friend_count: 25
            },
        ].sort(userSorter)

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const result = await sqlServer.execute('SELECT * FROM Users');
        const recordset = result['recordset'].sort(userSorter);

        for (let i = 0; i < expected.length; i++) {
            expect(recordset[i]['id']).toStrictEqual(expected[i]['id']);
            expect(recordset[i]['email']).toStrictEqual(expected[i]['email']);
            expect(recordset[i]['demographic']).toStrictEqual(expected[i]['demographic']);
            expect(recordset[i]['friend_count']).toStrictEqual(expected[i]['friend_count']);
        }
    });

    test("Insert 5 new Contents with 2 medias: create-content.sql", async () => {
        const expectedContent = [
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
              external_link: 'https://comedyshows.example.com/mike-myers/buyme',
            },
            {
              id: '28D7A6E2-0029-4EE9-A5D1-79593DA7420B',
              user_id: 'A20D6D3F-6989-4943-8112-9A8FFCC86280',
              type: 'Post',
              text: "In the Beginning there was nothing ... then Chuck Norris roundhouse kicked nothing and told it to get a job.",
              external_link: null,
            },
            {
              id: 'B95B6CC9-B477-45BD-8601-A46EB872C13F',
              user_id: '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965',
              type: 'Post',
              text: "Cause this is thriller, thriller night...",
              external_link: null,
            },
            {
              id: '225A3539-4DFC-4182-A0ED-D36E0D08A426',
              user_id: '26102B74-F154-4592-97FF-A3255C9266B5',
              type: 'Ad',
              text: "How to become a pop start...",
              external_link: "www.totally-real-madona.xyz",
            }
        ].sort(contentSorter);

        const expectedMedia = [
          {
            content_id: '402C3EE9-DCEA-4073-9616-4AF99D518764',
            media_type: 'Image',
            url: 'https://comedyshows.example.com/mike-myers/buyme/image.png'
          },
          {
            content_id: '28D7A6E2-0029-4EE9-A5D1-79593DA7420B',
            media_type: 'Video',
            url: 'https://meta.com/video/chuck-media'
          }
        ].sort(mediaSorter);

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const contentCreationAction = new SqlAction(sqlServer, "create-content.sql");
        await contentCreationAction.execute();

        const content = await sqlServer.execute('SELECT * FROM Content');
        const contentRecordset = content['recordset'].sort(contentSorter);
        for (let i = 0; i < expectedContent.length; i++) {
            expect(contentRecordset[i]['id']).toStrictEqual(expectedContent[i]['id']);
            expect(contentRecordset[i]['user_id']).toStrictEqual(expectedContent[i]['user_id']);
            expect(contentRecordset[i]['type']).toStrictEqual(expectedContent[i]['type']);
            expect(contentRecordset[i]['text']).toStrictEqual(expectedContent[i]['text']);
            expect(contentRecordset[i]['external_link']).toStrictEqual(expectedContent[i]['external_link']);
        }

        const media = await sqlServer.execute('SELECT * FROM Media')
        const mediaRecordset = media['recordset'].sort(mediaSorter)
        for (let i = 0; i < expectedMedia.length; i++) {
            expect(mediaRecordset[i]['content_id']).toStrictEqual(expectedMedia[i]['content_id']);
            expect(mediaRecordset[i]['media_type']).toStrictEqual(expectedMedia[i]['media_type']);
            expect(mediaRecordset[i]['url']).toStrictEqual(expectedMedia[i]['url']);
        }
    });

    test("Insert 5 new Interactions: create-interactions.sql", async () => {
        const expected = [
          {
            "user_id": "44A4BB81-DEFF-41BC-AF2B-FAA964EDC965",
            "content_id": "AAAC36FF-62B4-463F-8521-259D840A9D6D",
            "type": "Like",
            "content": null,
            "source": "discovery",
            "time_spent": "0",
            "date": "2024-02-14T20:59:16.163Z"
          },
          {
            "user_id": "44A4BB81-DEFF-41BC-AF2B-FAA964EDC965",
            "content_id": "28D7A6E2-0029-4EE9-A5D1-79593DA7420B",
            "type": "Share",
            "content": null,
            "source": "discovery",
            "time_spent": "0",
            "date": "2024-02-14T20:59:16.163Z"
          },
          {
            "user_id": "ECE7C609-7316-48A1-8719-A223B2F4EB3B",
            "content_id": "B95B6CC9-B477-45BD-8601-A46EB872C13F",
            "type": "Comment",
            "content": "Thrilling indeed!",
            "source": "discovery",
            "time_spent": "0",
            "date": "2024-02-14T20:59:16.163Z"
          },
          {
            "user_id": "A20D6D3F-6989-4943-8112-9A8FFCC86280",
            "content_id": "AAAC36FF-62B4-463F-8521-259D840A9D6D",
            "type": "Like",
            "content": null,
            "source": "discovery",
            "time_spent": "0",
            "date": "2024-02-14T20:59:16.163Z"
          },
          {
            "user_id": "9485B8DB-BE44-4131-99F2-F90C4025DE46",
            "content_id": "402C3EE9-DCEA-4073-9616-4AF99D518764",
            "type": "Share",
            "content": null,
            "source": "discovery",
            "time_spent": "0",
            "date": "2024-02-14T20:59:16.163Z"
          }
        ].sort(interactionSorter);

        const userCreationAction = new SqlAction(sqlServer, "create-users.sql");
        await userCreationAction.execute();

        const contentCreationAction = new SqlAction(sqlServer, "create-content.sql");
        await contentCreationAction.execute();

        const interactionsCreationAction = new SqlAction(sqlServer, "create-interactions.sql");
        await interactionsCreationAction.execute();

        let result = await sqlServer.execute('SELECT * FROM Interactions');
        result = [...result['recordset']].sort(interactionSorter);

        for (let i = 0; i < expected.length; i++) {
            expect(result[i]['user_id']).toStrictEqual(expected[i]['user_id']);
            expect(result[i]['content_id']).toStrictEqual(expected[i]['content_id']);
            expect(result[i]['type']).toStrictEqual(expected[i]['type']);
            expect(result[i]['content']).toStrictEqual(expected[i]['content']);
            expect(result[i]['source']).toStrictEqual(expected[i]['source']);
            expect(result[i]['time_spent']).toStrictEqual(expected[i]['time_spent']);
        }
    });
})
