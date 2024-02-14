-- Inserting posts and ads into Content table
INSERT INTO Content (id, user_id, type, text, external_link, date)
VALUES
-- Post by Chuck Norris
('AAAC36FF-62B4-463F-8521-259D840A9D6D', 'A20D6D3F-6989-4943-8112-9A8FFCC86280', 'Post', 'Martial Arts Training Tips', 'https://martialarts.example.com', GETDATE()),

-- Another post by Chuck Norris
('28D7A6E2-0029-4EE9-A5D1-79593DA7420B', 'A20D6D3F-6989-4943-8112-9A8FFCC86280', 'Post', 'In the Beginning there was nothing ... then Chuck Norris roundhouse kicked nothing and told it to get a job.', NULL, GETDATE()),

-- Ad by Mike Myers
('402C3EE9-DCEA-4073-9616-4AF99D518764', 'ECE7C609-7316-48A1-8719-A223B2F4EB3B', 'Ad', 'Check out the Latest Comedy Shows!', 'https://comedyshows.example.com/mike-myers/buyme', GETDATE()),

-- Post by Michael Jackson
('B95B6CC9-B477-45BD-8601-A46EB872C13F', '44A4BB81-DEFF-41BC-AF2B-FAA964EDC965', 'Post', 'Cause this is thriller, thriller night...', NULL, GETDATE()),

-- Ad by Madonna
('225A3539-4DFC-4182-A0ED-D36E0D08A426', '26102B74-F154-4592-97FF-A3255C9266B5', 'Ad', 'How to become a pop start...', 'www.totally-real-madona.xyz', GETDATE());

-- Inserting media records into Media table
INSERT INTO Media (id, content_id, media_type, url)
VALUES
-- Image for the ad "Check out the Latest Comedy Shows!" by Mike Myers
(NEWID(), '402C3EE9-DCEA-4073-9616-4AF99D518764', 'Image', 'https://comedyshows.example.com/mike-myers/buyme/image.png'),

-- Video for the post "Martial Arts Training Tips" by Chuck Norris
(NEWID(), '28D7A6E2-0029-4EE9-A5D1-79593DA7420B', 'Video', 'https://meta.com/video/chuck-media');
