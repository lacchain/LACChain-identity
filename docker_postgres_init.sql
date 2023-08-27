CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE lacchain_identity_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE lacchain_identity
WITH OWNER = docker
CONNECTION LIMIT = -1;

