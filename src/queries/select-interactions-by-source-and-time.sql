SELECT user_id, time_spent
FROM Interactions
WHERE source = 'discovery' AND time_spent > 100;
