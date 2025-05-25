import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { trades } = useSelector((state) => state.trades);
  const [stats, setStats] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalProfit: 0,
    averageProfit: 0
  });

  useEffect(() => {
    if (trades.length > 0) {
      const winningTrades = trades.filter(trade => trade.result === 'win');
      const losingTrades = trades.filter(trade => trade.result === 'loss');
      const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);

      setStats({
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        winRate: (winningTrades.length / trades.length) * 100,
        totalProfit,
        averageProfit: totalProfit / trades.length
      });
    }
  }, [trades]);

  const profitData = {
    labels: trades.map(trade => new Date(trade.entryDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Profit/Loss',
        data: trades.map(trade => trade.profit),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const winLossData = {
    labels: ['Wins', 'Losses'],
    datasets: [
      {
        data: [stats.winningTrades, stats.losingTrades],
        backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)']
      }
    ]
  };

  return (
    <div>
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Trades</Card.Title>
              <Card.Text className="h2">{stats.totalTrades}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Win Rate</Card.Title>
              <Card.Text className="h2">{stats.winRate.toFixed(1)}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Profit</Card.Title>
              <Card.Text className="h2">${stats.totalProfit.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Average Profit</Card.Title>
              <Card.Text className="h2">${stats.averageProfit.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>Profit/Loss Over Time</Card.Title>
              <Line data={profitData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Win/Loss Ratio</Card.Title>
              <Doughnut data={winLossData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard; 