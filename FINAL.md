# Rational Algebra with SQL

## Introduction

- The is Part 2 of an SQL task for Ono Academic Colladge as PArt of Data strctures class.
- This SQL Scheme and Queries represent a simple to more complex business flows in Facebook.

## Tools

- DB: Using docker with MS Azure official image: [mcr.microsoft.com/azure-sql-edge]("https://hub.docker.com/_/microsoft-azure-sql-edge")
- Tested using MS SQL official Node.js library: [mssql]("https://www.npmjs.com/package/mssql")
- Source: https://github.com/Dkhodos/sql_project

## Tasks

### CREATE

#### Create all the tables in the assigment scope.

```sql
-- Create `Users` Table
CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    email NVARCHAR(255) UNIQUE,
    demographic NVARCHAR(255),
    date_of_birth DATE,
    friend_count INT
);

-- Create `Tags` Table
CREATE TABLE Tags (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(255) UNIQUE
);

-- Create `Segments` Table
CREATE TABLE Segments (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    name NVARCHAR(255)
);

-- Create `Content` Table
CREATE TABLE Content (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id),
    type NVARCHAR(50),
    text NVARCHAR(MAX),
    external_link NVARCHAR(255),
    date DATETIME
);

-- Create `Media` Table
CREATE TABLE Media (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    media_type NVARCHAR(50),
    url NVARCHAR(255)
);

-- Create `Content_Tags` Table
CREATE TABLE Content_Tags (
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    tag_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Tags(id)
);

-- Create `Interactions` Table
CREATE TABLE Interactions (
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id),
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    type NVARCHAR(50),
    content NVARCHAR(MAX),
    source NVARCHAR(50),
    time_spent BIGINT,
    date DATETIME
);

-- Create `Segment_Tags` Table
CREATE TABLE Segment_Tags (
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id),
    tag_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Tags(id)
);

-- Create `Segment_Users` Table
CREATE TABLE Segment_Users (
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id),
    user_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Users(id)
);

-- Create `Recommendations` Table
CREATE TABLE Recommendations (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    content_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Content(id),
    segment_id UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Segments(id)
);
```

### INSERT

#### 1. Inset 5 new users to the DB

##### Query

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
('ECE7C609-7316-48A1-8719-A223B2F4EB3B', 'mike.myres@gmail.com', 'Demographic 1', '1980-01-01', 5),
('A20D6D3F-6989-4943-8112-9A8FFCC86280', 'chuck.norris@gmail.com', 'Demographic 2', '1990-02-02', 15),
('44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', 'michael.jackson@gmail.com', 'Demographic 3', '2000-03-03', 25),
('9485B8DB-BE44-4131-99F2-F90C4025DE46', 'jay.z@gmail.com', 'Demographic 3', '2010-11-07', 1000),
('26102B74-F154-4592-97FF-A3255C9266B5', 'madona@gmail.com', 'Demographic 3', '2023-03-07', 2500);
```

##### Expected output after insertion for `SELECT * FROM Users`

| id                                   | email                     | demographic   | date_of_birth            | friend_count |
| ------------------------------------ | ------------------------- | ------------- | ------------------------ | ------------ |
| A20D6D3F-6989-4943-8112-9A8FFCC86280 | chuck.norris@gmail.com    | Demographic 2 | 1990-02-02T00:00:00.000Z | 15           |
| ECE7C609-7316-48A1-8719-A223B2F4EB3B | mike.myres@gmail.com      | Demographic 1 | 1980-01-01T00:00:00.000Z | 5            |
| 26102B74-F154-4592-97FF-A3255C9266B5 | madona@gmail.com          | Demographic 3 | 2023-03-07T00:00:00.000Z | 2500         |
| 9485B8DB-BE44-4131-99F2-F90C4025DE46 | jay.z@gmail.com           | Demographic 3 | 2010-11-07T00:00:00.000Z | 1000         |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | michael.jackson@gmail.com | Demographic 3 | 2000-03-03T00:00:00.000Z | 25           |

#### 2. Insert 5 new Contents with 2 medias (based on 1)

##### Query

```sql
-- Inserting posts and ads into Content table
INSERT INTO Content (id, user_id, type, text, external_link)
VALUES
-- Post by Chuck Norris
('AAAC36FF-62B4-463F-8521-259D840A9D6D', 'A20D6D3F-6989-4943-8112-9A8FFCC86280', 'Post', 'Martial Arts Training Tips', 'https://martialarts.example.com'),

-- Another post by Chuck Norris
('28D7A6E2-0029-4EE9-A5D1-79593DA7420B', 'A20D6D3F-6989-4943-8112-9A8FFCC86280', 'Post', 'In the Beginning there was nothing ... then Chuck Norris roundhouse kicked nothing and told it to get a job.', NULL),

-- Ad by Mike Myers
('402C3EE9-DCEA-4073-9616-4AF99D518764', 'ECE7C609-7316-48A1-8719-A223B2F4EB3B', 'Ad', 'Check out the Latest Comedy Shows!', 'https://comedyshows.example.com/mike-myers/buyme'),

-- Post by Michael Jackson
('B95B6CC9-B477-45BD-8601-A46EB872C13F', '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', 'Post', 'Cause this is thriller, thriller night...', NULL),

-- Ad by Madonna
('225A3539-4DFC-4182-A0ED-D36E0D08A426', '26102B74-F154-4592-97FF-A3255C9266B5', 'Ad', 'How to become a pop start...', 'www.totally-real-madona.xyz');

-- Inserting media records into Media table
INSERT INTO Media (id, content_id, media_type, url)
VALUES
-- Image for the ad "Check out the Latest Comedy Shows!" by Mike Myers
(NEWID(), '402C3EE9-DCEA-4073-9616-4AF99D518764', 'Image', 'https://comedyshows.example.com/mike-myers/buyme/image.png'),

