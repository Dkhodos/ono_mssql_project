/*
    INSERT INTO Users (id, email, demographic, date_of_birth, friend_count)
    VALUES
    (NEWID(), 'john.doe@example.com', 'USA', '1985-04-12', 100),
    (NEWID(), 'jane.doe@example.com', 'Canada', '1990-08-24', 150);
*/
-- Updating demographic from 'USA' to 'United States' for relevant users
UPDATE Users
SET demographic = 'United States'
WHERE demographic = 'USA';
