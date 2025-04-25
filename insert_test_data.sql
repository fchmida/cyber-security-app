INSERT INTO users (username, email, password_hash)
VALUES ('john_doe', 'john@example.com', 'hashed_password_123'),
('jane_smith', 'jane@example.com', 'hashed_password_456');

INSERT INTO completed_modules (user_id, module_name)
VALUES
(1, 'Intro to Cybersecurity');

INSERT INTO quiz_scores (user_id, quiz_name, score)
VALUES
(1, 'Cybersecurity Basics', 85),
(2, 'Phishing Quiz', 92);