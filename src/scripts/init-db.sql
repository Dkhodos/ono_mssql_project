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
