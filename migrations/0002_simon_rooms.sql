CREATE TABLE IF NOT EXISTS music_rooms (code TEXT PRIMARY KEY, state TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0, expires INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS music_rooms_expires ON music_rooms(expires);
