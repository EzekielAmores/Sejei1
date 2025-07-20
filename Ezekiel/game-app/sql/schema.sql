CREATE DATABASE IF NOT EXISTS game;

USE game;

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  logged_in TINYINT(1) DEFAULT 0
);

CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  team_id INT,
  position INT,
  FOREIGN KEY (user_id) REFERENCES accounts(id),
  FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Insert accounts
INSERT INTO accounts (username, password, role) VALUES
('admin', 'adminpass', 'admin'),
('alice', 'user1', 'user'),
('bob', 'user2', 'user'),
('charlie', 'user3', 'user'),
('dave', 'user4', 'user');

-- Teams
INSERT INTO teams (name) VALUES ('Team A'), ('Team B');

-- Team Members
INSERT INTO team_members (user_id, team_id, position) VALUES
(2, 1, 1), -- alice
(3, 1, 2), -- bob
(4, 2, 1), -- charlie
(5, 2, 2); -- dave