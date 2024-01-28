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
