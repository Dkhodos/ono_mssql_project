SELECT C.text
FROM Content C
LEFT JOIN Media M ON C.id = M.content_id
WHERE M.id IS NULL;
