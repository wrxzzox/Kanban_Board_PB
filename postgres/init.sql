-- Create tables will be handled by Go Auto-migration usually, 
-- but we can set up extensions or initial data here if needed.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- We might want to ensure the database exists if we weren't using the POSTGRES_DB env var,
-- but standard postgres image does that.