-- Video for the post "Martial Arts Training Tips" by Chuck Norris
(NEWID(), '28D7A6E2-0029-4EE9-A5D1-79593DA7420B', 'Video', 'https://meta.com/video/chuck-media');
```

##### Output for running Output for running `SELECT * FROM Content`

| id                                   | user_id                              | type | text                                                                                                         | external_link                                    | date                     |
| ------------------------------------ | ------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ------------------------ |
| AAAC36FF-62B4-463F-8521-259D840A9D6D | A20D6D3F-6989-4943-8112-9A8FFCC86280 | Post | Martial Arts Training Tips                                                                                   | https://martialarts.example.com                  | 2024-02-14T23:31:09.293Z |
| 402C3EE9-DCEA-4073-9616-4AF99D518764 | ECE7C609-7316-48A1-8719-A223B2F4EB3B | Ad   | Check out the Latest Comedy Shows!                                                                           | https://comedyshows.example.com/mike-myers/buyme | 2024-02-14T23:31:09.293Z |
| 28D7A6E2-0029-4EE9-A5D1-79593DA7420B | A20D6D3F-6989-4943-8112-9A8FFCC86280 | Post | In the Beginning there was nothing ... then Chuck Norris roundhouse kicked nothing and told it to get a job. |                                                  | 2024-02-14T23:31:09.293Z |
| B95B6CC9-B477-45BD-8601-A46EB872C13F | 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | Post | Cause this is thriller, thriller night...                                                                    |                                                  | 2024-02-14T23:31:09.293Z |
| 225A3539-4DFC-4182-A0ED-D36E0D08A426 | 26102B74-F154-4592-97FF-A3255C9266B5 | Ad   | How to become a pop start...                                                                                 | www.totally-real-madona.xyz                      | 2024-02-14T23:31:09.293Z |

##### Output for running Output for running `SELECT * FROM Media`

| id                                   | content_id                           | media_type | url                                                        |
| ------------------------------------ | ------------------------------------ | ---------- | ---------------------------------------------------------- |
| 0FC28344-8FBF-48E6-8458-90EAC04375B5 | 28D7A6E2-0029-4EE9-A5D1-79593DA7420B | Video      | https://meta.com/video/chuck-media                         |
| 8C6F3A1E-2751-4047-B083-B7B33BAC2ADE | 402C3EE9-DCEA-4073-9616-4AF99D518764 | Image      | https://comedyshows.example.com/mike-myers/buyme/image.png |

#### 3. Insert 5 new Interactions (based on 1, 2)

##### Query

```sql
-- Inserting interactions into Interactions table
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES
-- Michael Jackson likes a post by Chuck Norris
('44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', 'AAAC36FF-62B4-463F-8521-259D840A9D6D', 'Like', NULL, 'discovery', 0, GETDATE()),

-- Michael Jackson shares another post by Chuck Norris
('44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', '28D7A6E2-0029-4EE9-A5D1-79593DA7420B', 'Share', NULL, 'discovery', 0, GETDATE()),

-- Mike Myers comments on Michael Jackson's post
('ECE7C609-7316-48A1-8719-A223B2F4EB3B', 'B95B6CC9-B477-45BD-8601-A46EB872C13F', 'Comment', 'Thrilling indeed!', 'discovery', 0, GETDATE()),

-- Chuck Norris likes his own post
('A20D6D3F-6989-4943-8112-9A8FFCC86280', 'AAAC36FF-62B4-463F-8521-259D840A9D6D', 'Like', NULL, 'discovery', 0, GETDATE()),

-- Jay Z shares an ad by Mike Myers
('9485B8DB-BE44-4131-99F2-F90C4025DE46', '402C3EE9-DCEA-4073-9616-4AF99D518764', 'Share', NULL, 'discovery', 0, GETDATE());
```

##### Output for running `SELECT * FROM Interactions`

| user_id                              | content_id                           | type    | content           | source    | time_spent | date                     |
| ------------------------------------ | ------------------------------------ | ------- | ----------------- | --------- | ---------- | ------------------------ |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | AAAC36FF-62B4-463F-8521-259D840A9D6D | Like    |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | 28D7A6E2-0029-4EE9-A5D1-79593DA7420B | Share   |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| ECE7C609-7316-48A1-8719-A223B2F4EB3B | B95B6CC9-B477-45BD-8601-A46EB872C13F | Comment | Thrilling indeed! | discovery | 0          | 2024-02-14T20:59:16.163Z |
| A20D6D3F-6989-4943-8112-9A8FFCC86280 | AAAC36FF-62B4-463F-8521-259D840A9D6D | Like    |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| 9485B8DB-BE44-4131-99F2-F90C4025DE46 | 402C3EE9-DCEA-4073-9616-4AF99D518764 | Share   |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |

### SELECT

#### 1. Select Users by friend count (Simple Where Query)

##### Existing Users

```sql
-- Inserts new rows into the Users table with specified values for each column.
-- NEWID() function generates a unique identifier for each user.
-- Values provided are for columns: id, email, demographic, date_of_birth, and friend_count.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(NEWID(), 'Chelsea.Corkery21@hotmail.com', 'Tayside', '2023-12-02 04:15:03', 15),
(NEWID(), 'Savannah62@gmail.com', 'West Sussex', '2023-08-15 17:46:22', 3),
(NEWID(), 'Emie_Nitzsche1@gmail.com', 'Henry County', '2023-10-08 18:13:33', 200),
(NEWID(), 'Alayna_Haley84@yahoo.com', 'Devon', '2023-10-22 22:37:06', 7),
(NEWID(), 'Jed_Ortiz89@gmail.com', 'Dorset', '2023-12-06 17:27:41', 400);
```

##### Query

```sql
-- Selects the email and id columns from the Users table.
-- Filters the results to only include users with a friend_count greater than 10.
SELECT email, id
FROM Users
WHERE friend_count > 10;
```

##### Output

| email                      | id                                   |
| -------------------------- | ------------------------------------ |
| Estelle.OKon66@gmail.com   | 8BABF01F-CFEB-4D9E-B41F-723277CBF0F1 |
| Domenica.Murazik@gmail.com | 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 |
| Macey23@yahoo.com          | F65337B8-2D73-4269-AB74-C25BAC081001 |

#### 2. Select Content by type and order by date (ORDER BY/HAVING/GROUP BY/AGGRIGATION)

##### Existing Users

```sql
-- Inserts new user records into the Users table.
-- Specifies values for each user, including a predefined UUID for id, email, demographic, date_of_birth, and friend_count.
-- These users are the authors of the content to be inserted next.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Sarina_Cremin3@gmail.com',
            'Calhoun County',
            '2023-06-25 08:18:35',
            6456),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Chris13@gmail.com',
            'Clark County',
            '2023-10-19 07:07:20',
            1857),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Maymie57@hotmail.com',
            'Jackson County',
            '2024-02-10 06:58:55',
            8272);
