CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE lacpass_identity_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE lacpass_identity
WITH OWNER = docker
CONNECTION LIMIT = -1;

