CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, 
    name VARCHAR(225) NOT NULL, 
    description TEXT,
    category VARCHAR(100), 
    brand VARCHAR(100),
    price_kobo BIGINT NOT NULL CHECK (price_kobo >= 0),
    rating NUMERIC(2, 1) DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);