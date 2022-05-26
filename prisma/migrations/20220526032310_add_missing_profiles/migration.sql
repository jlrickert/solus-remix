-- Add profile to each existing user if missing
INSERT INTO
	"Profile" (userId)
SELECT
	(id)
FROM
	"User" source
WHERE
	NOT EXISTS (
		SELECT
			1
		FROM
			"Profile" destination
		WHERE
			destination.userId = source.id
	);