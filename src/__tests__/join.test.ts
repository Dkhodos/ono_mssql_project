import { User, UserGenerator } from '../dataGenerators/UserGenerator.js';
import {
  Content,
  ContentGenerator,
} from '../dataGenerators/ContentGenerator.js';
import {
  Interaction,
  InteractionGenerator,
} from '../dataGenerators/InteractionGenerator.js';
import {
  ContentTag,
  ContentTagGenerator,
} from '../dataGenerators/ContentTagGenerator.js';
import { Tag, TagGenerator } from '../dataGenerators/TagGenerator.js';
import { Media, MediaGenerator } from '../dataGenerators/MediaGenerator.js';
import { TestUtils } from '../testUtils.js';
import SqlServer from '../sqlServer/sqlServer.js';
import { SqlAction } from '../sqlServer/sqlAction.js';

describe('SQL Join data', () => {
  const userGenerator = new UserGenerator();
  const contentGenerator = new ContentGenerator();
  const interactionGenerator = new InteractionGenerator();
  const contentTagGenerator = new ContentTagGenerator();
  const tagGenerator = new TagGenerator();
  const mediaGenerator = new MediaGenerator(); // Assuming this generator exists

  const userIDs = [
    '3bba9c78-afb6-4002-bab5-805cdbe562c8',
    '8babf01f-cfeb-4d9e-b41f-723277cbf0f1',
    'f65337b8-2d73-4269-ab74-c25bac081001',
  ].map((item) => item.toUpperCase());

  const contentIDs = [
    'a2d53dc8-c911-41b9-b853-3efe93262ed6',
    '958044e9-1271-456f-9344-885204c87475',
    'f0bbd4fb-3f94-4718-8178-ff32c2f0b749',
  ].map((item) => item.toUpperCase());

  const tagIDs = [
    'ad4f2da8-ac62-4b37-b744-65b3ad9704ff',
    'bfaae58d-dc12-472f-bbf8-d4a6bb9aa74b',
    '0e3d82b4-870d-45c2-8a8f-7defd54f0183',
    '72d9c265-8e6a-4fd2-8623-d1e862737b40',
    '2f0e1567-4083-4f49-b6f6-4fe5009c3ca9',
  ].map((item) => item.toUpperCase());

  let sqlServer: SqlServer;

  beforeEach(async () => {
    sqlServer = await TestUtils.initSqlDB();
  });

  test('Interaction Dates Selection Based on Source and Tag Count', async () => {
    // Generate and insert users
    const users = userIDs.map((id) => new User({ id }));
    const usersQuery = userGenerator.generateQuery(users);
    await sqlServer.execute(usersQuery);

    // Generate and insert content
    const contents = [
      new Content({ id: contentIDs[0], user_id: userIDs[0] }),
      new Content({ id: contentIDs[1], user_id: userIDs[1] }),
      new Content({ id: contentIDs[2], user_id: userIDs[2] }),
    ];
    const contentsQuery = contentGenerator.generateQuery(contents);
    await sqlServer.execute(contentsQuery);

    const tags = [
      new Tag({ id: tagIDs[0], name: 'Tag1' }),
      new Tag({ id: tagIDs[1], name: 'Tag2' }),
      new Tag({ id: tagIDs[2], name: 'Tag3' }),
    ];
    const tagsQuery = tagGenerator.generateQuery(tags);
    await sqlServer.execute(tagsQuery);

    // Generate and insert content tags
    const contentTags = [
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[0] }),
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[1] }), // Content with multiple tags
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[2] }),
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[1] }), // Another content with multiple tags
      new ContentTag({ content_id: contentIDs[2], tag_id: tagIDs[2] }), // Content with single tag
    ];
    const contentTagsQuery = contentTagGenerator.generateQuery(contentTags);
    await sqlServer.execute(contentTagsQuery);

    // Generate and insert interactions
    const interactions = [
      new Interaction({
        user_id: userIDs[0],
        content_id: contentIDs[0],
        type: 'Like',
        date: new Date('2024-01-01'),
      }),
      new Interaction({
        user_id: userIDs[1],
        content_id: contentIDs[1],
        type: 'Like',
        date: new Date('2024-01-02'),
      }),
      new Interaction({
        user_id: userIDs[2],
        content_id: contentIDs[2],
        type: 'Comment',
        date: new Date('2024-01-03'),
      }),
    ];
    const interactionsQuery = interactionGenerator.generateQuery(interactions);
    await sqlServer.execute(interactionsQuery);

    const action = new SqlAction(
      sqlServer,
      'select_interaction_dates_based_on_tags.sql'
    );
    const results = await action.execute();

    // Expected dates based on the interactions and content tags
    const expectedDates = [new Date('2024-01-01'), new Date('2024-01-02')];
    expect(
      results['recordset'].map(({ date }: { date: string }) => date)
    ).toStrictEqual(expectedDates);
  });

  test('Select Content Text Where No Corresponding Media', async () => {
    // Static arrays of Users, Contents, Tags, and ContentTags
    const users = [
      new User({ id: userIDs[0] }),
      new User({ id: userIDs[1] }),
      new User({ id: userIDs[2] }),
    ];

    const contents = [
      new Content({ id: contentIDs[0], user_id: userIDs[0] }),
      new Content({ id: contentIDs[1], user_id: userIDs[1] }),
      new Content({ id: contentIDs[2], user_id: userIDs[2] }),
    ];

    const tags = [
      new Tag({ id: tagIDs[0], name: 'Tag1' }),
      new Tag({ id: tagIDs[1], name: 'Tag2' }),
      new Tag({ id: tagIDs[2], name: 'Tag3' }),
    ];

    const contentTags = [
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[0] }),
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[1] }),
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[2] }),
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[1] }),
      new ContentTag({ content_id: contentIDs[2], tag_id: tagIDs[2] }),
    ];

    // Insert data into the database
    const userQuery = userGenerator.generateQuery(users);
    const contentQuery = contentGenerator.generateQuery(contents);
    const tagQuery = tagGenerator.generateQuery(tags);
    const contentTagQuery = contentTagGenerator.generateQuery(contentTags);
    await sqlServer.execute(userQuery);
    await sqlServer.execute(contentQuery);
    await sqlServer.execute(tagQuery);
    await sqlServer.execute(contentTagQuery);

    // Media records - only add to some contents to test the query
    const mediaRecords = [
      new Media({
        content_id: contentIDs[0],
        media_type: 'Image',
        url: 'https://example.com/image1.jpg',
      }),
      // Do not add media for contentIDs[1] to test the query
      new Media({
        content_id: contentIDs[2],
        media_type: 'Video',
        url: 'https://example.com/video1.mp4',
      }),
    ];
    await sqlServer.execute(mediaGenerator.generateQuery(mediaRecords));

    // Execute the SQL query and test
    const action = new SqlAction(sqlServer, 'select-content-text-no-media.sql');
    const results = await action.execute();
    const expectedTexts = [contents[1].text]; // Only the text of the second content should be selected

    expect(
      results['recordset'].map(({ text }: { text: string }) => text)
    ).toStrictEqual(expectedTexts);
  });

  test('Select Content Text Where is Corresponding Media Exists', async () => {
    // Static arrays of Users, Contents, Tags, and ContentTags
    const users = [
      new User({ id: userIDs[0] }),
      new User({ id: userIDs[1] }),
      new User({ id: userIDs[2] }),
    ];

    const contents = [
      new Content({ id: contentIDs[0], user_id: userIDs[0] }),
      new Content({ id: contentIDs[1], user_id: userIDs[1] }),
      new Content({ id: contentIDs[2], user_id: userIDs[2] }),
    ];

    const tags = [
      new Tag({ id: tagIDs[0], name: 'Tag1' }),
      new Tag({ id: tagIDs[1], name: 'Tag2' }),
      new Tag({ id: tagIDs[2], name: 'Tag3' }),
    ];

    const contentTags = [
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[0] }),
      new ContentTag({ content_id: contentIDs[0], tag_id: tagIDs[1] }),
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[2] }),
      new ContentTag({ content_id: contentIDs[1], tag_id: tagIDs[1] }),
      new ContentTag({ content_id: contentIDs[2], tag_id: tagIDs[2] }),
    ];

    // Insert data into the database
    await sqlServer.execute(userGenerator.generateQuery(users));
    await sqlServer.execute(contentGenerator.generateQuery(contents));
    await sqlServer.execute(tagGenerator.generateQuery(tags));
    await sqlServer.execute(contentTagGenerator.generateQuery(contentTags));

    // Media records - only add to some contents to test the query
    const mediaRecords = [
      new Media({
        content_id: contentIDs[0],
        media_type: 'Image',
        url: 'https://example.com/image1.jpg',
      }),
      // Do not add media for contentIDs[1] to test the query
      new Media({
        content_id: contentIDs[2],
        media_type: 'Video',
        url: 'https://example.com/video1.mp4',
      }),
    ];
    await sqlServer.execute(mediaGenerator.generateQuery(mediaRecords));

    // Execute the SQL query and test
    const action = new SqlAction(
      sqlServer,
      'select-content-with-text-with-media.sql'
    );
    const results = await action.execute();
    const expectedTexts = [
      { text: contents[0].text },
      { text: contents[2].text },
    ];
    expect(results['recordset']).toStrictEqual(expectedTexts);
  });
});