```

##### Existing Contents

```sql
-- Inserts new content records into the Content table.
-- Each record includes a unique ID for the content, a user_id linking it to the Users table, the type of content (Post, Ad, or Link), the text of the content, an external link, and the date the content was posted.
-- This setup allows for content to be associated with users and categorized by type and date.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'd39932f5-54d0-4c65-bb48-d20a06014c0e',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'Post',
                'Post Content 1',
                'https://forsaken-asparagus.com/',
                '2024-01-01 00:00:00'),
(
                'e8e00c42-61f9-4ff7-819d-946516f9537f',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'Ad',
                'Ad Content 1',
                'https://weepy-curl.com/',
                '2024-01-02 00:00:00'),
(
                '4a139128-6754-4786-a597-ddc9efc930db',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'Link',
                'News Content 1',
                'https://married-assistance.info',
                '2024-01-03 00:00:00'),
(
                'cbc0eeec-0884-4bb4-a247-afd74a98109c',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'Post',
                'Post Content 2',
                'https://belated-luck.info/',
                '2024-01-04 00:00:00'),
(
                '1f7d2969-8068-4510-9a24-3924582b43a1',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'Link',
                'Review Content 1',
                'https://vivacious-subsidence.net',
                '2024-01-05 00:00:00'),
(
                'c19817cf-1187-4a82-b6bc-a19cd1ce632d',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'Ad',
                'Ad Content 2',
                'https://pastel-herring.net',
                '2024-01-06 00:00:00');
```

##### Query

```sql
-- Selects the text column from the Content table.
-- Filters the content to only include types 'Post' and 'Ad'.
-- Orders the results by the date column in ascending order, ensuring the output is chronologically sorted.
SELECT text
FROM Content
WHERE type IN ('Post', 'Ad')
ORDER BY date;
```

##### Output

| text           |
| -------------- |
| Post Content 1 |
| Ad Content 1   |
| Post Content 2 |
| Ad Content 2   |

#### 3. Select Interactions by source and time spent (Simple Where Query)

##### Existing Users

```sql
-- Inserts new records into the Users table. Each record includes a unique identifier (id), the user's email, demographic information, date of birth, and friend count.
-- These users are the participants in the interactions recorded in the Interactions table.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Celia35@gmail.com',
            'Nottinghamshire',
            '2023-12-09 00:01:37',
            407),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Amara.Koss@gmail.com',
            'Kent',
            '2023-07-15 00:42:21',
            8694),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Joshuah_OKon1@hotmail.com',
            'Scott County',
            '2023-12-16 04:11:54',
            1646);
```

##### Existing Contents

```sql
-- Inserts content records into the Content table, including a unique ID, the ID of the user who created the content, the type of content, the text of the content, an external link associated with it, and the date it was posted.
-- This setup links content items to their creators in the Users table.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'cbc68200-fed1-40ad-99fa-2551601acc9c',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'impedit',
                'Adsuesco ara vestigium explicabo torrens constans currus concedo commodo asporto.',
                'https://obvious-shoe.info/',
                '2024-02-14 17:52:48'),
(
                '8817fc75-75aa-4685-9fe0-9cd18abef49f',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'ater',
                'Subseco spoliatio bis theca cauda voveo commodo patruus.',
                'https://impressive-loaf.biz',
                '2024-02-14 18:06:25'),
(
                '094f471c-13bb-4a2f-90fa-4173208cc0b9',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'auctus',
                'Audacia crepusculum nostrum volubilis coerceo urbanus sopor ait.',
                'https://deafening-hornet.org',
                '2024-02-14 03:28:59');
```

##### Existing Interactions

```sql
-- Inserts interaction records into the Interactions table. Each record includes the ID of the interacting user, the ID of the content interacted with, the type of interaction, content of the interaction, the source of the interaction,
-- time spent on the interaction, and the date of the interaction.
-- This information tracks how users engage with content, including the duration and origin of the interaction.
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES
(
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'cbc68200-fed1-40ad-99fa-2551601acc9c',
                'surculus',
                'Suasoria centum temptatio repudiandae cognomen tutamen.',
                'discovery',
                150,
                '2024-01-01 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                '8817fc75-75aa-4685-9fe0-9cd18abef49f',
                'cervus',
                'Error recusandae voluptatum veritas cubicularis aequitas benigne.',
                'discovery',
                50,
                '2024-01-02 00:00:00'),
(
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                '094f471c-13bb-4a2f-90fa-4173208cc0b9',
                'canto',
                'Cunae veritas vicinus denique comis annus theatrum laborum.',
                'other',
                200,
                '2024-01-03 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                '8817fc75-75aa-4685-9fe0-9cd18abef49f',
                'tumultus',
                'Est cupressus error aspernatur capto timor dens consectetur solvo.',
                'discovery',
                250,
                '2024-01-04 00:00:00');
```

##### Query

```sql
-- Selects the user_id and time_spent columns from the Interactions table.
-- Filters the records to only include interactions that originated from the 'discovery' source
-- and where the time spent is greater than 100 seconds.
-- This query identifies users who have spent a significant amount of time on content discovered through a specific source.
SELECT user_id, time_spent
FROM Interactions
WHERE source = 'discovery' AND time_spent > 100;
```

##### Output

| user_id                              | time_spent |
| ------------------------------------ | ---------- |
| 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 | 150        |
| 8BABF01F-CFEB-4D9E-B41F-723277CBF0F1 | 250        |

#### 4. Select Interactions count for each user having more than 2 interactions (ORDER BY/HAVING/GROUP BY/AGGRIGATION)

##### Existing Users

```sql
-- Inserts new records into the Users table with predefined values.
-- Each record includes a unique id, email, demographic, date of birth, and friend count.
-- These users are meant to represent individuals who can interact with content within the database.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Clara_Green@gmail.com',
            'Clwyd',
            '2023-04-15 04:34:19',
            107),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Telly82@yahoo.com',
            'Worcestershire',
            '2023-09-05 11:21:49',
            3963),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Odessa83@hotmail.com',
            'Devon',
            '2023-09-28 04:47:29',
            4019);
