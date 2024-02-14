import { User, UserGenerator } from '../dataGenerators/UserGenerator.js';
import {
  Content,
  ContentGenerator,
} from '../dataGenerators/ContentGenerator.js';
import {
  Interaction,
  InteractionGenerator,
} from '../dataGenerators/InteractionGenerator.js';
import SqlServer from '../sqlServer/sqlServer.js';
import { TestUtils } from '../testUtils.js';
import { SqlAction } from '../sqlServer/sqlAction.js';

describe('SQL Inset data', () => {
  const userGenerator = new UserGenerator();
  const contentGenerator = new ContentGenerator();
  const interactionGenerator = new InteractionGenerator();

  const userIDs = [
    '3bba9c78-afb6-4002-bab5-805cdbe562c8',
    '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
    'f65337b8-2d73-4269-ab74-c25bac081001',
  ].map((item) => item.toUpperCase());

  let sqlServer: SqlServer;

  beforeEach(async () => {
    sqlServer = await TestUtils.initSqlDB();
  });

  test('Select Users by friend count', async () => {
    const users = [
      new User({ id: userIDs[0], friend_count: 15 }),
      new User({ friend_count: 3 }),
      new User({ id: userIDs[1], friend_count: 200 }),
      new User({ friend_count: 7 }),
      new User({ id: userIDs[2], friend_count: 400 }),
    ];

    const query = userGenerator.generateQuery(users);
    await sqlServer.execute(query);

    const action = new SqlAction(
      sqlServer,
      'select-users-with-friends-count.sql'
    );
    const results = await action.execute();
    const ids = results['recordset'].map(({ id }: { id: string }) => id);
    expect(ids.sort()).toStrictEqual(userIDs.sort());
  });

  test('Select Content by type and order by date', async () => {
    const users = userIDs.map((id) => new User({ id }));

    const userInsertQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(userInsertQuery);

    const contents = [
      new Content({
        user_id: userIDs[0],
        type: 'Post',
        text: 'Post Content 1',
        date: new Date('2024-01-01'),
      }),
      new Content({
        user_id: userIDs[1],
        type: 'Ad',
        text: 'Ad Content 1',
        date: new Date('2024-01-02'),
      }),
      new Content({
        user_id: userIDs[2],
        type: 'Link',
        text: 'News Content 1',
        date: new Date('2024-01-03'),
      }),
      new Content({
        user_id: userIDs[0],
        type: 'Post',
        text: 'Post Content 2',
        date: new Date('2024-01-04'),
      }),
      new Content({
        user_id: userIDs[1],
        type: 'Link',
        text: 'Review Content 1',
        date: new Date('2024-01-05'),
      }),
      new Content({
        user_id: userIDs[2],
        type: 'Ad',
        text: 'Ad Content 2',
        date: new Date('2024-01-06'),
      }),
    ];

    const expectedTexts = [
      'Post Content 1',
      'Ad Content 1',
      'Post Content 2',
      'Ad Content 2',
    ];

    const query = contentGenerator.generateQuery(contents);
    await sqlServer.execute(query);

    const action = new SqlAction(
      sqlServer,
      'select-content-by-type-order-by-date.sql'
    );
    const results = await action.execute();
    console.log(JSON.stringify(results['recordset'], null, 2));
    const texts = results['recordset'].map(
      ({ text }: { text: string }) => text
    );
    expect(texts).toStrictEqual(expectedTexts);
  });

  test('Select Interactions by source and time_spent', async () => {
    // Fixed user IDs
    const userIDs = [
      '3bba9c78-afb6-4002-bab5-805cdbe562c8',
      '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
      'f65337b8-2d73-4269-ab74-c25bac081001',
    ].map((item) => item.toUpperCase());

    // Generate and insert users
    const users = userIDs.map((id) => new User({ id }));
    const userInsertQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(userInsertQuery);

    // Generate and insert content
    const contents = userIDs.map((id) => new Content({ user_id: id }));
    const contentInsertQuery = contentGenerator.generateQuery(contents);
    await sqlServer.execute(contentInsertQuery);

    // Generate and insert interactions
    const interactions = [
      new Interaction({
        user_id: userIDs[0],
        content_id: contents[0].id,
        source: 'discovery',
        time_spent: 150,
        date: new Date('2024-01-01'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 50,
        date: new Date('2024-01-02'),
      }),
      new Interaction({
        user_id: userIDs[2],
        content_id: contents[2].id,
        source: 'other',
        time_spent: 200,
        date: new Date('2024-01-03'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 250,
        date: new Date('2024-01-04'),
      }),
    ];
    const interactionInsertQuery =
      interactionGenerator.generateQuery(interactions);
    await sqlServer.execute(interactionInsertQuery);

    const action = new SqlAction(
      sqlServer,
      'select-interactions-by-source-and-time.sql'
    );
    const results = await action.execute();

    const expectedResults = [
      { user_id: userIDs[0], time_spent: '150' },
      { user_id: userIDs[1], time_spent: '250' },
    ];

    expect(results['recordset']).toStrictEqual(expectedResults);
  });

  test('Select Interactions count for each user having more than 2 interactions', async () => {
    const userIDs = [
      '3bba9c78-afb6-4002-bab5-805cdbe562c8',
      '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
      'f65337b8-2d73-4269-ab74-c25bac081001',
    ].map((item) => item.toUpperCase());

    const users = userIDs.map((id) => new User({ id }));
    const userInsertQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(userInsertQuery);

    const contents = userIDs.map((id) => new Content({ user_id: id }));
    const contentInsertQuery = contentGenerator.generateQuery(contents);
    await sqlServer.execute(contentInsertQuery);

    const interactions = [
      new Interaction({
        user_id: userIDs[0],
        content_id: contents[0].id,
        source: 'discovery',
        time_spent: 150,
        date: new Date('2024-01-01'),
      }),
      new Interaction({
        user_id: userIDs[0],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 50,
        date: new Date('2024-01-02'),
      }),
      new Interaction({
        user_id: userIDs[0],
        content_id: contents[0].id,
        source: 'other',
        time_spent: 50,
        date: new Date('2024-01-02'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contents[2].id,
        source: 'other',
        time_spent: 200,
        date: new Date('2024-01-03'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 250,
        date: new Date('2024-01-04'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 250,
        date: new Date('2024-01-04'),
      }),
      new Interaction({
        user_id: userIDs[2],
        content_id: contents[1].id,
        source: 'discovery',
        time_spent: 250,
        date: new Date('2024-01-04'),
      }),
    ];

    const interactionInsertQuery =
      interactionGenerator.generateQuery(interactions);
    await sqlServer.execute(interactionInsertQuery);

    const action = new SqlAction(
      sqlServer,
      'select-users-interactions-count-having-more-than-2-order-desc.sql'
    );
    const results = await action.execute();

    const expectedResults = [
      { user_id: userIDs[1], totalInteractions: 3 },
      { user_id: userIDs[0], totalInteractions: 3 },
    ];

    expect(results['recordset']).toStrictEqual(expectedResults);
  });

  test('Select Content count for each user having more than 1 content created', async () => {
    const userIDs = [
      '3bba9c78-afb6-4002-bab5-805cdbe562c8',
      '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
    ].map((item) => item.toUpperCase());

    const users = userIDs.map((id) => new User({ id }));
    const userInsertQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(userInsertQuery);

    const contents = [
      new Content({
        user_id: userIDs[0],
      }),
      new Content({
        user_id: userIDs[0],
      }),
      new Content({
        user_id: userIDs[1],
      }),
    ];

    const contentInsertQuery = contentGenerator.generateQuery(contents);
    await sqlServer.execute(contentInsertQuery);

    const action = new SqlAction(
      sqlServer,
      'select-users-content-count-having-more-than-1.sql'
    );
    const results = await action.execute();

    const expectedResults = [{ user_id: userIDs[0], NumberOfContents: 2 }];

    expect(results['recordset']).toStrictEqual(expectedResults);
  });

  test('Select Contents where length is bigger than 10 order desc', async () => {
    const userIDs = [
      '3bba9c78-afb6-4002-bab5-805cdbe562c8',
      '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
    ].map((item) => item.toUpperCase());

    const users = userIDs.map((id) => new User({ id }));
    const userInsertQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(userInsertQuery);

    const contents = [
      new Content({
        user_id: userIDs[0],
        text: 'This is a long text',
        id: 'BC3C913D-361F-47CD-807F-F55BF9A931B4',
        type: 'complectus',
        external_link: 'https://lovely-jalapeno.biz/',
        date: new Date('2024-01-01'),
      }),
      new Content({
        user_id: userIDs[0],
        text: 'short',
      }),
      new Content({
        id: '1F42EA48-351B-49ED-885D-34BAD7D2358F',
        user_id: userIDs[1],
        text: 'Another long text',
        type: 'stipes',
        external_link: 'https://smooth-lawn.com',
        date: new Date('2024-01-01'),
      }),
    ];

    const contentInsertQuery = contentGenerator.generateQuery(contents);
    await sqlServer.execute(contentInsertQuery);

    const action = new SqlAction(
      sqlServer,
      'select-contents-with-length-bigger-than-10-order-desc.sql'
    );
    const results = await action.execute();

    const expectedResults = [
      {
        user_id: userIDs[0],
        text: 'This is a long text',
        id: 'BC3C913D-361F-47CD-807F-F55BF9A931B4',
        type: 'complectus',
        external_link: 'https://lovely-jalapeno.biz/',
        date: new Date('2024-01-01'),
      },
      {
        id: '1F42EA48-351B-49ED-885D-34BAD7D2358F',
        user_id: userIDs[1],
        text: 'Another long text',
        type: 'stipes',
        external_link: 'https://smooth-lawn.com',
        date: new Date('2024-01-01'),
      },
    ];

    expect(results['recordset']).toStrictEqual(expectedResults);
  });
});
