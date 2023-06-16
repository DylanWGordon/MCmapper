CREATE EXTENSION IF NOT EXISTS postgis;

DROP TABLE IF EXISTS worlds;
CREATE TABLE worlds(
    world_id SERIAL,
    world_name TEXT,
    user TEXT
);

DROP TABLE IF EXISTS poi;
CREATE TABLE poi(
    poi_id SERIAL,
    poi_name TEXT,
    biome TEXT,
    kind TEXT,
    coordinates GEOMETRY(PointZ),
    user_comments TEXT,
);