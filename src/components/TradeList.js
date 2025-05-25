import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { setTrades, setFilter } from '../store/tradeSlice';
import axios from 'axios';

function TradeList() {
  const dispatch = useDispatch();
  const { trades, filters } = useSelector((state) => state.trades);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get('/api/trades');
        dispatch(setTrades(response.data));
      } catch (error) {
        console.error('Error fetching trades:', error);
      }
    };
    fetchTrades();
  }, [dispatch]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilter({ [name]: value }));
  };

  const filteredTrades = trades.filter(trade => {
    return (
      (!filters.result || trade.result === filters.result) &&
      (!filters.ticker || trade.ticker === filters.ticker) &&
      (!filters.type || trade.type === filters.type) &&
      (!filters.reasoning || trade.reasoning === filters.reasoning)
    );
  }).sort((a, b) => {
    const order = filters.sortOrder === 'desc' ? -1 : 1;
    return order * (new Date(a[filters.sortBy]) - new Date(b[filters.sortBy]));
  });

  return (
    <div>
      <div className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select name="result" value={filters.result} onChange={handleFilterChange}>
              <option value="">All Results</option>
              <option value="win">Win</option>
              <option value="loss">Loss</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="call">Call</option>
              <option value="put">Put</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
              <option value="entryDate">Entry Date</option>
              <option value="exitDate">Exit Date</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange}>
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row xs={1} md={2} lg={4} className="g-4">
        {filteredTrades.map((trade) => (
          <Col key={trade.id}>
            <Card className={`h-100 ${trade.result === 'win' ? 'border-success' : 'border-danger'}`}>
              <Card.Body>
                <Card.Title>{trade.ticker} {trade.type.toUpperCase()}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {trade.option}
                </Card.Subtitle>
                <Card.Text>
                  <strong>Profit:</strong> ${trade.profit.toFixed(2)}<br />
                  <strong>Result:</strong> {trade.result}
                </Card.Text>
                <Link to={`/trade/${trade.id}`}>
                  <Button variant="outline-primary" size="sm">View Details</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default TradeList; 