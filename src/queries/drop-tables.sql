-- delete the content in reign key dependencies first
DELETE FROM Interactions;
DELETE FROM Content_Tags;
DELETE FROM Segment_Tags;
DELETE FROM Segment_Users;
DELETE FROM Recommendations;
DELETE FROM Media;

-- Drop tables with foreign key dependencies first
DROP TABLE Interactions;
DROP TABLE Content_Tags;
DROP TABLE Segment_Tags;
DROP TABLE Segment_Users;
DROP TABLE Recommendations;
DROP TABLE Media;

-- delete the content in primary tables
DELETE FROM Content;
DELETE FROM Tags;
DELETE FROM Segments;
DELETE FROM Users;

-- Then drop the primary tables
DROP TABLE Content;
DROP TABLE Tags;
DROP TABLE Segments;
DROP TABLE Users;
