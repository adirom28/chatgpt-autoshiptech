
-- demo user (password hash placeholder). Use bcrypt to update.
INSERT INTO users (email, password_hash, company_name)
VALUES ('demo@autoshiptech.com', '$2b$10$replaceWithBCryptHashxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', 'Demo Co')
ON CONFLICT (email) DO NOTHING
RETURNING id;

-- If you need to manually insert a site, replace <USER_ID>
-- You can update this later once you know the user_id.
