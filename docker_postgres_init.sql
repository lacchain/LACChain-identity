CREATE USER docker WITH PASSWORD 'password' CREATEDB;

CREATE DATABASE laccpass_identity_development
WITH OWNER = docker
CONNECTION LIMIT = -1;

CREATE DATABASE laccpass_identity
WITH OWNER = docker
CONNECTION LIMIT = -1;

