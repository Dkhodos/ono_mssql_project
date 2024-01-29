SELECT I.date
FROM Interactions I
LEFT JOIN (
    SELECT content_id, COUNT(*) AS TagCount
    FROM Content_Tags
    GROUP BY content_id
) AS CT ON I.content_id = CT.content_id
WHERE I.type = 'Like' OR CT.TagCount > 1;
