SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME IN ('Interactions', 'Content_Tags', 'Segment_Tags', 'Segment_Users', 'Recommendations', 'Media', 'Content', 'Tags', 'Segments', 'Users');