```

##### Existing Contents

```sql
-- Inserts content records into the Content table.
-- Each record includes a unique content id, the id of the user who created the content, the content's type, text, an external link, and the date it was posted.
-- This setup allows for a variety of content types to be tracked along with their creators.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'd5f609c4-3ac8-4fa6-95bf-06da415e8111',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'delibero',
                'Degusto ad atrox.',
                'https://extra-large-security.org/',
                '2024-02-14 06:20:17'),
(
                'e8e32942-8c28-4744-9db9-dbbb3a5f21f3',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'avaritia',
                'Creta asper ultra adaugeo speciosus solvo vitium correptius victoria.',
                'https://dapper-quarter.info/',
                '2024-02-13 23:12:54'),
(
                '6fbaf0e0-2192-4492-bc93-7880be061b80',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'neque',
                'Combibo vestrum vestigium valde libero tertius.',
                'https://knobby-cornerstone.com/',
                '2024-02-14 12:44:44');
```

##### Existing Interactions

```sql
-- Inserts interaction records into the Interactions table.
-- Each record includes the user_id of the interacting user, the content_id of the content interacted with, the type of interaction, content of the interaction, the source of the interaction, time spent on the interaction, and the interaction date.
-- These records are used to track how users engage with content, including the medium of discovery and duration.
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES
(
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'd5f609c4-3ac8-4fa6-95bf-06da415e8111',
                'nobis',
                'Clamo terminatio conatus.',
                'discovery',
                150,
                '2024-01-01 00:00:00'),
(
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'e8e32942-8c28-4744-9db9-dbbb3a5f21f3',
                'beatus',
                'Comminor venio qui vilicus spoliatio alias cuppedia aurum tardus chirographum.',
                'discovery',
                50,
                '2024-01-02 00:00:00'),
(
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'd5f609c4-3ac8-4fa6-95bf-06da415e8111',
                'vitium',
                'Ex ago cultellus curto.',
                'other',
                50,
                '2024-01-02 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                '6fbaf0e0-2192-4492-bc93-7880be061b80',
                'vinculum',
                'Vestrum denique uterque speciosus usque adsidue crux caput.',
                'other',
                200,
                '2024-01-03 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'e8e32942-8c28-4744-9db9-dbbb3a5f21f3',
                'pecus',
                'Supplanto voluptates tripudio adfectus ambitus caritas cogito aliquam molestias laudantium.',
                'discovery',
                250,
                '2024-01-04 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'e8e32942-8c28-4744-9db9-dbbb3a5f21f3',
                'adficio',
                'Consectetur comes mollitia terminatio vacuus censura.',
                'discovery',
                250,
                '2024-01-04 00:00:00'),
(
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'e8e32942-8c28-4744-9db9-dbbb3a5f21f3',
                'cumque',
                'Ullam curtus adulescens sperno.',
                'discovery',
                250,
                '2024-01-04 00:00:00');
```

##### Query

```sql
-- Selects the user_id and the total count of interactions for each user from the Interactions table.
-- Groups the results by user_id to aggregate the count of interactions per user.
-- Filters the groups to only include those where the count of interactions exceeds 2.
-- Orders the results by totalInteractions in descending order to show users with the most interactions first.
-- This query is useful for identifying highly active users based on their interaction count.
SELECT user_id, COUNT(*) as totalInteractions
FROM Interactions
GROUP BY user_id
HAVING COUNT(*) > 2
ORDER BY totalInteractions DESC;
```

##### Output

| user_id                              | totalInteractions |
| ------------------------------------ | ----------------- |
| 8BABF01F-CFEB-4D9E-B41F-723277CBF0F1 | 3                 |
| 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 | 3                 |

#### 5. Select Content count for each user having more than 1 content created (ORDER BY/HAVING/GROUP BY/AGGRIGATION)

##### Existing Users

```sql
-- Inserts new records into the Users table.
-- Each record is defined with specific fields: id, email, demographic, date of birth, and friend count.
-- These records represent the users who can create content within the system.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Taurean39@hotmail.com',
            'Pike County',
            '2023-12-12 01:28:09',
            9184),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Bettie_Becker@hotmail.com',
            'County Down',
            '2023-04-08 13:22:53',
            9297);
```

##### Existing Contents

```sql
-- Inserts new content records into the Content table.
-- Each content record includes an id, user_id (linking it to the creator), type of content, text content, an external link, and the date it was created.
-- This is used to track the content created by users and categorize it by type and creation date.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'c7ab6dd8-d43c-46b2-88e5-f23e4020b957',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'carus',
                'Universe possimus autus aurum tristis nesciunt cicuta aduro apud.',
                'https://deficient-mass.biz/',
                '2024-02-14 08:21:28'),
(
                '0b070110-e59e-4390-8bd6-6dcfe133d51c',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'vobis',
                'Aequus curtus cupiditate vulgo cetera amor.',
                'https://content-progression.org',
                '2024-02-14 17:13:38'),
(
                '1c25a9a5-c036-416e-a360-8c9dd15b4b7c',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'crudelis',
                'Depulso officia angustus qui vulticulus sumptus curriculum nihil alioqui suscipit.',
                'https://easy-going-gastronomy.net',
                '2024-02-14 05:10:28');
