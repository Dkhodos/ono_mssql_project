SELECT user_id, COUNT(user_id) AS NumberOfContents
FROM Content
GROUP BY user_id
HAVING COUNT(user_id) > 1;
