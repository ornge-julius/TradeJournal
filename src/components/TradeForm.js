import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

function TradeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ticker: '',
    type: 'call',
    entryDate: '',
    exitDate: '',
    result: 'win',
    option: '',
    source: '',
    reasoning: '',
    entryPrice: '',
    exitPrice: '',
    profit: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      const fetchTrade = async () => {
        try {
          const response = await axios.get(`/api/trades/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error('Error fetching trade:', error);
        }
      };
      fetchTrade();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`/api/trades/${id}`, formData);
      } else {
        await axios.post('/api/trades', formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving trade:', error);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h3>{id ? 'Edit Trade' : 'New Trade'}</h3>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Ticker</Form.Label>
            <Form.Control
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Option</Form.Label>
            <Form.Control
              type="text"
              name="option"
              value={formData.option}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Entry Date</Form.Label>
            <Form.Control
              type="date"
              name="entryDate"
              value={formData.entryDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Exit Date</Form.Label>
            <Form.Control
              type="date"
              name="exitDate"
              value={formData.exitDate}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Result</Form.Label>
            <Form.Select
              name="result"
              value={formData.result}
              onChange={handleChange}
              required
            >
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Source</Form.Label>
            <Form.Control
              type="text"
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Reasoning</Form.Label>
            <Form.Control
              as="textarea"
              name="reasoning"
              value={formData.reasoning}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Entry Price</Form.Label>
            <Form.Control
              type="text"
              name="entryPrice"
              value={formData.entryPrice}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Exit Price</Form.Label>
            <Form.Control
              type="text"
              name="exitPrice"
              value={formData.exitPrice}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Profit</Form.Label>
            <Form.Control
              type="text"
              name="profit"
              value={formData.profit}
              onChange={handleChange}
              placeholder="Enter profit"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {id ? 'Update Trade' : 'Add Trade'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default TradeForm; 