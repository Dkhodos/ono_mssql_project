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
