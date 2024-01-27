# Rational Algebra with SQL
## Scheme creation
- **Notes**: 
	- Ideally we would use `NEWID()` to create a new `UUID4` but for the sake of the exercise we would use static values.
	- `GETDATE` - simply adds the current data by `UNIX` timestamp.
### Create `User` Table
```sql
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    email NVARCHAR(255) UNIQUE,
    demographic NVARCHAR(255),
    date_of_birth DATE,
    friend_count INT
);
```
### Create `Tags` Table
```sql
CREATE TABLE Tags (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(255) UNIQUE
);
```
### Create `Segments` Table
```sql
CREATE TABLE Segments (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(255)
);
```
### Create `Content` Table
```sql
CREATE TABLE Content (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id),
    type NVARCHAR(50),
    text NVARCHAR(MAX),
    external_link NVARCHAR(255),
    date DATETIME
);
```
### Create `Media` Table
```sql
CREATE TABLE Media (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    media_type NVARCHAR(50),
    url NVARCHAR(255)
);
```
### Create `Content_Tags` Table
```sql
CREATE TABLE Content_Tags (
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    tag_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Tags(id)
);
```
### Create `Interactions` Table
```sql
CREATE TABLE Interactions (
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id),
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    type NVARCHAR(50),
    content NVARCHAR(MAX),
    source NVARCHAR(50),
    time_spent BIGINT,
    date DATETIME
);
```
### Create `Segment_Tags` Table
```sql
CREATE TABLE Segment_Tags (
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id),
    tag_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Tags(id)
);
```
### Create `Segment_Users` Table
```sql
CREATE TABLE Segment_Users (
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id),
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id)
);
```
### Create `Recommendations` Table
```sql
CREATE TABLE Recommendations (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id)
);
```
## Inserts
### Create three new Users
```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES 
('ece7c609-7316-48a1-8719-a223b2f4eb3b', 'mike.myres@gmail.com', 'Demographic 1', '1980-01-01', 5),
('a20d6d3f-6989-4943-8112-9a8ffcc86280', 'chuck.norris@gmail.com', 'Demographic 2', '1990-02-02', 15),
('44a4bb81-deff-41bc-af2b-faa964edc965', 'michael.jackson@gmail.com', 'Demographic 3', '2000-03-03', 25);
```

