CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS worlds;
CREATE TABLE worlds(
    world_id SERIAL,
    world_name TEXT,
    world_user TEXT
);

DROP TABLE IF EXISTS poi;
CREATE TABLE poi(
    poi_id SERIAL,
    poi_name TEXT,
    biome TEXT NOT NULL,
    kind TEXT NOT NULL,
    coordinates GEOMETRY(PointZ) NOT NULL,
    user_comments TEXT
);