```

##### Query

```sql
-- Selects the user_id and counts the number of contents created by each user from the Content table.
-- Groups the result by user_id to aggregate the count of content per user.
-- Applies a HAVING clause to filter out users who have created more than 1 piece of content.
-- This query is useful for identifying active content creators within the system.
SELECT user_id, COUNT(user_id) AS NumberOfContents
FROM Content
GROUP BY user_id
HAVING COUNT(user_id) > 1;
```

##### Output

| user_id                              | NumberOfContents |
| ------------------------------------ | ---------------- |
| 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 | 2                |

#### 6. Select Contents where length is bigger than 10 order desc (ORDER BY/HAVING/GROUP BY/AGGRIGATION)

##### Existing Users

```sql
-- Inserts new user records into the Users table.
-- Each record includes the user's id, email, demographic information, date of birth, and friend count.
-- These users are the authors or creators of the content to be inserted next.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Hugh_Jaskolski89@gmail.com',
            'County Antrim',
            '2023-03-18 08:47:01',
            6551),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Paul_Larson@hotmail.com',
            'Nottinghamshire',
            '2023-10-21 08:46:11',
            2676);
```

##### Existing Contents

```sql
-- Inserts content records into the Content table.
-- Each record specifies a unique content id, the id of the user who created the content, the content type, the textual content, an external link related to the content, and the content creation date.
-- This allows for tracking of content by its creators and categorizing it by type and creation time.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'BC3C913D-361F-47CD-807F-F55BF9A931B4',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'complectus',
                'This is a long text',
                'https://lovely-jalapeno.biz/',
                '2024-01-01 00:00:00'),
(
                'ec89c15f-e5fc-47a0-b079-4d226f54f8c7',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'tendo',
                'short',
                'https://incredible-bus.info/',
                '2024-02-14 05:24:06'),
(
                '1F42EA48-351B-49ED-885D-34BAD7D2358F',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'stipes',
                'Another long text',
                'https://smooth-lawn.com',
                '2024-01-01 00:00:00');
```

##### Query

```sql
-- Selects all columns from the Content table.
-- Applies a condition to only include content where the length of the text exceeds 10 characters.
-- Orders the results by the length of the text in descending order, showing longer texts first.
-- This query is used to identify and prioritize content with more substantial text content, potentially indicating more detailed or comprehensive information.
SELECT *
FROM Content
WHERE LEN(text) > 10
ORDER BY LEN(text) DESC;
```

##### Output

| id                                   | user_id                              | type       | text                | external_link                | date                     |
| ------------------------------------ | ------------------------------------ | ---------- | ------------------- | ---------------------------- | ------------------------ |
| BC3C913D-361F-47CD-807F-F55BF9A931B4 | 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 | complectus | This is a long text | https://lovely-jalapeno.biz/ | 2024-01-01T00:00:00.000Z |
| 1F42EA48-351B-49ED-885D-34BAD7D2358F | 8BABF01F-CFEB-4D9E-B41F-723277CBF0F1 | stipes     | Another long text   | https://smooth-lawn.com      | 2024-01-01T00:00:00.000Z |

#### 7. Interaction Dates Selection Based on Source and Tag Count (Nested Query)

##### Existing Users

```sql
-- Inserts records into the Users table, specifying each user's unique id, email, demographic, date of birth, and friend count.
-- These users are the content creators and interactors within the system.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Kenyatta.McGlynn@yahoo.com',
            'Madison County',
            '2023-05-08 21:45:37',
            3742),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Talia24@gmail.com',
            'Strathclyde',
            '2023-04-30 09:30:58',
            6979),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Hattie_Bailey@gmail.com',
            'Fife',
            '2023-11-30 23:44:47',
            6542);
```

##### Existing Contents

```sql
-- Inserts records into the Content table, linking each piece of content to a user via user_id, and detailing the content's type, text, external link, and creation date.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'somniculosus',
                'Praesentium pecco desolo pecto adulatio utrimque suppellex alius tracto agnosco.',
                'https://tasty-limo.info/',
                '2024-02-14 20:20:42'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'caste',
                'Careo tactus compello aeneus cuppedia depono aperio aestas coepi depopulo.',
                'https://frugal-loop.net',
                '2024-02-14 18:34:39'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'ancilla',
                'Adhuc doloribus expedita cinis torqueo voluptas dignissimos vulnus varius.',
                'https://ethical-puppet.net',
                '2024-02-14 11:59:14');
```

##### Existing Tags

```sql
-- Inserts records into the Tags table, each with a unique id and name.
-- Tags are used to categorize content further, allowing for more nuanced content discovery and organization.
INSERT INTO Tags (id, name)
VALUES
(
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF',
                'Tag1'),
(
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B',
                'Tag2'),
(
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183',
                'Tag3');
```

##### Existing Content Tags

```sql
-- Inserts relationships between content and tags into the Content_Tags table.
-- This table links content to one or more tags, enriching the content's metadata and facilitating filtered searches based on tags.
INSERT INTO Content_Tags (content_id, tag_id)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF'),
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183'),
(
                '958044E9-1271-456F-9344-885204C87475',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183');
```

##### Existing Interactions

```sql
-- Inserts records into the Interactions table, specifying the user involved, the content interacted with, the type of interaction, content description, source, time spent, and date of interaction.
-- These interactions are critical for understanding user engagement with the content.
INSERT INTO Interactions (user_id, content_id, type, content, source, time_spent, date)
VALUES
(
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'Like',
                'Atavus tepesco quis blanditiis caveo aeger aliquid turba vae.',
                'https://legal-help.net',
                63789,
                '2024-01-01 00:00:00'),
(
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                '958044E9-1271-456F-9344-885204C87475',
                'Like',
                'Tubineus architecto voro solium odio.',
                'https://imperfect-founding.name/',
                65687,
                '2024-01-02 00:00:00'),
(
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                'Comment',
                'Adversus ait derelinquo possimus culpa amo speciosus decretum.',
                'https://only-hut.info',
                42642,
                '2024-01-03 00:00:00');
```

##### Query

```sql
-- Selects the dates of interactions from the Interactions table.
-- Left joins a subquery that counts tags for each content item, enabling filtering based on the number of tags a content item has.
-- The WHERE clause filters interactions to those of type 'Like' or where the associated content has more than one tag.
-- This query is used to identify specific interaction dates based on the interaction type and the richness of content categorization through tagging.
SELECT I.date
FROM Interactions I
LEFT JOIN (
    SELECT content_id, COUNT(*) AS TagCount
    FROM Content_Tags
    GROUP BY content_id
) AS CT ON I.content_id = CT.content_id
WHERE I.type = 'Like' OR CT.TagCount > 1;
```

##### Output

| date                     |
| ------------------------ |
| 2024-01-01T00:00:00.000Z |
| 2024-01-02T00:00:00.000Z |

#### 8. Select Content Text Where No Corresponding Media (Join)

##### Existing Users

```sql
-- Inserts records into the Users table. Each record specifies a user's unique id, email, demographic information,
-- date of birth, and friend count, representing the system's user base capable of creating content.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Demetris.Schultz92@yahoo.com',
            'Union County',
            '2023-11-01 17:09:13',
            787),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Karelle.Kozey@yahoo.com',
            'Avon',
            '2024-01-30 18:43:39',
            4621),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Amely97@gmail.com',
            'Berkshire',
            '2023-11-22 02:38:34',
            8516);
