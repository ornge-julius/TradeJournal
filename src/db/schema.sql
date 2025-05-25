CREATE TABLE trades (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    ticker VARCHAR(10) NOT NULL,
    type VARCHAR(10) NOT NULL,
    result VARCHAR(10) NOT NULL,
    option VARCHAR(50) NOT NULL,
    source VARCHAR(100) NOT NULL,
    reasoning TEXT NOT NULL,
    entry_price VARCHAR(20) NOT NULL,
    exit_price VARCHAR(20) NOT NULL,
    profit DECIMAL(10,2) NOT NULL,
    exit_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 