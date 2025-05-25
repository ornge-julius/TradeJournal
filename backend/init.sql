CREATE TABLE IF NOT EXISTS trades (
    id SERIAL PRIMARY KEY,
    ticker VARCHAR(10) NOT NULL,
    type VARCHAR(10) NOT NULL,
    entry_date TIMESTAMP NOT NULL,
    exit_date TIMESTAMP,
    result VARCHAR(10),
    option VARCHAR(50),
    source VARCHAR(100),
    reasoning TEXT,
    entry_price DECIMAL(10, 2),
    exit_price DECIMAL(10, 2),
    profit DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 