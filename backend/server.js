const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database configuration
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'trading_journal',
  password: process.env.POSTGRES_PASSWORD || 'trading_journal_pass',
  host: process.env.POSTGRES_HOST || 'db',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'trading_journal_db'
});

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to format date string to PostgreSQL datetime
function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;
  return date.toISOString();
}

// Routes
app.get('/api/trades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trades ORDER BY entry_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ message: 'Error fetching trades' });
  }
});

app.get('/api/trades/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trades WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching trade:', error);
    res.status(500).json({ message: 'Error fetching trade' });
  }
});

app.post('/api/trades', async (req, res) => {
  try {
    const {
      ticker,
      type,
      entryDate,
      exitDate,
      result,
      option,
      source,
      reasoning,
      entryPrice,
      exitPrice,
      profit,
      notes
    } = req.body;

    const queryResult = await pool.query(
      `INSERT INTO trades (
        ticker, type, entry_date, exit_date, result, option, source,
        reasoning, entry_price, exit_price, profit, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [ticker, type, entryDate, exitDate, result, option, source, reasoning, entryPrice, exitPrice, profit, notes]
    );

    res.status(201).json(queryResult.rows[0]);
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({ message: 'Error creating trade' });
  }
});

app.put('/api/trades/:id', async (req, res) => {
  try {
    const {
      ticker,
      type,
      entryDate,
      exitDate,
      result,
      option,
      source,
      reasoning,
      entryPrice,
      exitPrice,
      profit,
      notes
    } = req.body;

    const queryResult = await pool.query(
      `UPDATE trades SET
        ticker = $1, type = $2, entry_date = $3, exit_date = $4,
        result = $5, option = $6, source = $7, reasoning = $8,
        entry_price = $9, exit_price = $10, profit = $11, notes = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13 RETURNING *`,
      [ticker, type, entryDate, exitDate, result, option, source, reasoning, entryPrice, exitPrice, profit, notes, req.params.id]
    );

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    res.json(queryResult.rows[0]);
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(500).json({ message: 'Error updating trade' });
  }
});

app.delete('/api/trades/:id', async (req, res) => {
  try {
    const queryResult = await pool.query('DELETE FROM trades WHERE id = $1 RETURNING *', [req.params.id]);
    if (queryResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    res.json({ message: 'Trade deleted successfully' });
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).json({ message: 'Error deleting trade' });
  }
});

app.post('/api/trades/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileContent = fs.readFileSync(req.file.path, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    console.log('Headers found:', headers);
    
    let imported = 0;
    let errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(value => value.trim());
      const trade = {};
      
      console.log(`\nProcessing line ${i}:`, values);
      
      try {
        headers.forEach((header, index) => {
          const value = values[index];
          console.log(`Processing ${header}: "${value}"`);
          
          switch(header) {
            case 'Entry Date': 
              trade.entry_date = formatDate(value);
              if (!trade.entry_date) throw new Error('Invalid entry date format');
              break;
            case 'Ticker': 
              trade.ticker = value;
              if (!trade.ticker) throw new Error('Ticker is required');
              break;
            case 'Type': 
              trade.type = value;
              if (!trade.type) throw new Error('Type is required');
              break;
            case 'Result': 
              trade.result = value;
              if (!trade.result) throw new Error('Result is required');
              break;
            case 'Option': 
              trade.option = value;
              if (!trade.option) throw new Error('Option is required');
              break;
            case 'Source': 
              trade.source = value;
              if (!trade.source) throw new Error('Source is required');
              break;
            case 'Reasoning': 
              trade.reasoning = value;
              if (!trade.reasoning) throw new Error('Reasoning is required');
              break;
            case 'Entry Price': 
              trade.entry_price = value || '0';
              break;
            case 'Exit Price': 
              trade.exit_price = value || '0';
              break;
            case 'Profit': 
              // Convert to decimal string with 2 decimal places
              const profitValue = value ? parseFloat(value.replace(/[^0-9.-]/g, '')) : 0;
              trade.profit = profitValue.toFixed(2);
              break;
            case 'Exit Date': 
              trade.exit_date = formatDate(value);
              if (!trade.exit_date) throw new Error('Invalid exit date format');
              break;
            case 'Notes': 
              trade.notes = value || null;
              break;
          }
        });

        console.log('Final trade object:', trade);

        const result = await pool.query(
          `INSERT INTO trades (
            ticker, type, entry_date, exit_date, result, option, source,
            reasoning, entry_price, exit_price, profit, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            trade.ticker, trade.type, trade.entry_date, trade.exit_date,
            trade.result, trade.option, trade.source, trade.reasoning,
            trade.entry_price, trade.exit_price, trade.profit, trade.notes
          ]
        );
        console.log('Successfully inserted trade:', result.rows[0]);
        imported++;
      } catch (error) {
        console.error(`Error processing line ${i}:`, error);
        errors.push(`Line ${i}: ${error.message}`);
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ 
      message: 'File processing completed', 
      imported,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 