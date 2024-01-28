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
