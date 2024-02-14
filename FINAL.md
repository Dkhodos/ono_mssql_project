# Rational Algebra with SQL

## Introduction

- Some intro here...

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

##### Query:

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
('ECE7C609-7316-48A1-8719-A223B2F4EB3B', 'mike.myres@gmail.com', 'Demographic 1', '1980-01-01', 5),
('A20D6D3F-6989-4943-8112-9A8FFCC86280', 'chuck.norris@gmail.com', 'Demographic 2', '1990-02-02', 15),
('44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', 'michael.jackson@gmail.com', 'Demographic 3', '2000-03-03', 25),
('9485B8DB-BE44-4131-99F2-F90C4025DE46', 'jay.z@gmail.com', 'Demographic 3', '2010-11-07', 1000),
('26102B74-F154-4592-97FF-A3255C9266B5', 'madona@gmail.com', 'Demographic 3', '2023-03-07', 2500);
```

##### Expected output after insertion for `SELECT * FROM Users`:

| id                                   | email                     | demographic   | date_of_birth            | friend_count |
| ------------------------------------ | ------------------------- | ------------- | ------------------------ | ------------ |
| A20D6D3F-6989-4943-8112-9A8FFCC86280 | chuck.norris@gmail.com    | Demographic 2 | 1990-02-02T00:00:00.000Z | 15           |
| ECE7C609-7316-48A1-8719-A223B2F4EB3B | mike.myres@gmail.com      | Demographic 1 | 1980-01-01T00:00:00.000Z | 5            |
| 26102B74-F154-4592-97FF-A3255C9266B5 | madona@gmail.com          | Demographic 3 | 2023-03-07T00:00:00.000Z | 2500         |
| 9485B8DB-BE44-4131-99F2-F90C4025DE46 | jay.z@gmail.com           | Demographic 3 | 2010-11-07T00:00:00.000Z | 1000         |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | michael.jackson@gmail.com | Demographic 3 | 2000-03-03T00:00:00.000Z | 25           |

#### 2. Insert 5 new Contents with 2 medias (based on 1)

##### Query:

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

##### Output for running Output for running `SELECT * FROM Interactions`:

| id                                   | user_id                              | type | text                                                                                                         | external_link                                    | date |
| ------------------------------------ | ------------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ---- |
| AAAC36FF-62B4-463F-8521-259D840A9D6D | A20D6D3F-6989-4943-8112-9A8FFCC86280 | Post | Martial Arts Training Tips                                                                                   | https://martialarts.example.com                  |      |
| 402C3EE9-DCEA-4073-9616-4AF99D518764 | ECE7C609-7316-48A1-8719-A223B2F4EB3B | Ad   | Check out the Latest Comedy Shows!                                                                           | https://comedyshows.example.com/mike-myers/buyme |      |
| 28D7A6E2-0029-4EE9-A5D1-79593DA7420B | A20D6D3F-6989-4943-8112-9A8FFCC86280 | Post | In the Beginning there was nothing ... then Chuck Norris roundhouse kicked nothing and told it to get a job. |                                                  |      |
| B95B6CC9-B477-45BD-8601-A46EB872C13F | 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | Post | Cause this is thriller, thriller night...                                                                    |                                                  |      |
| 225A3539-4DFC-4182-A0ED-D36E0D08A426 | 26102B74-F154-4592-97FF-A3255C9266B5 | Ad   | How to become a pop start...                                                                                 | www.totally-real-madona.xyz                      |      |

#### 3. Insert 5 new Interactions (based on 1, 2)

##### Query:

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

##### Output for running `SELECT * FROM Interactions`:

| user_id                              | content_id                           | type    | content           | source    | time_spent | date                     |
| ------------------------------------ | ------------------------------------ | ------- | ----------------- | --------- | ---------- | ------------------------ |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | AAAC36FF-62B4-463F-8521-259D840A9D6D | Like    |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| 44A4BB81-DEFF-41BC-AF2B-FAA964EDC965 | 28D7A6E2-0029-4EE9-A5D1-79593DA7420B | Share   |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| ECE7C609-7316-48A1-8719-A223B2F4EB3B | B95B6CC9-B477-45BD-8601-A46EB872C13F | Comment | Thrilling indeed! | discovery | 0          | 2024-02-14T20:59:16.163Z |
| A20D6D3F-6989-4943-8112-9A8FFCC86280 | AAAC36FF-62B4-463F-8521-259D840A9D6D | Like    |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |
| 9485B8DB-BE44-4131-99F2-F90C4025DE46 | 402C3EE9-DCEA-4073-9616-4AF99D518764 | Share   |                   | discovery | 0          | 2024-02-14T20:59:16.163Z |

### SELECT

#### 1. Select Users by friend count

##### Existing Users

```sql
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
            NEWID(),
            'Chelsea.Corkery21@hotmail.com',
            'Tayside',
            '2023-12-02 04:15:03',
            15),
(
            NEWID(),
            'Savannah62@gmail.com',
            'West Sussex',
            '2023-08-15 17:46:22',
            3),
(
            NEWID(),
            'Emie_Nitzsche1@gmail.com',
            'Henry County',
            '2023-10-08 18:13:33',
            200),
(
            NEWID(),
            'Alayna_Haley84@yahoo.com',
            'Devon',
            '2023-10-22 22:37:06',
            7),
(
            NEWID(),
            'Jed_Ortiz89@gmail.com',
            'Dorset',
            '2023-12-06 17:27:41',
            400);
```

##### Query

```sql
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

#### 2. Select Content by type and order by date

##### Existing Users

```sql
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

##### Existing Content

```sql
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
