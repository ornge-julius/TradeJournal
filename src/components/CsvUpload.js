import React, { useState } from 'react';
import { Card, Button, Form, Alert } from 'react-bootstrap';
import api from '../utils/api';

function CsvUpload() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setMessage({ type: '', text: '' });
    } else {
      setFile(null);
      setMessage({ type: 'danger', text: 'Please select a valid CSV file' });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'danger', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/api/trades/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage({ type: 'success', text: `Successfully imported ${response.data.imported} trades` });
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Error uploading file' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h3>Import Trades from CSV</h3>
      </Card.Header>
      <Card.Body>
        {message.text && (
          <Alert variant={message.type} className="mb-3">
            {message.text}
          </Alert>
        )}
        <Form onSubmit={handleUpload}>
          <Form.Group className="mb-3">
            <Form.Label>Select CSV File</Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Form.Text className="text-muted">
              The CSV file should have the following columns: Entry Date, Ticker, Type, Result, Option, Source, Reasoning, Entry Price, Exit Price, Profit, Exit Date, Notes
            </Form.Text>
          </Form.Group>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload CSV'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default CsvUpload; 