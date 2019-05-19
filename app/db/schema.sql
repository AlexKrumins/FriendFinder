### Schema
CREATE DATABASE friends_db;
USE friends_db;

CREATE TABLE friends
(
	id int NOT NULL AUTO_INCREMENT,
	friend varchar(255) NOT NULL,
	photo varchar(255) NOT NULL,
	scores varchar(40) NOT NULL,
	PRIMARY KEY (id)
);
