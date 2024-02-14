SELECT C.text
FROM Content C
JOIN Media M ON C.id = M.content_id;