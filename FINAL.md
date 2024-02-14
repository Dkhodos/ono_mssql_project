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

#### 1. Select Users by friend count (Simple Where Query)

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

#### 2. Select Content by type and order by date (ORDER BY/HAVING/GROUP BY/AGGRIGATION)

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

##### Existing Contents

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

#### 3. Select Interactions by source and time spent (Simple Where Query)

##### Existing Users

```sql
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
SELECT C.text
FROM Content C
JOIN Media M ON C.id = M.content_id;
```

##### Output

| text                                                                            |
| ------------------------------------------------------------------------------- |
| Doloremque patrocinor suasoria vetus turba vos venia culpo tergiversatio arcus. |
| Cilicium utrimque sequi suggero victoria deripio temporibus vesper.             |

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
