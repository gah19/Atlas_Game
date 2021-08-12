INSERT INTO users (username, email, country, password_encrypted, created_at, updated_at) VALUES('quantumomid', 'quantumomid@msn.com', 'United Kingdom', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, country, password_encrypted, created_at, updated_at) VALUES('quantumdavid', 'quantumdavid@msn.com', 'France', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, country, password_encrypted, created_at, updated_at) VALUES('quantummichael', 'quantummichael@msn.com', 'Germany', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, country, password_encrypted, created_at, updated_at) VALUES('quantumguy', 'quantumguy@msn.com', 'Mexico', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());
INSERT INTO users (username, email, country, password_encrypted, created_at, updated_at) VALUES('quantumjoanna', 'quantumjoanna@msn.com', 'China', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW());

INSERT INTO finished_games (username,  country, score, created_at) VALUES ('quantumguy', 'Mexico', 100, '12/25/2019');
INSERT INTO finished_games (username,  country, score, created_at) VALUES ('quantumjoanna', 'China', 90, '06/08/2021');
INSERT INTO finished_games (username,  country, score, created_at) VALUES ('quantumdavid', 'France', 120, '12/25/2020');
INSERT INTO finished_games (username,  country, score, created_at) VALUES ('quantumdavid', 'France', 100, NOW());
INSERT INTO finished_games (username,  country, score, created_at) VALUES('quantummichael', 'Germany', 150, NOW());
INSERT INTO finished_games (username,  country, score, created_at) VALUES('quantumomid', 'United Kingdom', 85, '07/10/2021');



INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumguy', 100, '["Egypt","France"]', NOW(), NOW());
INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumjoanna', 100, '["Egypt","France"]',NOW(), NOW());
INSERT INTO current_games (username, score, played_countries, created_at, updated_at) VALUES ('quantumdavid', 100, '["Egypt","France"]',NOW(), NOW());