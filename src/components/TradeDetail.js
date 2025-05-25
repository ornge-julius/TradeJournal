import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function TradeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trade, setTrade] = useState(null);

  useEffect(() => {
    const fetchTrade = async () => {
      try {
        const response = await axios.get(`/api/trades/${id}`);
        setTrade(response.data);
      } catch (error) {
        console.error('Error fetching trade:', error);
      }
    };
    fetchTrade();
  }, [id]);

  if (!trade) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h3>{trade.ticker} {trade.type.toUpperCase()}</h3>
        <div>
          <Button variant="outline-primary" onClick={() => navigate(`/edit-trade/${id}`)} className="me-2">
            Edit
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Back to List
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h5>Trade Details</h5>
            <p><strong>Entry Date:</strong> {new Date(trade.entryDate).toLocaleDateString()}</p>
            <p><strong>Exit Date:</strong> {new Date(trade.exitDate).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {trade.type}</p>
            <p><strong>Option:</strong> {trade.option}</p>
            <p><strong>Result:</strong> {trade.result}</p>
            <p><strong>Source:</strong> {trade.source}</p>
          </Col>
          <Col md={6}>
            <h5>Financial Details</h5>
            <p><strong>Entry Price:</strong> ${trade.entryPrice}</p>
            <p><strong>Exit Price:</strong> ${trade.exitPrice}</p>
            <p><strong>Profit:</strong> ${trade.profit}</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h5>Analysis</h5>
            <p><strong>Reasoning:</strong> {trade.reasoning}</p>
            <p><strong>Notes:</strong> {trade.notes}</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default TradeDetail; 