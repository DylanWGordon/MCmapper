CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS worlds;
CREATE TABLE worlds(
    world_id SERIAL,
    world_name TEXT,
    world_user TEXT
);

DROP TABLE IF EXISTS poi;
CREATE TABLE poi(
    id SERIAL,
    name VARCHAR(40),
    biome TEXT NOT NULL,
    kind TEXT NOT NULL,
    x INTEGER NOT NULL,
    y INTEGER NOT NULL,
    z INTEGER NOT NULL,
    comments VARCHAR(255)
);