```

##### Existing Content

```sql
-- Inserts records into the Content table, detailing each piece of content's id, creator (user_id), type, textual content, an external link, and the date of creation, establishing a catalog of content within the system.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'super',
                'Concedo depraedor despecto sum desipio soleo voluptate barba conspergo.',
                'https://low-accessory.net/',
                '2024-02-14 01:17:17'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'vere',
                'Deinde vilitas concido certus argentum inflammatio benigne pauper.',
                'https://monumental-icing.com',
                '2024-02-14 21:38:50'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'vigilo',
                'Repellendus patrocinor corpus decretum maxime ara capillus degusto trucido tabernus.',
                'https://zesty-lilac.org',
                '2024-02-14 01:30:38');
```

##### Existing Tags

```sql
-- Inserts tag records into the Tags table. Each record is given a unique id and a name.
-- Tags are utilized to categorize content more granularly, enhancing content discovery and organization within the system.
INSERT INTO Tags (id, name)
VALUES
(
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF',
                'Tag1'),
(
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B',
                'Tag2'),
(
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183',
                'Tag3');
```

##### Existing Content Tag

```sql
-- Inserts relationships between content and tags into the Content_Tags table.
-- Each entry links a piece of content with a tag, allowing for multiple tags per content.
-- This structure enriches content metadata and supports complex queries based on tag-based filtering, which enhances content retrieval and relevance.
INSERT INTO Content_Tags (content_id, tag_id)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF'),
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183'),
(
                '958044E9-1271-456F-9344-885204C87475',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183');
```

##### Query

```sql
-- Selects the text of content entries from the Content table that do not have a corresponding media entry in the Media table.
-- The LEFT JOIN ensures all content is considered, and the WHERE clause filters out content that lacks associated media.
-- This query is useful for identifying content that may require additional multimedia elements for enhancement.
SELECT C.text
FROM Content C
LEFT JOIN Media M ON C.id = M.content_id
WHERE M.id IS NULL;
```

##### Output

| text                                                               |
| ------------------------------------------------------------------ |
| Deinde vilitas concido certus argentum inflammatio benigne pauper. |

#### 9. Select Content Text Where is Corresponding Media Exists (Join)

##### Existing Users

```sql
-- Inserts new user records into the Users table. Each record specifies a user's id, email, demographic information, date of birth, and friend count.
-- This data lays the foundation for tracking content creation and interactions within the platform by various users, reflecting a diverse user base.
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
            'Demetris.Schultz92@yahoo.com',
            'Union County',
            '2023-11-01 17:09:13',
            787),
(
            '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
            'Karelle.Kozey@yahoo.com',
            'Avon',
            '2024-01-30 18:43:39',
            4621),
(
            'F65337B8-2D73-4269-AB74-C25BAC081001',
            'Amely97@gmail.com',
            'Berkshire',
            '2023-11-22 02:38:34',
            8516);
```

##### Existing Content

```sql
-- Inserts records into the Content table, detailing the content's id, the user who created it, the type of content, the content's text, an external link, and the content's creation date.
-- This establishes a catalog of content that can be further categorized, shared, and interacted with on the platform.
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',
                'super',
                'Concedo depraedor despecto sum desipio soleo voluptate barba conspergo.',
                'https://low-accessory.net/',
                '2024-02-14 01:17:17'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',
                'vere',
                'Deinde vilitas concido certus argentum inflammatio benigne pauper.',
                'https://monumental-icing.com',
                '2024-02-14 21:38:50'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                'F65337B8-2D73-4269-AB74-C25BAC081001',
                'vigilo',
                'Repellendus patrocinor corpus decretum maxime ara capillus degusto trucido tabernus.',
                'https://zesty-lilac.org',
                '2024-02-14 01:30:38');
```

##### Existing Tags

```sql
-- Inserts tag records into the Tags table. Each tag is identified by a unique id and given a descriptive name.
-- These tags are intended for categorizing content across the platform, allowing users to filter and search content based on specific topics or themes. Tags help in enhancing the discoverability of content and facilitating more organized content navigation.
INSERT INTO Tags (id, name)
VALUES
(
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF',
                'Tag1'),
(
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B',
                'Tag2'),
(
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183',
                'Tag3');
