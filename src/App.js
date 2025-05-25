import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navigation from './components/Navigation';
import TradeList from './components/TradeList';
import TradeDetail from './components/TradeDetail';
import TradeForm from './components/TradeForm';
import Dashboard from './components/Dashboard';
import CsvUpload from './components/CsvUpload';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<Router>
			<Navigation />
			<Container className="mt-4">
				<Routes>
					<Route path="/" element={<TradeList />} />
					<Route path="/trade/:id" element={<TradeDetail />} />
					<Route path="/new-trade" element={<TradeForm />} />
					<Route path="/edit-trade/:id" element={<TradeForm />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="/upload" element={<CsvUpload />} />
				</Routes>
			</Container>
		</Router>
	);
}

export default App;