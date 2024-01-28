DECLARE @UserIdMikeMyers UNIQUEIDENTIFIER = 'ece7c609-7316-48a1-8719-a223b2f4eb3b';
DECLARE @UserIdChuckNorris UNIQUEIDENTIFIER = 'a20d6d3f-6989-4943-8112-9a8ffcc86280';

-- Predefined Content IDs
DECLARE @ContentIdMikeMyers UNIQUEIDENTIFIER = '402c3ee9-dcea-4073-9616-4af99d518764';
DECLARE @ContentIdChuckNorris UNIQUEIDENTIFIER = 'aaac36ff-62b4-463f-8521-259d840a9d6d';

-- Insert Content for Mike Myers
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES (@ContentIdMikeMyers, @UserIdMikeMyers, 'Ad', 'Check out the Latest Comedy Shows!', 'https://comedyshows.example.com', GETDATE());

-- Insert Content for Chuck Norris
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES (@ContentIdChuckNorris, @UserIdChuckNorris, 'Post', 'Martial Arts Training Tips', 'https://martialarts.example.com', GETDATE());

-- Variables for Media URLs
DECLARE @MediaUrlMikeMyers NVARCHAR(255) = 'https://example.com/mike-media';
DECLARE @MediaUrlChuckNorris NVARCHAR(255) = 'https://example.com/chuck-media';

-- Insert Media for Mike Myers' Content
INSERT INTO Media (id, content_id, media_type, url)
VALUES (NEWID(), @ContentIdMikeMyers, 'Image', @MediaUrlMikeMyers);

-- Insert Media for Chuck Norris' Content
INSERT INTO Media (id, content_id, media_type, url)
VALUES (NEWID(), @ContentIdChuckNorris, 'Video', @MediaUrlChuckNorris);