```

##### Existing Content Tag

```sql
-- Inserts relationships between content and tags into the Content_Tags table.
-- relationship connector between the Content and Tags tables. Each entry links a specific piece of content with a tag, allowing for the assignment of multiple tags to a single content item.
-- This setup enriches the content's metadata, supports advanced filtering capabilities, and improves content discoverability through tag-based searches.
INSERT INTO Content_Tags (content_id, tag_id)
VALUES
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'AD4F2DA8-AC62-4B37-B744-65B3AD9704FF'),
(
                'A2D53DC8-C911-41B9-B853-3EFE93262ED6',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                '958044E9-1271-456F-9344-885204C87475',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183'),
(
                '958044E9-1271-456F-9344-885204C87475',
                'BFAAE58D-DC12-472F-BBF8-D4A6BB9AA74B'),
(
                'F0BBD4FB-3F94-4718-8178-FF32C2F0B749',
                '0E3D82B4-870D-45C2-8A8F-7DEFD54F0183');
```

##### Query

```sql
-- Selects the text of content entries from the Content table that have corresponding media entries in the Media table.
-- The JOIN operation ensures that only content with associated media is selected, focusing on content that is potentially more engaging due to the presence of multimedia elements.
SELECT C.text
FROM Content C
JOIN Media M ON C.id = M.content_id;
```

##### Output

| text                                                                            |
| ------------------------------------------------------------------------------- |
| Doloremque patrocinor suasoria vetus turba vos venia culpo tergiversatio arcus. |
| Cilicium utrimque sequi suggero victoria deripio temporibus vesper.             |

### Update

#### Update all users with a "USA" demographic to "United States"

##### Existing Users

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(NEWID(), 'john.doe@example.com', 'USA', '1985-04-12', 100),
(NEWID(), 'jane.doe@example.com', 'Canada', '1990-08-24', 150);
```

##### Query

```sql
-- Updating demographic from 'USA' to 'United States' for relevant users
UPDATE Users
SET demographic = 'United States'
WHERE demographic = 'USA';
```

##### Output for `SELECT * FROM Users`:

| id                                   | email                | demographic   | date_of_birth            | friend_count |
| ------------------------------------ | -------------------- | ------------- | ------------------------ | ------------ |
| 0B4AD9ED-2E38-4163-91CF-7E25F46D3868 | john.doe@example.com | Canada        | 2023-11-03T00:00:00.000Z | 100          |
| AC980F43-9B9F-42A5-BB41-97DA45ED0EEE | jane.doe@example.com | United States | 2023-03-27T00:00:00.000Z | 150          |

#### Move a specific recommendation to a new segment

##### Existing Users

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
    'a0ddf08a-193f-4287-b994-214c2c6cd806', -- User ID
    'Luella94@gmail.com',                   -- Email
    'Kent',                                 -- Demographic
    '2023-08-06 22:44:46',                  -- Date of Birth
    1631                                    -- Friend Count
);
```

##### Existing Content

```sql
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
(
    '3c840aab-2714-4ebc-a8f7-c809c0e87a89', -- Content ID
    'a0ddf08a-193f-4287-b994-214c2c6cd806', -- User ID (Foreign Key)
    'tamisium',                             -- Content Type
    'Hic adicio adamo tolero cunae cohibeo cubitum synagoga turbo.', -- Text
    'https://bright-villa.info/',           -- External Link
    '2024-02-14 05:04:03'                   -- Date
);
```

##### Existing Segments

```sql
INSERT INTO Segments (id, name)
VALUES
(
    '64EFEF9A-5682-42A9-8894-0A80811738D0', -- Segment ID for Segment A
    'Segment A'
),
(
    'DCAD39E6-8F67-4D2C-A423-A6E698BA8932', -- Segment ID for Segment B
    'Segment B'
);
```

##### Existing Recommendations

```sql
INSERT INTO Recommendations (id, content_id, segment_id)
VALUES
(
    '4dad31c7-049a-4f85-a5c8-1187d8275d01', -- Recommendation ID
    '3c840aab-2714-4ebc-a8f7-c809c0e87a89', -- Content ID (Foreign Key)
    '64EFEF9A-5682-42A9-8894-0A80811738D0'  -- Segment ID (Foreign Key)
);
```

##### Query

```sql
-- Moving a recommendation from 'Segment A' to 'Segment B'
UPDATE Recommendations
SET segment_id = 'dcad39e6-8f67-4d2c-a423-a6e698ba8932' -- New segment ID (Segment B)
WHERE id = '4dad31c7-049a-4f85-a5c8-1187d8275d01'; -- Specific ID of the recommendation to move
```

##### Output for `SELECT * FROM Recommendations`

| id                                   | content_id                           | segment_id                           |
| ------------------------------------ | ------------------------------------ | ------------------------------------ |
| 4DAD31C7-049A-4F85-A5C8-1187D8275D01 | 3C840AAB-2714-4EBC-A8F7-C809C0E87A89 | DCAD39E6-8F67-4D2C-A423-A6E698BA8932 |

### DELETE

#### Delete all Contents that contain a specific string (Content moderation)

##### Existing Users

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
('3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',  'Aida_Johns@hotmail.com',  'Borders',  '2024-01-08 15:13:01', 8436),
('8BABF01F-CFEB-4D9E-B41F-723277CBF0F1',  'Mike99@hotmail.com',  'Wayne County',  '2023-07-24 19:22:12', 4600),
('F65337B8-2D73-4269-AB74-C25BAC081001', 'Carlos38@gmail.com', 'Norfolk', '2023-05-28 09:10:57', 242);
```

###### Existing Content

```sql
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
-- Content that is suppose to stay
('A2D53DC8-C911-41B9-B853-3EFE93262ED6', '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8', 'acer', 'Content without specific text',
 'https://pitiful-league.com',  '2024-02-16 19:19:00'),
-- Content that is suppose to be deleted
('958044E9-1271-456F-9344-885204C87475', '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1', 'vitiosus', 'Content mentioning Hamas',
 'https://cruel-leaf.net/', '2024-02-17 03:19:12'),
-- Content that is suppose to stay
('F0BBD4FB-3F94-4718-8178-FF32C2F0B749', 'F65337B8-2D73-4269-AB74-C25BAC081001', 'terebro', 'Another content without specific text',
 'https://lively-migrant.info/', '2024-02-17 10:37:24');
```

##### Query

```sql
-- Delete all Content rows that contain the string `Hamas`
DELETE FROM Content
WHERE text LIKE '%Hamas%';

```

##### Output for `SELECT id FROM Content`

