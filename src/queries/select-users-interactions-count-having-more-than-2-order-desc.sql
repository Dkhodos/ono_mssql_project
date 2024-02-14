SELECT user_id, COUNT(*) as totalInteractions
FROM Interactions
GROUP BY user_id
HAVING COUNT(*) > 2
ORDER BY totalInteractions DESC;