### Every user create a new Content with Media
```sql
-- Variables for User IDs
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
```
### Users create interacts with content
```sql
DECLARE @UserIdMichaelJackson UNIQUEIDENTIFIER = '44a4bb81-deff-41bc-af2b-faa964edc965';
DECLARE @UserIdMikeMyers UNIQUEIDENTIFIER = 'ece7c609-7316-48a1-8719-a223b2f4eb3b';
DECLARE @ContentIdChuckNorris UNIQUEIDENTIFIER = 'aaac36ff-62b4-463f-8521-259d840a9d6d';

-- Michael Jackson's interactions
-- Likes content created by Chuck Norris
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES (@UserIdMichaelJackson, @ContentIdChuckNorris, 'Like', NULL, 'discovery', 0, GETDATE());

-- Shares content created by Chuck Norris
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES (@UserIdMichaelJackson, @ContentIdChuckNorris, 'Share', NULL, 'discovery', 0, GETDATE());

-- Mike Myers's interaction
-- Comments on content created by Chuck Norris
DECLARE @Comment NVARCHAR(MAX) = 'Great tips on martial arts!';
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES (@UserIdMikeMyers, @ContentIdChuckNorris, 'Comment', @Comment, 'discovery', 120, GETDATE());
```
## Updates
### Update Friend Count of Two Users (Increment)
```sql
DECLARE @UserIdMikeMyers UNIQUEIDENTIFIER = 'ece7c609-7316-48a1-8719-a223b2f4eb3b';
DECLARE @UserIdChuckNorris UNIQUEIDENTIFIER = 'a20d6d3f-6989-4943-8112-9a8ffcc86280';

-- Update friend count for Mike Myers
UPDATE Users
SET friend_count = friend_count + 2
WHERE id = @UserIdMikeMyers;

-- Update friend count for Chuck Norris
UPDATE Users
SET friend_count = friend_count + 4
WHERE id = @UserIdChuckNorris;
```
### Update Tags of All Contents (Auto meta tagging)
```sql
-- User IDs
DECLARE @UserIdMichaelJackson UNIQUEIDENTIFIER = '44a4bb81-deff-41bc-af2b-faa964edc965';
DECLARE @UserIdMikeMyers UNIQUEIDENTIFIER = 'ece7c609-7316-48a1-8719-a223b2f4eb3b';
DECLARE @UserIdChuckNorris UNIQUEIDENTIFIER = 'a20d6d3f-6989-4943-8112-9a8ffcc86280';

-- Content IDs
DECLARE @ContentIdMikeMyers UNIQUEIDENTIFIER = '402c3ee9-dcea-4073-9616-4af99d518764';
DECLARE @ContentIdChuckNorris UNIQUEIDENTIFIER = 'aaac36ff-62b4-463f-8521-259d840a9d6d';

-- Tag IDs
DECLARE @TagId1 UNIQUEIDENTIFIER = 'c6b6fa5a-f707-4028-9b5f-c51709fdaf00';
DECLARE @TagId2 UNIQUEIDENTIFIER = 'e555bae5-a7c7-4941-88f8-2cfbf5d129b0';
DECLARE @TagId3 UNIQUEIDENTIFIER = 'f76f7c43-b2a2-4ea4-984e-df40068baa1a';
DECLARE @TagId4 UNIQUEIDENTIFIER = '27916d6e-a3b2-471d-b42b-6059611b1c63';
DECLARE @TagId5 UNIQUEIDENTIFIER = 'a9b68633-0f98-4563-b9b9-66a3cbd1fa53';
DECLARE @TagId6 UNIQUEIDENTIFIER = 'd5bd83b0-4a45-42b5-b64c-7826f4e567d4';

-- Associate tags with Mike Myers' content
INSERT INTO Content_Tags (content_id, tag_id) VALUES
(@ContentIdMikeMyers, @TagId1),
(@ContentIdMikeMyers, @TagId2);

-- Associate tags with Chuck Norris' content
INSERT INTO Content_Tags (content_id, tag_id) VALUES
(@ContentIdChuckNorris, @TagId3),
(@ContentIdChuckNorris, @TagId4);

-- Assuming the ID for Michael Jackson's content is known (replace with actual ID)
-- Associate tags with Michael Jackson's content
INSERT INTO Content_Tags (content_id, tag_id) VALUES
(@ContentIdMichaelJackson, @TagId5),
(@ContentIdMichaelJackson, @TagId6);
```
### Update an Interaction's Time Spent
```sql
DECLARE @ContentIdChuckNorris UNIQUEIDENTIFIER = 'aaac36ff-62b4-463f-8521-259d840a9d6d';
DECLARE @UserIdMikeMyers UNIQUEIDENTIFIER = 'ece7c609-7316-48a1-8719-a223b2f4eb3b';

-- Update time spent for an interaction of Mike Myers with Chuck Norris' content
UPDATE Interactions
SET time_spent = 180
WHERE user_id = @UserIdMikeMyers AND content_id = @ContentIdChuckNorris;
```
## Selections
### Simple sections
#### Select all users where friend count is more than 10
```sql
SELECT *
FROM Users
WHERE friend_count > 10;
```
#### Select `text` from `Content` where the type is either 'Post' or 'Ad'
```sql
SELECT text
FROM Content
WHERE type IN ('Post', 'Ad');
```
#### Select `date` and `time_spent` from `Interactions` where the source is 'discovery' and `time_spent` is greater than 100
```sql
SELECT date, time_spent
FROM Interactions
WHERE source = 'discovery' AND time_spent > 100;
```
### Join sections
#### Select `date` from interactions that are 'Likes' or are tagged with more than 1 tag
```sql
SELECT I.date
FROM Interactions I
LEFT JOIN (
    SELECT content_id, COUNT(*) AS TagCount
    FROM Content_Tags
    GROUP BY content_id
) AS CT ON I.content_id = CT.content_id
WHERE I.type = 'Like' OR CT.TagCount > 1;
```
#### Select `text` from `Content` without a media
```sql
SELECT C.text
FROM Content C
LEFT JOIN Media M ON C.id = M.content_id
WHERE M.id IS NULL;
```
### Nested sections
#### Query to Create a View for Content Texts Without Media
```sql
WITH ContentViewWithoutMedia AS (
    SELECT C.text
    FROM Content C
    LEFT JOIN Media M ON C.id = M.content_id
    WHERE M.id IS NULL
)
SELECT * FROM ContentViewWithoutMedia;
```
#### Query to Select Interaction Dates into a New Table for Likes or Multiple Tags
```sql
SELECT I.date
INTO InteractionDatesForLikesOrMultipleTags
FROM Interactions I
LEFT JOIN (
    SELECT content_id, COUNT(*) AS TagCount
    FROM Content_Tags
    GROUP BY content_id
) AS CT ON I.content_id = CT.content_id
WHERE I.type = 'Like' OR CT.TagCount > 1;
```
#### Order All Users by Friend Count
```sql
SELECT *
FROM Users
ORDER BY friend_count DESC;
```
#### Group All Content by Type
```sql
SELECT type, COUNT(*) AS ContentCount
FROM Content
GROUP BY type;
```
#### Aggregate a User's Total Time Spent via Interactions
```sql
SELECT user_id, SUM(time_spent) AS TotalTimeSpent
FROM Interactions
GROUP BY user_id;
```
## Deletion
### Delete a content where text includes "Hamas" (content moderation)
```sql
DELETE FROM Content
WHERE text LIKE '%Hamas%';
```
### Delete all interactions where time spent is lower than 5
```sql
DELETE FROM Interactions
WHERE time_spent < 5;
```

## Drop tables
```sql
-- Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS Interactions;
DROP TABLE IF EXISTS Content_Tags;
DROP TABLE IF EXISTS Segment_Tags;
DROP TABLE IF EXISTS Segment_Users;
DROP TABLE IF EXISTS Recommendations;
DROP TABLE IF EXISTS Media;

-- Then drop the primary tables
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Content;
DROP TABLE IF EXISTS Tags;
DROP TABLE IF EXISTS Segments;
```
