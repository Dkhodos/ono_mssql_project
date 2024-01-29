SELECT text
FROM Content
WHERE type IN ('Post', 'Ad')
ORDER BY date;
