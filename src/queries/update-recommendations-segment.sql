/*
-- Insert a user record into the Users table
INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
VALUES
(
    'a0ddf08a-193f-4287-b994-214c2c6cd806', -- User ID
    'Luella94@gmail.com',                   -- Email
    'Kent',                                 -- Demographic
    '2023-08-06 22:44:46',                  -- Date of Birth
    1631                                    -- Friend Count
);

-- Insert a content record into the Content table, linked to the user above
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

-- Insert segment records into the Segments table
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

-- Insert a recommendation record into the Recommendations table, linked to the content and segment
INSERT INTO Recommendations (id, content_id, segment_id)
VALUES
(
    '4dad31c7-049a-4f85-a5c8-1187d8275d01', -- Recommendation ID
    '3c840aab-2714-4ebc-a8f7-c809c0e87a89', -- Content ID (Foreign Key)
    '64EFEF9A-5682-42A9-8894-0A80811738D0'  -- Segment ID (Foreign Key)
);
*/

-- Moving a recommendation from 'Segment A' to 'Segment B'
UPDATE Recommendations
SET segment_id = 'dcad39e6-8f67-4d2c-a423-a6e698ba8932' -- New segment ID (Segment B)
WHERE id = '4dad31c7-049a-4f85-a5c8-1187d8275d01'; -- Specific ID of the recommendation to move