| id                                   | user_id                              | type    | text                                  | external_link                        | date                     |
| ------------------------------------ | ------------------------------------ | ------- | ------------------------------------- | ------------------------------------ | ------------------------ |
| A2D53DC8-C911-41B9-B853-3EFE93262ED6 | 3BBA9C78-AFB6-4002-BAB5-805CDBE562C8 | ancilla | Content without specific text         | https://scarce-butter.com/           | 2024-02-17T07:14:28.000Z |
| F0BBD4FB-3F94-4718-8178-FF32C2F0B749 | F65337B8-2D73-4269-AB74-C25BAC081001 | cubo    | Another content without specific text | https://motionless-negotiation.info/ | 2024-02-17T11:31:20.000Z |

#### Delete all RRecommendations linked to a specific user

##### Existing users

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
-- Keep Recommendations for Yasmine
('3BBA9C78-AFB6-4002-BAB5-805CDBE562C8',  'Yasmine53@gmail.com',  'Dorset',  '2023-02-19 19:58:28', 7871),
-- Delete Recommendations for Julia
('8BABF01F-CFEB-4D9E-B41F-723277CBF0F1', 'Julia.Langosh@hotmail.com', 'Jackson County', '2023-10-13 08:04:01', 5603),
-- Keep Recommendations for Aurelio
('F65337B8-2D73-4269-AB74-C25BAC081001', 'Aurelio_Dooley@hotmail.com', 'Powys', '2023-06-20 11:02:29', 1454);
```

##### Existing Content

```sql
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
-- Yasmine's Content
('f8c08030-2f35-407f-a11f-dc18804b304a', '3BBA9C78-AFB6-4002-BAB5-805CDBE562C8', 'bellicus', 'Corrumpo volo voluptates.',
 'https://spherical-alpha.biz/', '2024-02-16 23:16:43'),
-- Julia's Content
('fe949d58-30a5-4ffa-bafc-306073c3b820', '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1', 'talus', 'Officiis absconditus ustilo cometes repudiandae.',
 'https://lovely-stockings.com/', '2024-02-17 06:05:29'),
-- Aurelio's Content
('d7b0392c-16c8-49d3-a2a5-7d2946c9e782', 'F65337B8-2D73-4269-AB74-C25BAC081001', 'audentia', 'Vomer temperantia vilitas.',
 'https://thunderous-coverall.name/', '2024-02-16 18:01:46'),
-- Yasmine's Content
('6b695978-b999-4126-9e16-5d35dd5d79ef', '8BABF01F-CFEB-4D9E-B41F-723277CBF0F1', 'adicio', 'Universe ultra cultura fuga autem thesaurus iusto.',
 'https://radiant-extension.biz/', '2024-02-17 02:49:19');
```

##### Existing Segments

```sql
INSERT INTO Segments (id, name)
VALUES
('791f9657-9e44-4fe2-8b2e-776bcdbcafad', 'Segment A'),
('ed24c53d-46f0-4c54-9174-891e87b5ee4a', 'Segment B');
```

##### Existing Recommendations

```sql
INSERT INTO Recommendations (id, content_id, segment_id)
VALUES
-- Recommendations for Julia's Content (this will be deleted)
('c591fb3d-f08f-43cf-844e-4361c01865df', 'fe949d58-30a5-4ffa-bafc-306073c3b820',  '791f9657-9e44-4fe2-8b2e-776bcdbcafad'),
-- Recommendations for Julia's Content (this will be deleted)
('57446975-00c0-4266-b348-cd0ac1c19649', 'fe949d58-30a5-4ffa-bafc-306073c3b820',  'ed24c53d-46f0-4c54-9174-891e87b5ee4a'),
-- Recommendations for Aurelio's Content
('b60966dc-c5f1-4d8c-a0fe-d210632d5ade', 'd7b0392c-16c8-49d3-a2a5-7d2946c9e782', '791f9657-9e44-4fe2-8b2e-776bcdbcafad'),
-- Recommendations for Julia's Content (this will be deleted)
('c04979ce-b122-4dbd-9800-609c7df26216', 'fe949d58-30a5-4ffa-bafc-306073c3b820', 'ed24c53d-46f0-4c54-9174-891e87b5ee4a'),
-- Recommendations for Aurelio's Content
('12080b52-cf89-463b-8cf4-a97af0e3e51f', 'd7b0392c-16c8-49d3-a2a5-7d2946c9e782', '791f9657-9e44-4fe2-8b2e-776bcdbcafad'),
-- Recommendations for Yasmine's Content 1
('65c89450-0877-4add-9eb2-dbbe18241bd7', 'f8c08030-2f35-407f-a11f-dc18804b304a', 'ed24c53d-46f0-4c54-9174-891e87b5ee4a');
```

##### Query

```sql
-- Delete Recommendations associated with the user's content (Julia - 8babf01f-cfeb-4d9e-b41f-723277cbf0f1)
DELETE FROM Recommendations
WHERE content_id IN (
    SELECT id FROM Content WHERE user_id = '8babf01f-cfeb-4d9e-b41f-723277cbf0f1'
);
```

##### Output for `SELECT * FROM Recommendations`

| id                                   | content_id                           | segment_id                           |
| ------------------------------------ | ------------------------------------ | ------------------------------------ |
| 3814C23E-3BAF-44B3-8E48-26BBD88BC76C | 93AB057D-2733-4470-9134-5AD2733C1883 | F89E4E22-A04A-4779-88FB-3202CC96E72E |
| 084AB62A-3A5C-4601-B8D4-386C189FB9E6 | 93AB057D-2733-4470-9134-5AD2733C1883 | F89E4E22-A04A-4779-88FB-3202CC96E72E |
| EB332C7F-64A8-48E8-92E2-6B9292A81439 | DDB0B4EE-8BD9-406F-B0A4-4027763604B3 | 951F7CF2-78DE-4F07-AD08-F40815D5078F |

### DROP

#### Drop all tables in DB

```sql
-- Drop tables with foreign key dependencies first
DROP TABLE Interactions;
DROP TABLE Content_Tags;
DROP TABLE Segment_Tags;
DROP TABLE Segment_Users;
DROP TABLE Recommendations;
DROP TABLE Media;

-- Then drop the primary tables
DROP TABLE Content;
DROP TABLE Tags;
DROP TABLE Segments;
DROP TABLE Users;
```
