-- Delete Recommendations associated with the user's content
DELETE FROM Recommendations
WHERE content_id IN (
    SELECT id FROM Content WHERE user_id = '8babf01f-cfeb-4d9e-b41f-723277cbf0f1'
);
